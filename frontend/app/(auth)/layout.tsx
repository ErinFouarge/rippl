import Link from "next/link";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-rippl-200 relative overflow-hidden">
      <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[120%] bg-rippl-600/10 -rotate-6 pointer-events-none hidden lg:block" />

      <div className="absolute -top-20 -right-20 w-80 h-80 bg-rippl-500 rounded-full pointer-events-none shadow-2xl shadow-rippl-200/50" />

      <div className="absolute -bottom-10 left-[10%] w-32 h-32 bg-indigo-400 rotate-45 pointer-events-none opacity-40 hidden md:block" />

      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-none xl:flex">
        <div className="w-24 h-4 bg-rippl-200 rounded-l-full" />
        <div className="w-40 h-4 bg-rippl-400 rounded-l-full" />
        <div className="w-16 h-4 bg-rippl-300 rounded-l-full" />
      </div>

      <header className="w-full max-w-7xl mx-auto px-10 py-10 z-20">
        <Link href="/" className="inline-flex items-center gap-4 group">
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
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 z-20">
        <div className="w-full max-w-100 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {children}
        </div>
      </main>

      <footer className="w-full py-10 px-10 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-8 bg-rippl-500" />
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            © 2026 Rippl
          </p>
        </div>

        <div className="flex gap-2 sm:flex">
          <div className="w-3 h-3 bg-rippl-400 rounded-full" />
          <div className="w-3 h-3 bg-rippl-300 rounded-full opacity-50" />
          <div className="w-3 h-3 bg-rippl-200 rounded-full opacity-25" />
        </div>
      </footer>
    </div>
  );
}