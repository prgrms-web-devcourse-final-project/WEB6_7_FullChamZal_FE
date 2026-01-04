"use client";

import Button from "@/components/common/Button";
import OverlayModal from "../OverlayModal";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function ResetPasswordModal({
  open,
  onClose,
  newPassword,
  newPassword2,
  setNewPassword,
  setNewPassword2,
  canReset,
  isPending,
  isSuccess,
  onSubmit,
  onGoLogin,
}: {
  open: boolean;
  onClose: () => void;
  newPassword: string;
  newPassword2: string;
  setNewPassword: (v: string) => void;
  setNewPassword2: (v: string) => void;
  canReset: boolean;
  isPending: boolean;
  isSuccess: boolean;
  onSubmit: () => void;
  onGoLogin: () => void;
}) {
  if (!open) return null;

  const isPasswordValid = passwordRegex.test(newPassword);
  const mismatch = newPassword2.length > 0 && newPassword !== newPassword2;

  const disabledReset = !canReset || !isPasswordValid || mismatch;

  return (
    <OverlayModal open={open} onClose={onClose}>
      <div className="relative w-[92%] max-w-md rounded-2xl border border-outline bg-white p-6 shadow-2xl">
        <div className="space-y-2">
          <p className="text-lg font-semibold">비밀번호 재설정</p>
          <p className="text-sm text-text-3">새 비밀번호를 입력해주세요.</p>
        </div>

        <div className="mt-4 space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-text-2">새 비밀번호</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              autoComplete="new-password"
              className="w-full p-4 bg-white border border-outline rounded-xl outline-none focus:border-primary-2"
            />

            {/* 안내 문구 + 실시간 검증 */}
            <p className="text-xs text-text-3">
              영문, 숫자, 특수문자를 포함한 8자 이상
            </p>
            {!isPasswordValid && newPassword.length > 0 && (
              <p className="text-sm text-primary">
                영문, 숫자, 특수문자를 모두 포함한 8자 이상이어야 합니다.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-2">새 비밀번호 확인</label>
            <input
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              type="password"
              placeholder="비밀번호 재입력"
              autoComplete="new-password"
              className="w-full p-4 bg-white border border-outline rounded-xl outline-none focus:border-primary-2"
            />
            {mismatch && (
              <p className="text-sm text-primary">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button
            className="w-full py-3 border border-outline bg-white text-text md:font-normal hover:bg-button-hover"
            onClick={onClose}
          >
            닫기
          </Button>

          <Button
            className="w-full py-3 md:font-normal"
            onClick={onSubmit}
            disabled={disabledReset}
          >
            {isPending ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </div>

        {isSuccess && (
          <div className="mt-4 text-sm text-text-3">
            비밀번호 변경 완료. 로그인 페이지로 돌아가서 로그인하세요.
            <button
              type="button"
              className="ml-2 underline underline-offset-4 hover:text-text-2"
              onClick={onGoLogin}
            >
              로그인하러 가기
            </button>
          </div>
        )}
      </div>
    </OverlayModal>
  );
}
