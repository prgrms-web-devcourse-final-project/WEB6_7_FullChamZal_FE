function normalizeToUtcIso(s: string) {
  // 이미 Z 또는 +hh:mm / -hh:mm 오프셋이 있으면 그대로
  if (/[zZ]$|[+\-]\d{2}:\d{2}$/.test(s)) return s;

  // "2026-01-03 10:00:00" 같은 형태도 "T"로 보정
  const fixed = s.replace(" ", "T");

  // 타임존 정보 없으면 "UTC로 들어온 값"이라고 가정하고 Z를 붙임
  return fixed + "Z";
}

export function formatDateTime(isoString: string) {
  const utc = normalizeToUtcIso(isoString);

  return new Date(utc).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}
