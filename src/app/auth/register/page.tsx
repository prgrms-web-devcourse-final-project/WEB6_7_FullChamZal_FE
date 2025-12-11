import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="회원가입"
      description="Dear. ___ 과 함께 특별한 여정을 시작하세요."
    >
      <RegisterForm />
    </AuthShell>
  );
}
