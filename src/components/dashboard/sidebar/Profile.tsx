import DivBox from "../DivBox";

export default function Profile({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <button type="button" onClick={onClick} className="w-full text-left">
        <DivBox className="border-2">
          <div className="flex items-center gap-3">
            <div className="bg-text w-14 h-14 rounded-full">
              {/* 이미지 없으면 이름 첫글자*/}
              <div className="text-white text-xl h-full flex items-center justify-center">
                {/* {"" ? "" : "홍"} */}홍
              </div>
            </div>
            <div>
              <p>홍길동</p>
              <p className="text-text-3 text-sm line-clamp-2">hong@mail.com</p>
            </div>
          </div>
        </DivBox>
      </button>
    </>
  );
}
