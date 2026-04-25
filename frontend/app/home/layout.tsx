import Navbar from "@/components/layout/Navbar"
import React from "react";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-slate-50">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] -left-32 w-64 h-64 border-32 border-indigo-200/40 rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-32 h-32 bg-rippl-500/10 rounded-xl" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-12 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}