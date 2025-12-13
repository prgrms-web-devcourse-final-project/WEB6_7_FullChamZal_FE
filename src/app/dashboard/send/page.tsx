import LetterDetailModal from "@/components/capsule/detail/LetterDetailModal";
import MailboxPage from "@/components/dashboard/contents/mailbox/MailboxPage";
import { Send } from "lucide-react";

export default async function SendPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const capsuleId = params.id;

  return (
    <>
      <MailboxPage icon={<Send />} title="보낸 편지" />
      {capsuleId}
      {capsuleId ? (
        <LetterDetailModal capsuleId={capsuleId} closeHref="/dashboard/send" />
      ) : null}
    </>
  );
}
