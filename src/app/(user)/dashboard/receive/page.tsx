import LetterDetailModal from "@/components/capsule/detail/LetterDetailModal";
import MailboxPage from "@/components/dashboard/contents/mailbox/MailboxPage";
import { Suspense } from "react";

export default async function ReceivePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const capsuleId = Number(params.id);

  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <MailboxPage type="receive" />
        {capsuleId ? (
          <LetterDetailModal
            capsuleId={capsuleId}
            open={true}
            role="USER"
            closeHref="/dashboard/receive"
          />
        ) : null}
      </Suspense>
    </>
  );
}
