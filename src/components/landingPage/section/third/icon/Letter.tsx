export default function Letter() {
  return (
    <>
      <div className="relative w-[340px] h-[340px]">
        <div className="absolute -left-1/4 top-0 w-[340px] h-[340px] rounded-full bg-linear-to-b from-white/40 to-white/0"></div>
        <div className="absolute left-0 top-0 w-[340px] h-[340px] rounded-full bg-linear-to-b from-white/40 to-white/0"></div>
        <div className="absolute left-1/4 top-0 w-[340px] h-[340px] rounded-full bg-linear-to-b from-white/40 to-white/0"></div>
      </div>
    </>
  );
}
