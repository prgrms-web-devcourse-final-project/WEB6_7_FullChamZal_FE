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
          className={`fixed inset-0 w-full h-full ${zIndexClassName} bg-black/40`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full h-dvh overflow-y-auto overscroll-contain touch-pan-y flex items-start justify-center px-6 lg:px-8 py-6 lg:items-center"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
