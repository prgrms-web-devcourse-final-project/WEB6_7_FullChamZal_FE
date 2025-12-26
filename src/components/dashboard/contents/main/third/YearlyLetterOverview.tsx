"use client";

import { TrendingUp } from "lucide-react";
import DivBox from "../../../DivBox";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import { useQuery } from "@tanstack/react-query";

export default function YearlyLetterOverview() {
  /** 보낸 편지 */
  const { data: sendData } = useQuery({
    queryKey: ["capsuleDashboard", "send", "count"],
    queryFn: ({ signal }) =>
      capsuleDashboardApi.sendDashboard({ page: 0, size: 1 }, signal),
  });

  /** 받은 편지 */
  const { data: receiveData } = useQuery({
    queryKey: ["capsuleDashboard", "receive", "count"],
    queryFn: ({ signal }) =>
      capsuleDashboardApi.receiveDashboard({ page: 0, size: 1 }, signal),
  });

  const year = new Date().getFullYear();

  const { data: yearLetters } = useQuery({
    queryKey: ["yearLetters", year],
    queryFn: ({ signal }) => capsuleDashboardApi.yearLetters(year, signal),
  });

  const yearData = yearLetters?.data.data ?? [];

  const sendCount = sendData?.data.totalElements ?? 0;
  const receiveCount = receiveData?.data.totalElements ?? 0;

  return (
    <>
      <DivBox className="lg:flex-2 space-y-9 cursor-auto hover:bg-outline/0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-lg">올해의 활동</p>
            <p className="text-text-3">편지 주고받기 현황</p>
          </div>
          <div className="text-[#4cd150] flex items-center gap-1">
            <TrendingUp size={16} />
            <span className="text-sm">활발</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-full px-4 py-3 bg-sub rounded-[10px] space-y-2">
            <p className="text-sm">보낸 편지</p>
            <p className="text-12 text-2xl">{sendCount}</p>
          </div>
          <div className="w-full px-4 py-3 bg-primary-5 rounded-[10px] space-y-2">
            <p className="text-sm">받은 편지</p>
            <p className="text-2xl">{receiveCount}</p>
          </div>
        </div>
        <div className="h-80 select-none outline-none [&_*:focus]:outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={yearData}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              {/* 그라데이션 정의 */}
              <defs>
                <linearGradient id="sendArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D6DAE1" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#D6DAE1" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="receiveArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFBCB1" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#FFBCB1" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* 영역 채우기 */}
              <Area
                type="monotone"
                dataKey="send"
                stroke="#D6DAE1"
                strokeWidth={2}
                fill="url(#sendArea)"
                name="보낸 편지"
              />
              <Area
                type="monotone"
                dataKey="receive"
                stroke="#FFBCB1"
                strokeWidth={2}
                fill="url(#receiveArea)"
                name="받은 편지"
              />

              <CartesianGrid stroke="#E7E5E4" strokeDasharray="5 5" />

              <XAxis dataKey="name" />
              <YAxis />
              <Legend align="right" />
              <Tooltip />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </DivBox>
    </>
  );
}
