import LetterDetailModal from "@/components/capsule/detail/LetterDetailModal";
import MailboxPage from "@/components/dashboard/contents/mailbox/MailboxPage";

export default async function ReceivePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const capsuleId = params.id;

  return (
    <>
      <MailboxPage type="receive" />
      {capsuleId ? (
        <LetterDetailModal
          capsuleId={capsuleId}
          closeHref="/dashboard/receive"
        />
      ) : null}
    </>
  );
}
