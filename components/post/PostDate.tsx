"use client";

export default function PostDate({ date }: { date: string }) {
  return (
    <p className="text-[11px] font-bold text-gray-600 dark:text-white pt-0.5">
      {date}
    </p>
  );
}