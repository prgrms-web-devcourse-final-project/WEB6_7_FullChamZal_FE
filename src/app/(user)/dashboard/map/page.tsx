import MapContents from "@/components/dashboard/map/MapContents";
import { Suspense } from "react";

export default function MapPage() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <div className="w-full h-full p-4 lg:p-8">
          <MapContents />
        </div>
      </Suspense>
    </>
  );
}
