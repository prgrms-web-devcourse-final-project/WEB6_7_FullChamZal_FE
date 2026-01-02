import FifthSection from "./section/five/FifthSection";
import FourthSection from "./section/four/FourthSection";
import MainSection from "./section/main/MainSection";
import SecondSection from "./section/SecondSection";
import SixthSection from "./section/SixthSection";
import ThirdSection from "./section/third/ThirdSection";

export default function MainLandingPage() {
  return (
    <>
      <MainSection />
      <main className="mx-auto max-w-330 px-8 md:px-15">
        <SecondSection />
        <ThirdSection />
        <FourthSection />
        <FifthSection />
        <SixthSection />
      </main>
    </>
  );
}
