"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Show header only on non-dashboard pages */}
        {!isDashboard && (
          <header className="w-full bg-white shadow-lg dark:bg-black/90">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
              <div className="flex items-center gap-3">
                <img src="/bank-logo.svg" alt="Neon Capital Logo" width={56} height={56} />
                <span className="text-3xl font-extrabold text-blue-900 dark:text-blue-300 tracking-tight">Neon Capital</span>
              </div>
              <nav className="hidden lg:flex gap-10 text-base font-semibold">
                <a href="/" className="hover:text-blue-700 transition">Home</a>
                <a href="/products" className="hover:text-blue-700 transition">Products</a>
                <a href="/promotions" className="hover:text-blue-700 transition">Promotions</a>
                <a href="/about" className="hover:text-blue-700 transition">About</a>
                <a href="/education" className="hover:text-blue-700 transition">Education</a>
              </nav>
              <div className="flex gap-2">
                <a href="/login" className="px-6 py-2 rounded-full bg-blue-700 text-white font-bold shadow hover:bg-blue-800 transition">LOGIN</a>
              </div>
            </div>
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
