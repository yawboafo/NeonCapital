"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Investments() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("investments");

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
          <Link href="/dashboard/accounts" onClick={() => setActiveNav("accounts")} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Accounts and Cards
          </Link>
          <Link href="/dashboard/investments" onClick={() => setActiveNav("investments")} className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium">
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
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Investments</h2>

        {/* Investment Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total invested</p>
                <p className="text-2xl font-bold text-gray-900">$10,000.00</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">No. of investments</p>
                <p className="text-2xl font-bold text-gray-900">1,600</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rate of return</p>
                <p className="text-2xl font-bold text-gray-900">+4.75%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Yearly Total Investment */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Yearly total investment</h3>
            <div className="h-64 flex items-end justify-between gap-4">
              {[
                { year: "2017", value: 60 },
                { year: "2018", value: 45 },
                { year: "2019", value: 40 },
                { year: "2020", value: 80 },
                { year: "2021", value: 55 },
                { year: "2022", value: 65 },
              ].map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-300 rounded-t" style={{ height: `${data.value}%` }}></div>
                  <p className="text-xs text-gray-500 mt-2">{data.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Yearly Total Revenue */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Yearly total revenue</h3>
            <div className="h-64 flex items-end justify-between gap-4">
              {[
                { year: "2017", value: 25 },
                { year: "2018", value: 40 },
                { year: "2019", value: 55 },
                { year: "2020", value: 70 },
                { year: "2021", value: 80 },
                { year: "2022", value: 95 },
              ].map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-purple-300 rounded-t" style={{ height: `${data.value}%` }}></div>
                  <p className="text-xs text-gray-500 mt-2">{data.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Investment & Trending Stock */}
        <div className="grid grid-cols-2 gap-6">
          {/* My Investment */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">My investment</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🍎</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Apple Market</p>
                    <p className="text-sm text-gray-500">Ecommerce, Marketplace</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$200.00</p>
                  <p className="text-sm text-gray-500">Investment value</p>
                  <p className="text-sm text-red-600 font-semibold">-23%</p>
                  <p className="text-xs text-gray-500">Return value</p>
                </div>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🌿</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Greenery</p>
                    <p className="text-sm text-gray-500">Ecommerce, Marketplace</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$200.00</p>
                  <p className="text-sm text-gray-500">Investment value</p>
                  <p className="text-sm text-gray-600 font-semibold">0%</p>
                  <p className="text-xs text-gray-500">Return value</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Stock */}
          <div className="bg-gray-900 text-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">Trending stock</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-gray-400">Name</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-400">Price</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-400">Return</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Coinspace</td>
                    <td className="text-right py-3">$100</td>
                    <td className="text-right py-3 text-green-400">+10%</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">DocSign</td>
                    <td className="text-right py-3">$100</td>
                    <td className="text-right py-3 text-red-400">-8%</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Target & Co.</td>
                    <td className="text-right py-3">$100</td>
                    <td className="text-right py-3 text-green-400">+10%</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">MNL Bank</td>
                    <td className="text-right py-3">$100</td>
                    <td className="text-right py-3 text-green-400">+12%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}