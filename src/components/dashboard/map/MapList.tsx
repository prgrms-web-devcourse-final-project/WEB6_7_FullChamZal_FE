import Card from "./Card";

type MapListProps = {
  listData?: PublicCapsule[];
};

export default function MapList({ listData }: MapListProps) {
  if (listData?.length === 0) return <p>주변에 편지가 없습니다.</p>;
  return (
    <>
      {/* 리스트 스크롤 */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6">
        {/* 리스트 1 */}
        {listData?.map((d) => (
          <Card key={d.capsuleId} data={d} />
        ))}
      </div>
    </>
  );
}
