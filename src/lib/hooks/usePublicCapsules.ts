import { useQuery } from "@tanstack/react-query";
import { fetchPublicCapsules } from "@/lib/api/dashboard/map";

type Params = {
  myLocation: {
    lat: number;
    lng: number;
  } | null;
  radius: number;
};
export function usePublicCapsules({ myLocation, radius }: Params) {
  return useQuery({
    queryKey: ["publicCapsules", myLocation?.lat, myLocation?.lng, radius],
    queryFn: () => {
      if (!myLocation) {
        throw new Error("현재 위치 정보 없음");
      }

      return fetchPublicCapsules({
        lat: myLocation.lat,
        lng: myLocation.lng,
        radius,
      });
    },
    enabled: !!myLocation,
    staleTime: 1000 * 30,
  });
}
