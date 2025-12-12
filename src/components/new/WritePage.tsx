import Left from "./left/Left";
import Right from "./Right";
import WriteHeader from "./WriteHeader";

export default function WritePage() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <WriteHeader />

        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden bg-sub">
          <div className="w-full lg:w-1/2 overflow-y-auto">
            <Left />
          </div>
          <div className="w-1/2 hidden lg:block">
            <Right />
          </div>
        </div>
      </div>
    </>
  );
}
