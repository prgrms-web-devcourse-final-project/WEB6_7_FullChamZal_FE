"use client";

import { useMemo, useState } from "react";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import SecondForm from "./secondForm/SecondForm";
import SuccessForm from "./SuccessForm";
import FirstForm from "./FirstForm";
import BackButton from "@/components/common/BackButton";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import toast from "react-hot-toast";

type Step = 1 | 2 | 3;

type FormState = {
  // step1
  title: string;
  description: string;
  order: OrderType;
  imageFile: File | null;

  // step2
  routeLetterIds: string[];
};

type Step2UIState = {
  routeItems: Letter[];
};

const initialState: FormState = {
  title: "",
  description: "",
  order: "ordered",
  imageFile: null,
  routeLetterIds: [],
};

export default function CreateStoryTrack() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>(initialState);

  const [step2, setStep2] = useState<Step2UIState>({ routeItems: [] });

  // step1 검증: 전부 입력했을 때만 다음 가능
  const canGoNextFromStep1 = useMemo(() => {
    return (
      form.title.trim().length > 0 &&
      form.description.trim().length > 0 &&
      form.imageFile !== null
    );
  }, [form.title, form.description, form.imageFile]);

  // step2 검증: 최소 2개 이상 선택해야 제출 가능
  const canSubmitFromStep2 = useMemo(() => {
    return form.routeLetterIds.length > 1;
  }, [form.routeLetterIds.length]);

  const handleCancel = () => {
    router.push("/dashboard/storyTrack/joined");
  };

  const handleNext = () => {
    if (step === 1 && !canGoNextFromStep1) return;
    if (step === 1) setStep(2);
  };

  const handleSubmit = async () => {
    if (step !== 2) return;
    if (!canSubmitFromStep2) return;

    try {
      setIsSubmitting(true);

      // FormState → CreateStorytrackRequest 변환
      const payload: CreateStorytrackRequest = {
        title: form.title.trim(),
        description: form.description.trim(),
        trackType: form.order === "ordered" ? "SEQUENTIAL" : "FREE",
        isPublic: 1, // 기본값: 공개
        price: 0, // 기본값: 무료
        capsuleList: form.routeLetterIds.map((id) => Number(id)), // string[] → number[]
      };

      // API 호출
      const response = await storyTrackApi.createStorytrack(payload);

      // 성공 시 Step 3으로 이동
      if (response.code === "200") {
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
                  imageFile: form.imageFile,
                }}
                onChange={(patch: Partial<FirstFormValue>) =>
                  setForm((prev) => ({ ...prev, ...patch }))
                }
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
              />
            )}
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex-none border-t border-outline bg-white/95 backdrop-blur">
        <div className="px-8 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-center">
            {/* 왼쪽 버튼 */}
            {step === 1 ? (
              <Button
                type="button"
                onClick={handleCancel}
                className="md:font-normal py-2 px-8 bg-white border border-outline text-text"
              >
                취소
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setStep((s) => (s === 2 ? 1 : s))}
                className="md:font-normal py-2 px-8 bg-white border border-outline text-text"
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
