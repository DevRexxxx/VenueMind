import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VenueMind Dashboard",
  description: "Multi-Agent Autonomous Operations Hub — FIFA World Cup 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex h-screen overflow-hidden font-sans text-white relative bg-[#05050A]">
        {/* Soft Radial Glows - Updated to Cyan/Blue */}
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pr-6 pb-6 no-scrollbar">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
