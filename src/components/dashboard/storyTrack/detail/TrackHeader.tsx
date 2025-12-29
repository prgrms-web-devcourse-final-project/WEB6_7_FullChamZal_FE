import Image from "next/image";

export default function TrackHeader() {
  return (
    <div className="relative w-full h-64 pb-8 px-8 rounded-2xl overflow-hidden">
      <Image
        src="https://cdn.pixabay.com/photo/2024/01/15/21/13/puppy-8510899_1280.jpg"
        alt="대표 이미지"
        fill
        className="object-cover"
      />
    </div>
  );
}
