"use client";

import { ImageIcon, PaintBucket, Send } from "lucide-react";
import Button from "../../common/Button";
import WriteDiv from "./WriteDiv";
import ActionTab from "./ActionTab";
import { useRef, useState } from "react";
import VisibilityOpt from "./VisibilityOpt";
import WriteInput from "./WriteInput";

export default function Left() {
  const [visibility, setVisibility] = useState<Visibility>("PRIVATE");
  const [paperTab, setPaperTab] = useState("ENVELOPE");
  const [sendMethod, setSendMethod] = useState("URL");

  /* 편지 내용 글자 수 제한 길이 */
  const MAX_CONTENT_LENGTH = 3000;

  const [content, setContent] = useState("");

  /* 한글 입력(조합) 중인지 체크 (조합 중엔 강제 slice 하면 입력이 깨질 수 있음) */
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

  /*  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      visibility, // 여기로 전달됨
    };

    console.log(payload);
  }; */

  return (
    <>
      <section className="p-8">
        <form className="space-y-6">
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
              <div></div>
            </div>
          </WriteDiv>

          <WriteDiv title="보내는 사람">
            <div>
              <WriteInput id="sendName" type="text" placeholder="홍길동" />
            </div>
          </WriteDiv>

          <WriteDiv title="받는 사람">
            <div>
              <WriteInput
                id="receiveName"
                type="text"
                placeholder="미래의 나"
              />
            </div>
          </WriteDiv>

          <WriteDiv title="전달 방법">
            <div className="space-y-3">
              <ActionTab
                value={sendMethod}
                onChange={setSendMethod}
                tabs={[
                  { id: "URL", tabName: "URL + 비밀번호" },
                  { id: "PHONE", tabName: "전화번호" },
                ]}
              />
              {sendMethod === "PHONE" ? (
                <WriteDiv
                  title="받는 사람 전화번호"
                  warning="* 입력하신 전화번호는 서버에 저장되지 않습니다."
                >
                  <WriteInput
                    id="pagePw"
                    type="password"
                    placeholder="000-0000-0000"
                  />
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
            <div>
              <div></div>
              <div></div>
            </div>
          </WriteDiv>

          <WriteDiv title="이미지 첨부 (선택사항)">
            <div></div>
          </WriteDiv>

          <Button className="w-full py-4 space-x-2">
            <Send />
            <span>편지 보내기</span>
          </Button>
        </form>
      </section>
    </>
  );
}
