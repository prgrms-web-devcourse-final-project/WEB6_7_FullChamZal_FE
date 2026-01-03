"use client";

import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import DivBox from "../../../DivBox";
import { useQuery } from "@tanstack/react-query";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";

export default function LetterReadingStatus() {
  const { data, isLoading, isError } = useQuery<
    PageResponse<CapsuleDashboardItem>
  >({
    queryKey: ["capsuleDashboard", "receive"],
    queryFn: ({ signal }) =>
      capsuleDashboardApi.receiveDashboard(undefined, signal),
    staleTime: 30_000,
    retry: 1,
  });

  const receiveList = data?.data.content ?? [];

  const viewedCount = receiveList.filter((item) => item.viewStatus).length;
  const unviewedCount = receiveList.filter((item) => !item.viewStatus).length;

  const donutData = [
    { name: "열람", value: viewedCount },
    { name: "미열람", value: unviewedCount },
  ];

  const DONUT_COLORS = ["#FF583B", "#D6DAE1"];

  const total = viewedCount + unviewedCount;

  return (
    <DivBox className="lg:flex-1 flex flex-col justify-between cursor-auto hover:bg-outline/0">
      <div>
        <p className="text-base md:text-lg">받은 편지 열람 현황</p>

        <div className="h-90 flex items-center justify-center select-none [&_*:focus]:outline-none">
          {isLoading ? (
            <p className="text-text-4">불러오는 중…</p>
          ) : isError ? (
            <p className="text-text-4">불러오지 못했어요.</p>
          ) : total === 0 ? (
            <p className="text-text-4">받은 편지가 없습니다.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={6}
                  stroke="none"
                >
                  {donutData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index]} />
                  ))}

                  <Label
                    value={`총 ${total}통`}
                    position="center"
                    fill="#111827"
                    className="text-2xl md:text-3xl font-medium"
                  />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 px-4 bg-sub rounded-lg">
          <div className="space-x-3">
            <span className="inline-block w-3 h-3 rounded-full bg-primary-2" />
            <span>{donutData[0].name}</span>
          </div>
          <span>{donutData[0].value}통</span>
        </div>

        <div className="flex items-center justify-between py-2 px-4 bg-sub rounded-lg">
          <div className="space-x-3">
            <span className="inline-block w-3 h-3 rounded-full bg-text-5" />
            <span>{donutData[1].name}</span>
          </div>
          <span>{donutData[1].value}통</span>
        </div>
      </div>
    </DivBox>
  );
}
