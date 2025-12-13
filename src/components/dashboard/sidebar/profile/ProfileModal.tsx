"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Lock, Mail, Phone, User, UserCircle, X } from "lucide-react";
import { Field } from "./Field";
import PhoneEditModal from "./PhoneEditModal";
import PasswordEditModal from "./PasswordEditModal";

type ProfileForm = {
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
};

export default function ProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const initial: ProfileForm = useMemo(
    () => ({
      name: "홍길동",
      nickname: "honggildong",
      email: "hong@mail.com",
      phoneNumber: "010-1234-5678",
    }),
    []
  );

  // ✅ 재인증(비밀번호 확인) 상태
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>(initial);
  const [initialForm, setInitialForm] = useState<ProfileForm>(initial);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // ✅ 모달 열릴 때마다 재인증 초기화
  useEffect(() => {
    if (open) {
      setIsVerified(false);
      setPassword("");
      setIsVerifying(false);
      setError(null);

      // 원하면 편집상태도 초기화
      setIsEditing(false);
      setForm(initialForm);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateField =
    (key: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const isDirty =
    form.name !== initialForm.name ||
    form.nickname !== initialForm.nickname ||
    form.email !== initialForm.email;

  const onSave = async () => {
    if (!isDirty) return;

    setIsSaving(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 700));
      setInitialForm(form);
      setIsEditing(false);
    } catch {
      setError("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const onPrimaryClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    onSave();
  };

  const handleClose = () => {
    onClose();
  };

  // 비밀번호 확인 로직 (서버로 확인 요청)
  const verifyPassword = async () => {
    if (!password.trim()) return;

    setIsVerifying(true);
    setError(null);

    try {
      // 예: POST /api/auth/verify-password

      setIsVerified(true);
      setPassword("");
    } catch (e: any) {
      setError(e.message ?? "비밀번호 확인에 실패했어요.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div className="w-full max-w-[500px] rounded-2xl border-2 border-outline bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
          {/* Header */}
          <div className="py-4 px-6 flex justify-between items-center border-b border-outline">
            <h4 className="text-lg">내 프로필</h4>
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer"
            >
              <X />
            </button>
          </div>

          {/* Contents */}
          <div className="space-y-8 p-6">
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {/* 1단계: 비밀번호 확인 */}
            {!isVerified ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-outline bg-sub p-4">
                  <Lock className="mt-0.5" size={18} />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">본인 확인이 필요해요</p>
                    <p className="text-xs text-text-3">
                      내 정보 열람을 위해 비밀번호를 입력해주세요.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">비밀번호</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") verifyPassword();
                    }}
                    className="w-110 rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3"
                    placeholder="비밀번호를 입력해주세요"
                    autoFocus
                  />
                </div>

                <Button
                  className="w-full py-3"
                  onClick={verifyPassword}
                  disabled={!password.trim() || isVerifying}
                >
                  {isVerifying ? "확인 중..." : "확인하기"}
                </Button>

                <button
                  type="button"
                  className="w-full text-center text-xs text-text-3 underline"
                  onClick={() => {
                    // 예: 비밀번호 찾기 페이지 이동
                    // router.push("/forgot-password")
                  }}
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            ) : (
              <>
                {/* 2단계: 기존 프로필 내용 그대로 */}
                <div className="space-y-5">
                  <Field
                    icon={<User size={16} />}
                    label="이름"
                    value={form.name}
                    isEditing={isEditing}
                    onChange={updateField("name")}
                  />

                  <Field
                    icon={<UserCircle size={16} />}
                    label="닉네임"
                    value={form.nickname}
                    isEditing={isEditing}
                    onChange={updateField("nickname")}
                  />

                  <Field
                    icon={<Mail size={16} />}
                    label="이메일"
                    value={form.email}
                    isEditing={isEditing}
                    onChange={updateField("email")}
                    disabled
                  />

                  <Field
                    icon={<Phone size={16} />}
                    label="전화번호"
                    value={form.phoneNumber}
                    isEditing={isEditing}
                    readOnly
                    actionLabel="수정"
                    onActionClick={() => setIsPhoneModalOpen(true)}
                  />

                  <Field
                    icon={<Lock size={16} />}
                    label="비밀번호"
                    value="••••••••"
                    isEditing={isEditing}
                    readOnly
                    actionLabel="수정"
                    onActionClick={() => setIsPasswordModalOpen(true)}
                  />
                </div>

                {/* 통계 */}
                <div className="flex gap-4 text-center">
                  <div className="flex-1 flex flex-col items-center gap-1 border border-outline bg-sub rounded-xl p-4">
                    <span className="text-2xl">24</span>
                    <span className="text-text-3 text-xs">보낸 편지</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 border border-outline bg-sub rounded-xl p-4">
                    <span className="text-2xl">24</span>
                    <span className="text-text-3 text-xs">받은 편지</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 border border-outline bg-sub rounded-xl p-4">
                    <span className="text-2xl">24</span>
                    <span className="text-text-3 text-xs">소중한 편지</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer도 인증 전/후 분기 추천 */}
          <div className="py-6 px-6 flex flex-col gap-3 border-t border-outline">
            {!isVerified ? (
              <Button
                className="w-full py-3 border border-outline bg-white text-text hover:text-white"
                onClick={handleClose}
              >
                닫기
              </Button>
            ) : (
              <>
                <Button
                  className="w-full py-3"
                  onClick={onPrimaryClick}
                  disabled={isEditing ? !isDirty || isSaving : false}
                >
                  {isSaving
                    ? "저장 중..."
                    : isEditing
                    ? "저장하기"
                    : "프로필 수정"}
                </Button>

                {isEditing ? (
                  <Button
                    type="button"
                    className="w-full py-3 border border-outline bg-white text-text hover:text-white"
                    onClick={() => {
                      setForm(initialForm);
                      setIsEditing(false);
                      setError(null);
                    }}
                    disabled={isSaving}
                  >
                    취소
                  </Button>
                ) : (
                  <button
                    type="button"
                    className="cursor-pointer text-text-3 text-xs underline"
                  >
                    계정 삭제
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>

      <PhoneEditModal
        open={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />
      <PasswordEditModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}
