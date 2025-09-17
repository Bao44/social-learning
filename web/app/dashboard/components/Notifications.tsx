"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({
  isOpen,
  onClose,
}: NotificationsPanelProps) {
  const [loading, setLoading] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed left-0 top-0 bottom-0 w-100 bg-white border-r border-gray-200 z-50 flex flex-col"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg">Thông báo</h2>
              <button onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
