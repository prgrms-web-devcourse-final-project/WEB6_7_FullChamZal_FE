"use client";

import Modal from "@/components/common/Modal";
import {
  AlertCircle,
  CheckCircle,
  Clock5,
  Eye,
  Flag,
  ShieldAlert,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export default function ReportList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-outline rounded-xl p-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">사용자 신고: 박민수</span>
              <div className="text-xs flex items-center gap-2">
                <span className="py-1 px-3 rounded-md bg-red-100 text-red-800">
                  높음
                </span>
                <span className="bg-orange-100 text-orange-800 py-1 px-3 rounded-md">
                  대기
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-2">신고자:</span> <span>홍길동</span>
              </div>
              <div>
                <span className="text-text-2">신고 일시:</span>{" "}
                <span>2024-12-10</span>
              </div>
              <div>
                <span className="text-text-2">신고 내용:</span>{" "}
                <span>부적절한 내용</span>
              </div>
              <div>
                <span className="text-text-2">대상 ID:</span> <span>#4</span>
              </div>
            </div>

            <p className="text-text-2 text-sm w-full rounded-lg bg-sub border border-outline p-3">
              욕설이 포함된 편지를 보냈습니다.
            </p>
          </div>

          <div className="border-t border-outline flex gap-2 pt-4">
            <button className="cursor-pointer py-2 px-3 flex items-center gap-1 rounded-lg bg-green-100 hover:bg-green-200">
              <CheckCircle size={16} />
              <span>승인</span>
            </button>

            <button className="cursor-pointer py-2 px-3 flex items-center gap-1 rounded-lg bg-red-100 hover:bg-red-200">
              <XCircle size={16} />
              <span>반려</span>
            </button>

            <button
              onClick={() => setOpenDetail(true)}
              className="cursor-pointer py-2 px-3 flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <Eye size={16} />
              <span>상세보기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 상세보기 모달 */}
      <Modal open={openDetail} onClose={() => setOpenDetail(false)}>
        <div className="w-full max-w-2xl flex flex-col h-full max-h-[900px] mx-auto rounded-xl bg-white">
          {/* Header */}
          <div className="py-4 px-6 flex justify-between items-center border-b border-outline">
            <div className="flex-1">
              <h4 className="text-lg">신고 상세 정보</h4>
              <span className="text-xs">신고 ID: #1</span>
            </div>
            <button
              type="button"
              onClick={() => setOpenDetail(false)}
              className="cursor-pointer"
            >
              <X />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 w-full overflow-y-auto p-6 space-y-6">
            <div className="flex gap-2">
              <span className="py-2 px-3 rounded-lg bg-orange-100 text-orange-800">
                대기 중
              </span>
              <span className="py-2 px-3 rounded-lg bg-red-100 text-red-800">
                높은 위험도
              </span>
            </div>

            {/* 신고자 정보 */}
            <div className="p-4 bg-blue-50 rounded-lg space-y-3">
              <div className="flex items-center gap-1">
                <User className="text-blue-800" />
                <span className="text-blue-900">신고자 정보</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-blue-800">이름</span>
                  <span className="text-blue-900">홍길동</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-blue-800">이메일</span>
                  <span className="text-blue-900">hong@example.com</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-blue-800">가입일</span>
                  <span className="text-blue-900">2023-05-15</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-blue-800">신고 일시</span>
                  <span className="text-blue-900">2024-12-10 14:30</span>
                </div>
              </div>
            </div>
            {/* 신고된 사용자 정보 */}
            <div className="p-4 bg-red-50 rounded-lg space-y-3">
              <div className="flex items-center gap-1">
                <ShieldAlert className="text-red-800" />
                <span className="text-red-900">신고된 사용자</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-red-800">이름</span>
                  <span className="text-red-900">홍길동</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-red-800">ID</span>
                  <span className="text-red-900">#4</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-red-800">이메일</span>
                  <span className="text-red-900">hong@example.com</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-red-800">가입일</span>
                  <span className="text-red-900">2023-05-15</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-red-800">누적 신고 수</span>
                  <div className="text-red-900 flex items-center gap-2">
                    <span>3건</span>
                    {/* 누적 신고 수가 몇 건 이상일 때 나옴 */}
                    <div className="text-xs flex items-center gap-1 py-1 px-2 bg-red-200 rounded-md">
                      <AlertCircle size={16} className="text-yellow-600" />
                      <span>다수 신고</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 신고 내용 */}
            <div className="p-4 bg-yellow-50 rounded-lg space-y-3">
              <div className="flex items-center gap-1">
                <Flag className="text-yellow-700" />
                <span className="text-yellow-900">신고 내용</span>
              </div>
              <div>
                <div className="space-y-1">
                  <span className="text-sm text-yellow-800">신고 사유</span>
                  <p className="text-yellow-900 py-2 px-3 bg-white rounded-lg">
                    부적절한 내용
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-yellow-800">상세 설명</span>
                  <p className="text-yellow-900 py-2 px-3 bg-white rounded-lg">
                    욕설이 포함된 편지를 보냈습니다. 반복적으로 불쾌한 내용을
                    전송하고 있어 조치가 필요합니다.
                  </p>
                </div>
              </div>
            </div>
            {/* 신고 접수 타입라인 */}
            <div className="p-4 bg-sub border border-outline rounded-lg space-y-1">
              <div className="flex items-center gap-1">
                <Clock5 size={20} />
                <span>처리 타임라인</span>
              </div>
              <p className="text-sm text-text-3">신고 접수: 2024-12-10 14:30</p>
            </div>
          </div>

          {/* Footer도 인증 전/후 분기 추천 */}
          <div className="py-6 px-6 flex gap-3 border-t border-outline">
            <button className="cursor-pointer flex-1 rounded-xl bg-admin p-2 text-white hover:bg-admin/80">
              신고 승인 및 제재
            </button>
            <button className="cursor-pointer flex-1 rounded-xl p-2 hover:bg-sub border border-outline">
              신고 반려
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
