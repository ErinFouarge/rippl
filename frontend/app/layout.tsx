import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import {Toaster} from "sonner";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Rippl",
  description: "Le réseau social épuré",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={dmSans.variable}>
    <body className="bg-stone-50 text-stone-900 antialiased">
      <Providers>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </Providers>
    </body>
    </html>
  );
}
