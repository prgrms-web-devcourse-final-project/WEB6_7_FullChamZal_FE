export async function login(payload: { userId: string; password: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    let message = "로그인에 실패했습니다.";
    try {
      const data = await res.json();
      message = data?.message ?? message;
      return data;
    } catch {}
    throw new Error(message);
  }
}

/* 회원 정보 */
export async function me() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/members/me`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("로그인 정보를 확인할 수 없습니다.");
  }

  return res.json();
}
