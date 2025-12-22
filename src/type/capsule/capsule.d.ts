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
