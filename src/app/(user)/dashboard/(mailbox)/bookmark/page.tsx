import LetterDetailModal from "@/components/capsule/detail/LetterDetailModal";
import MailboxPage from "@/components/dashboard/contents/mailbox/MailboxPage";
import MailboxSkeleton from "@/components/ui/skeleton/MailboxSkeleton";
import { Suspense } from "react";

export default async function BookmarkPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const capsuleId = Number(params.id);

  return (
    <>
      <Suspense fallback={<MailboxSkeleton />}>
        <MailboxPage type="bookmark" />
        {capsuleId ? (
          <LetterDetailModal
            capsuleId={capsuleId}
            closeHref="/dashboard/bookmark"
            role="USER"
          />
        ) : null}
      </Suspense>
    </>
  );
}
