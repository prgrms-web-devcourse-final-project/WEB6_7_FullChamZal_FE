export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="w-full min-h-screen flex items-center justify-center">
        {children}
      </main>
    </>
  );
}
