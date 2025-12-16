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

  const navItems = [
    { id: "dashboard", label: "Overview", href: "/dashboard", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { id: "accounts", label: "Accounts", href: "/dashboard/accounts", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )},
    { id: "transfer", label: "Transfers", href: "/dashboard/transfer", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )},
    { id: "transactions", label: "Transactions", href: "/dashboard/transactions", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: "investments", label: "Investments", href: "/dashboard/investments", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )},
  ];

  const bottomItems = [
    { id: "support", label: "Support", href: "/dashboard/support", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { id: "settings", label: "Settings", href: "/dashboard/settings", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200/80 flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">NeonCapital</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group relative ${
                activeNav === item.id
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {activeNav === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
              )}
              <span className={activeNav === item.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Other</p>
          {bottomItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group relative ${
                activeNav === item.id
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {activeNav === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
              )}
              <span className={activeNav === item.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 w-full text-left text-slate-600 hover:bg-red-50 hover:text-red-600 group"
          >
            <span className="text-slate-400 group-hover:text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Accounts & Cards</h1>
              <p className="text-slate-500 text-sm">Manage your accounts and payment cards</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* My Accounts */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">My Accounts</h2>
                  <p className="text-slate-500 text-sm mt-1">Your bank accounts and balances</p>
                </div>
                <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg">
                  {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
                </span>
              </div>
              
              {accounts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">No accounts found</p>
                  <p className="text-slate-400 text-sm mt-1">Contact admin to create an account</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {accounts.map((account) => (
                    <div key={account._id} className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-lg font-semibold">{account.accountName}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{account.accountType}</p>
                          </div>
                          {account.interestRate && (
                            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              {account.interestRate}%
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-6">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Available Balance</p>
                          <p className="text-3xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
                        </div>
                        
                        <div className="space-y-3 pt-4 border-t border-white/10">
                          {account.iban && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">IBAN</span>
                              <span className="font-mono text-sm">{account.iban}</span>
                            </div>
                          )}
                          {account.accountNumber && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">Account</span>
                              <span className="font-mono">{account.accountNumber}</span>
                            </div>
                          )}
                          {account.sortCode && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">Sort Code</span>
                              <span className="font-mono">{account.sortCode}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">Owner</span>
                            <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* My Cards */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">My Cards</h2>
                  <p className="text-slate-500 text-sm mt-1">Your debit and credit cards</p>
                </div>
                <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg">
                  {cards.length} {cards.length === 1 ? 'card' : 'cards'}
                </span>
              </div>
              
              {cards.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">No cards found</p>
                  <p className="text-slate-400 text-sm mt-1">Contact admin to issue a card</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {cards.map((card, index) => {
                    const cardGradients = [
                      'from-amber-400 via-orange-400 to-orange-500',
                      'from-blue-400 via-blue-500 to-indigo-600',
                      'from-violet-400 via-purple-500 to-purple-600',
                      'from-emerald-400 via-teal-500 to-teal-600',
                    ];
                    const cardGradient = cardGradients[index % cardGradients.length];
                    
                    return (
                      <div key={card._id} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Card Visual */}
                        <div className={`bg-gradient-to-br ${cardGradient} rounded-2xl p-6 text-white shadow-xl aspect-[1.6/1] relative overflow-hidden`}>
                          {/* Pattern overlay */}
                          <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                          }}></div>
                          
                          <div className="relative h-full flex flex-col">
                            <div className="flex items-start justify-between mb-auto">
                              <div className="w-12 h-8 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md shadow-sm"></div>
                              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                </svg>
                              </div>
                            </div>
                            
                            <div className="mt-auto">
                              <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Daily Limit</p>
                              <p className="text-2xl font-bold mb-4">{formatCurrency(card.limit || 0)}</p>
                              <p className="font-mono text-lg tracking-widest mb-3">**** **** **** {card.cardNumber.slice(-4)}</p>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{card.cardHolderName}</p>
                                <p className="text-sm font-mono">{card.expiryDate}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">{card.cardType}</h3>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg ${
                              card.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                              card.status === 'Blocked' ? 'bg-amber-50 text-amber-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                card.status === 'Active' ? 'bg-emerald-500' :
                                card.status === 'Blocked' ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}></span>
                              {card.status}
                            </span>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Card Holder</p>
                              <p className="font-medium text-slate-900">{card.cardHolderName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Card Number</p>
                              <p className="font-mono text-slate-900">**** **** **** {card.cardNumber.slice(-4)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Expiry Date</p>
                                <p className="font-medium text-slate-900">{card.expiryDate}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">CVV</p>
                                <p className="font-medium text-slate-900">•••</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                            <button className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                              View Details
                            </button>
                            <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
                              Manage Card
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
