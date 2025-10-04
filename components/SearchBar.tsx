"use client";

import { useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  className?: string;
  placeholder: string;
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  className,
  placeholder = "구 검색...",
}: Props) {
  const inputref = useRef<HTMLInputElement>(null);
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div key="search-wrap" className="relative">
        <input
          ref={inputref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
          className="w-full border rounded pl-3 pr-7 py-2 text-sm"
          aria-label="search"
          placeholder={placeholder}
        />
        {/* 입력값 지우기 */}
        {value && (
          <button
            type="button"
            aria-label="clear"
            onClick={() => onChange("")}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
          ></button>
        )}
      </div>
    </div>
  );
}
