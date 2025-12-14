import CapsuleList from "./capsules/CapsuleList";
import PhoneList from "./phone/PhoneList";
import ReportList from "./reports/ReportList";
import UserList from "./users/UserList";

export default function ContentsList({
  section,
  tab,
  query,
}: {
  section: "users" | "capsules" | "reports" | "phone";
  tab: string;
  query: string;
}) {
  if (section === "users") {
    return <UserList tab={tab} query={query} />;
  }

  if (section === "capsules") {
    return <CapsuleList tab={tab} query={query} />;
  }

  if (section === "reports") {
    return <ReportList tab={tab} query={query} />;
  }

  if (section === "phone") {
    return <PhoneList tab={tab} query={query} />;
  }

  return <div>준비중</div>;
}
