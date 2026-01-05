import Link from "next/link";
import Logo from "./Logo";

const links = [
  {
    title: "Main",
    href: "#main",
  },
  {
    title: "Why",
    href: "#why",
  },
  {
    title: "What",
    href: "#what",
  },
  {
    title: "How",
    href: "#how",
  },
  {
    title: "Who",
    href: "#who",
  },
  {
    title: "Start",
    href: "#start",
  },
];

export default function Footer() {
  return (
    <footer className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/" aria-label="go home" className="mx-auto block size-fit">
          <div className="w-12 h-12 text-[#ff2600]">
            <Logo className={"w-full h-full"} />
          </div>
        </Link>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-[#ff2600] block duration-150"
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
        <span className="text-muted-foreground block text-center text-sm">
          {" "}
          © {new Date().getFullYear()} Dear.___, All rights reserved
        </span>
      </div>
    </footer>
  );
}
