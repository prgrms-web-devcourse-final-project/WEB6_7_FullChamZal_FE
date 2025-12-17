type CapsuleDashboardItem = {
  capsuleId: number;
  capsuleColor: string;
  capsulePackingColor: string;
  recipient: string;
  sender: string;
  title: string;
  content: string;
  createAt: string; // 서버가 createAt 로 내려줌
  viewStatus: boolean;
  unlockType: string;
  unlockAt: string | null;
  locationName: string | null;
  locationLat: number | null;
  locationLng: number | null;
};

type CapsuleReadRequest = {
  capsuleId: number;
  viewerType: "SEND" | "RECEIVE" | "BOOKMARK" | string; // 서버 확정되면 좁히기
  isSendSelf: 0 | 1;

  unlockAt?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;

  url?: number | string | null;
  password?: number | string | null;
};

type CapsuleReadResponse = {
  capsuleId: number;
  capsuleColor: string;
  capsulePackingColor: string;
  recipient: string;
  senderNickname: string;
  title: string;
  content: string;
  createAt: string;
  viewStatus: boolean;
  unlockType: string;
  unlockAt: string | null;
  unlockUntil: string | null;
  locationName: string | null;
  locationLat: number | null;
  locationLng: number | null;
};
