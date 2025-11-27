"use client";

import { writePost } from "@/app/post/actions";
import { useFormState } from "react-dom";
import AddButton from "../ui/button/AddButton";

export default function AddPost() {
  const [state, action] = useFormState(writePost, { success: false });
  return (
    <form action={action} className="space-y-4 pb-4 sm:mb-6">
      <textarea
        name="post"
        placeholder="당신만의 코스를 공유해보세요!"
        className="textarea-bordered rounded w-full border p-3 h-[120%]"
      ></textarea>

      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      <div className="flex justify-center gap-5">
        <AddButton
          text="작성하기"
          className=" w-[100px] bg-purple-500 hover:bg-purple-600 text-white font-medium border-none py-1
    rounded-md text-center  transition-colors cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
    </form>
  );
}
