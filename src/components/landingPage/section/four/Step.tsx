export default function Step({ icon, step, title, contents }: StepData) {
  return (
    <>
      <div className="space-y-4">
        <div className="inline-block p-0.5 rounded-xl bg-linear-to-br from-[#F9F9F9] to-[#DDDDDD]">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div>
          <div className="space-y-2 font-semibold">
            <p className="text-3xl text-[#FF2600]">Step {step}</p>
            <p className="text-xl">{title}</p>
          </div>
        </div>
        <p className="whitespace-pre-line break-keep">{contents}</p>
      </div>
    </>
  );
}
