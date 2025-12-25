export default function PublicLetterPicker({
  onSelect,
}: {
  onSelect: (letter: Letter) => void;
}) {
  // 여기서 공개 편지 목록 가져와야함
  const letters: Letter[] = [
    { id: "1", title: "한강 야경에서 쓴 편지", placeName: "여의도 한강공원" },
    { id: "2", title: "홍대 골목길", placeName: "홍대입구" },
  ];

  return (
    <ul className="divide-y divide-outline">
      {letters.map((l) => (
        <li key={l.id}>
          <button
            type="button"
            onClick={() => onSelect(l)}
            className="w-full text-left px-4 py-3 hover:bg-button-hover"
          >
            <div className="text-sm text-text">{l.title}</div>
            <div className="text-xs text-text-4">
              {l.placeName ?? "위치 미지정"}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
