import Left from "./Left";
import Right from "./Right";
import WriteHeader from "./WriteHeader";

export default function WritePage() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <WriteHeader />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 overflow-y-auto">
            <Left />
          </div>
          <div className="w-1/2">
            <Right />
          </div>
        </div>
      </div>
    </>
  );
}
