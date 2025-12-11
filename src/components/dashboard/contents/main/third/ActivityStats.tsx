import LetterReadingStatus from "./LetterReadingStatus";
import YearlyLetterOverview from "./YearlyLetterOverview";

export default function ActivityStats() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <YearlyLetterOverview />
        <LetterReadingStatus />
      </div>
    </>
  );
}
