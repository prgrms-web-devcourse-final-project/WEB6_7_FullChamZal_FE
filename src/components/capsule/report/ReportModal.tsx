"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import { AlertCircle, MessageSquareWarning, X } from "lucide-react";
import { reportApi } from "@/lib/api/capsule/report";
import ActiveModal from "@/components/common/ActiveModal";

const REASON_LABEL: Record<ReportReasonType, string> = {
  SPAM: "스팸(광고, 홍보성 내용)",
  OBSCENITY: "음란물(선정적이거나 부적절한 내용)",
  HATE: "혐오 발언(차별, 비방, 혐오 표현)",
  FRAUD: "사기(거짓 정보, 피싱)",
  ETC: "기타(그 외 부적절한 내용)",
};

export default function ReportModal({
  open,
  onClose,
  capsuleId,
}: {
  open: boolean;
  onClose: () => void;
  capsuleId: number;
}) {
  const [reasonType, setReasonType] = useState<ReportReasonType>("SPAM");
  const [reasonDetail, setReasonDetail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ type: false, detail: false });

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [failMsg, setFailMsg] = useState<string | null>(null);

  const trimmedDetail = reasonDetail.trim();

  // 모든 유형에서 상세 내용 필수
  const isDetailRequired = true;

  // 최소 글자수
  const minLen = 10;

  const detailError = useMemo(() => {
    if (!touched.detail) return "";
    if (isDetailRequired && trimmedDetail.length < minLen) {
      return `상세 내용을 ${minLen}자 이상 입력해주세요.`;
    }
    return "";
  }, [touched.detail, isDetailRequired, minLen, trimmedDetail.length]);

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (isDetailRequired && trimmedDetail.length < minLen) return false;
    return true;
  }, [isSubmitting, isDetailRequired, minLen, trimmedDetail.length]);

  const resetForm = () => {
    setReasonType("SPAM");
    setReasonDetail("");
    setTouched({ type: false, detail: false });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setTouched({ type: true, detail: true });
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);

      await reportApi.report({
        capsuleId,
        reasonType,
        reasonDetail: trimmedDetail,
      });

      setIsSuccessOpen(true);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "신고 처리 중 오류가 발생했습니다.";
      setFailMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* 신고 성공 모달 */}
      {isSuccessOpen && (
        <ActiveModal
          active="success"
          title="신고 접수 완료"
          content="신고가 정상적으로 접수되었습니다."
          open={isSuccessOpen}
          onClose={() => setIsSuccessOpen(false)}
          onConfirm={() => {
            setIsSuccessOpen(false);
            handleClose(); // 폼 리셋 + 모달 닫기
          }}
        />
      )}

      {/* 신고 실패 모달 */}
      {!!failMsg && (
        <ActiveModal
          active="fail"
          title="신고 실패"
          content={failMsg}
          open={!!failMsg}
          onClose={() => setFailMsg(null)}
          onConfirm={() => setFailMsg(null)}
        />
      )}

      <Modal open={open} onClose={handleClose}>
        <div className="max-w-150 w-full rounded-2xl bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-outline bg-primary text-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/15 rounded-full">
                <MessageSquareWarning className="text-white" />
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-semibold leading-tight">신고하기</p>
                <p className="text-sm text-white/90">
                  부적절한 내용을 신고해주세요
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="닫기"
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* 안내 박스 */}
            <div className="flex gap-3 p-4 rounded-xl border border-outline bg-primary/5">
              <AlertCircle className="mt-0.5 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-1">
                  허위 신고는 제재를 받을 수 있습니다.
                </p>
                <p className="text-xs text-text-3">
                  신고 유형을 선택하고 상세 내용을 작성해주세요.
                </p>
              </div>
            </div>

            {/* 신고 유형 (Radio List) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">신고 유형</label>

              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(REASON_LABEL) as ReportReasonType[]).map((k) => {
                  const checked = reasonType === k;

                  return (
                    <label
                      key={k}
                      className={`cursor-pointer rounded-xl border px-4 py-3 transition
                      ${
                        checked
                          ? "border-primary bg-primary/5"
                          : "border-outline bg-white hover:bg-button-hover"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="reasonType"
                          value={k}
                          checked={checked}
                          onChange={() => {
                            setReasonType(k);
                            setTouched((p) => ({ ...p, type: true }));
                          }}
                          // tailwind 문법 수정(기본 accent)
                          className="mt-1 h-4 w-4 accent-primary"
                        />

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-text-1">
                              {REASON_LABEL[k]}
                            </p>

                            {checked ? (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                선택됨
                              </span>
                            ) : null}
                          </div>

                          {/* 같은 라벨 반복 출력 버그 수정 */}
                          <p className="text-xs text-text-3 mt-1">
                            {REASON_LABEL[k]}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 상세 내용 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="reasonDetail" className="text-sm font-medium">
                  신고 사유 상세 내용{" "}
                  <span className="text-primary ml-1">*</span>
                </label>
                <span className="text-xs text-text-3">
                  {trimmedDetail.length}/300
                </span>
              </div>

              <textarea
                id="reasonDetail"
                value={reasonDetail}
                onChange={(e) => setReasonDetail(e.target.value.slice(0, 300))}
                onBlur={() => setTouched((p) => ({ ...p, detail: true }))}
                rows={4}
                placeholder={
                  "신고하려는 내용에 대해 자세히 설명해주세요.\n예: 부적절한 광고성 내용이 포함되어 있습니다."
                }
                className={`w-full resize-none border rounded-xl py-3 px-4 bg-white outline-none transition focus:ring-2 focus:ring-primary/60 ${
                  detailError
                    ? "border-primary-2 focus:border-primary/60"
                    : "border-outline focus:border-primary/40"
                }`}
              />

              {detailError ? (
                <p className="text-xs text-primary">{detailError}</p>
              ) : (
                <p className="text-xs text-text-3">
                  상세 내용을 {minLen}자 이상 작성해주세요.
                </p>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-2 border-t border-outline px-6 py-4 bg-white">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer flex-1 py-2.5 rounded-xl border border-outline hover:bg-button-hover transition"
              disabled={isSubmitting}
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`cursor-pointer flex-1 py-2.5 rounded-xl text-white transition ${
                canSubmit
                  ? "bg-primary-3 hover:bg-primary"
                  : "bg-primary-3/60 opacity-60 disabled:cursor-not-allowed"
              }
  `}
            >
              {isSubmitting ? "처리 중..." : "신고하기"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
