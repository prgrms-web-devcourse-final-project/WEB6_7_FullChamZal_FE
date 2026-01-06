"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import {
  storytrackAttachmentApi,
  type StorytrackAttachmentStatus,
} from "@/lib/api/dashboard/storyTrackAttachment";
import { useCleanupStorytrackTempFile } from "@/lib/hooks/useCleanupStorytrackTempFile";

type Props = {
  value: FirstFormValue;
  onChange: (patch: Partial<FirstFormValue>) => void;
};

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "code" in err) {
    const apiError = err as { code?: string; message?: string };
    if (apiError.message) {
      return apiError.message;
    }
  }

  if (err instanceof Error) return err.message;

  if (err && typeof err === "object") {
    const errObj = err as Record<string, unknown>;
    const response = errObj?.response as
      | { data?: { message?: unknown; error?: unknown } }
      | undefined;
    const candidate =
      response?.data?.message ?? response?.data?.error ?? errObj?.message;

    if (typeof candidate === "string") return candidate;
  }

  return "이미지 업로드에 실패했습니다.";
}

export default function FirstForm({ value, onChange }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedAttachment, setUploadedAttachment] = useState<{
    attachmentId: number;
    fileName: string;
    previewUrl: string;
    status: StorytrackAttachmentStatus;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const uploadedAttachmentRef = useRef(uploadedAttachment);

  // 파일 프리뷰 URL 생성/해제
  useEffect(() => {
    if (uploadedAttachment?.previewUrl) {
      setPreviewUrl(uploadedAttachment.previewUrl);
      return;
    }
    setPreviewUrl(null);
  }, [uploadedAttachment]);

  // 이미지 필터링 상태 폴링 함수
  const pollAttachmentStatus = async (
    attachmentId: number,
    onStatusChange: (status: StorytrackAttachmentStatus) => void
  ) => {
    // 기존 폴링이 있다면 취소
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }

    const poll = async () => {
      try {
        const { status } = await storytrackAttachmentApi.getStatus(
          attachmentId
        );
        onStatusChange(status);

        // TEMP 또는 DELETED 상태면 폴링 종료
        if (status === "TEMP" || status === "DELETED") {
          pollingTimeoutRef.current = null;
          return;
        }

        // 2초 후 다시 폴링
        const timeoutId = setTimeout(poll, 2000);
        pollingTimeoutRef.current = timeoutId;
      } catch (error) {
        console.error(`Failed to poll status for ${attachmentId}:`, error);
        onStatusChange("DELETED"); // 오류 발생 시 DELETED로 처리
        pollingTimeoutRef.current = null;
      }
    };

    // 초기 지연 후 폴링 시작
    const initialTimeoutId = setTimeout(poll, 500);
    pollingTimeoutRef.current = initialTimeoutId;
  };

  // 이미지 파일 선택 핸들러
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      toast.error(`${file.name}: 이미지 파일만 업로드할 수 있습니다.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // 파일 크기 제한
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name}: 파일 크기는 10MB 이하여야 합니다.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsUploading(true);
    try {
      // 미리보기 URL 생성 (로컬)
      const previewUrl = URL.createObjectURL(file);

      // Presigned URL 방식으로 업로드
      const response = await storytrackAttachmentApi.uploadByPresignedUrl(file);

      // 업로드 완료 후 상태를 PENDING으로 설정하고 폴링 시작
      const newAttachment = {
        attachmentId: response.attachmentId,
        fileName: file.name,
        previewUrl,
        status: "PENDING" as StorytrackAttachmentStatus, // 업로드 완료, 필터링 대기 중
      };
      setUploadedAttachment(newAttachment);

      // 부모 컴포넌트에 attachmentId와 상태 전달
      onChange({
        thumbnailAttachmentId: response.attachmentId,
        thumbnailStatus: "PENDING",
      });

      // 폴링 시작: 상태가 TEMP 또는 DELETED가 될 때까지 조회
      pollAttachmentStatus(response.attachmentId, (status) => {
        setUploadedAttachment((prev) => {
          if (!prev || prev.attachmentId !== response.attachmentId) {
            return prev;
          }

          const prevStatus = prev.status;

          // 상태 변경 시 부모에게 전달
          if (status === "DELETED") {
            // DELETED로 변경되었을 때 토스트 표시
            if (prevStatus !== "DELETED") {
              toast.error(
                `${prev.fileName}: 유해 이미지로 검열되어 삭제되었습니다.`
              );
            }
            // DELETED 상태면 부모 컴포넌트에서 attachmentId 제거
            onChange({
              thumbnailAttachmentId: undefined,
              thumbnailStatus: "DELETED",
            });
          } else {
            // 다른 상태 변경 시에도 부모에게 전달
            onChange({ thumbnailStatus: status });
          }

          return {
            ...prev,
            status,
          };
        });
      });

      toast.success("이미지 업로드를 시작했습니다!");
    } catch (error) {
      toast.error(getErrorMessage(error));
      // 에러 발생 시에만 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 삭제 핸들러
  const handleRemoveAttachment = async () => {
    if (!uploadedAttachment) return;

    try {
      await storytrackAttachmentApi.deleteTemp(uploadedAttachment.attachmentId);
      // previewUrl cleanup
      if (uploadedAttachment.previewUrl) {
        URL.revokeObjectURL(uploadedAttachment.previewUrl);
      }
      setUploadedAttachment(null);
      // 부모 컴포넌트에서 attachmentId 제거
      onChange({ thumbnailAttachmentId: undefined });
      toast.success("이미지가 삭제되었습니다.");
    } catch {
      toast.error("이미지 삭제에 실패했습니다.");
    }
  };

  // uploadedAttachment 변경 시 ref 업데이트
  useEffect(() => {
    uploadedAttachmentRef.current = uploadedAttachment;
  }, [uploadedAttachment]);

  // 임시 파일 자동 정리 훅 사용
  // ㄴ 브라우저 탭 나가기 (beforeunload)
  // ㄴ 컴포넌트 언마운트 (뒤로가기, 페이지 이동 등)
  useCleanupStorytrackTempFile(uploadedAttachmentRef);

  // 컴포넌트 언마운트 시 폴링 정리
  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full min-h-0">
      <div className="flex gap-8 h-full min-h-0">
        {/* Left - 입력 폼 */}
        <div className="flex-1 w-full h-full min-h-0 border border-outline rounded-xl p-4 lg:p-8 flex flex-col">
          {/* 스크롤 영역 */}
          <div className="flex-1 min-h-0 overflow-y-auto px-2 space-y-4 lg:space-y-6">
            {/* 제목 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm">
                트랙 제목
              </label>
              <input
                id="title"
                type="text"
                value={value.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="예: 서울 한강 야경 투어"
                className="border border-outline rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-2 outline-none"
              />
            </div>

            {/* 설명 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm">
                트랙 설명
              </label>
              <textarea
                id="description"
                rows={3}
                value={value.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="이 스토리트랙에 대해 설명해주세요..."
                className="resize-none border border-outline rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-2 outline-none"
              />
            </div>

            {/* 트랙 유형 */}
            <div className="flex flex-col gap-2">
              <span className="text-sm">트랙 유형</span>

              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="order"
                    value="SEQUENTIAL"
                    checked={value.order === "SEQUENTIAL"}
                    onChange={() => onChange({ order: "SEQUENTIAL" })}
                    className="hidden peer"
                  />
                  <div className="flex items-center justify-center py-2.5 border-2 border-outline text-text-3 rounded-lg peer-checked:border-primary-2 peer-checked:bg-button-hover peer-checked:text-primary-2">
                    순서대로
                  </div>
                </label>

                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="order"
                    value="FREE"
                    checked={value.order === "FREE"}
                    onChange={() => onChange({ order: "FREE" })}
                    className="hidden peer"
                  />
                  <div className="flex items-center justify-center py-2.5 border-2 border-outline text-text-3 rounded-lg peer-checked:border-primary-2 peer-checked:bg-button-hover peer-checked:text-primary-2">
                    순서 없음
                  </div>
                </label>
              </div>
            </div>

            {/* 대표 이미지 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="img" className="text-sm">
                대표 이미지
              </label>

              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  id="img"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={
                    isUploading ||
                    uploadedAttachment?.status === "PENDING" ||
                    uploadedAttachment?.status === "UPLOADING"
                  }
                  className="w-full cursor-pointer border border-outline rounded-lg py-2 px-4 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-button-hover file:px-3 file:py-1.5 file:text-sm file:text-text hover:file:bg-outline/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {/* 파일 이름 표시 */}
                {uploadedAttachment?.fileName && (
                  <span className="text-sm text-text-2">
                    선택된 파일: {uploadedAttachment.fileName}
                  </span>
                )}
                {(isUploading ||
                  uploadedAttachment?.status === "PENDING" ||
                  uploadedAttachment?.status === "UPLOADING") && (
                  <span className="text-sm text-text-3">
                    {uploadedAttachment?.status === "PENDING" ||
                    uploadedAttachment?.status === "UPLOADING"
                      ? "이미지 검토가 완료될 때까지 기다려주세요..."
                      : "이미지를 업로드하는 중..."}
                  </span>
                )}
              </div>
            </div>

            {/* 모바일 미리보기 (상태 오버레이 포함) */}
            <div className="block md:hidden">
              {previewUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-outline bg-sub-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={uploadedAttachment?.fileName || "대표 이미지 미리보기"}
                    className={`w-full h-full object-cover ${
                      uploadedAttachment?.status === "DELETED"
                        ? "opacity-50"
                        : ""
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />

                  {/* 상태 오버레이 */}
                  {(uploadedAttachment?.status === "UPLOADING" ||
                    uploadedAttachment?.status === "PENDING") && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-20">
                      <Loader2 className="animate-spin mb-2" size={24} />
                      <span className="text-xs">
                        {uploadedAttachment.status === "UPLOADING"
                          ? "업로드 중..."
                          : "검토 중..."}
                      </span>
                    </div>
                  )}

                  {uploadedAttachment?.status === "DELETED" && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-20">
                      <X className="mb-2 text-red-400" size={24} />
                      <span className="text-xs text-center px-2">
                        필터링 실패
                      </span>
                    </div>
                  )}

                  {/* 삭제 버튼 */}
                  {uploadedAttachment &&
                    uploadedAttachment.status !== "DELETED" && (
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white z-30"
                        aria-label="이미지 삭제"
                      >
                        <X size={16} />
                      </button>
                    )}
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-base text-text-3">이미지 미리보기</div>
                  <div className="text-sm text-text-4">
                    대표 이미지를 선택하면 여기에 표시됩니다
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - 이미지 미리보기 (데스크톱, 상태 오버레이 포함) */}
        <div className="flex-1 h-full min-h-0 border border-outline rounded-xl p-8 hidden md:flex items-center justify-center text-text-4 overflow-hidden relative">
          {previewUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={uploadedAttachment?.fileName || "대표 이미지 미리보기"}
                className={`max-w-full max-h-full object-contain rounded-lg ${
                  uploadedAttachment?.status === "DELETED" ? "opacity-50" : ""
                }`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />

              {/* 상태 오버레이 */}
              {(uploadedAttachment?.status === "UPLOADING" ||
                uploadedAttachment?.status === "PENDING") && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-20 rounded-lg">
                  <Loader2 className="animate-spin mb-2" size={24} />
                  <span className="text-xs">
                    {uploadedAttachment.status === "UPLOADING"
                      ? "업로드 중..."
                      : "검토 중..."}
                  </span>
                </div>
              )}

              {uploadedAttachment?.status === "DELETED" && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-20 rounded-lg">
                  <X className="mb-2 text-red-400" size={24} />
                  <span className="text-xs text-center px-2">필터링 실패</span>
                </div>
              )}

              {/* 삭제 버튼 */}
              {uploadedAttachment &&
                uploadedAttachment.status !== "DELETED" && (
                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white z-30"
                    aria-label="이미지 삭제"
                  >
                    <X size={20} />
                  </button>
                )}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="text-base text-text-3">이미지 미리보기</div>
              <div className="text-sm text-text-4">
                대표 이미지를 선택하면 여기에 표시됩니다
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
