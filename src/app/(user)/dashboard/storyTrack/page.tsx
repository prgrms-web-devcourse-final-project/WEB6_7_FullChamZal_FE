import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <div className="p-8">
          {/* 헤더 */}
          <div className="space-y-2">
            <h3 className="text-3xl font-medium">
              스토리트랙
              <span className="text-primary px-1">_</span>
            </h3>
            <p className="text-text-2">
              장소를 따라가며 펼쳐지는 이야기의 여정
            </p>
          </div>
        </div>
      </Suspense>
    </>
  );
}
