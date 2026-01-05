export default function Step({ icon, step, title, contents }: StepData) {
  return (
    <>
      <div className="space-y-4">
        <div className="hidden md:inline-block p-0.5 rounded-xl bg-linear-to-br from-button-hover to-[#DDDDDD]">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div>
          <div className="space-y-2 font-medium md:font-semibold">
            <p className="text-xl md:text-3xl text-[#ff2600]">Step {step}</p>
            <p className="text-lg md:text-xl break-keep">{title}</p>
          </div>
        </div>
        <p className="text-sm md:text-base whitespace-pre-line break-keep">
          {contents}
        </p>
      </div>
    </>
  );
}
