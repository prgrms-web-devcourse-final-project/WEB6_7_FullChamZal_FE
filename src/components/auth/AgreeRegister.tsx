import { ShieldAlert } from "lucide-react";
import Button from "../common/Button";
import { Checkbox } from "../ui/checkbox";

type Agreements = { terms: boolean; privacy: boolean; marketing: boolean };

export default function AgreeRegister({
  value,
  onChange,
  onNext,
}: {
  value: Agreements;
  onChange: (v: Agreements) => void;
  onNext: () => void;
}) {
  const canNext = value.terms && value.privacy;

  return (
    <div className="space-y-3 md:space-y-8">
      <div className="p-5 space-y-5 border border-outline rounded-xl bg-white">
        <div className="flex gap-2">
          <ShieldAlert size={20} />
          <div className="w-87 space-y-4 text-xs md:text-base">
            <p className="text-text-2 break-keep">
              개인정보보호법에 따라 Dear.___ 에 회원가입 신청하시는 분께
              수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의
              보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을
              안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
            </p>
            <div className="space-y-3">
              <div>
                <p>1. 수집 목적</p>
                <p className="text-text-2 ml-1 mt-1 break-keep">
                  회원가입, 본인확인(SMS 인증), 서비스 이용 관련 안내 및 메세지
                  수신 알림(비광고성 알림톡·SMS 포함), 고객문의 및 분쟁 처리
                </p>
              </div>
              <div>
                <p>2. 수집 항목</p>
                <p className="text-text-2 ml-1 mt-1">이름, 휴대전화번호</p>
              </div>
              <div>
                <p>3. 보유 기간</p>
                <p className="text-text-2 ml-1 mt-1">회원 탈퇴 시까지</p>
              </div>
              <div>
                <p>4. 동의 거부권 및 거부 시 불이익</p>
                <p className="text-text-2 ml-1 mt-1 break-keep">
                  정보주체는 개인정보 수집·이용에 대한 동의를 거부할 권리가
                  있습니다. 다만, 본인의 성명 및 휴대전화번호 제공에 동의하지
                  않을 경우 회원가입 및 본인확인 절차를 진행할 수 없으므로
                  서비스 이용이 제한됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-xs md:text-base">
          {/* 체크박스들 */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="terms"
              checked={value.terms}
              onCheckedChange={(checked) =>
                onChange({ ...value, terms: checked === true })
              }
            />
            <label htmlFor="terms">
              개인정보 수집·이용에 동의합니다. (필수)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="privacy"
              checked={value.privacy}
              onCheckedChange={(checked) =>
                onChange({ ...value, privacy: checked === true })
              }
            />
            <label htmlFor="privacy">
              휴대전화 SMS 본인확인에 동의합니다. (필수)
            </label>
          </div>
        </div>
      </div>

      <Button
        className="w-full py-2 md:py-3 text-xs md:text-base"
        disabled={!canNext}
        onClick={onNext}
      >
        다음
      </Button>
    </div>
  );
}
