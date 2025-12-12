import MailboxPage from "@/components/dashboard/contents/mailbox/MailboxPage";
import { Inbox } from "lucide-react";

export default function Page() {
  return (
    <>
      <MailboxPage icon={<Inbox />} title="받은 편지" />
    </>
  );
}
