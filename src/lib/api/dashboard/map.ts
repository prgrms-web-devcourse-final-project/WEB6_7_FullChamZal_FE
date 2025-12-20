import { apiFetch } from "../fetchClient";

export type PublicCapsulesResponse = PublicCapsule[];
type Params = {
  lat: number;
  lng: number;
  radius: number;
};

export async function fetchPublicCapsules(params: Params) {
  const qs = new URLSearchParams({
    currentLatitude: String(params.lat),
    currentLongitude: String(params.lng),
    radius: String(params.radius),
  });

  return apiFetch<PublicCapsulesResponse>(
    `/api/v1/capsule/nearby?${qs.toString()}`,
    {
      method: "GET",
    }
  );
}
