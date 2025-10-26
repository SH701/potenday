"use client";

import { ArrowRight, Calendar, Clock, MapPin, X } from "lucide-react";

interface Spot {
  name: string;
  desc: string;
  address?: string;
  arriveTime?: string;
  stayTime?: string;
  category?: string;
  nextMove?: string;
}
interface Props {
  title: string;
  vibe: string | null | undefined;
  route?: string | null | undefined;
  spots: Spot[];
}

interface CourseModalProps {
  course: Props | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function CourseModal({
  course,
  onClose,
  isOpen,
}: CourseModalProps) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div
        className="bg-white rounded-2xl  max-h-[90vh] overflow-auto shadow-2xl max-w-[75vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition absolute right-4 top-4"
        >
          <X className="w-6 h-6" />
        </button>

        <div>
          <div className=" space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <h3 className="text-2xl font-bold">{course.title}</h3>
              <p className="text-purple-100 mt-2">{course.vibe}</p>

              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <MapPin className="w-4 h-4" />
                  <span>{course.spots?.length || 0}개 장소</span>
                </div>
              </div>
            </div>

            {/* 타임라인 */}
            <div className="relative space-y-6 pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-pink-400"></div>

              {course.spots.map((spot: Spot, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[26px] top-2 w-5 h-5 rounded-full bg-white border-4 border-purple-400 shadow-md"></div>

                  <div
                    className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition border border-gray-100 cursor-pointer"
                    onClick={() =>
                      window.open(
                        `https://map.naver.com/v5/search/${encodeURIComponent(
                          spot.name.replace(/<[^>]*>/g, "")
                        )}`,
                        "_blank"
                      )
                    }
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {spot.arriveTime && (
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {spot.arriveTime}
                          </span>
                        )}
                        {spot.category && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {spot.category}
                          </span>
                        )}
                      </div>
                      {spot.stayTime && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {spot.stayTime}
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {spot.name}
                    </h4>

                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {spot.desc}
                    </p>

                    {spot.address && (
                      <div className="flex items-start gap-2 text-xs text-gray-500 mb-2">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{spot.address}</span>
                      </div>
                    )}

                    {spot.nextMove && i < course.spots.length - 1 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-purple-600">
                        <ArrowRight className="w-4 h-4" />
                        <span>{spot.nextMove}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
