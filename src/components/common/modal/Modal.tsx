"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Modal({
  open,
  onClose,
  children,
  zIndexClassName = "z-9999",
  contentClassName = "max-w-md",
  closeOnOverlayClick = true,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndexClassName?: string;
  contentClassName?: string;
  closeOnOverlayClick?: boolean;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={`fixed inset-0 ${zIndexClassName} bg-black/40`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            if (closeOnOverlayClick) {
              onClose();
            }
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center px-6 lg:px-8 py-6">
            {/* 실제 모달 카드 */}
            <motion.div
              className={`relative max-h-[calc(100dvh-48px)] w-full ${contentClassName} overflow-y-auto overscroll-contain bg-white rounded-2xl`}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
