import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell title="로그인" description="Dear. ___ 에 다시 오신 걸 환영해요.">
      <LoginForm />
    </AuthShell>
  );
}
