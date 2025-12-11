import { Home, Map } from "lucide-react";
import DivBox from "../DivBox";

export default function MenuTab() {
  return (
    <>
      <div className="space-y-3">
        <DivBox className="px-5 py-3 rounded-[10px] shadow-md text-white bg-primary-2 border-primary-2">
          <div className="flex items-center gap-3">
            <Home />
            <div>
              <p className="text-sm">홈</p>
              <p className="text-xs">대시보드</p>
            </div>
          </div>
        </DivBox>
        <DivBox className="px-5 py-3 rounded-[10px]">
          <div className="flex items-center gap-3">
            <Map />
            <div>
              <p className="text-sm">지도</p>
              <p className="text-xs">공개 편지 찾기</p>
            </div>
          </div>
        </DivBox>
      </div>
    </>
  );
}
