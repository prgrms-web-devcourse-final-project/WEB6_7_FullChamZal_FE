const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type ApiEnvelope<T> = { code: string; message: string; data: T };

export class ApiError extends Error {
  code?: string;
  status?: number;
  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}


export async function apiFetch<T>(
  path: string,
  options: RequestInit & { json?: unknown } = {}
): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.json ? JSON.stringify(options.json) : options.body,
    credentials: "include",
    cache: "no-store",
  });


  const data = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok) {
    const msg = data?.message ?? "요청 실패";
    const code = data?.code;
    throw new ApiError(msg, code, res.status);
  }

  if (!data) throw new ApiError("응답 파싱 실패", undefined, res.status);
  return data;
}