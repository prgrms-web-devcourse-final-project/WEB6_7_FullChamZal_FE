"use client";

import Button from "@/components/common/Button";

export default function FindIdSection({
  verified,
  canFindId,
  pending,
  onFindId,
}: {
  verified: boolean;
  canFindId: boolean;
  pending: boolean;
  onFindId: () => void;
}) {
  return (
    <div className="space-y-3 border-t border-outline pt-6">
      {!verified && (
        <div className="text-sm text-text-3">
          먼저 전화번호 인증을 완료해주세요.
        </div>
      )}
      <Button className="w-full py-3" onClick={onFindId} disabled={!canFindId}>
        {pending ? "조회 중..." : "내 아이디 조회"}
      </Button>
    </div>
  );
}
