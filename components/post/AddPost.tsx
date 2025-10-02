"use client";

import { writePost } from "@/app/post/actions";
import { useFormState } from "react-dom";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Button from "../etc/Button";

export default function AddPost() {
  const [state, action] = useFormState(writePost, { success: false });
  return (
    <form action={action} className="space-y-4 pb-4 mb-6">
      <textarea
        name="post"
        placeholder="당신만의 코스를 공유해보세요!"
        className="textarea-bordered rounded w-full border p-3"
      ></textarea>
      <div>
        <label className="w-full flex gap-2 items-center justify-center cursor-pointer  p-2 bg-gray-100 rounded hover:bg-gray-200">
          <PhotoIcon className="size-7 -rotate-30" />
          <span className="font-semibold">사진 추가</span>
          <input type="file" name="photo" accept="image/*" className="hidden" />
        </label>
      </div>
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      <div className="flex justify-center">
        <Button
          text="작성하기"
          className=" w-[100px] bg-green-500 hover:bg-green-600 text-white font-medium border-none py-1
    rounded-md text-center  transition-colors cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
    </form>
  );
}
