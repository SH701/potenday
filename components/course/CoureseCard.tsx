"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    vibe: string | null;
    spots: any;
    createdAt: Date;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("정말 이 코스를 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/course/delete?id=${course.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert("삭제 실패: " + (data.error || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li className="group bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
      {/* 삭제 버튼 */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-3 right-3 z-10 p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
        title="삭제"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <Link href={`/course/${course.id}`}>
        <div className="p-5">
          {/* 제목 */}
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition mb-2 pr-10">
            {course.title}
          </h3>

          {/* 분위기 */}
          {course.vibe && (
            <p className="text-sm text-gray-600 mb-3">{course.vibe}</p>
          )}

          {/* 장소 개수 */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>
                {Array.isArray(course.spots) ? course.spots.length : 0}개 장소
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(course.createdAt).toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          {/* 첫 3개 장소 미리보기 */}
          {Array.isArray(course.spots) && course.spots.length > 0 && (
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <span className="truncate">
                {course.spots
                  .slice(0, 3)
                  .map((s: any) => s.name)
                  .join(" → ")}
                {course.spots.length > 3 && " ..."}
              </span>
            </div>
          )}
        </div>
        {/* 하단 구분선 */}
        <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"></div>
      </Link>
    </li>
  );
}
