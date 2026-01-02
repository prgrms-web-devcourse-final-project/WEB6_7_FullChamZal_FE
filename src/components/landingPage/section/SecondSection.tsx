import Image from "next/image";

export default function SecondSection() {
  return (
    <>
      <section id="why" className="py-20 md:py-60">
        <div className="relative w-full h-105 md:h-140">
          <div className="relative z-10 w-full max-w-170 font-paperlogy space-y-8 md:space-y-15">
            <div>
              <p className="md:text-2xl">
                정보는 속도가 중요하지만, <br />
                <span className="text-primary font-semibold">감정</span>은
                천천히 도착할수록 더 깊어집니다.
              </p>
            </div>
            <div>
              <p className="md:text-2xl">
                모든 메시지가 1초 안에 도착하는 시대
              </p>
              <p className="text-xl md:text-4xl font-semibold">
                <span className="font-bold text-primary">Dear.__</span> 는
                ‘기다림’이 있는 편지를 만듭니다.
              </p>
            </div>
          </div>
          <div className="relative sm:absolute bottom-0 right-0 md:-right-15 lg:-right-30 sm:w-[60vw] md:w-130 lg:w-158 h-full md:h-115 lg:h-140 z-0">
            <div className="relative w-full h-full">
              <Image
                src="/img/section2.jpg"
                alt="section2"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 70vw, (max-width: 768px) 60vw, 632px"
              />
              <div className="absolute inset-0 bg-white/30" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
