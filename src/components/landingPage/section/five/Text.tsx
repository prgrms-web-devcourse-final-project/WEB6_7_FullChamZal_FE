export default function Text({ data }: { data: FiveDataType }) {
  return (
    <>
      <div className="max-w-[480px] space-y-2 z-0">
        <p className="flex items-center gap-2 font-semibold">
          <span className="text-[#172C51] text-4xl">Dear.</span>
          <span className="text-primary text-3xl underline">{data.title}</span>
        </p>
        <div className="space-y-4">
          <p className="font-medium text-2xl">{data.step}</p>
          <p className="text-lg whitespace-pre-line">{data.contents}</p>
        </div>
      </div>
    </>
  );
}
