"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardSidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

export default function DashboardSidebar({ activeNav, onNavChange }: DashboardSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push("/");
  };

  return (
    <aside className="w-64 bg-blue-600 fixed h-full flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <Link 
          href="/dashboard" 
          onClick={() => onNavChange("dashboard")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeNav === "dashboard" 
              ? "bg-white bg-opacity-20 text-white" 
              : "text-white text-opacity-80 hover:bg-white hover:bg-opacity-10"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Overview</span>
        </Link>
        <Link 
          href="/dashboard/accounts"
          onClick={() => onNavChange("accounts")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeNav === "accounts" 
              ? "bg-white bg-opacity-20 text-white" 
              : "text-white text-opacity-80 hover:bg-white hover:bg-opacity-10"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Accounts</span>
        </Link>
        <Link 
          href="/dashboard/transfer"
          onClick={() => onNavChange("transfer")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeNav === "transfer" 
              ? "bg-white bg-opacity-20 text-white" 
              : "text-white text-opacity-80 hover:bg-white hover:bg-opacity-10"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>Transfers</span>
        </Link>
        <Link 
          href="/dashboard/transactions"
          onClick={() => onNavChange("transactions")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeNav === "transactions" 
              ? "bg-white bg-opacity-20 text-white" 
              : "text-white text-opacity-80 hover:bg-white hover:bg-opacity-10"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Statements</span>
        </Link>
        <Link 
          href="/dashboard/accounts"
          onClick={() => onNavChange("cards")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeNav === "cards" 
              ? "bg-white bg-opacity-20 text-white" 
              : "text-white text-opacity-80 hover:bg-white hover:bg-opacity-10"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Cards</span>
        </Link>
        <Link 
          href="/dashboard/investments"
          onClick={() => onNavChange("investments")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeNav === "investments" 
              ? "bg-white bg-opacity-20 text-white" 
              : "text-white text-opacity-80 hover:bg-white hover:bg-opacity-10"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>Transactions</span>
        </Link>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 space-y-1 border-t border-white border-opacity-10">
        <Link 
          href="/dashboard/settings"
          onClick={() => onNavChange("settings")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeNav === "settings" 
              ? "bg-white bg-opacity-20 text-white" 
              : "text-white text-opacity-80 hover:bg-white hover:bg-opacity-10"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </Link>
        <Link 
          href="/dashboard/profile"
          onClick={() => onNavChange("profile")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeNav === "profile" 
              ? "bg-white bg-opacity-20 text-white" 
              : "text-white text-opacity-80 hover:bg-white hover:bg-opacity-10"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profile</span>
        </Link>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 text-white text-opacity-80 hover:bg-white hover:bg-opacity-10 rounded-lg w-full text-left font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
