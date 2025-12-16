"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Investments() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("investments");
  const [user, setUser] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchInvestments(parsedUser._id);
  }, []);

  const fetchInvestments = async (userId: string) => {
    try {
      const response = await fetch(`/api/investments?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setInvestments(data.investments || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching investments:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push("/");
  };

  const formatCurrency = (amount: number, currency: string = 'GBP') => {
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    const numAmount = Number(amount) || 0;
    return `${symbol}${numAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateStats = () => {
    const totalInvested = investments.reduce((sum, inv) => sum + (Number(inv.purchasePrice) * Number(inv.quantity)), 0);
    const currentValue = investments.reduce((sum, inv) => sum + (Number(inv.currentPrice) * Number(inv.quantity)), 0);
    const totalReturn = currentValue - totalInvested;
    const returnRate = totalInvested > 0 ? ((totalReturn / totalInvested) * 100) : 0;

    return {
      totalInvested,
      totalCount: investments.length,
      returnRate,
      currentValue
    };
  };

  const calculateInvestmentReturn = (investment: any) => {
    const invested = Number(investment.purchasePrice) * Number(investment.quantity);
    const current = Number(investment.currentPrice) * Number(investment.quantity);
    const returnAmount = current - invested;
    const returnPercent = invested > 0 ? ((returnAmount / invested) * 100) : 0;
    return { returnAmount, returnPercent };
  };

  const getInvestmentIcon = (type: string) => {
    const icons: any = {
      'Stocks': '📈',
      'Bonds': '📊',
      'Crypto': '₿',
      'Real Estate': '🏠',
      'Mutual Funds': '💼',
      'ETF': '📉'
    };
    return icons[type] || '💰';
  };

  const stats = calculateStats();

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
          <p className="text-slate-600 font-medium">Loading investments...</p>
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
              <h1 className="text-2xl font-bold text-slate-900">Investments</h1>
              <p className="text-slate-500 text-sm">Track and manage your investment portfolio</p>
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
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Investment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Invested</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalInvested)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">No. of Investments</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${stats.returnRate >= 0 ? 'bg-emerald-50' : 'bg-red-50'} rounded-2xl flex items-center justify-center`}>
                    <svg className={`w-7 h-7 ${stats.returnRate >= 0 ? 'text-emerald-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Rate of Return</p>
                    <p className={`text-2xl font-bold ${stats.returnRate >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stats.returnRate >= 0 ? '+' : ''}{stats.returnRate.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Yearly Total Investment */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-semibold text-slate-900">Yearly Investment</h3>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-end justify-between gap-3">
                    {[
                      { year: "2019", value: 40 },
                      { year: "2020", value: 80 },
                      { year: "2021", value: 55 },
                      { year: "2022", value: 65 },
                      { year: "2023", value: 75 },
                      { year: "2024", value: 90 },
                    ].map((data, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center group">
                        <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg group-hover:from-blue-600 group-hover:to-blue-500 transition-all duration-300 shadow-sm" style={{ height: `${data.value}%` }}></div>
                        <p className="text-xs text-slate-500 mt-3 font-medium">{data.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Yearly Total Revenue */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-semibold text-slate-900">Yearly Revenue</h3>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-end justify-between gap-3">
                    {[
                      { year: "2019", value: 45 },
                      { year: "2020", value: 60 },
                      { year: "2021", value: 70 },
                      { year: "2022", value: 78 },
                      { year: "2023", value: 85 },
                      { year: "2024", value: 95 },
                    ].map((data, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center group">
                        <div className="w-full bg-gradient-to-t from-violet-500 to-violet-400 rounded-lg group-hover:from-violet-600 group-hover:to-violet-500 transition-all duration-300 shadow-sm" style={{ height: `${data.value}%` }}></div>
                        <p className="text-xs text-slate-500 mt-3 font-medium">{data.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* My Investment & Portfolio Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Investment */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">My Investments</h3>
                  <span className="px-2.5 py-1 bg-slate-200/70 text-slate-600 text-xs font-medium rounded-lg">{investments.length} holdings</span>
                </div>
                <div className="p-6">
                  {investments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <p className="text-slate-600 font-medium">No investments yet</p>
                      <p className="text-slate-400 text-sm mt-1">Start investing to build your portfolio</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {investments.map((investment, index) => {
                        const returns = calculateInvestmentReturn(investment);
                        const currentValue = Number(investment.currentPrice) * Number(investment.quantity);
                        const colors = ['bg-blue-100', 'bg-amber-100', 'bg-violet-100', 'bg-emerald-100', 'bg-pink-100'];
                        
                        return (
                          <div key={investment._id} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100/50 rounded-xl transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 ${colors[index % colors.length]} rounded-xl flex items-center justify-center`}>
                                <span className="text-xl">{getInvestmentIcon(investment.investmentType)}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{investment.investmentName}</p>
                                <p className="text-sm text-slate-500">{investment.investmentType}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Qty: {investment.quantity} @ {formatCurrency(investment.purchasePrice)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-900">{formatCurrency(currentValue)}</p>
                              <p className={`text-sm font-medium ${returns.returnPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {returns.returnPercent >= 0 ? '+' : ''}{returns.returnPercent.toFixed(2)}%
                              </p>
                              <p className="text-xs text-slate-400">{formatCurrency(returns.returnAmount)} return</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Portfolio Summary */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl shadow-xl overflow-hidden relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
                
                <div className="relative">
                  <div className="px-6 py-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold">Portfolio Summary</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-slate-400">Total Invested</span>
                        <span className="font-semibold text-lg">{formatCurrency(stats.totalInvested)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-slate-400">Current Value</span>
                        <span className="font-semibold text-lg">{formatCurrency(stats.currentValue)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-slate-400">Total Return</span>
                        <span className={`font-semibold text-lg ${(stats.currentValue - stats.totalInvested) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {(stats.currentValue - stats.totalInvested) >= 0 ? '+' : ''}{formatCurrency(stats.currentValue - stats.totalInvested)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-slate-400">Return Rate</span>
                        <span className={`font-semibold text-lg ${stats.returnRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stats.returnRate >= 0 ? '+' : ''}{stats.returnRate.toFixed(2)}%
                        </span>
                      </div>
                      
                      {investments.length > 0 && (
                        <div className="pt-4">
                          <h4 className="text-sm font-semibold mb-4 text-slate-300 uppercase tracking-wider">Investment Breakdown</h4>
                          <div className="space-y-3">
                            {investments.map((inv) => {
                              const percentage = stats.currentValue > 0 
                                ? ((Number(inv.currentPrice) * Number(inv.quantity)) / stats.currentValue * 100).toFixed(1)
                                : '0.0';
                              return (
                                <div key={inv._id} className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-slate-300">{inv.investmentName}</span>
                                      <span className="text-white font-medium">{percentage}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                      <div 
                                        className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
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
