type CapsuleDashboardItem = {
  capsuleId: number;
  capsuleColor: string;
  capsulePackingColor: string;
  recipient: string;
  sender: string;
  title: string;
  content: string;
  createAt: string;
  viewStatus: boolean;
  unlockType: string;
  unlockAt: string | null;
  locationName: string | null;
  locationLat: number | null;
  locationLng: number | null;
};
