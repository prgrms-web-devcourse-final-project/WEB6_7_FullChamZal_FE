// lib/formatDateTime.ts
export function formatDateTime(isoString: string) {
  const date = new Date(isoString);

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
