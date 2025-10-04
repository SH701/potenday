"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function SyncUser() {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;
    if (sessionStorage.getItem("user_synced")) return;

    fetch("/api/register", { method: "POST" })
      .then((res) => res.json())
      .then((data) => console.log("user synced:", data))
      .catch(console.error)
      .finally(() => sessionStorage.setItem("user_synced", "1"));
  }, [isSignedIn]);

  return null;
}
