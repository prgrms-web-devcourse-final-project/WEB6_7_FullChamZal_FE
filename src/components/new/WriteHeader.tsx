import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WriteHeader() {
  return (
    <>
      <header>
        <div className="flex items-center gap-4">
          <Link href={"/dashboard"}>
            <ArrowLeft className="text-primary" />
          </Link>
          <div className="space-y-1">
            <p className="text-2xl font-medium">
              편지 쓰기<span className="text-primary px-1">_</span>
            </p>
            <p className="text-text-3 text-sm">소중한 마음을 담아보세요</p>
          </div>
        </div>
      </header>
    </>
  );
}
