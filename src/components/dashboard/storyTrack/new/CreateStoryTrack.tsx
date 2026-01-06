"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Button from "@/components/common/tag/Button";
import { useRouter } from "next/navigation";
import SecondForm from "./secondForm/SecondForm";
import SuccessForm from "./SuccessForm";
import FirstForm from "./FirstForm";
import BackButton from "@/components/common/tag/BackButton";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cleanupStorytrackTempFile } from "@/lib/hooks/useCleanupStorytrackTempFile";

type Step = 1 | 2 | 3;

type FormState = {
  // step1
  title: string;
  description: string;
  order: TrackType;
  thumbnailAttachmentId: number | undefined; // 필수 (초기값은 undefined)
  thumbnailStatus?: "UPLOADING" | "PENDING" | "TEMP" | "DELETED" | "USED"; // 썸네일 상태

  // step2
  routeLetterIds: string[];
};

type Step2UIState = {
  routeItems: Letter[];
};

const initialState: FormState = {
  title: "",
  description: "",
  order: "SEQUENTIAL",
  thumbnailAttachmentId: undefined,
  thumbnailStatus: undefined,
  routeLetterIds: [],
};

export default function CreateStoryTrack() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>(initialState);

  const [step2, setStep2] = useState<Step2UIState>({ routeItems: [] });

  // Step 3에서 사용할 썸네일 이미지 URL
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(
    null
  );

  // Step1 → Step2로 이동하는 경우 cleanup을 스킵하기 위한 ref
  const skipCleanupForNextStepRef = useRef(false);

  // step1 검증: 전부 입력했을 때만 다음 가능
  const canGoNextFromStep1 = useMemo(() => {
    return (
      form.title.trim().length > 0 &&
      form.description.trim().length > 0 &&
      form.thumbnailAttachmentId !== undefined &&
      form.thumbnailStatus === "TEMP" // TEMP 상태(필터링 완료)일 때만 다음 단계 가능
    );
  }, [
    form.title,
    form.description,
    form.thumbnailAttachmentId,
    form.thumbnailStatus,
  ]);

  // step2 검증: 최소 2개 이상 선택해야 제출 가능
  const canSubmitFromStep2 = useMemo(() => {
    return form.routeLetterIds.length > 1;
  }, [form.routeLetterIds.length]);

  const handleCancel = () => {
    // 취소 시 cleanup 스킵 플래그를 false로 리셋하여 cleanup이 실행되도록 함
    skipCleanupForNextStepRef.current = false;

    // Step1, Step2에서만 취소 시 cleanup 실행
    // Step 3에서는 스토리트랙 생성 완료로 썸네일이 THUMBNAIL 상태이므로 cleanup 불필요
    if (step !== 3 && form.thumbnailAttachmentId) {
      cleanupStorytrackTempFile(form.thumbnailAttachmentId);
    }

    router.push("/dashboard/storyTrack/joined");
  };

  const handleNext = () => {
    if (step === 1 && !canGoNextFromStep1) return;
    if (step === 1) {
      // Step1 -> Step2로 이동하기 전에 cleanup 스킵 플래그 설정
      skipCleanupForNextStepRef.current = true;
      setStep(2);
    }
  };

  // Step2 0< Step1로 돌아올 때 cleanup 스킵 플래그 설정
  const handleBack = () => {
    if (step === 2) {
      // Step2 → Step1로 돌아가기 전에 cleanup 스킵 플래그 설정
      skipCleanupForNextStepRef.current = true;
      setStep(1);
    }
  };

  // Step 간 이동 완료 후 cleanup 스킵 플래그 리셋
  useEffect(() => {
    // Step 변경 후 약간의 지연을 두고 플래그 리셋
    // (언마운트 cleanup이 실행된 후 리셋되도록)
    const timeoutId = setTimeout(() => {
      if (skipCleanupForNextStepRef.current) {
        skipCleanupForNextStepRef.current = false;
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [step]);

  // 페이지 이탈 시 cleanup 실행 (Step1, Step2만)
  // Step1 → Step2, Step2 → Step1 이동 시에만 cleanup 스킵
  // Step 3에서는 스토리트랙 생성 완료로 썸네일이 THUMBNAIL 상태이므로 cleanup 불필요
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Step 3에서는 cleanup 실행하지 않음 (스토리트랙 생성 완료)
      if (step === 3) return;

      // Step 간 이동 중이면 cleanup 스킵
      if (skipCleanupForNextStepRef.current) return;

      // 그 외 모든 경우 (취소, 탭 닫기, 뒤로가기 등): cleanup 실행
      if (form.thumbnailAttachmentId) {
        cleanupStorytrackTempFile(form.thumbnailAttachmentId);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [step, form.thumbnailAttachmentId]);

  // 컴포넌트 언마운트 시 cleanup 실행 (Step1, Step2만)
  // Step1 -> Step2, Step2 -> Step1 이동 시에만 cleanup 스킵
  // Step 3에서는 스토리트랙 생성 완료로 썸네일이 THUMBNAIL 상태이므로 cleanup 불필요
  useEffect(() => {
    return () => {
      // Step 3에서는 cleanup 실행하지 않음 (스토리트랙 생성 완료)
      if (step === 3) return;

      // Step 간 이동 중이면 cleanup 스킵
      if (skipCleanupForNextStepRef.current) return;

      // 그 외 모든 경우 (취소, 뒤로가기 등): cleanup 실행
      if (form.thumbnailAttachmentId) {
        cleanupStorytrackTempFile(form.thumbnailAttachmentId);
      }
    };
  }, [step, form.thumbnailAttachmentId]);

  const handleSubmit = async () => {
    if (step !== 2) return;
    if (!canSubmitFromStep2) return;

    try {
      setIsSubmitting(true);

      // FormState -> CreateStorytrackRequest 변환
      // canSubmitFromStep2와 canGoNextFromStep1 검증을 통과했으므로 thumbnailAttachmentId는 반드시 존재
      const payload: CreateStorytrackRequest = {
        title: form.title.trim(),
        description: form.description.trim(),
        trackType: form.order === "SEQUENTIAL" ? "SEQUENTIAL" : "FREE",
        isPublic: 1, // 기본값: 공개
        price: 0, // 기본값: 무료
        capsuleList: form.routeLetterIds.map((id) => Number(id)), // string[] → number[]
        attachmentId: form.thumbnailAttachmentId!, // 썸네일 attachmentId (필수, 검증 완료)
      };

      // API 호출
      const response = await storyTrackApi.createStorytrack(payload);

      // 성공 시 Step 3으로 이동
      if (response.code === "200") {
        queryClient.invalidateQueries({ queryKey: ["mineStoryTrack"] });

        // 스토리트랙 상세 조회로 썸네일 이미지 URL 가져오기
        try {
          const detailResponse = await storyTrackApi.storyTrackDetail({
            storytrackId: String(response.data.storytrackId),
          });
          if (detailResponse.code === "200" && detailResponse.data.imageUrl) {
            setThumbnailImageUrl(detailResponse.data.imageUrl);
          }
        } catch (error) {
          console.error("썸네일 이미지 URL 조회 실패:", error);
          // 이미지 URL 조회 실패는 무시 (이미지 없이 표시)
        }

        toast.success("스토리트랙 생성이 완료되었습니다!");
        setStep(3);
      } else {
        throw new Error(response.message || "스토리트랙 생성에 실패했습니다.");
      }
    } catch (e) {
      console.error("스토리트랙 생성 실패:", e);
      const errorMessage =
        e instanceof Error
          ? e.message
          : "스토리트랙 생성에 실패했습니다. 다시 시도해주세요.";
      toast.error(errorMessage);
      // 생성 실패 시 임시 파일은 그대로 유지 (사용자가 다시 시도할 수 있도록)
      // cleanup은 Step1로 돌아가거나 페이지를 벗어날 때 실행됨
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full lg:h-screen overflow-hidden flex flex-col">
      {/* Top + Form 영역 */}
      <div className="flex-1 overflow-hidden p-4 lg:p-8 flex flex-col gap-4 lg:gap-8 min-h-0">
        {/* Top */}
        <div className="space-y-3 flex-none">
          <BackButton />

          <div className="space-y-2">
            <h3 className="text-xl lg:text-3xl font-medium">
              새 스토리트랙 만들기
              <span className="text-primary px-1">_</span>
            </h3>
            <p className="text-sm lg:text-base text-text-2">
              공개 스토리트랙으로 특별한 경로를 만들어보세요
            </p>
          </div>
        </div>

        {/* 진행 상태 */}
        <StepHeader step={step} />

        {/* Form */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <form className="h-full">
            {/* Step 1 */}
            {step === 1 && (
              <FirstForm
                value={{
                  title: form.title,
                  description: form.description,
                  order: form.order,
                  thumbnailAttachmentId: form.thumbnailAttachmentId,
                  thumbnailStatus: form.thumbnailStatus,
                }}
                onChange={(patch: Partial<FirstFormValue>) =>
                  setForm((prev) => ({ ...prev, ...patch }))
                }
                skipCleanupRef={skipCleanupForNextStepRef}
              />
            )}

            {/* Step 2 */}
            {step === 2 && (
              <SecondForm
                order={form.order}
                value={{ routeItems: step2.routeItems }}
                onChange={(patch) => {
                  // (UI용)
                  const nextRouteItems = patch.routeItems ?? step2.routeItems;

                  // UI state 업데이트
                  setStep2({ routeItems: nextRouteItems });

                  // 저장용: id만 추출해서 form에 저장
                  setForm((prev) => ({
                    ...prev,
                    routeLetterIds: nextRouteItems.map((x) => x.id),
                  }));
                }}
              />
            )}

            {/* Step 3 */}
            {step === 3 && (
              <SuccessForm
                title={form.title}
                order={form.order}
                routeCount={form.routeLetterIds.length}
                imageUrl={thumbnailImageUrl || undefined}
              />
            )}
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex-none border-t border-outline bg-bg/95 backdrop-blur">
        <div className="px-8 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-center">
            {/* 왼쪽 버튼 */}
            {step === 1 ? (
              <Button
                type="button"
                onClick={handleCancel}
                className="md:font-normal py-2 px-8 bg-bg border border-outline text-text"
              >
                취소
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleBack}
                className="md:font-normal py-2 px-8 bg-bg border border-outline text-text hover:bg-button-hover"
              >
                이전
              </Button>
            )}

            {/* 오른쪽 버튼 */}
            {step === 1 && (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canGoNextFromStep1}
                className="md:font-normal py-2 px-8"
              >
                다음 단계
              </Button>
            )}

            {step === 2 && (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmitFromStep2 || isSubmitting}
                className="md:font-normal py-2 px-8"
              >
                {isSubmitting ? "생성 중..." : "스토리트랙 생성"}
              </Button>
            )}

            {step === 3 && (
              <Button
                type="button"
                onClick={() => router.push("/dashboard/storyTrack/mine")}
                className="md:font-normal py-2 px-8"
              >
                완료
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 진행 상태 헤더: step에 따라 active 스타일 변경 */
function StepHeader({ step }: { step: 1 | 2 | 3 }) {
  const active = "text-primary-2";
  const inactive = "text-text-4";
  const circleActive = "bg-primary-2 text-white";
  const circleInactive = "border border-outline text-text-4";

  const steps = [
    { n: 1, label: "기본 정보" },
    { n: 2, label: "경로 설정" },
    { n: 3, label: "스토리트랙 생성 완료" },
  ] as const;

  const percent = step === 1 ? 33 : step === 2 ? 66 : 100;
  const current = steps[step - 1];

  return (
    <div className="flex flex-col gap-3">
      {/* Mobile: 현재 스텝만 (하지만 데스크탑과 동일한 원형 배지 스타일 유지) */}
      <div className="md:hidden flex items-center justify-between">
        <div className={`flex items-center gap-3 ${active}`}>
          <span
            className={`w-9 h-9 rounded-full flex items-center justify-center ${circleActive}`}
          >
            {current.n}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-primary-2">{current.label}</span>
          </div>
        </div>
        <span className="text-xs text-text-3">{percent}%</span>
      </div>

      {/* Mobile: 진행바 (outline 톤 유지) */}
      <div className="md:hidden w-full h-2 bg-outline rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-2 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Desktop: 기존 그대로 */}
      <div className="hidden md:flex items-center gap-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className={`flex-none flex items-center gap-3 ${
              step === s.n ? active : inactive
            }`}
          >
            <span
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === s.n ? circleActive : circleInactive
              }`}
            >
              {s.n}
            </span>
            <span>{s.label}</span>
          </div>
        ))}

        <div className="w-full h-0.5 bg-outline" />
      </div>
    </div>
  );
}
