"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function SyncUser() {
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      console.log("🔒 Not signed in, skipping sync");
      return;
    }

    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("user_synced")
    ) {
      console.log("✓ User already synced in this session");
      return;
    }

    console.log("🔄 Syncing user:", userId);

    fetch("/api/register", { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("✅ User synced:", data);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("user_synced", "1");
        }
      })
      .catch((err) => {
        console.error("❌ User sync failed:", err);
      });
  }, [isSignedIn, userId]);

  return null;
}
