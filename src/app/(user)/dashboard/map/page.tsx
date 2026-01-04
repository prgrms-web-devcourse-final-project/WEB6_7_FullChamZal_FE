import MapContents from "@/components/dashboard/map/MapContents";
import MapPageSkeleton from "@/components/skeleton/dashboard/map/MapPageSkeleton";
import { Suspense } from "react";

export default function MapPage() {
  return (
    <>
      <Suspense fallback={<MapPageSkeleton />}>
        <div className="w-full h-full">
          <MapContents />
        </div>
      </Suspense>
    </>
  );
}
