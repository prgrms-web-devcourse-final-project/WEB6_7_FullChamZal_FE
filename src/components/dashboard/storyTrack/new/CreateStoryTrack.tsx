"use client";

import { useMemo, useState } from "react";
import Button from "@/components/common/Button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import SecondForm from "./secondForm/SecondForm";
import SuccessForm from "./SuccessForm";
import FirstForm from "./FirstForm";

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

  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    if (step === 2) setStep(1);
    if (step === 3) router.push("/dashboard/storyTrack/joined");
  };

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

      // 성공하면 Step3
      setStep(3);
    } catch (e) {
      console.error(e);
      alert("생성 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Top + Form 영역 */}
      <div className="flex-1 overflow-hidden p-8 flex flex-col gap-8 min-h-0">
        {/* Top */}
        <div className="space-y-3 flex-none">
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer flex items-center gap-1 text-text-3 hover:text-text"
          >
            <ArrowLeft size={20} />
            돌아가기
          </button>

          <div className="space-y-2">
            <h3 className="text-3xl font-medium">
              새 스토리트랙 만들기
              <span className="text-primary px-1">_</span>
            </h3>
            <p className="text-text-2">
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
                  // patch.routeItems: Letter[] (UI용)
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
            {step === 3 && <SuccessForm />}
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

  return (
    <div className="flex items-center gap-4 flex-none">
      <div
        className={`flex-none flex items-center gap-3 ${
          step === 1 ? active : inactive
        }`}
      >
        <span
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === 1 ? circleActive : circleInactive
          }`}
        >
          1
        </span>
        <span>기본 정보</span>
      </div>

      <div
        className={`flex-none flex items-center gap-3 ${
          step === 2 ? active : inactive
        }`}
      >
        <span
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === 2 ? circleActive : circleInactive
          }`}
        >
          2
        </span>
        <span>경로 설정</span>
      </div>

      <div
        className={`flex-none flex items-center gap-3 ${
          step === 3 ? active : inactive
        }`}
      >
        <span
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === 3 ? circleActive : circleInactive
          }`}
        >
          3
        </span>
        <span>스토리트랙 생성 완료</span>
      </div>

      <div className="w-full h-0.5 bg-outline" />
    </div>
  );
}
