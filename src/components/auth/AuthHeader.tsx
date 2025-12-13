import Logo from "../common/Logo";

export default function AuthHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      {/* 로고 */}
      <header className="space-y-4 md:space-y-6">
        <div className="text-primary flex items-center gap-2">
          <Logo className="w-7 md:w-9" />
          <span className="text-xl md:text-2xl font-paperozi font-extrabold">
            Dear. ___
          </span>
        </div>
        <div className="space-y-3 text-center">
          <p className="text-xl md:text-3xl font-semibold">{title}</p>
          <p className="text-sm md:text-base">{description}</p>
        </div>
      </header>

      {/* 소셜 로그인 버튼 */}
      <button
        type="button"
        className="cursor-pointer w-full py-2 md:py-3 bg-white/80 rounded-xl flex items-center justify-center gap-2 border border-outline"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_572_914)">
            <path
              d="M15.6418 8.14568C15.6418 7.49051 15.5887 7.01241 15.4736 6.5166H7.99219V9.47372H12.3836C12.2951 10.2086 11.817 11.3153 10.7545 12.059L10.7396 12.158L13.1051 13.9905L13.269 14.0069C14.7741 12.6168 15.6418 10.5716 15.6418 8.14568Z"
              fill="#4285F4"
            />
            <path
              d="M7.99149 15.9364C10.1429 15.9364 11.9491 15.228 13.2683 14.0062L10.7538 12.0584C10.081 12.5276 9.17787 12.8552 7.99149 12.8552C5.88431 12.8552 4.09586 11.4652 3.45833 9.54395L3.36488 9.55188L0.905213 11.4554L0.873047 11.5449C2.18339 14.1478 4.87494 15.9364 7.99149 15.9364Z"
              fill="#34A853"
            />
            <path
              d="M3.45866 9.54423C3.29045 9.04843 3.19309 8.51716 3.19309 7.96825C3.19309 7.41929 3.29045 6.88808 3.44981 6.39228L3.44536 6.28668L0.954863 4.35254L0.873379 4.3913C0.333323 5.47147 0.0234375 6.68446 0.0234375 7.96825C0.0234375 9.25205 0.333323 10.465 0.873379 11.5451L3.45866 9.54423Z"
              fill="#FBBC05"
            />
            <path
              d="M7.99149 3.08109C9.48776 3.08109 10.4971 3.72741 11.0726 4.26753L13.3214 2.07178C11.9403 0.787988 10.1429 0 7.99149 0C4.87494 0 2.18339 1.78845 0.873047 4.39143L3.44948 6.39241C4.09586 4.47115 5.88431 3.08109 7.99149 3.08109Z"
              fill="#EB4335"
            />
          </g>
          <defs>
            <clipPath id="clip0_572_914">
              <rect width="15.6719" height="15.9917" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span className="text-sm md:text-base">Google</span>
      </button>

      {/* 구분선 */}
      <div className="py-2 md:py-4">
        <div className="w-full h-px bg-text-5"></div>
      </div>
    </>
  );
}
