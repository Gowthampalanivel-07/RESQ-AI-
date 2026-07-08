"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-3xl bg-brand/10 border border-brand/20 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        </div>
        <p className="text-[10px] text-brand font-black uppercase tracking-[0.4em] animate-pulse">Initializing Tactical HUD...</p>
      </div>
    </div>
  );
}
