import Link from "next/link";

export default function AuthFooter({ title }: { title: string }) {
  return (
    <>
      <footer className="text-center py-4 md:py-6 border border-outline rounded-b-3xl bg-sub shadow-xl">
        <div className="space-x-2 text-sm md:text-base">
          <span>
            {title === "로그인"
              ? "계정이 없으신가요?"
              : "이미 계정이 있으신가요?"}
          </span>
          <Link
            href={`/auth/${title === "로그인" ? "register" : "login"}`}
            className=" text-text-4 underline"
          >
            {title === "로그인" ? "회원가입" : "로그인"}
          </Link>
        </div>
      </footer>
    </>
  );
}
