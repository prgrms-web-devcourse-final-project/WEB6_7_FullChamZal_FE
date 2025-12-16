const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ApiEnvelope<T> = {
  code: string;
  message: string;
  data: T;
};

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, options?: { code?: string; status?: number }) {
    super(message);
    this.name = "ApiError";
    this.code = options?.code;
    this.status = options?.status;
  }
}

type ApiFetchOptions = RequestInit & {
  json?: unknown;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(options.json ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    body: options.json ? JSON.stringify(options.json) : options.body,
    credentials: "include",
    signal: options.signal,
    cache: "no-store",
  });

  let envelope: ApiEnvelope<T> | null = null;

  try {
    envelope = (await res.json()) as ApiEnvelope<T>;
  } catch {
    // body 없는 경우 대비
  }

  if (!res.ok) {
    throw new ApiError(envelope?.message ?? "요청 실패", {
      code: envelope?.code,
      status: res.status,
    });
  }

  if (!envelope) {
    throw new ApiError("응답 파싱 실패", { status: res.status });
  }

  return envelope.data;
}

// DTO(= raw JSON) 그대로 반환하는 전용 함수
export async function apiFetchRaw<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(options.json ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    body: options.json ? JSON.stringify(options.json) : options.body,
    credentials: "include",
    signal: options.signal,
    cache: "no-store",
  });

  const body = (await res.json().catch(() => null)) as unknown;

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message?: unknown }).message ?? "요청 실패")
        : "요청 실패";
    const code =
      body && typeof body === "object" && "code" in body
        ? String((body as { code?: unknown }).code ?? "")
        : undefined;

    throw new ApiError(message, { code, status: res.status });
  }

  if (body == null) {
    throw new ApiError("응답 파싱 실패", { status: res.status });
  }

  return body as T;
}
