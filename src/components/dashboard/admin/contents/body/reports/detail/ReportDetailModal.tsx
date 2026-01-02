/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Modal from "@/components/common/Modal";
import { adminReportApi } from "@/lib/api/admin/reports/adminReports";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock5, Flag, ShieldAlert, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Field } from "./Field";
import { formatDateTime } from "@/lib/hooks/formatDateTime";

import ReportDetailHeader from "./ReportDetailHeader";
import AdminProcessSection from "./AdminProcessSection";
import ReportDetailFooter from "./ReportDetailFooter";

type ReportStatus = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";
type ReportAction = "NONE" | "HIDE_CAPSULE" | "SUSPEND_MEMBER";

function isReportStatus(v: any): v is ReportStatus {
  return (
    v === "PENDING" || v === "REVIEWING" || v === "ACCEPTED" || v === "REJECTED"
  );
}

function getReporterDisplayName(report: any) {
  const nickname = report?.reporterNickname;
  const reporterId = report?.reporterId;
  if (!nickname || nickname.trim() === "" || !reporterId) return "익명";
  return nickname;
}

function toIsoFromLocal(value: string) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function compactBody(obj: Record<string, any>) {
  const out: Record<string, any> = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined) return;
    if (v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    out[k] = v;
  });
  return out;
}

