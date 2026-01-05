"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import EditHeader from "@/components/capsule/edit/EditHeader";
import Right from "@/components/capsule/new/right/Right";
import WriteInput from "@/components/capsule/new/left/WriteInput";
import WriteDiv from "@/components/capsule/new/left/WriteDiv";
import Button from "@/components/common/tag/Button";
import ActiveModal from "@/components/common/modal/ActiveModal";
import { CAPTURE_ENVELOPE_PALETTE } from "@/constants/capsulePalette";
import { updateCapsule, readSendCapsule } from "@/lib/api/capsule/capsule";
import { Send } from "lucide-react";

type PreviewState = {
  title: string;
  senderName: string;
  receiverName: string;
  content: string;
  visibility: Visibility | "SELF";
  authMethod: string;
  unlockType: string;
  charCount: number;
  envelopeColorName: string;
  paperColorName: string;
  paperColorHex: string;
};

export default function CapsuleEditPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const capsuleId = useMemo(
    () => Number(searchParams.get("capsuleId") ?? 0),
    [searchParams]
  );

  const initialTitle = "";
  const initialContent = "";

  const [preview, setPreview] = useState<PreviewState>({
    title: initialTitle,
    senderName: "",
    receiverName: "",
    content: initialContent,
    visibility: "PRIVATE",
    authMethod: "URL",
    unlockType: "TIME",
    charCount: initialContent.length,
    envelopeColorName: "",
    paperColorName: "",
    paperColorHex: "#F5F1E8",
  });

  const MAX_CONTENT_LENGTH = 3000;
  const [isComposing, setIsComposing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const findColorHex = (name?: string | null) => {
    if (!name) return undefined;
    const found = CAPTURE_ENVELOPE_PALETTE.find(
      (c) => c.name?.toLowerCase() === name.toLowerCase()
    );
    return found?.color as string | undefined;
  };

  // 서버 프리필 대비 유효 값 계산
  const { data: prefillData } = useQuery({
    queryKey: ["capsuleEditPrefill", capsuleId],
    enabled: capsuleId > 0 && !preview.title && !preview.content,
    queryFn: async () => {
      const res = await readSendCapsule(capsuleId);
      return res.data;
    },
  });

  const effectiveTitle = preview.title || prefillData?.title || "";
  const effectiveContent = preview.content || prefillData?.content || "";
  const effectiveCharCount =
    preview.charCount || prefillData?.content?.length || 0;
  const effectiveEnvelopeName =
    preview.envelopeColorName || prefillData?.capsulePackingColor || "-";
  const effectivePaperName =
    preview.paperColorName || prefillData?.capsuleColor || "-";
  const effectivePaperHex =
    findColorHex(preview.paperColorHex ? undefined : effectivePaperName) ||
    preview.paperColorHex ||
    "#F5F1E8";
  const effectiveSender =
    preview.senderName || prefillData?.senderNickname || "";
  const effectiveReceiver =
    preview.receiverName || prefillData?.recipient || "";
  const effectiveVisibility = preview.visibility || "PRIVATE";
  const effectiveUnlockType =
    preview.unlockType || prefillData?.unlockType || "TIME";
  const effectiveAuthMethod =
    effectiveVisibility === "PUBLIC" ? "NONE" : "PASSWORD";
  const mergedPreview: PreviewState = {
    ...preview,
    title: effectiveTitle,
    content: effectiveContent,
    charCount: effectiveCharCount,
    senderName: effectiveSender,
    receiverName: effectiveReceiver,
    visibility: effectiveVisibility,
    authMethod: effectiveAuthMethod,
    unlockType: effectiveUnlockType,
    envelopeColorName: effectiveEnvelopeName,
    paperColorName: effectivePaperName,
    paperColorHex: effectivePaperHex,
  };

  const updateMutation = useMutation({
    mutationKey: ["capsuleUpdatePage", capsuleId],
    mutationFn: (payload: { title: string; content: string }) =>
      updateCapsule(capsuleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries();
      setIsSuccessModalOpen(true);
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "수정 중 오류가 발생했습니다.";
      setErrorMessage(msg);
      setIsErrorModalOpen(true);
    },
  });

  const disabled =
    !capsuleId ||
    updateMutation.isPending ||
    (!effectiveTitle.trim() && !effectiveContent.trim());

  if (!capsuleId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-2">
        캡슐 ID가 없습니다.
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <EditHeader />

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden bg-sub">
        <div className="w-full lg:w-1/2 overflow-y-auto">
          <section className="p-8 space-y-6">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate({
                  title: effectiveTitle,
                  content: effectiveContent,
                });
              }}
            >
              <WriteDiv
                title="편지 제목"
                warning="* 상대방이 편지를 열지 않아도 볼 수 있는 제목입니다. 공개를 원하지 않는 내용은 작성을 삼가 주세요."
              >
                <WriteInput
                  id="title"
                  type="text"
                  placeholder="미리 노출되는 제목을 작성해보세요."
                  value={effectiveTitle}
                  onChange={(e) =>
                    setPreview((p) => ({
                      ...p,
                      title: e.target.value,
                    }))
                  }
                />
              </WriteDiv>

              <WriteDiv title="편지 내용">
                <div>
                  <textarea
                    value={effectiveContent}
                    onChange={(e) => {
                      const next = isComposing
                        ? e.target.value
                        : e.target.value.slice(0, MAX_CONTENT_LENGTH);
                      setPreview((p) => ({
                        ...p,
                        content: next,
                        charCount: next.length,
                      }));
                    }}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={(e) => {
                      setIsComposing(false);
                      const next = e.currentTarget.value.slice(
                        0,
                        MAX_CONTENT_LENGTH
                      );
                      setPreview((p) => ({
                        ...p,
                        content: next,
                        charCount: next.length,
                      }));
                    }}
                    maxLength={MAX_CONTENT_LENGTH}
                    className="w-full h-60 bg-sub-2 p-3 rounded-lg resize-none outline-none border border-white focus:border focus:border-primary-2"
                    placeholder="마음을 담아 편지를 써보세요..."
                  />

                  <div
                    className={`text-right text-xs ${
                      effectiveCharCount > MAX_CONTENT_LENGTH * 0.9
                        ? "text-error"
                        : "text-text-3"
                    }`}
                  >
                    {Math.min(effectiveCharCount, MAX_CONTENT_LENGTH)} /{" "}
                    {MAX_CONTENT_LENGTH}
                  </div>

                  <input
                    type="hidden"
                    value={effectiveContent}
                    name="content"
                  />
                </div>
              </WriteDiv>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="w-full py-4 space-x-2 disabled:opacity-50"
                  disabled={disabled}
                >
                  <Send />
                  <span>
                    {updateMutation.isPending ? "보내는 중..." : "수정하기"}
                  </span>
                </Button>
              </div>
            </form>
          </section>
        </div>

        <div className="w-1/2 hidden lg:flex border-l border-outline overflow-hidden min-h-0">
          <Right preview={mergedPreview} />
        </div>
      </div>

      <ActiveModal
        active="success"
        title="수정이 완료되었습니다."
        content="캡슐이 성공적으로 수정되었습니다."
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onConfirm={() => {
          setIsSuccessModalOpen(false);
          router.back();
        }}
      />

      <ActiveModal
        active="fail"
        title="수정 실패"
        content={errorMessage || "수정 중 오류가 발생했습니다."}
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        onConfirm={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
}
