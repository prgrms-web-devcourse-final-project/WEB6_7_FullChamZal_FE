"use client";

import {
  Clock,
  Hand,
  ImageIcon,
  MapPin,
  PaintBucket,
  Send,
} from "lucide-react";
import WriteDiv from "./WriteDiv";
import ActionTab from "./ActionTab";
import VisibilityOpt from "./VisibilityOpt";
import WriteInput from "./WriteInput";
import UnlockConditionTabs from "./UnlockConditionTabs";
import { useRef, useState } from "react";
import DayTime from "./unlockOpt/DayTime";
import Location from "./unlockOpt/Location";
import DayLocation from "./unlockOpt/DayLocation";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import CopyTemplate from "../modal/CopyTemplate";
import { useMe } from "@/lib/hooks/useMe";
import {
  buildPrivatePayload,
  buildPublicPayload,
  createPrivateCapsule,
  createPublicCapsule,
} from "@/lib/api/capsule/capsule";
import type { UnlockType } from "@/lib/api/capsule/types";

export default function WriteForm() {
  const router = useRouter();
  const [isCopyOpen, setIsCopyOpen] = useState(false);
  const [result, setResult] = useState<{
    userName: string;
    url: string;
    password?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [senderMode, setSenderMode] = useState<"name" | "nickname">("name");

  const meQuery = useMe();
  const me = meQuery.data;

  const [visibility, setVisibility] = useState<Visibility>("PRIVATE");
  const [paperTab, setPaperTab] = useState("ENVELOPE");
  const [sendMethod, setSendMethod] = useState("URL");
  const [unlockType, setUnlockType] = useState("TIME");
  const [dayForm, setDayForm] = useState<DayForm>({ date: "", time: "" });
  const [locationForm, setLocationForm] = useState<LocationForm>({
    query: "",
    placeName: "",
    address: "",
    lat: undefined,
    lng: undefined,
  });

  /* 편지 내용 글자 수 제한 길이 */
  const MAX_CONTENT_LENGTH = 3000;

  const [content, setContent] = useState("");

  /* 한글 입력 중인지 체크 (조합 중엔 강제 slice 하면 입력이 깨질 수 있음) */
  const isComposingRef = useRef(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;

    /* 조합 중엔 일단 그대로 반영 (조합 종료 시에 한번 더 정리) */
    if (isComposingRef.current) {
      setContent(next);
      return;
    }

    setContent(next.slice(0, MAX_CONTENT_LENGTH));
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLTextAreaElement>
  ) => {
    isComposingRef.current = false;
    const next = e.currentTarget.value;
    setContent(next.slice(0, MAX_CONTENT_LENGTH));
  };

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    // 로그인 사용자의 name을 발신자 이름으로 고정
    const senderName =
      senderMode === "nickname" ? me?.nickname || "" : me?.name || "";
    const title = (formData.get("title") as string) || "";
    const receiveName = (formData.get("receiveName") as string) || "";
    const contentValue = content.trim();
    const phoneNum =
      sendMethod === "PHONE" ? (formData.get("pagePw") as string) || "" : "";
    const capsulePassword =
      sendMethod === "URL" ? (formData.get("pagePw") as string) || "" : "";

    // TODO: 미입력 폼 체크 - 토스트나 모달등으로 변경 예정
    if (!title) {
      window.alert("제목을 입력해 주세요.");
      return;
    }
    if (!receiveName) {
      window.alert("받는 사람을 입력해 주세요.");
      return;
    }
    if (!contentValue) {
      window.alert("내용을 입력해 주세요.");
      return;
    }
    if (!dayForm.date || !dayForm.time) {
      window.alert("해제 날짜와 시간을 모두 입력해 주세요.");
      return;
    }
    if (sendMethod === "PHONE" && !phoneNum) {
      window.alert("전화번호를 입력해 주세요.");
      return;
    }
    if (sendMethod === "URL" && !capsulePassword) {
      window.alert("비밀번호를 입력해 주세요.");
      return;
    }

    if (!me?.memberId) {
      if (meQuery.isLoading) {
        window.alert(
          "사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }
      window.alert("로그인 후 다시 시도해 주세요.");
      return;
    }

    // unlockType 매핑: MANUAL → TIME_AND_LOCATION
    const effectiveUnlockType: UnlockType =
      unlockType === "MANUAL"
        ? "TIME_AND_LOCATION"
        : (unlockType as UnlockType);

    // 시간/위치 필수 검증 (unlockType에 따라)
    if (
      (effectiveUnlockType === "TIME" ||
        effectiveUnlockType === "TIME_AND_LOCATION") &&
      (!dayForm.date || !dayForm.time)
    ) {
      window.alert("해제 날짜와 시간을 모두 입력해 주세요.");
      return;
    }
    if (
      (effectiveUnlockType === "LOCATION" ||
        effectiveUnlockType === "TIME_AND_LOCATION") &&
      (!locationForm.placeName || !locationForm.lat || !locationForm.lng)
    ) {
      window.alert("장소를 선택해 주세요.");
      return;
    }

    const privatePayload = buildPrivatePayload({
      memberId: me.memberId,
      senderName,
      title,
      content: contentValue,
      visibility,
      effectiveUnlockType,
      dayForm,
      locationForm,
    });

    const publicPayload = buildPublicPayload({
      memberId: me.memberId,
      senderName,
      title,
      content: contentValue,
      visibility,
      effectiveUnlockType,
      dayForm,
      locationForm,
      capsulePassword,
      capsuleColor: "",
      capsulePackingColor: "",
    });

    try {
      setIsSubmitting(true);

      const data =
        visibility === "PRIVATE"
          ? await createPrivateCapsule(privatePayload, {
              phoneNum,
              capsulePassword: capsulePassword || undefined,
            })
          : await createPublicCapsule(publicPayload);
      setResult({
        userName: senderName || data?.nickName || "",
        url: data?.url || "",
        password: data?.capPW,
      });
      setIsCopyOpen(true);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "캡슐 생성에 실패했습니다.";
      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <WriteDiv title="공개 범위">
          <VisibilityOpt value={visibility} onChange={setVisibility} />

          <input type="hidden" name="visibility" value={visibility} />
        </WriteDiv>

        <WriteDiv title="편지지 & 편지 봉투 테마">
          <div>
            <ActionTab
              value={paperTab}
              onChange={setPaperTab}
              tabs={[
                {
                  id: "ENVELOPE",
                  tabName: "편지봉투",
                  icon: <PaintBucket size={16} />,
                },
                {
                  id: "PAPER",
                  tabName: "편지지(추가예정)",
                  icon: <ImageIcon size={16} />,
                },
              ]}
            />
          </div>
        </WriteDiv>

        <WriteDiv title="보내는 사람">
          <div className="space-y-2">
            <div className="flex items-center justify-end gap-3 text-sm text-text-1 -mt-8 mb-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={senderMode === "name"}
                  onChange={() => setSenderMode("name")}
                />
                <span>이름</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={senderMode === "nickname"}
                  onChange={() => setSenderMode("nickname")}
                />
                <span>닉네임</span>
              </label>
            </div>
            <WriteInput
              id="sendName"
              type="text"
              placeholder="홍길동"
              value={
                senderMode === "nickname" ? me?.nickname || "" : me?.name || ""
              }
              readOnly
            />
          </div>
        </WriteDiv>

        <WriteDiv title="받는 사람">
          <div>
            <WriteInput id="receiveName" type="text" placeholder="미래의 나" />
          </div>
        </WriteDiv>

        <WriteDiv title="전달 방법">
          <div className="space-y-3">
            <ActionTab
              value={sendMethod}
              onChange={setSendMethod}
              tabs={[
                { id: "URL", tabName: "비밀번호" },
                { id: "PHONE", tabName: "전화번호" },
              ]}
            />
            {sendMethod === "PHONE" ? (
              <WriteDiv
                title="받는 사람 전화번호"
                warning="* 회원으로 등록된 전화번호만 사용할 수 있습니다."
              >
                <WriteInput id="pagePw" type="text" placeholder="- 없이 입력" />
              </WriteDiv>
            ) : (
              <WriteDiv
                title="편지 열람 비밀번호"
                warning="* 상대방이 해당 편지를 확인하기 위해 사용하는 비밀번호입니다."
              >
                <WriteInput
                  id="pagePw"
                  type="password"
                  placeholder="비밀번호를 입력하세요."
                />
              </WriteDiv>
            )}
          </div>
        </WriteDiv>

        <WriteDiv
          title="편지 제목"
          warning="* 상대방이 편지를 열지 않아도 볼 수 있는 제목입니다. 공개를 원하지 않는 내용은 작성을 삼가 주세요."
        >
          <div>
            <WriteInput
              id="title"
              type="text"
              placeholder="미리 노출되는 제목을 작성해보세요."
            />
          </div>
        </WriteDiv>

        <WriteDiv title="편지 내용">
          <div>
            <textarea
              value={content}
              onChange={handleContentChange}
              onCompositionStart={() => (isComposingRef.current = true)}
              onCompositionEnd={handleCompositionEnd}
              maxLength={MAX_CONTENT_LENGTH}
              className="w-full h-60 bg-sub-2 p-3 rounded-lg resize-none"
              placeholder="마음을 담아 편지를 써보세요..."
            />

            <div
              className={`text-right text-xs ${
                content.length > MAX_CONTENT_LENGTH * 0.9
                  ? "text-red-500"
                  : "text-text-3"
              }`}
            >
              {Math.min(content.length, MAX_CONTENT_LENGTH)} /{" "}
              {MAX_CONTENT_LENGTH}
            </div>

            <input type="hidden" name="content" value={content} />
          </div>
        </WriteDiv>

        <WriteDiv title="해제 조건">
          <div className="space-y-3">
            <UnlockConditionTabs
              tabs={[
                {
                  id: "TIME",
                  title: "시간",
                  description: "특정 날짜와 시간에 열람",
                  icon: <Clock size={20} />,
                },
                {
                  id: "LOCATION",
                  title: "장소",
                  description: "특정 장소에 도착 시 열람",
                  icon: <MapPin size={20} />,
                },
                {
                  id: "MANUAL",
                  title: "시간 + 장소",
                  description: "시간과 장소 모두 충족 시 열람",
                  icon: <Hand size={20} />,
                },
              ]}
              value={unlockType}
              onChange={setUnlockType}
            />
            <div className="w-full p-4 border border-outline bg-[#F9F9FA] rounded-xl space-y-3">
              {unlockType === "TIME" && (
                <DayTime value={dayForm} onChange={setDayForm} />
              )}
              {unlockType === "LOCATION" && (
                <Location value={locationForm} onChange={setLocationForm} />
              )}
              {unlockType === "MANUAL" && (
                <DayLocation
                  dayValue={dayForm}
                  onDayChange={setDayForm}
                  locationValue={locationForm}
                  onLocationChange={setLocationForm}
                />
              )}
            </div>
          </div>
        </WriteDiv>

        <WriteDiv title="이미지 첨부 (선택사항)">
          <div></div>
        </WriteDiv>

        <Button type="submit" className="w-full py-4 space-x-2">
          <Send />
          <span>{isSubmitting ? "보내는 중..." : "편지 보내기"}</span>
        </Button>
      </form>

      <CopyTemplate
        open={isCopyOpen}
        onClose={() => setIsCopyOpen(false)}
        onConfirm={() => {
          setIsCopyOpen(false);
          router.push("/dashboard");
        }}
        data={result}
      />
    </>
  );
}
