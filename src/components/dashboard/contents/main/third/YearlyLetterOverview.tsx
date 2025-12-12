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

const data = [
  {
    name: "1월",
    receive: 3,
    send: 5,
  },
  {
    name: "2월",
    receive: 5,
    send: 2,
  },
  {
    name: "3월",
    receive: 2,
    send: 3,
  },
  {
    name: "4월",
    receive: 7,
    send: 5,
  },
  {
    name: "5월",
    receive: 8,
    send: 6,
  },
  {
    name: "6월",
    receive: 6,
    send: 7,
  },
  {
    name: "7월",
    receive: 4,
    send: 4,
  },
  {
    name: "8월",
    receive: 3,
    send: 0,
  },
  {
    name: "9월",
    receive: 0,
    send: 1,
  },
  {
    name: "10월",
    receive: 2,
    send: 3,
  },
  {
    name: "11월",
    receive: 1,
    send: 4,
  },
  {
    name: "12월",
    receive: 4,
    send: 2,
  },
];

export default function YearlyLetterOverview() {
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
            <p className="text-12 text-2xl">20</p>
          </div>
          <div className="w-full px-4 py-3 bg-primary-5 rounded-[10px] space-y-2">
            <p className="text-sm">보낸 편지</p>
            <p className="text-2xl">20</p>
          </div>
        </div>
        <div className="h-80 select-none outline-none [&_*:focus]:outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
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
