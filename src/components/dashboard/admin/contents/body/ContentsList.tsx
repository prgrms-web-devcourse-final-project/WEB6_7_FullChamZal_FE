import CapsuleList from "./capsules/CapsuleList";
import ModerationList from "./moderation/ModerationList";
import PhoneList from "./phone/PhoneList";
import ReportList from "./reports/ReportList";
import UserList from "./users/UserList";

export default function ContentsList({
  section,
  tab,
  keyword,
}: {
  section: "users" | "capsules" | "reports" | "phone" | "moderation";
  tab: string;
  keyword: string;
}) {
  if (section === "users") {
    return <UserList tab={tab} query={keyword} />;
  }

  if (section === "capsules") {
    return <CapsuleList tab={tab} query={keyword} />;
  }

  if (section === "reports") {
    return <ReportList tab={tab} query={keyword} />;
  }

  if (section === "phone") {
    return <PhoneList tab={tab} query={keyword} />;
  }

  if (section === "moderation") {
    return <ModerationList tab={tab} query={keyword} />;
  }

  return <div>준비중</div>;
}
