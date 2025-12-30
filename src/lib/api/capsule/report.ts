import { apiFetch } from "../fetchClient";

export const reportApi = {
  report: (body: ReportRequest, signal?: AbortSignal) => {
    return apiFetch<ApiResponse<number>>("/api/v1/report", {
      method: "POST",
      json: body,
      signal,
    });
  },
};
