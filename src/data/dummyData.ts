export const dummyCapsules: Capsule[] = [
  {
    id: "capsule-001",
    mailbox: "send",
    from: "성춘향",
    to: "홍길동",
    title: "봄날에 남기는 짧은 인사",
    content: `안녕, 길동아.

봄이 와서 문득 너 생각이 났어.
바쁘게 살다 보면 마음을 전할 타이밍을 놓치잖아.
이 편지가 열릴 때쯤엔, 너도 조금은 여유를 찾았으면 좋겠다.

늘 응원해.`,
    createdAt: "2025-11-18T21:10:00+09:00",
    unlockCondition: { type: "time", at: "2029-04-12T00:00:00+09:00" },
    isUnlocked: false,
    isRead: false,
    isBookmarked: false,
    sharePath: "/capsules/capsule-001",
  },
  {
    id: "capsule-002",
    mailbox: "send",
    from: "김지은",
    to: "홍길동",
    title: "성산일출봉에서 떠올린 너",
    content: `성산일출봉 올라가는 길이 생각보다 숨차더라.
정상에 서니까 바람이 엄청 불고, 하늘이 정말 맑았어.

그 풍경을 보는데 갑자기 너한테 꼭 보여주고 싶더라.
다음엔 같이 오자.`,
    createdAt: "2025-10-02T09:35:00+09:00",
    unlockCondition: {
      type: "location",
      address: "제주 서귀포시 성산읍 성산리 1 (성산일출봉)",
      lat: 33.4588,
      lng: 126.9425,
    },
    isUnlocked: false,
    isRead: false,
    isBookmarked: false,
    sharePath: "/capsules/capsule-002",
  },
  {
    id: "capsule-003",
    mailbox: "receive",
    from: "이몽룡",
    to: "홍길동",
    title: "우리가 처음 만났던 그날",
    content: `처음 만났던 날, 너는 생각보다 조용했는데
말 한마디 한마디가 되게 단단해서 기억에 남아.

그때의 느낌이 아직도 선명해.
가끔은 그 날로 돌아가고 싶더라.`,
    createdAt: "2024-09-20T18:00:00+09:00",
    unlockCondition: { type: "time", at: "2024-10-01T09:00:00+09:00" },
    isUnlocked: true,
    isRead: false,
    isBookmarked: true,
    sharePath: "/capsules/capsule-003",
  },
  {
    id: "capsule-004",
    mailbox: "receive",
    from: "박서연",
    to: "홍길동",
    title: "말하지 못했던 이야기",
    content: `솔직히 말하면, 그때는 나도 여유가 없었어.
그래서 네 마음을 다 헤아리지 못했던 것 같아.

늦었지만 고마웠다고 말하고 싶었어.
그리고 미안했다고.`,
    createdAt: "2023-12-24T23:59:00+09:00",
    unlockCondition: { type: "time", at: "2023-12-25T00:00:00+09:00" },
    isUnlocked: true,
    isRead: true,
    isBookmarked: false,
    sharePath: "/capsules/capsule-004",
  },
  {
    id: "capsule-005",
    mailbox: "bookmark",
    from: "최민수",
    to: "홍길동",
    title: "그 여름의 기록",
    content: `여름은 늘 금방 지나가는데,
그때의 공기랑 냄새는 오래 남는 것 같아.

망원한강공원에서 말없이 걷던 순간이
이상하게 자꾸 생각나더라.`,
    createdAt: "2024-07-15T20:12:00+09:00",
    unlockCondition: {
      type: "location",
      address: "서울 마포구 망원한강공원",
      lat: 37.5563,
      lng: 126.8996,
    },
    isUnlocked: true,
    isRead: true,
    isBookmarked: true,
    sharePath: "/capsules/capsule-005",
  },
  {
    id: "capsule-006",
    mailbox: "send",
    from: "미래의 나",
    to: "홍길동",
    title: "1년 뒤의 나에게",
    content: `지금의 너는 어떤 표정을 짓고 있을까?

아마도 여전히 꼼꼼하게, 그리고 묵묵하게
네가 해야 할 일을 해내고 있겠지.

너 자신을 너무 몰아붙이지는 말자.
잘하고 있어.`,
    createdAt: "2025-12-01T01:00:00+09:00",
    unlockCondition: { type: "time", at: "2026-01-01T00:00:00+09:00" },
    isUnlocked: false,
    isRead: false,
    isBookmarked: false,
    sharePath: "/capsules/capsule-006",
  },
];
