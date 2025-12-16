import LetterDetailModal from "@/components/capsule/detail/LetterDetailModal";
import MailboxPage from "@/components/dashboard/contents/mailbox/MailboxPage";
import { Suspense } from "react";

export default async function BookmarkPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const capsuleId = params.id;

  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <MailboxPage type="bookmark" />
        {capsuleId ? (
          <LetterDetailModal
            capsuleId={capsuleId}
            closeHref="/dashboard/bookmark"
          />
        ) : null}
      </Suspense>
    </>
  );
}
