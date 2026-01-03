"use client";

export default function FindPwIntroSection({
  inputUserId,
  setInputUserId,
}: {
  inputUserId: string;
  setInputUserId: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-text-2">아이디</label>
      <input
        value={inputUserId}
        onChange={(e) => setInputUserId(e.target.value)}
        placeholder="아이디를 입력하세요"
        className="w-full p-4 bg-white border border-outline rounded-xl outline-none focus:border-primary-2"
      />
      <p className="text-xs text-text-3">
        입력한 아이디와, 인증된 전화번호로 조회된 아이디가 일치할 때만 비밀번호
        변경이 가능합니다.
      </p>
    </div>
  );
}
