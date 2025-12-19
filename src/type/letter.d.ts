// types/capsule.ts
type UnlockCondition =
  | { type: "time"; at: string } // ISO datetime
  | { type: "location"; address: string; lat: number; lng: number };

type MailboxType = "send" | "receive" | "bookmark";

interface Capsule {
  id: string;
  mailbox: MailboxType; // send/receive/bookmark에서 필터용
  from: string;
  to: string;
  title: string;
  content: string; // ✅ 본문
  createdAt: string; // ✅ 작성일(ISO)
  unlockCondition: UnlockCondition;
  isUnlocked: boolean;
  isRead: boolean;
  isBookmarked: boolean; // ✅ 저장하기 상태
  sharePath: string; // ✅ 공개 링크 (/capsules/[id] 같은)
}

interface PublicCapsule {
  capsuleId: string;
  capsuleLocationName: string;
  writerNickname: string;
  title: string;
  content: string;
  capsuleCreatedAt: string;
  capsuleUnlockType: string;
  capsuleLatitude: number;
  capsuleLongitude: number;
  distanceToCapsule: number;
  isViewed: boolean;
}
