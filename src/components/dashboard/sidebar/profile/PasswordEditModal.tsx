"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { X } from "lucide-react";
import { updateMe } from "@/lib/api/members/members";
import toast from "react-hot-toast";

const getErrorMessage = (e: unknown) => {
  if (e && typeof e === "object" && "message" in e) {
    return String((e as { message?: unknown }).message ?? "요청 실패");
  }
  return "요청 실패";
};

// 영문 + 숫자 + 특수문자 포함, 8자 이상
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function PasswordEditModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsSaving(false);
    setError(null);
  }, [open]);

  const isPasswordValid = passwordRegex.test(newPassword);
  const isMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const canSave =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    isPasswordValid &&
    !isMismatch &&
    !isSaving;

  const onSave = async () => {
    if (!canSave) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateMe({
        currentPassword,
        newPassword,
      });
      toast.success("비밀번호가 변경되었습니다!", {
        style: { borderColor: "#57b970" },
      });
      onClose();
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-105 rounded-2xl border border-outline bg-bg p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg">비밀번호 변경</h4>
          <button onClick={onClose} className="cursor-pointer" type="button">
            <X />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm">현재 비밀번호</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isSaving}
              className="w-full rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3 disabled:bg-gray-100 disabled:text-text-3"
              placeholder="현재 비밀번호를 입력해주세요"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isSaving}
              className="w-full rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3 disabled:bg-gray-100 disabled:text-text-3"
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            />

            {/* 안내 문구 + 실시간 검증 */}
            <p className="text-xs text-text-3">
              영문, 숫자, 특수문자를 포함한 8자 이상
            </p>
            {!isPasswordValid && newPassword.length > 0 ? (
              <p className="text-xs text-red-600">
                영문, 숫자, 특수문자를 모두 포함한 8자 이상이어야 합니다.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
              }}
              disabled={isSaving}
              className="w-full rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3 disabled:bg-gray-100 disabled:text-text-3"
              placeholder="새 비밀번호를 한 번 더 입력해주세요"
            />
          </div>

          {isMismatch ? (
            <p className="text-xs text-red-600">
              새 비밀번호가 일치하지 않습니다.
            </p>
          ) : null}

          <Button className="w-full py-3" onClick={onSave} disabled={!canSave}>
            {isSaving ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
