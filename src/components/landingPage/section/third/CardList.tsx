import Card from "./Card";
import Letter from "./icon/Letter";
import Map from "./icon/Map";
import Clock from "./icon/Clock";

export default function CardList() {
  return (
    <>
      <div className="flex gap-8 text-white">
        <Card
          title="시간 기반 편지"
          contents="정해진 날짜와 시간이 되어야 열리는 메시지. 생일, 기념일, 미래의 나에게 전하는 편지 등 특별한 순간을 남겨보세요."
          bg="#FF4221"
          icon={<Clock />}
        />
        <Card
          title="장소 기반 편지"
          contents="도착해야만 열리는 메시지. 첫 데이트 장소, 여행 코스, 나만의 비밀 장소에 감정을 기록하세요."
          bg="#FF9481"
          icon={<Map />}
        />
        <Card
          title="공개 편지"
          contents="특정 장소를 찾은 누구나 열어볼 수 있는 메시지. 여행지나 동네의 한 지점이 사람들의 이야기로 채워지는 작은 공간이 됩니다."
          bg="#172C51"
          icon={<Letter />}
        />
      </div>
    </>
  );
}
