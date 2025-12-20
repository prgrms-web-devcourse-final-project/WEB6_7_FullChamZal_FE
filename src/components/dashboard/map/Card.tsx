import { MapPin } from "lucide-react";
type CardProps = {
  data: PublicCapsule;
  keyword: string;
};

export default function Card({ data, keyword }: CardProps) {
  function highlightText(text: string, keyword: string) {
    //키워드 없으면 반환
    if (!keyword) return text;
    const index = text.toLowerCase().indexOf(keyword.toLowerCase());
    //키워드 일치하는 부분 없으면 반환
    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + keyword.length);
    const after = text.slice(index + keyword.length);

    return (
      <>
        {before}
        <span className="text-primary-2 font-semibold">{match}</span>
        {after}
      </>
    );
  }
  return (
    <>
      <div className="border border-outline rounded-xl p-4 space-y-4 hover:bg-button-hover">
        <div className="space-y-1">
          <p>{highlightText(data.title, keyword)}</p>
          <div className="text-xs flex items-center gap-1 text-text-3">
            <div className="flex items-center gap-1">
              <MapPin size={12} />{" "}
              <span>{highlightText(data.capsuleLocationName, keyword)}</span>
            </div>
            <span>•</span>
            <span className="text-primary-2">
              {Math.floor(data.distanceToCapsule)}m
            </span>
          </div>
        </div>
        {/* <div className="text-sm">
          <p>벚꽃이 피는 이 거리에서 당신을 떠올립니다...</p>
        </div> */}
        <div className="flex justify-between text-xs text-text-2">
          <span>from. {data.writerNickname}</span>{" "}
          <span>{data.capsuleCreatedAt.slice(0, 10)}</span>
        </div>
      </div>
    </>
  );
}
