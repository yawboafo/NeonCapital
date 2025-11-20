"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Transfer() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("transfer");
  const [transferType, setTransferType] = useState("own");
  const [selectedAccount, setSelectedAccount] = useState("checking");

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
          <Link href="/dashboard/transfer" onClick={() => setActiveNav("transfer")} className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium">
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
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Transfer</h2>
            
            {/* Select Payer */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select payer</label>
              <select 
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border-none"
              >
                <option value="checking">Checking Account</option>
                <option value="savings">Savings Account</option>
                <option value="budget">Budget Account</option>
              </select>
            </div>

            {/* Account Card */}
            <div className="bg-gray-900 text-white rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Checking Account</h3>
              <div className="mb-2">
                <p className="text-sm text-gray-400">Balance</p>
                <p className="text-3xl font-bold">USD 10,000.00</p>
              </div>
              <div className="border-t border-gray-700 pt-4 mt-4">
                <p className="text-sm text-gray-400 mb-1">IBAN</p>
                <p className="font-medium">AB11 0000 0000 1111 1111</p>
                <p className="text-sm text-gray-400 mt-3 mb-1">Account owner</p>
                <p className="font-medium">Nicola Rich</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full py-3 bg-purple-200 text-gray-900 rounded-lg font-medium hover:bg-purple-300 transition flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share IBAN
              </button>
              <button className="w-full py-3 bg-orange-200 text-gray-900 rounded-lg font-medium hover:bg-orange-300 transition flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Request payment
              </button>
            </div>

            {/* Saved Beneficiaries */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Saved Beneficiaries</h3>
                <button className="text-blue-600 text-sm hover:underline">View all</button>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">➕</span>
                  </div>
                  <p className="text-xs text-gray-600">Add New</p>
                </div>
                {["MP", "LS", "OW"].map((initials, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold mb-2">
                      {initials}
                    </div>
                    <p className="text-xs text-gray-600">{["Maria Purple", "Leonard Smith", "Oscar Wild"][i]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Transfer to</h2>
            
            {/* Transfer Type Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setTransferType("own")}
                className={`px-6 py-2 rounded-lg font-medium ${
                  transferType === "own" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Own account
              </button>
              <button
                onClick={() => setTransferType("other")}
                className={`px-6 py-2 rounded-lg font-medium ${
                  transferType === "other" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Other account
              </button>
            </div>

            {/* Transfer Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beneficiary</label>
                <input
                  type="text"
                  placeholder="IBAN *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                <input
                  type="text"
                  placeholder="USD 0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Other Data Dropdown */}
              <details className="border border-gray-300 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700">Other data</summary>
                <div className="p-4 space-y-4 border-t border-gray-300">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Transfer purpose"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Beneficiary's name"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Beneficiary's email"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Payer's reference"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <textarea
                    placeholder="Information for beneficiary"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </details>

              <button className="w-full py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition mt-6">
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}