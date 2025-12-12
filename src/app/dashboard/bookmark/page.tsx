import MailboxPage from "@/components/dashboard/contents/mailbox/MailboxPage";
import { Heart } from "lucide-react";

export default function Page() {
  return (
    <>
      <MailboxPage icon={<Heart />} title="소중한 편지" />
    </>
  );
}
