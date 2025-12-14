type Mode = "admin" | "user";

type MenuItem = {
  href: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  /** startsWith로 active 체크할 기준 */
  activePrefix: string;
};
