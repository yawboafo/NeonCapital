"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Accounts() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("accounts");

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 fixed h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Neon Capital</h1>
        </div>
        
        <nav className="space-y-2">
          <Link href="/dashboard" onClick={() => setActiveNav("dashboard")} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link href="/dashboard/transfer" onClick={() => setActiveNav("transfer")} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Transfer
          </Link>
          <Link href="/dashboard/transactions" onClick={() => setActiveNav("transactions")} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Transactions
          </Link>
          <Link href="/dashboard/accounts" onClick={() => setActiveNav("accounts")} className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Accounts and Cards
          </Link>
          <Link href="/dashboard/investments" onClick={() => setActiveNav("investments")} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Investments
          </Link>
        </nav>

        <div className="absolute bottom-8 space-y-2 w-52">
          <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Accounts and Cards</h2>

        {/* My Accounts */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">My accounts</h3>
          <div className="grid grid-cols-3 gap-6">
            {/* Checking Account */}
            <div className="bg-gray-900 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Checking Account</h4>
                <span className="text-cyan-400 text-sm">📈 2.36%</span>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Available balance</p>
                <p className="text-3xl font-bold">£10,000.00</p>
              </div>
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div>
                  <p className="text-sm text-gray-400">IBAN</p>
                  <p className="font-medium">AB11 0000 0000 1111 1111</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Account owner</p>
                  <p className="font-medium">Nicola Rich</p>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-purple-200 text-gray-900 rounded-lg font-medium hover:bg-purple-300 transition">
                See details
              </button>
            </div>

            {/* Savings Account */}
            <div className="bg-gray-900 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Savings Account</h4>
                <span className="text-cyan-400 text-sm">📈 2.36%</span>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Available balance</p>
                <p className="text-3xl font-bold">£8,000.00</p>
              </div>
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div>
                  <p className="text-sm text-gray-400">IBAN</p>
                  <p className="font-medium">AB11 0000 0000 1111 1111</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Account owner</p>
                  <p className="font-medium">Nicola Rich</p>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-purple-200 text-gray-900 rounded-lg font-medium hover:bg-purple-300 transition">
                See details
              </button>
            </div>

            {/* Budget Account */}
            <div className="bg-gray-900 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Budget Account</h4>
                <span className="text-cyan-400 text-sm">📈 2.36%</span>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Available balance</p>
                <p className="text-3xl font-bold">£2,000.00</p>
              </div>
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div>
                  <p className="text-sm text-gray-400">IBAN</p>
                  <p className="font-medium">AB11 0000 0000 1111 1111</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Account owner</p>
                  <p className="font-medium">Nicola Rich</p>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-purple-200 text-gray-900 rounded-lg font-medium hover:bg-purple-300 transition">
                See details
              </button>
            </div>
          </div>
        </div>

        {/* My Cards */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">My cards</h3>
          <div className="grid grid-cols-2 gap-8">
            {/* Credit Card */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-8 bg-yellow-300 rounded"></div>
                  <div className="text-2xl">💳</div>
                </div>
                <p className="text-sm mb-2">Available Balance</p>
                <p className="text-2xl font-bold mb-8">£10,000.00</p>
                <div className="space-y-1">
                  <p className="text-sm">1111 0000 1100 0000</p>
                  <div className="flex justify-between">
                    <p className="text-sm">Nicola Rich</p>
                    <p className="text-sm">12/24</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Credit Card</h4>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-medium text-gray-900">Physical</p>
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span> Active
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Card number</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-medium text-gray-900">1111 0000 1100 0000</p>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiration date</p>
                    <p className="font-medium text-gray-900 mt-1">12/24</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CVV</p>
                    <p className="font-medium text-gray-900 mt-1">***</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Debit Card */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-300 to-blue-400 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-8 bg-blue-200 rounded"></div>
                  <div className="text-2xl">💳</div>
                </div>
                <p className="text-sm mb-2">Available Balance</p>
                <p className="text-2xl font-bold mb-8">£8,500.00</p>
                <div className="space-y-1">
                  <p className="text-sm">1111 **** **** 0000</p>
                  <div className="flex justify-between">
                    <p className="text-sm">Nicola Rich</p>
                    <p className="text-sm">12/24</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Debit Card</h4>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-medium text-gray-900">Physical</p>
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span> Active
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Card number</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-medium text-gray-900">1111 **** **** 0000</p>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiration date</p>
                    <p className="font-medium text-gray-900 mt-1">12/24</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CVV</p>
                    <p className="font-medium text-gray-900 mt-1">***</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}