"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import { useRouter, useParams } from "next/navigation";
import BackButton from "@/components/common/BackButton";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import toast from "react-hot-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import RouteEditList from "./RouteEditList";
import RouteMap from "../new/secondForm/RouteMap";
import { Map, X } from "lucide-react";

type FormState = {
  routeLetterIds: string[];
  order: TrackType; // 경로 표시용
  title: string; // 완료 페이지 표시용
};

type Step1UIState = {
  routeItems: Letter[];
};

export default function EditStoryTrack() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const storytrackId =
    typeof params.trackId === "string" ? params.trackId : undefined;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMap, setOpenMap] = useState(false);

  const [form, setForm] = useState<FormState>({
    routeLetterIds: [],
    order: "SEQUENTIAL",
    title: "",
  });

  const [step1, setStep1] = useState<Step1UIState>({ routeItems: [] });
  const [originalRouteItems, setOriginalRouteItems] = useState<Letter[]>([]);

  // 스토리트랙 상세 데이터 조회
  const { data: trackData, isLoading } = useQuery({
    queryKey: ["storyTrackDetail", storytrackId],
    queryFn: async ({ signal }) => {
      return await storyTrackApi.storyTrackDetail(
        { storytrackId, page: 0, size: 100 },
        signal
      );
    },
    enabled: !!storytrackId,
  });

  // API 데이터를 폼에 채우기
  useEffect(() => {
    if (trackData?.data) {
      const data = trackData.data;

      // 경로 데이터를 Letter[] 형식으로 변환
      const routeItems: Letter[] =
        data.paths?.content?.map((pathItem) => ({
          id: String(pathItem.capsule.capsuleId),
          title: pathItem.capsule.capsuleTitle || "",
          placeName: pathItem.capsule.unlock?.locationName,
          lat: pathItem.capsule.unlock?.location?.locationLat,
          lng: pathItem.capsule.unlock?.location?.locationLng,
        })) || [];

      setStep1({ routeItems });
      setOriginalRouteItems(routeItems); // 원본 저장 (변경사항 비교용)
      setForm((prev) => ({
        ...prev,
        routeLetterIds: routeItems.map((x) => x.id),
        order: data.storytrackType || "SEQUENTIAL",
        title: data.title || "",
      }));
    }
  }, [trackData]);

  // 변경사항이 있는지 확인
  const hasChanges =
    originalRouteItems.length !== step1.routeItems.length ||
    originalRouteItems.some(
      (original, index) => original.id !== step1.routeItems[index]?.id
    );

  const handleCancel = () => {
    if (storytrackId) {
      router.push(`/dashboard/storyTrack/${storytrackId}`);
    } else {
      router.push("/dashboard/storyTrack/mine");
    }
  };

  const handleReplace = (stepOrder: number, newLetter: Letter) => {
    // 해당 stepOrder의 경로를 새 편지로 교체
    const updatedItems = [...step1.routeItems];
    updatedItems[stepOrder - 1] = newLetter;
    setStep1({ routeItems: updatedItems });
    setForm((prev) => ({
      ...prev,
      routeLetterIds: updatedItems.map((x) => x.id),
    }));
  };

  const handleReorder = (next: Letter[]) => {
    // 순서 변경 (UI만 업데이트, 실제 API 호출은 handleSubmit에서 처리)
    setStep1({ routeItems: next });
    setForm((prev) => ({
      ...prev,
      routeLetterIds: next.map((x) => x.id),
    }));
  };

  const handleSubmit = async () => {
    if (!storytrackId) return;

    if (!hasChanges) {
      toast.success("변경사항이 없습니다.", {
        style: { borderColor: "#57b970" },
      });
      handleCancel();
      return;
    }

    try {
      setIsSubmitting(true);

      const storytrackIdNum = Number(storytrackId);
      if (isNaN(storytrackIdNum)) {
        throw new Error("유효하지 않은 스토리트랙 ID입니다.");
      }

      const currentRouteItems = step1.routeItems;
      const originalStepCount = originalRouteItems.length;
      const currentStepCount = currentRouteItems.length;

      // 최대 stepOrder 계산 (기존과 새 중 큰 값)
      const maxSteps = Math.max(originalStepCount, currentStepCount);

      // 각 step별로 비교하여 변경된 것만 수정
      for (let stepOrder = 1; stepOrder <= maxSteps; stepOrder++) {
        const originalCapsuleId = originalRouteItems[stepOrder - 1]?.id;
        const newCapsuleId = currentRouteItems[stepOrder - 1]?.id;

        // 새 경로가 더 짧아진 경우는 스킵 (백엔드에서 처리 필요할 수 있음)
        if (!newCapsuleId) {
          continue;
        }

        // 캡슐이 변경된 경우에만 API 호출
        if (originalCapsuleId !== newCapsuleId) {
          await storyTrackApi.updatePath({
            storytrackId: storytrackIdNum,
            stepOrderId: stepOrder,
            updatedCapsuleId: Number(newCapsuleId),
          });
        }
      }

      // 캐시 무효화 및 성공 처리
      queryClient.invalidateQueries({ queryKey: ["storyTrackDetail"] });
      queryClient.invalidateQueries({ queryKey: ["mineStoryTrack"] });

      toast.success("스토리트랙 경로 수정이 완료되었습니다!", {
        style: { borderColor: "#57b970" },
      });

      // 상세 페이지로 이동
      router.push(`/dashboard/storyTrack/${storytrackIdNum}`);
    } catch (e) {
      console.error("스토리트랙 수정 실패:", e);
      const errorMessage =
        e instanceof Error
          ? e.message
          : "스토리트랙 수정에 실패했습니다. 다시 시도해주세요.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full lg:h-screen overflow-hidden flex flex-col items-center justify-center">
        <div className="text-text-3">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="h-full lg:h-screen overflow-hidden flex flex-col">
      {/* Top + Form 영역 */}
      <div className="flex-1 overflow-hidden p-4 lg:p-8 flex flex-col gap-4 lg:gap-8 min-h-0">
        {/* Top */}
        <div className="space-y-3 flex-none">
          <BackButton />

          <div className="space-y-2">
            <h3 className="text-xl lg:text-3xl font-medium">
              스토리트랙 경로 수정
              <span className="text-primary px-1">_</span>
            </h3>
            <p className="text-sm lg:text-base text-text-2">
              각 경로의 편지를 교체하거나 위/아래 버튼으로 순서를 변경할 수
              있습니다.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <form className="h-full">
            {/* Step 1: 경로 수정 */}

            <div className="h-full min-h-0">
              <div className="flex gap-8 h-full min-h-0">
                {/* Left - 경로 목록 */}
                <div className="flex-1 h-full min-h-0 border border-outline rounded-xl p-4 lg:p-8 flex flex-col">
                  <div className="flex-1 min-h-0 overflow-y-auto px-2 space-y-4 lg:space-y-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="text-base lg:text-xl font-semibold text-text">
                          경로 수정
                        </div>
                        <p className="text-xs md:text-sm text-text-2">
                          각 경로 옆의 교체 버튼으로 편지를 교체하거나, 위/아래
                          버튼으로 순서를 변경할 수 있습니다.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOpenMap(true)}
                        className="cursor-pointer md:hidden flex-none inline-flex items-center gap-1 rounded-full border border-outline bg-bg px-3 py-2 text-sm text-text-3 hover:bg-button-hover"
                      >
                        <Map size={16} />
                        지도
                      </button>
                    </div>

                    <RouteEditList
                      order={form.order}
                      items={step1.routeItems}
                      onReplace={handleReplace}
                      onReorder={handleReorder}
                    />
                  </div>
                </div>

                {/* Right - 지도 (데스크탑) */}
                <div className="hidden md:block flex-1 h-full min-h-0 border border-outline rounded-xl overflow-hidden">
                  <RouteMap routeItems={step1.routeItems} order={form.order} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex-none border-t border-outline bg-bg/95 backdrop-blur">
        <div className="px-8 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-center">
            {/* 왼쪽 버튼 */}
            <Button
              type="button"
              onClick={handleCancel}
              className="md:font-normal py-2 px-8 bg-bg border border-outline text-text"
            >
              취소
            </Button>

            {/* 오른쪽 버튼 */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!hasChanges || isSubmitting}
              className="md:font-normal py-2 px-8"
            >
              {isSubmitting ? "수정 중..." : "경로 수정"}
            </Button>
          </div>
        </div>
      </div>

      {/* 모바일: 지도 바텀시트 */}
      {openMap ? (
        <div
          className="md:hidden fixed inset-0 z-9999 bg-black/40"
          onClick={() => setOpenMap(false)}
        >
          <div
            className="absolute left-0 right-0 bottom-0 bg-bg rounded-t-2xl border-t border-outline h-[85dvh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline">
              <div className="font-medium">지도</div>
              <button
                type="button"
                onClick={() => setOpenMap(false)}
                className="cursor-pointer p-2 rounded-lg hover:bg-button-hover"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              <RouteMap routeItems={step1.routeItems} order={form.order} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