export default function ReportDetailModal({
  open,
  reportId,
  onClose,
}: {
  open: boolean;
  reportId: number | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const [processMemo, setProcessMemo] = useState("");
  const [sanctionUntilLocal, setSanctionUntilLocal] = useState("");
  const [action, setAction] = useState<ReportAction>("NONE");
  const [uiError, setUiError] = useState<string | null>(null);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // 상세 조회
  const {
    data: report,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminReportDetail", reportId],
    enabled: open && typeof reportId === "number",
    queryFn: ({ signal }) =>
      adminReportApi.get({ reportId: reportId as number, signal }),
  });

  const r: AdminReportDetail = report as AdminReportDetail;

  // 모달 열릴 때 초기값
  useEffect(() => {
    if (!open) return;
    if (!r) return;

    setUiError(null);
    setProcessMemo(r?.adminMemo ?? "");
    setSanctionUntilLocal("");

    const suggested: ReportAction =
      r?.targetType === "CAPSULE" ? "HIDE_CAPSULE" : "NONE";
    setAction(suggested);
  }, [open, r]);

  const statusLabel = useMemo(() => {
    const raw = r?.status;
    const status: ReportStatus | undefined = isReportStatus(raw)
      ? raw
      : undefined;

    switch (status) {
      case "PENDING":
        return { text: "대기 중", className: "bg-orange-100 text-orange-800" };
      case "REVIEWING":
        return { text: "검토 중", className: "bg-blue-100 text-blue-800" };
      case "ACCEPTED":
        return { text: "승인", className: "bg-green-100 text-green-800" };
      case "REJECTED":
        return { text: "반려", className: "bg-gray-100 text-gray-800" };
      default:
        return {
          text: r?.status ?? "-",
          className: "bg-gray-100 text-gray-800",
        };
    }
  }, [r?.status]);

  const actionable = useMemo(() => {
    const raw = r?.status;
    const status: ReportStatus | undefined = isReportStatus(raw)
      ? raw
      : undefined;
    return status === "PENDING" || status === "REVIEWING";
  }, [r?.status]);

  const updateStatusMutation = useMutation({
    mutationFn: async (params: {
      reportId: number;
      status: ReportStatus;
      action: ReportAction;
      processMemo?: string | null;
      sanctionUntil?: string | null;
    }) => {
      setUiError(null);
      const anyApi: any = adminReportApi as any;
      if (typeof anyApi.updateStatus !== "function") {
        throw new Error("adminReportApi.updateStatus is not defined");
      }

      const body = compactBody({
        status: params.status,
        action: params.action,
        processMemo: params.processMemo ?? undefined,
        sanctionUntil: params.sanctionUntil ?? undefined,
      });

      try {
        return await anyApi.updateStatus({
          reportId: params.reportId,
          ...body,
        });
      } catch {
        return await anyApi.updateStatus({ reportId: params.reportId, body });
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["adminReportDetail", reportId],
        }),
        queryClient.invalidateQueries({ queryKey: ["adminReports"] }),
        queryClient.invalidateQueries({ queryKey: ["adminReportCount"] }),
      ]);
      onClose();
    },
    onError: (err: any) => {
      const msg =
        err?.data?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "처리 실패";
      const detail = err?.data
        ? JSON.stringify(err.data)
        : err?.response?.data
        ? JSON.stringify(err.response.data)
        : "";
      setUiError(detail ? `${msg}\n${detail}` : String(msg));
      console.error("updateStatus failed:", err);
    },
  });

  const isMutating = updateStatusMutation.isPending;

  const handleApprove = () => {
    if (typeof reportId !== "number") return;

    // 회원정지면 sanctionUntil 필수
    if (action === "SUSPEND_MEMBER") {
      const iso = toIsoFromLocal(sanctionUntilLocal);
      if (!iso) {
        setUiError(
          "회원 정지(SUSPEND_MEMBER) 선택 시 제재 종료일을 입력해야 합니다."
        );
        return;
      }

      updateStatusMutation.mutate({
        reportId,
        status: "ACCEPTED",
        action,
        processMemo: processMemo?.trim() ? processMemo.trim() : undefined,
        sanctionUntil: iso,
      });
      return;
    }

    updateStatusMutation.mutate({
      reportId,
      status: "ACCEPTED",
      action,
      processMemo: processMemo?.trim() ? processMemo.trim() : undefined,
      sanctionUntil: undefined,
    });
  };

  const handleReject = () => {
    if (typeof reportId !== "number") return;

    updateStatusMutation.mutate({
      reportId,
      status: "REJECTED",
      action: "NONE",
      processMemo: processMemo?.trim() ? processMemo.trim() : undefined,
      sanctionUntil: undefined,
    });
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[min(672px,94vw)] md:w-full md:max-w-2xl mx-auto rounded-xl bg-white flex flex-col max-h-[88dvh] md:max-h-[85vh] overflow-hidden">
        {/* Header (분리) */}
        <ReportDetailHeader reportId={reportId} onClose={onClose} />

        {/* Body */}
        <div className="flex-1 min-h-0 w-full overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {isLoading && <div className="text-sm text-text-3">불러오는 중…</div>}

          {isError && (
            <div className="text-sm text-red-600">
              불러오기 실패: {String((error as any)?.message ?? "")}
            </div>
          )}

          {uiError ? (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 whitespace-pre-wrap">
              {uiError}
            </div>
          ) : null}

          {!isLoading && !isError && r && (
            <>
              <div className="flex gap-2">
                <span
                  className={`py-2 px-3 rounded-lg ${statusLabel.className}`}
                >
                  {statusLabel.text}
                </span>
              </div>

              {/* 신고자 정보 */}
              <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                <div className="flex items-center gap-1">
                  <User className="text-blue-800" />
                  <span className="text-blue-900">신고자 정보</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <Field
                    label="닉네임"
                    value={getReporterDisplayName(r)}
                    theme="blue"
                  />
                  <Field
                    label="회원 ID"
                    value={String(r.reporterId ?? "-")}
                    theme="blue"
                  />
                  <Field
                    label="전화번호"
                    value={r.reporterPhone ?? "-"}
                    theme="blue"
                  />
                  <Field
                    label="신고 일시"
                    value={formatDateTime(r.createdAt)}
                    theme="blue"
                  />
                </div>
              </div>

              {/* 신고 대상 정보 */}
              <div className="p-4 bg-red-50 rounded-lg space-y-3">
                <div className="flex items-center gap-1">
                  <ShieldAlert className="text-red-800" />
                  <span className="text-red-900">신고 대상</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <Field
                    label="대상 타입"
                    value={r.targetType ?? "-"}
                    theme="red"
                  />
                  <Field
                    label="대상 ID"
                    value={String(r.targetId ?? "-")}
                    theme="red"
                  />
                  <Field
                    label="작성자 닉네임"
                    value={r.targetWriterNickname ?? "-"}
                    theme="red"
                  />
                  <Field
                    label="대상 제목"
                    value={r.targetTitle ?? "-"}
                    theme="red"
                    wide
                  />
                </div>
              </div>

              {/* 신고 내용 */}
              <div className="p-4 bg-yellow-50 rounded-lg space-y-3">
                <div className="flex items-center gap-1">
                  <Flag className="text-yellow-700" />
                  <span className="text-yellow-900">신고 내용</span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-sm text-yellow-800">신고 사유</span>
                    <p className="text-yellow-900 py-2 px-3 bg-white rounded-lg">
                      {r.reasonType ?? "-"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-yellow-800">상세 설명</span>
                    <p className="text-yellow-900 py-2 px-3 bg-white rounded-lg whitespace-pre-wrap">
                      {r.reasonDetail ?? "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 관리자 처리 (분리) */}
              <AdminProcessSection
                actionable={actionable}
                isMutating={isMutating}
                action={action}
                setAction={setAction}
                processMemo={processMemo}
                setProcessMemo={setProcessMemo}
                sanctionUntilLocal={sanctionUntilLocal}
                setSanctionUntilLocal={setSanctionUntilLocal}
              />

              {/* 타임라인 */}
              <div className="p-4 bg-sub border border-outline rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Clock5 size={18} className="shrink-0" />
                  <span className="text-sm font-medium">처리 타임라인</span>
                </div>
                <p className="text-sm text-text-3">
                  신고 접수: {formatDateTime(r.createdAt)}
                </p>
                <p className="text-sm text-text-3">
                  처리 완료:{" "}
                  {r.processedAt ? formatDateTime(r.processedAt) : "-"}
                </p>
                <p className="text-sm text-text-3">
                  처리자: {r.processedBy ? `#${r.processedBy}` : "-"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer (분리) */}
        <ReportDetailFooter
          disabled={!r || !actionable || isMutating}
          isMutating={isMutating}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </Modal>
  );
}
