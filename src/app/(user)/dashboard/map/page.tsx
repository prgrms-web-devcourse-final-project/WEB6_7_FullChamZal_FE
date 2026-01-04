import MapContents from "@/components/dashboard/map/MapContents";
import MapPageSkeleton from "@/components/skeleton/dashboard/map/MapPageSkeleton";
import { Suspense } from "react";

export default function MapPage() {
  return (
    <>
      <Suspense fallback={<MapPageSkeleton />}>
        <div className="w-full h-full p-4 lg:p-8">
          <MapContents />
        </div>
      </Suspense>
    </>
  );
}
