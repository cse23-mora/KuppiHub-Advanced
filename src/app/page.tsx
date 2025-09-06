// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Faculty from "./faculty/page";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // client-only check to see if user chose auto-redirect previously
    if (typeof window === "undefined") return;

    const savedPref = localStorage.getItem("autoRedirectModules");
    const lastURL = localStorage.getItem("lastModuleURL");

    if (savedPref === "true" && lastURL) {
      // use replace so "/" doesn't stay in history (optional)
      router.replace(lastURL);
    }
  }, [router]);

  // render Faculty as before — checkbox & preference lives in modules page
  return <Faculty />;
}
