"use client";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getMeDetail, updateMe } from "@/lib/api/members/members";

const getErrorMessage = (e: unknown) => {
  if (e && typeof e === "object" && "message" in e) {
    return String((e as { message?: unknown }).message ?? "요청 실패");
  }
  return "요청 실패";
};

export default function PhoneEditModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [initialPhone, setInitialPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let mounted = true;
    setError(null);

    (async () => {
      setIsLoading(true);
      try {
        const me = await getMeDetail();
        if (!mounted) return;

        const value = me.phoneNumber ?? "";
        setPhone(value);
        setInitialPhone(value);
      } catch (e: unknown) {
        if (!mounted) return;
        setError(getErrorMessage(e) ?? "전화번호를 불러오지 못했어요.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open]);

  const isDirty = phone !== initialPhone;

  const onSave = async () => {
    if (!isDirty || !phone.trim()) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateMe({ phoneNumber: phone });
      onClose();
    } catch (e: unknown) {
      setError(getErrorMessage(e) ?? "전화번호 수정에 실패했어요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-[420px] rounded-2xl border border-outline bg-white p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg">전화번호 수정</h4>
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

          <label className="text-sm">전화번호</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading || isSaving}
            className="w-full rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3 disabled:bg-gray-100 disabled:text-text-3"
            placeholder="전화번호를 입력해주세요"
          />

          <Button
            className="w-full py-3"
            onClick={onSave}
            disabled={isLoading || isSaving || !isDirty || !phone.trim()}
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </Button>
        </div>

        <p className="text-xs text-text-3 mt-3">
          (추후 여기 자리에 SMS 인증 플로우를 붙이면 좋아요)
        </p>
      </div>
    </Modal>
  );
}
