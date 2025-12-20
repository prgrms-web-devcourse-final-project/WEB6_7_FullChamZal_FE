/**
 * 캡슐 색상 팔레트 정의
 * - 봉투/편지지 색상을 이름(name)과 HEX(color)로 관리합니다.
 * - 사용 예시:
 *   import { CAPTURE_ENVELOPE_PALETTE, CAPTURE_COLOR_MAP } from "@/constants/capsulePalette";
 *   const hex = CAPTURE_COLOR_MAP["BEIGE"]; // "#F5F1E8"
 *   const options = CAPTURE_ENVELOPE_PALETTE; // select 박스, 미리보기 등에 사용
 */
export type CapsuleColor = {
  name: string;
  color: string;
};

export const CAPTURE_ENVELOPE_PALETTE: CapsuleColor[] = [
  { name: "BEIGE", color: "#F5F1E8" },
  { name: "YELLOW", color: "#FEF7E7" },
  { name: "PINK", color: "#FCE8EC" },
  { name: "BLUE", color: "#E8F4FC" },
  { name: "LAVENDER", color: "#F0E8FC" },
  { name: "MINT", color: "#E8FCF4" },
  { name: "PEACH", color: "#FFE8D6" },
];

export const CAPTURE_COLOR_MAP = Object.fromEntries(
  CAPTURE_ENVELOPE_PALETTE.map((item) => [item.name, item.color])
) as Record<string, string>;
