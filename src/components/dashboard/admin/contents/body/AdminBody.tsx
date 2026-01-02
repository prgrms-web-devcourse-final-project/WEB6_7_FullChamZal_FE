"use client";

import { Search } from "lucide-react";
import AdminMenuTab from "./AdminMenuTab";
import ContentsList from "./ContentsList";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type TabItem = { key: string; label: string };

export default function AdminBody({
  section,
  tabs,
  defaultTab,
  searchPlaceholder = "검색...",
}: {
  section: "users" | "capsules" | "reports" | "phone" | "moderation";
  tabs: readonly TabItem[];
  defaultTab: string;
  searchPlaceholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabKeys = useMemo(() => new Set(tabs.map((t) => t.key)), [tabs]);

  const tab = useMemo(() => {
    const t = searchParams.get("tab") ?? defaultTab;
    return tabKeys.has(t) ? t : defaultTab;
  }, [searchParams, defaultTab, tabKeys]);

  // URL에 저장되는 검색어는 keyword
  const keyword = searchParams.get("keyword") ?? "";

  // input은 로컬 상태로만 관리 (작성 중에는 URL 안 바뀜)
  const [keywordInput, setKeywordInput] = useState(keyword);

  // 뒤로가기/탭 변경 등으로 URL keyword가 바뀌면 input도 동기화
  useEffect(() => {
    setKeywordInput(keyword);
  }, [keyword]);

  const setTab = (nextTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // "검색 확정" 함수
  const commitKeyword = () => {
    const params = new URLSearchParams(searchParams.toString());
    const v = keywordInput.trim();

    if (v) params.set("keyword", v);
    else params.delete("keyword");

    // tab 유지
    if (!params.get("tab")) params.set("tab", tab);

    router.replace(`${pathname}?${params.toString()}`);
  };

  // 입력 취소(옵션): ESC 누르면 원래 keyword로 되돌림
  const cancelKeyword = () => {
    setKeywordInput(keyword);
  };

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* 검색 */}
      <div className="relative w-full">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-4"
        />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full text-xs md:text-base p-3 lg:p-4 pl-12 bg-white/80 border border-outline rounded-xl outline-none focus:border-primary-2"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onBlur={commitKeyword} // 포커스 빠질 때 검색 적용
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitKeyword(); // Enter로 검색 적용
            }
            if (e.key === "Escape") {
              e.preventDefault();
              cancelKeyword(); // ESC로 입력 취소
            }
          }}
        />
      </div>

      {/* 메뉴 탭 */}
      <AdminMenuTab tabs={tabs} value={tab} onChange={setTab} />

      {/* 리스트 */}
      <ContentsList section={section} tab={tab} keyword={keyword} />
    </div>
  );
}
