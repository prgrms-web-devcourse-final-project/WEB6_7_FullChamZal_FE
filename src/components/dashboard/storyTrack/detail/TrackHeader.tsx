/* eslint-disable @next/next/no-img-element */

const DEFAULT_THUMBNAIL = "/img/basicImg.png";

type Props = {
  imageUrl?: string | null;
};

export default function TrackHeader({ imageUrl }: Props) {
  const thumbnailUrl = imageUrl || DEFAULT_THUMBNAIL;

  return (
    <div className="relative w-full h-44 sm:h-56 lg:h-64 rounded-2xl overflow-hidden">
      <img
        src={thumbnailUrl}
        alt="대표 이미지"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
