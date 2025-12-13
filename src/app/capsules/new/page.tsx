import WritePage from "@/components/capsule/new/WritePage";

export default function Page() {
  // 유저를 확인해서 로그인하지 않은 상태라면 로그인창으로 이동하게
  // 주소창에 직접 입력, 공유 링크, 다른 페이지에서 링크 등 우회 접근 차단

  return (
    <>
      <WritePage />
    </>
  );
}
