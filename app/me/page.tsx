import db from "@/lib/db";
import { Star, Clock, FolderHeart } from "lucide-react";

export default async function Me() {
  const stars = await db.star.findMany();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <FolderHeart className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">내 저장 목록</h1>
          </div>
          <span className="text-sm text-gray-500">총 {stars.length}개</span>
        </div>

        {/* 내용 */}
        {stars.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md p-12">
            <Star className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg font-medium">
              아직 저장된 장소가 없습니다.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              마음에 드는 장소를 저장해 보세요!
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stars.map((star) => (
              <li
                key={star.id}
                className="group bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition">
                      {star.title}
                    </h3>
                    <Star
                      className="w-5 h-5 text-yellow-400 fill-yellow-300"
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-4 h-4" />
                    {new Date(star.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {/* 하단 구분선 */}
                <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
