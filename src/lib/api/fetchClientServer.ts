// src/lib/api/fetchClientServer.ts
import "server-only";
import { cookies } from "next/headers";
import { ApiError, type ApiEnvelope } from "./fetchClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type ApiFetchOptions = RequestInit & { json?: unknown };

export async function apiFetchServer<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const cookieStore = await cookies(); // Next 버전 차이 안전
  const cookieHeader = cookieStore.toString();

  const url = new URL(path, API_BASE).toString(); // URL 조합 안전

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      ...(options.json ? { "Content-Type": "application/json" } : {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      ...options.headers,
    },
    body: options.json ? JSON.stringify(options.json) : options.body,
    cache: "no-store",
  });

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await res.json()) as ApiEnvelope<T>;
  } catch {}

  if (!res.ok) {
    throw new ApiError(envelope?.message ?? "요청 실패", {
      code: envelope?.code,
      status: res.status,
    });
  }
  if (!envelope) throw new ApiError("응답 파싱 실패", { status: res.status });

  return envelope.data;
}
