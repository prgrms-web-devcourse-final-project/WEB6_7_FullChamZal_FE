"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Lock, Mail, Phone, User, UserCircle, X } from "lucide-react";
import { Field } from "./Field";
import PhoneEditModal from "./PhoneEditModal";
import PasswordEditModal from "./PasswordEditModal";
import {
  getMeDetail,
  updateMe,
  verifyMemberPassword,
  type MemberMeDetail,
} from "@/lib/api/members/members";
import AccountDeleteModal from "./AccountDeleteModal";
import { useQuery } from "@tanstack/react-query";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";

type ProfileForm = {
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  oAuthProvider?: string | null;
};

const getErrorMessage = (e: unknown) => {
  if (e && typeof e === "object" && "message" in e) {
    return String((e as { message?: unknown }).message ?? "요청 실패");
  }
  return "요청 실패";
};

export default function ProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const emptyForm: ProfileForm = useMemo(
    () => ({
      name: "",
      nickname: "",
      email: "",
      phoneNumber: "",
    }),
    []
  );

  const [me, setMe] = useState<MemberMeDetail | null>(null);

  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [initialForm, setInitialForm] = useState<ProfileForm>(emptyForm);

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nextNicknameChangeDate, setNextNicknameChangeDate] = useState<
    string | null
  >(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const isOAuthGoogle = me?.oauthProvider === "GOOGLE";

  useEffect(() => {
    if (!open) return;

    // 초기화
    setMe(null);

    setIsVerified(false);
    setPassword("");
    setIsVerifying(false);

    setIsEditing(false);
    setIsSaving(false);
    setIsLoadingProfile(false);

    setError(null);
    setNextNicknameChangeDate(null);

    setForm(emptyForm);
    setInitialForm(emptyForm);

    (async () => {
      try {
        setIsLoadingProfile(true);
        const meRes = await getMeDetail();
        setMe(meRes);

        const next: ProfileForm = {
          name: meRes.name ?? "",
          nickname: meRes.nickname ?? "",
          email: meRes.userId ?? "",
          phoneNumber: meRes.phoneNumber ?? "",
          oAuthProvider: meRes.oauthProvider ?? null,
        };

        if (meRes.oauthProvider === "GOOGLE") {
          setIsVerified(true);
          setForm(next);
          setInitialForm(next);
          return;
        }

        setForm(emptyForm);
        setInitialForm(emptyForm);
      } catch (e: unknown) {
        setError(getErrorMessage(e));
      } finally {
        setIsLoadingProfile(false);
      }
    })();
  }, [open, emptyForm]);

  const updateField =
    (key: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const isDirty = form.nickname !== initialForm.nickname;

  const verifyPassword = async () => {
    if (!password.trim()) return;

    setIsVerifying(true);
    setError(null);

    try {
      await verifyMemberPassword(password);

      setIsVerified(true);
      setPassword("");

      setIsLoadingProfile(true);
      const meRes = await getMeDetail();
      setMe(meRes);

      const next: ProfileForm = {
        name: meRes.name ?? "",
        nickname: meRes.nickname ?? "",
        email: meRes.userId ?? "",
        phoneNumber: meRes.phoneNumber ?? "",
      };

      setForm(next);
      setInitialForm(next);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setIsVerifying(false);
      setIsLoadingProfile(false);
    }
  };

  const onSave = async () => {
    if (!isDirty) return;

    setIsSaving(true);
    setError(null);
    setNextNicknameChangeDate(null);

    try {
      const res = await updateMe({
        nickname: form.nickname,
      });

      setInitialForm((prev) => ({ ...prev, nickname: form.nickname }));
      setIsEditing(false);

      if (res?.nextNicknameChangeDate) {
        setNextNicknameChangeDate(res.nextNicknameChangeDate);
      }
    } catch (e: unknown) {
      setError(getErrorMessage(e));
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

  /** 보낸 편지 */
  const { data: sendData } = useQuery({
    queryKey: ["capsuleDashboard", "send", "count"],
    queryFn: ({ signal }) =>
      capsuleDashboardApi.sendDashboard({ page: 0, size: 1 }, signal),
  });

  /** 받은 편지 */
  const { data: receiveData } = useQuery({
    queryKey: ["capsuleDashboard", "receive", "count"],
    queryFn: ({ signal }) =>
      capsuleDashboardApi.receiveDashboard({ page: 0, size: 1 }, signal),
  });

  /* 북마크 */
  const { data: bookmarkData } = useQuery({
    queryKey: ["bookmarks", "count"],
    queryFn: ({ signal }) =>
      capsuleDashboardApi.bookmarks({ page: 0, size: 1 }, signal),
  });

  const sendCount = sendData?.data.totalElements ?? 0;
  const receiveCount = receiveData?.data.totalElements ?? 0;
  const bookmarkCount = bookmarkData?.totalElements ?? 0;

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div className="w-full max-w-125 rounded-2xl border-2 border-outline bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <div className="py-4 px-6 flex justify-between items-center border-b border-outline">
            <h4 className="text-lg">내 프로필</h4>

            {/* 구글 유저도 닫기는 허용(원하면 막을 수도 있음) */}
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer"
            >
              <X />
            </button>
          </div>

          <div className="space-y-8 p-6">
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {isLoadingProfile ? (
              <div className="text-sm text-text-3">불러오는 중...</div>
            ) : null}

            {!isVerified && !isOAuthGoogle ? (
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
                    className="w-full rounded-xl border border-outline px-4 py-3 outline-none focus:ring-2 focus:ring-primary-3"
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
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  <Field
                    icon={<User size={16} />}
                    label="이름"
                    value={form.name}
                    isEditing={false}
                    readOnly
                    disabled
                  />

                  <div className="space-y-1">
                    <Field
                      icon={<UserCircle size={16} />}
                      label="닉네임"
                      value={form.nickname}
                      isEditing={isEditing}
                      onChange={updateField("nickname")}
                    />
                    {nextNicknameChangeDate ? (
                      <p className="ml-1 text-xs text-text-3">
                        다음 닉네임 변경 가능일: {nextNicknameChangeDate}
                      </p>
                    ) : null}
                  </div>

                  <Field
                    icon={<Mail size={16} />}
                    label="이메일"
                    value={form.email}
                    isEditing={false}
                    readOnly
                    disabled
                  />

                  <Field
                    icon={<Phone size={16} />}
                    label="전화번호"
                    value={form.phoneNumber}
                    isEditing={false}
                    readOnly
                    actionLabel="수정"
                    onActionClick={() => setIsPhoneModalOpen(true)}
                  />

                  {form.oAuthProvider ? null : (
                    <Field
                      icon={<Lock size={16} />}
                      label="비밀번호"
                      value={isOAuthGoogle ? "소셜 로그인" : "••••••••"}
                      isEditing={false}
                      readOnly
                      actionLabel={isOAuthGoogle ? undefined : "수정"}
                      onActionClick={
                        isOAuthGoogle
                          ? undefined
                          : () => setIsPasswordModalOpen(true)
                      }
                    />
                  )}
                </div>

                <div className="flex gap-4 text-center">
                  <div className="flex-1 flex flex-col items-center gap-1 border border-outline bg-sub rounded-xl p-4">
                    <span className="text-2xl">{sendCount}</span>
                    <span className="text-text-3 text-xs">보낸 편지</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 border border-outline bg-sub rounded-xl p-4">
                    <span className="text-2xl">{receiveCount}</span>
                    <span className="text-text-3 text-xs">받은 편지</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 border border-outline bg-sub rounded-xl p-4">
                    <span className="text-2xl">{bookmarkCount}</span>
                    <span className="text-text-3 text-xs break-keep">
                      소중한 편지
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="py-6 px-6 flex flex-col gap-3 border-t border-outline">
            {!isVerified && !isOAuthGoogle ? (
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
                  disabled={
                    isLoadingProfile
                      ? true
                      : isEditing
                      ? !isDirty || isSaving
                      : false
                  }
                >
                  {isLoadingProfile
                    ? "불러오는 중..."
                    : isSaving
                    ? "저장 중..."
                    : isEditing
                    ? "저장하기"
                    : "프로필 수정"}
                </Button>

                {isEditing ? (
                  <Button
                    type="button"
                    className="w-full py-3 border border-outline bg-white text-text hover:bg-button-hover"
                    onClick={() => {
                      setForm(initialForm);
                      setIsEditing(false);
                      setError(null);
                      setNextNicknameChangeDate(null);
                    }}
                    disabled={isSaving}
                  >
                    돌아가기
                  </Button>
                ) : (
                  <button
                    type="button"
                    className="cursor-pointer text-text-3 text-xs underline"
                    onClick={() => setIsDeleteModalOpen(true)}
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
      {form.oAuthProvider ? null : (
        <PasswordEditModal
          open={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
      <AccountDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
