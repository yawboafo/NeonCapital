"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Accounts() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("accounts");
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchData(parsedUser._id);
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const accountsRes = await fetch(`/api/accounts?userId=${userId}`);
      const accountsData = await accountsRes.json();
      setAccounts(accountsData.accounts || []);

      const cardsRes = await fetch(`/api/cards?userId=${userId}`);
      const cardsData = await cardsRes.json();
      setCards(cardsData.cards || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'GBP') => {
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    const numAmount = Number(amount) || 0;
    return `${symbol}${numAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading your accounts...</div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">My accounts</h3>
            <span className="text-sm text-gray-600">{accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}</span>
          </div>
          {accounts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 mb-2">No accounts found</p>
              <p className="text-sm text-gray-400">Contact admin to create an account</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div key={account._id} className="bg-gray-900 text-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">{account.accountName}</h4>
                    {account.interestRate && (
                      <span className="text-cyan-400 text-sm">📈 {account.interestRate}%</span>
                    )}
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-1">Available balance</p>
                    <p className="text-3xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
                    <p className="text-xs text-gray-400 mt-1">{account.accountType}</p>
                  </div>
                  <div className="border-t border-gray-700 pt-4 space-y-2">
                    {account.iban && (
                      <div>
                        <p className="text-sm text-gray-400">IBAN</p>
                        <p className="font-medium text-sm">{account.iban}</p>
                      </div>
                    )}
                    {account.accountNumber && (
                      <div>
                        <p className="text-sm text-gray-400">Account Number</p>
                        <p className="font-medium">{account.accountNumber}</p>
                      </div>
                    )}
                    {account.sortCode && (
                      <div>
                        <p className="text-sm text-gray-400">Sort Code</p>
                        <p className="font-medium">{account.sortCode}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Account owner</p>
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Cards */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">My cards</h3>
            <span className="text-sm text-gray-600">{cards.length} {cards.length === 1 ? 'card' : 'cards'}</span>
          </div>
          {cards.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 mb-2">No cards found</p>
              <p className="text-sm text-gray-400">Contact admin to issue a card</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              {cards.map((card, index) => {
                const cardColors = [
                  'from-orange-300 to-orange-400',
                  'from-blue-300 to-blue-400',
                  'from-purple-300 to-purple-400',
                  'from-green-300 to-green-400',
                ];
                const cardColor = cardColors[index % cardColors.length];
                
                return (
                  <div key={card._id} className="grid grid-cols-2 gap-6">
                    <div className={`bg-gradient-to-br ${cardColor} rounded-2xl p-6 text-white`}>
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-8 bg-white bg-opacity-30 rounded"></div>
                        <div className="text-2xl">💳</div>
                      </div>
                      <p className="text-sm mb-2">Daily Limit</p>
                      <p className="text-2xl font-bold mb-8">£{Number(card.limit || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <div className="space-y-1">
                        <p className="text-sm font-mono">**** **** **** {card.cardNumber.slice(-4)}</p>
                        <div className="flex justify-between">
                          <p className="text-sm">{card.cardHolderName}</p>
                          <p className="text-sm">{card.expiryDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">{card.cardType}</h4>
                      <div className="border-t border-gray-200 pt-4 space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 text-xs ${
                              card.status === 'Active' ? 'text-green-600' :
                              card.status === 'Blocked' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                card.status === 'Active' ? 'bg-green-600' :
                                card.status === 'Blocked' ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}></span> {card.status}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Card Holder</p>
                          <p className="font-medium text-gray-900 mt-1">{card.cardHolderName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Card number</p>
                          <p className="font-medium text-gray-900 mt-1 font-mono">**** **** **** {card.cardNumber.slice(-4)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expiration date</p>
                          <p className="font-medium text-gray-900 mt-1">{card.expiryDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">CVV</p>
                          <p className="font-medium text-gray-900 mt-1">***</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}