"use client";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function Navbar() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-stone-200 z-50">
      <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">

        <Link href="/home" className="inline-flex items-center gap-4 group">
          <div className="w-12 h-12 bg-rippl-600 rounded-2xl flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-all duration-300 shadow-lg shadow-rippl-200">
            <span className="text-white font-black text-2xl italic tracking-tighter">R</span>
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
              rippl.
            </span>
            <span className="text-[10px] font-bold text-rippl-600 uppercase tracking-[0.2em]">
              The Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-black text-slate-900">{isLoading ? "..." : `@${user?.username || "guest"}`}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rippl-600">En ligne</p>
          </div>

          <button
            onClick={signOut}
            className="rippl-btn-outline font-black uppercase tracking-wider"
          >
            Quitter
          </button>
        </div>
      </div>
    </nav>
  );
}