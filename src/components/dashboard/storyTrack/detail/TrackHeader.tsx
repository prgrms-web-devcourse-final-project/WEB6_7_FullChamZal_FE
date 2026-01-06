const DEFAULT_THUMBNAIL =
  "https://cdn.pixabay.com/photo/2024/01/15/21/13/puppy-8510899_1280.jpg";

type Props = {
  imageUrl?: string | null;
};

export default function TrackHeader({ imageUrl }: Props) {
  const thumbnailUrl = imageUrl || DEFAULT_THUMBNAIL;

  return (
    <div className="relative w-full h-44 sm:h-56 lg:h-64 rounded-2xl overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailUrl}
        alt="대표 이미지"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
