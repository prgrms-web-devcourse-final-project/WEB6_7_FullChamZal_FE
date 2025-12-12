import Card from "./Card";

export default function MapList() {
  return (
    <>
      {/* 리스트 스크롤 */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6">
        {/* 리스트 1 */}
        <Card />
      </div>
    </>
  );
}
