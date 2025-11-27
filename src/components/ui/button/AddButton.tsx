"use client";

import { useFormStatus } from "react-dom";

interface Props {
  text: string;
  className?: string;
}

export default function AddButton({ text, className }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      className={` ${className}`}
      type="submit"
      disabled={pending}
    >
      {pending ? "Loading..." : text}
    </button>
  );
}
