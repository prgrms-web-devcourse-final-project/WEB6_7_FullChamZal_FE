"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Modal({
  open,
  onClose,
  children,
  zIndexClassName = "z-9999",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndexClassName?: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={`fixed w-full h-full inset-0 ${zIndexClassName} bg-black/40`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose} // backdrop 클릭 닫기
        >
          <motion.div
            className="relative w-full min-h-screen flex items-center justify-center"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
