/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Modal from "@/components/common/Modal";
import { adminReportApi } from "@/lib/api/admin/reports/adminReports";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock5, Flag, ShieldAlert, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ReportStatus = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";

type ReportAction = "NONE" | "HIDE_CAPSULE" | "SUSPEND_MEMBER";

const ACTION_OPTIONS: { value: ReportAction; label: string; hint?: string }[] =
  [
    {
      value: "NONE",
      label: "조치 없음",
      hint: "경고/기록만 남기고 조치하지 않음",
    },
    {
      value: "HIDE_CAPSULE",
      label: "캡슐 숨김",
      hint: "신고 대상 캡슐을 비노출 처리",
    },
    {
      value: "SUSPEND_MEMBER",
      label: "회원 정지",
      hint: "정지 해제 일시가 필요",
    },
  ];

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

function formatDateTime(v?: string | null) {
  if (!v) return "-";
  return String(v).replace("T", " ").slice(0, 19);
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

  const r: any = report;

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
      <div className="w-full max-w-2xl mx-auto rounded-xl bg-white flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="py-4 px-6 flex justify-between items-center border-b border-outline shrink-0">
          <div className="flex-1">
            <h4 className="text-lg">신고 상세 정보</h4>
            <span className="text-xs">신고 ID: #{reportId ?? "-"}</span>
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 w-full overflow-y-auto p-6 space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
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
                <div className="grid grid-cols-2 gap-4">
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

              {/* 관리자 처리 입력 */}
              <div className="rounded-xl border border-outline p-4 space-y-4">
                <div className="text-sm font-semibold">관리자 처리</div>

                {/* 조치 타입 선택 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-text-3">조치 타입</div>

                    {/* 선택된 값 칩 */}
                    <span
                      className={[
                        "text-[11px] px-2 py-1 rounded-full border",
                        action === "NONE"
                          ? "bg-gray-50 text-gray-700 border-gray-200"
                          : action === "HIDE_CAPSULE"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-red-50 text-red-700 border-red-200",
                      ].join(" ")}
                    >
                      {ACTION_OPTIONS.find((o) => o.value === action)?.label ??
                        action}
                    </span>
                  </div>

                  <div className="relative">
                    {/* 커스텀 화살표 */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg
                        viewBox="0 0 20 20"
                        className={[
                          "h-4 w-4",
                          !actionable || isMutating
                            ? "text-gray-300"
                            : "text-gray-500",
                        ].join(" ")}
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <select
                      className={[
                        "w-full appearance-none rounded-xl border px-3 py-3 pr-10 text-sm outline-none transition",
                        "bg-white",
                        !actionable || isMutating
                          ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                          : "border-outline hover:border-admin/40 focus:border-admin focus:ring-4 focus:ring-admin/15",
                      ].join(" ")}
                      value={action}
                      onChange={(e) =>
                        setAction(e.target.value as ReportAction)
                      }
                      disabled={!actionable || isMutating}
                    >
                      {ACTION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 힌트 박스 */}
                  <div
                    className={[
                      "rounded-lg border px-3 py-2 text-xs leading-relaxed",
                      action === "NONE"
                        ? "bg-gray-50 border-gray-200 text-gray-600"
                        : action === "HIDE_CAPSULE"
                        ? "bg-orange-50 border-orange-200 text-orange-700"
                        : "bg-red-50 border-red-200 text-red-700",
                    ].join(" ")}
                  >
                    {ACTION_OPTIONS.find((o) => o.value === action)?.hint ?? ""}
                  </div>
                </div>

                {/* 처리 메모 */}
                <div className="space-y-1">
                  <div className="text-xs text-text-3">처리 메모</div>
                  <textarea
                    className="w-full min-h-[90px] rounded-lg border border-outline p-3 text-sm outline-none focus:ring-2 focus:ring-admin/30"
                    value={processMemo}
                    onChange={(e) => setProcessMemo(e.target.value)}
                    placeholder="처리 사유/근거를 남겨주세요. (선택)"
                    disabled={!actionable || isMutating}
                  />
                </div>

                {/* 제재 종료일: 회원정지일 때만 활성 */}
                <div className="space-y-1">
                  <div className="text-xs text-text-3">
                    제재 종료일{" "}
                    {action === "SUSPEND_MEMBER" ? "(필수)" : "(선택/미사용)"}
                  </div>
                  <input
                    type="datetime-local"
                    className="w-full rounded-lg border border-outline p-3 text-sm outline-none focus:ring-2 focus:ring-admin/30 disabled:bg-gray-50"
                    value={sanctionUntilLocal}
                    onChange={(e) => setSanctionUntilLocal(e.target.value)}
                    disabled={
                      !actionable || isMutating || action !== "SUSPEND_MEMBER"
                    }
                  />
                </div>
              </div>

              {/* 타임라인 */}
              <div className="p-4 bg-sub border border-outline rounded-lg space-y-2">
                <div className="flex items-center gap-1">
                  <Clock5 size={20} />
                  <span>처리 타임라인</span>
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

        {/* Footer */}
        <div className="py-4 px-6 border-t border-outline shrink-0">
          <div className="flex gap-3">
            <button
              className="cursor-pointer flex-1 rounded-xl bg-admin p-2 text-white hover:bg-admin/80 disabled:opacity-50"
              disabled={!r || !actionable || isMutating}
              onClick={handleApprove}
            >
              {isMutating ? "처리 중…" : "신고 승인"}
            </button>

            <button
              className="cursor-pointer flex-1 rounded-xl p-2 hover:bg-sub border border-outline disabled:opacity-50"
              disabled={!r || !actionable || isMutating}
              onClick={handleReject}
            >
              {isMutating ? "처리 중…" : "신고 반려"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Field({
  label,
  value,
  theme,
  wide,
}: {
  label: string;
  value: string;
  theme: "blue" | "red";
  wide?: boolean;
}) {
  const labelClass = theme === "blue" ? "text-blue-800" : "text-red-800";
  const valueClass = theme === "blue" ? "text-blue-900" : "text-red-900";

  return (
    <div className={`flex flex-col gap-1 ${wide ? "col-span-2" : ""}`}>
      <span className={`text-sm ${labelClass}`}>{label}</span>
      <span className={`${valueClass} wrap-break-word`}>{value}</span>
    </div>
  );
}
