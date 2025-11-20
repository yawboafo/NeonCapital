"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch user's data
    fetchUserData(parsedUser._id);
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch accounts
      const accountsRes = await fetch(`/api/accounts?userId=${userId}`);
      const accountsData = await accountsRes.json();
      setAccounts(accountsData.accounts || []);

      // Fetch transactions for all user accounts
      const transactionsRes = await fetch(`/api/transactions?userId=${userId}`);
      const transactionsData = await transactionsRes.json();
      setTransactions(transactionsData.transactions || []);

      // Fetch investments
      const investmentsRes = await fetch(`/api/investments?userId=${userId}`);
      const investmentsData = await investmentsRes.json();
      setInvestments(investmentsData.investments || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const calculateTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  };

  const calculateTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  const calculateTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
  };

  const calculateInvestmentValue = () => {
    return investments.reduce((sum, inv) => 
      sum + ((inv.currentPrice || 0) * (inv.quantity || 0)), 0
    );
  };

  const getRecentTransactions = () => {
    return transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const formatCurrency = (amount: number, currency: string = 'GBP') => {
    const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    const numAmount = Math.abs(Number(amount) || 0);
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
        <div className="text-gray-600">Loading your dashboard...</div>
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
          <Link 
            href="/dashboard" 
            onClick={() => setActiveNav("dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
              activeNav === "dashboard" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link 
            href="/dashboard/transfer" 
            onClick={() => setActiveNav("transfer")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
              activeNav === "transfer" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Transfer
          </Link>
          <Link 
            href="/dashboard/transactions" 
            onClick={() => setActiveNav("transactions")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
              activeNav === "transactions" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Transactions
          </Link>
          <Link 
            href="/dashboard/accounts" 
            onClick={() => setActiveNav("accounts")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
              activeNav === "accounts" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Accounts and Cards
          </Link>
          <Link 
            href="/dashboard/investments" 
            onClick={() => setActiveNav("investments")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
              activeNav === "investments" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
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

        {/* Welcome Message */}
        {user && (
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName}!</h2>
            <p className="text-gray-600 mt-1">Here's your financial overview</p>
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Total Balance Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Total Balance</h3>
              <span className="text-cyan-600 text-sm">💰 {accounts.length} Accounts</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4">
              {formatCurrency(calculateTotalBalance())}
            </p>
            <div className="flex gap-8 text-sm">
              <div>
                <p className="text-gray-600 mb-1">▲ Income</p>
                <p className="font-semibold text-green-600">
                  {formatCurrency(calculateTotalIncome())}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">▼ Expenses</p>
                <p className="font-semibold text-red-600">
                  {formatCurrency(calculateTotalExpenses())}
                </p>
              </div>
            </div>
          </div>

          {/* Total Investments Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Total Investments</h3>
              <span className="text-cyan-600 text-sm">📈 {investments.length} Assets</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4">
              {formatCurrency(calculateInvestmentValue())}
            </p>
            <div className="flex gap-1 items-end h-16">
              {investments.length > 0 ? (
                investments.slice(0, 12).map((inv, i) => {
                  const gain = ((inv.currentPrice - inv.purchasePrice) / inv.purchasePrice) * 100;
                  const height = Math.min(Math.max(gain + 50, 20), 100);
                  return (
                    <div key={i} className="flex-1 bg-blue-300 rounded-t" style={{ height: `${height}%` }}></div>
                  );
                })
              ) : (
                [30, 40, 35, 45, 50, 60, 55, 70, 65, 75, 80, 90].map((height, i) => (
                  <div key={i} className="flex-1 bg-blue-300 rounded-t opacity-30" style={{ height: `${height}%` }}></div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Statistics and Transactions */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Statistics Chart */}
          <div className="col-span-2 bg-gray-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Statistics</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-white">
                  <span className="w-3 h-3 bg-pink-500 rounded-full"></span> Expenses
                </span>
                <span className="flex items-center gap-2 text-white">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span> Income
                </span>
                <select className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-700 text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
            </div>
            
            {/* Chart Grid Lines */}
            <div className="relative h-64">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-gray-800"></div>
                ))}
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-gray-500 text-xs -ml-8">
                <span>3K</span>
                <span>2K</span>
                <span>1K</span>
                <span>0</span>
              </div>
              
              {/* Bars */}
              <div className="relative h-full flex items-end justify-between gap-4 px-2">
                {[
                  { expenses: 65, income: 85 },
                  { expenses: 45, income: 92 },
                  { expenses: 58, income: 70 },
                  { expenses: 72, income: 48 },
                  { expenses: 52, income: 88 },
                  { expenses: 38, income: 62 },
                  { expenses: 78, income: 95 },
                ].map((day, i) => (
                  <div key={i} className="flex-1 flex gap-2 items-end h-full group">
                    <div 
                      className="flex-1 bg-gradient-to-t from-pink-500 to-pink-400 rounded-t-lg shadow-lg transition-all duration-300 hover:opacity-80 relative"
                      style={{ height: `${day.expenses}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        £{(day.expenses * 30).toFixed(0)}
                      </div>
                    </div>
                    <div 
                      className="flex-1 bg-gradient-to-t from-green-400 to-green-300 rounded-t-lg shadow-lg transition-all duration-300 hover:opacity-80 relative"
                      style={{ height: `${day.income}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        £{(day.income * 30).toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between mt-4 text-gray-400 text-xs px-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <Link href="/dashboard/transactions" className="text-blue-600 text-sm hover:underline">
                View all
              </Link>
            </div>
            <div className="flex gap-2 mb-6 text-sm">
              <button onClick={() => setActiveTab("all")} className={`px-4 py-1 rounded-full ${activeTab === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
                All
              </button>
              <button onClick={() => setActiveTab("expense")} className={`px-4 py-1 rounded-full ${activeTab === "expense" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
                Expenses
              </button>
              <button onClick={() => setActiveTab("income")} className={`px-4 py-1 rounded-full ${activeTab === "income" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
                Income
              </button>
            </div>
            <div className="space-y-4">
              {getRecentTransactions().length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No transactions yet</p>
                  <Link href="/dashboard/transactions" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                    Add your first transaction
                  </Link>
                </div>
              ) : (
                getRecentTransactions()
                  .filter(t => activeTab === 'all' || t.type === activeTab)
                  .map((transaction, i) => {
                    const categoryColors: any = {
                      'Groceries': 'bg-purple-200',
                      'Restaurant': 'bg-blue-200',
                      'Shopping': 'bg-pink-200',
                      'Transport': 'bg-green-200',
                      'Utilities': 'bg-yellow-200',
                      'Salary': 'bg-orange-200',
                      'Entertainment': 'bg-indigo-200',
                      'Healthcare': 'bg-red-200',
                      'Other': 'bg-gray-200',
                    };
                    const color = categoryColors[transaction.category] || 'bg-gray-200';
                    
                    return (
                      <div key={transaction._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-lg`}>
                            {transaction.type === 'income' ? "📤" : "🏪"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {transaction.merchantName || transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">{transaction.category}</p>
                          </div>
                        </div>
                        <span className={`font-semibold ${transaction.type === 'income' ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </span>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Goals */}
          <div className="bg-purple-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Goals</h3>
              <div className="flex gap-2">
                <button className="text-gray-600">◀</button>
                <button className="text-gray-600">▶</button>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">Summer Vacation</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl">✈️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">62% reached</p>
                <p className="text-sm text-gray-600">$1,485 out of $2,385</p>
              </div>
            </div>
          </div>

          {/* Spending Overview */}
          <div className="bg-orange-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Spending Overview</h3>
            <div className="space-y-3">
              {[
                { label: "Groceries", percent: 88 },
                { label: "Withdrawal", percent: 20 },
                { label: "Retail", percent: 10 },
                { label: "Leisure", percent: 2 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.percent}%</span>
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Transfer */}
          <div className="bg-gray-900 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Quick Transfer</h3>
              <div className="flex gap-2">
                <button className="text-gray-400">◀</button>
                <button className="text-gray-400">▶</button>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">➕</span>
                </div>
                <p className="text-xs">Add New</p>
              </div>
              {["MP", "LS", "OW", "KP"].map((initials, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center mb-2 text-white font-semibold">
                    {initials}
                  </div>
                  <p className="text-xs">{["Maria", "Leonard", "Oscar", "Karen"][i]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}