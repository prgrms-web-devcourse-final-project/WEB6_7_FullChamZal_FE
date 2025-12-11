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
import DivBox from "../../DivBox";

export default function LetterReadingStatus() {
  const donutData = [
    { name: "열람", value: 15 },
    { name: "미열람", value: 10 },
  ];

  const DONUT_COLORS = ["#FF583B", "#D6DAE1"];

  return (
    <>
      <DivBox className="lg:flex-1 flex flex-col justify-between cursor-auto hover:bg-outline/0">
        <div>
          <p className="text-lg">받은 편지 열람 현황</p>
          <div className="h-[360px] flex items-center justify-center select-none [&_*:focus]:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={80} // 도넛 구멍 크기
                  outerRadius={120} // 전체 원 크기
                  paddingAngle={6} // 섹터 사이 간격
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index]} />
                  ))}

                  <Label
                    value={`총 24통`}
                    position="center"
                    fill="#111827" // 텍스트 색
                    style={{ fontSize: 28, fontWeight: 500 }}
                  />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 px-4 bg-sub rounded-lg">
            <div className="space-x-3">
              <span className="inline-block w-3 h-3 rounded-full bg-primary-2"></span>
              <span>{donutData[0].name}</span>
            </div>
            <span>{donutData[0].value}통</span>
          </div>
          <div className="flex items-center justify-between py-2 px-4 bg-sub rounded-lg">
            <div className="space-x-3">
              <span className="inline-block w-3 h-3 rounded-full bg-text-5"></span>
              <span>{donutData[1].name}</span>
            </div>
            <span>{donutData[1].value}통</span>
          </div>
        </div>
      </DivBox>
    </>
  );
}
