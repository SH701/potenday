"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Recommendation } from "@/app/main/page";

interface PlaceModalProps {
  selectedItem: Recommendation | null;
  onClose: () => void;
  guName?: string;
}

export default function PlaceModal({
  selectedItem,
  onClose,
  guName,
}: PlaceModalProps) {
  return (
    <AnimatePresence>
      {selectedItem && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-8 w-[420px]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
            <p className="text-gray-600 mb-4">{selectedItem.desc}</p>
            <div className="text-sm text-gray-500 mb-2">
              🕒 운영시간: {selectedItem.time}
            </div>
            {selectedItem.price && (
              <div className="text-sm text-gray-500 mb-4">
                💰 가격: {selectedItem.price}
              </div>
            )}
            {guName && (
              <p className="text-sm text-gray-400">
                {guName}의 추천 장소입니다.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
