import { db } from "@/lib/db";
import { Star, FolderHeart, Route } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
<<<<<<< HEAD
import BackButton from "@/components/ui/button/BackButton";
import CourseCard from "@/components/course/CoureseCard";
import StarDelete from "@/components/ui/button/StarDelete";
import Move from "@/components/ui/button/MoveNaver";

import { Course, Stars } from "@/types/prisma";
=======
import BackButton from "@/src/components/etc/BackButton";
import CourseCard from "@/src/components/course/CoureseCard";
import StarDelete from "@/src/components/etc/StarDelete";
import Move from "@/src/components/etc/Move";
>>>>>>> 55c74ae (Refactor: 폴더 구조 정리)

export default async function Me() {
  const user = await currentUser();
  const stars: Stars[] = await db.star.findMany({
    where: { userId: user?.id },
    orderBy: { created_at: "desc" },
  });
  const courses: Course[] = await db.course.findMany({
    where: { userId: user?.id },
    orderBy: { created_at: "desc" },
  });

  const isEmpty = stars.length === 0 && courses.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <FolderHeart className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">내 저장 목록</h1>
          </div>
          <BackButton />
        </div>

        {/* 빈 상태 */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md p-12">
            <FolderHeart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              아직 저장된 항목이 없습니다.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              마음에 드는 장소나 코스를 저장해 보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* 저장된 코스 */}
            {courses.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Route className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    내 코스 ({courses.length})
                  </h2>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </ul>
              </section>
            )}

            {/* 저장된 장소 */}
            {stars.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
                  <h2 className="text-xl font-bold text-gray-900">
                    내 장소 ({stars.length})
                  </h2>
                </div>
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

                          <StarDelete placeId={star.placeId} />
                        </div>
                        <div className="flex flex-col ">
                          <p className="text-sm text-gray-600 mb-3">
                            {star.desc}
                          </p>

                          <p className=" text-xs text-gray-500 mb-3">
                            {star.address}
                          </p>
                        </div>
                        <Move star={star} />
                      </div>
                      {/* 하단 구분선 */}
                      <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
