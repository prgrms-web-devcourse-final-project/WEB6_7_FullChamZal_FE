import LetterDetailModal from "@/components/capsule/detail/LetterDetailModal";
import MailboxPage from "@/components/dashboard/contents/mailbox/MailboxPage";
import MailboxSkeleton from "@/components/ui/skeleton/MailboxSkeleton";
import { Suspense } from "react";

export default async function SendPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const capsuleId = Number(params.id);

  return (
    <>
      <Suspense fallback={<MailboxSkeleton />}>
        <MailboxPage type="send" />
        {capsuleId ? (
          <LetterDetailModal
            capsuleId={capsuleId}
            closeHref="/dashboard/send"
            role="USER"
          />
        ) : null}
      </Suspense>
    </>
  );
}
