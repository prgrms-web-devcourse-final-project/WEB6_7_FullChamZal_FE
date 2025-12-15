"use client";

import { Search } from "lucide-react";
import AdminMenuTab from "./AdminMenuTab";
import ContentsList from "./ContentsList";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type TabItem = { key: string; label: string };

export default function AdminBody({
  section,
  tabs,
  defaultTab,
  searchPlaceholder = "검색...",
}: {
  section: "users" | "capsules" | "reports" | "phone";
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

  const query = searchParams.get("q") ?? "";

  const setTab = (nextTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const setQuery = (nextQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextQuery) params.set("q", nextQuery);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="space-y-8">
        {/* 검색 */}
        <div className="relative w-full">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-4"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full p-4 pl-12 bg-white/80 border border-outline rounded-xl outline-none focus:border-primary-2"
          />
        </div>

        {/* 메뉴 탭 */}
        <AdminMenuTab tabs={tabs} value={tab} onChange={setTab} />

        {/* 리스트 */}
        <ContentsList section={section} tab={tab} query={query} />
      </div>
    </>
  );
}
