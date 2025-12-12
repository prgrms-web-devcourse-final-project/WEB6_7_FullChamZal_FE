import MailboxPage from "@/components/dashboard/contents/mailbox/MailboxPage";
import { Send } from "lucide-react";

export default function Page() {
  return (
    <>
      <MailboxPage icon={<Send />} title="보낸 편지" />
    </>
  );
}
