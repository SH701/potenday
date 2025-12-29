"use client";

import { Recommendation } from "@/types/recommandation";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, ExternalLink, Clock } from "lucide-react";

import { useEffect, useState } from "react";

interface PlaceModalProps {
  selectedItem: Recommendation | null;
  onClose: () => void;
  guName?: string;
}

interface NaverPlaceDetail {
  title: string;
  address: string;
  telephone: string;
  category: string;
  link: string;
  roadAddress: string;
  photos?: string[];
  photo?: string;
  rating?: number;
  reviewCount?: number;
}

export default function PlaceModal({
  selectedItem,
  onClose,
  guName,
}: PlaceModalProps) {
  const [placeDetail, setPlaceDetail] = useState<NaverPlaceDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedItem) return;

    setLoading(true);
    setPlaceDetail(null);

    fetch(
      `/api/place-detail?query=${encodeURIComponent(
        selectedItem.title + " " + (guName || "")
      )}&count=5`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.detail) {
          setPlaceDetail(data.detail);
        }
      })
      .catch((err) => console.error("장소 상세 불러오기 실패:", err))
      .finally(() => setLoading(false));
  }, [selectedItem, guName]);

  if (!selectedItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-[500px] max-h-[85vh] overflow-y-auto mx-4 sm:mx-0"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold pr-10">{selectedItem.title}</h2>
            <p className="text-white/90 text-sm mt-1">{guName}</p>
          </div>

          <div className="p-6">
            {placeDetail?.photos && placeDetail.photos.length > 0 ? (
              <div className="mb-6">
                <div className="flex overflow-x-auto gap-3 pb-2">
                  {placeDetail.photos.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${selectedItem.title} 사진 ${idx + 1}`}
                      className="h-40 w-64 object-cover rounded-xl flex-shrink-0 shadow-md"
                    />
                  ))}
                </div>
              </div>
            ) : placeDetail?.photo ? (
              <div className="mb-6">
                <img
                  src={placeDetail.photo}
                  alt={selectedItem.title}
                  className="h-40 w-full object-cover rounded-xl shadow-md"
                />
              </div>
            ) : null}

            {/* 🔹 기본 정보 */}
            <div className="mb-6">
              <p className="text-gray-700 text-lg mb-4">{selectedItem.desc}</p>
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="font-medium">{selectedItem.time}</span>
              </div>
            </div>

            {/* 네이버 정보 */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">상세 정보 불러오는 중...</p>
              </div>
            ) : placeDetail ? (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  📍 상세 정보
                </h3>

                {/* 주소 */}
                {placeDetail.roadAddress && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          {placeDetail.roadAddress}
                        </p>
                        {placeDetail.address && (
                          <p className="text-sm text-gray-500">
                            지번: {placeDetail.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 카테고리 */}
                {placeDetail.category && (
                  <div className="flex flex-wrap gap-2">
                    {placeDetail.category.split(">").map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {cat.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* 네이버 링크 */}
                <a
                  href={placeDetail.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  사진 · 리뷰 보기
                </a>
              </div>
            ) : (
              <div className="border-t pt-6">
                <p className="text-center text-gray-500 mb-6">
                  상세 정보를 찾을 수 없습니다
                </p>
                <a
                  href={`https://search.naver.com/search.naver?query=${encodeURIComponent(
                    selectedItem.title + " " + (guName || "")
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  네이버에서 직접 검색하기
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
