import Image from "next/image";

export default function ImgCard({
  data,
  active,
  setActive,
}: {
  data: FiveDataType[];
  active: number;
  setActive: (active: number) => void;
}) {
  const layouts = [
    {
      wrapper: "absolute top-0 right-0 w-[480px] h-60 rounded-2xl bg-gray-900",
      z: "z-40",
    },
    {
      wrapper:
        "absolute top-25 right-[180px] w-[480px] h-60 rounded-2xl bg-gray-700",
      z: "z-30",
    },
    {
      wrapper:
        "absolute top-50 right-[360px] w-[480px] h-60 rounded-2xl bg-gray-500",
      z: "z-20",
    },
    {
      wrapper:
        "absolute top-75 left-[180px] w-[480px] h-60 rounded-2xl bg-gray-400",
      z: "z-10",
    },
    {
      wrapper: "absolute top-100 left-0 w-[480px] h-60 rounded-2xl bg-gray-300",
      z: "z-0",
    },
  ];

  return (
    <div className="absolute top-10 left-0 w-full h-full">
      {data.map((item, index) => {
        const layout = layouts[index];

        if (!layout) return null;

        const isActive = active === index;

        return (
          <div
            key={item.title}
            className={`${layout.wrapper} ${layout.z} ${
              isActive ? "shadow-2xl scale-[1.05]" : ""
            } hover:shadow-2xl hover:z-50 hover:scale-[1.05] transition-all duration-300 overflow-hidden cursor-pointer`}
            onMouseEnter={() => setActive(index)}
          >
            {item.img ? (
              <Image
                src={item.img}
                alt={item.title}
                width={800}
                height={800}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              // 이미지 없을 때
              <div className="w-full h-full rounded-2xl bg-linear-to-br from-slate-800 via-slate-700 to-slate-500 flex items-center justify-center">
                <span className="text-sm text-white/80 px-4 text-center">
                  {item.step}
                  <br />
                  {item.title}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
