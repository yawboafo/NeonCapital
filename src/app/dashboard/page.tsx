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
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferForm, setTransferForm] = useState({
    accountId: '',
    recipientName: '',
    recipientAccount: '',
    amount: '',
    description: ''
  });

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

  const calculateSpendingByCategory = () => {
    // Get current month's expense transactions
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      return t.type === 'expense' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    // Define category mappings with colors
    const categoryMap: { [key: string]: { label: string; color: string; keywords: string[] } } = {
      'groceries': { 
        label: 'Groceries & Food', 
        color: 'bg-blue-600',
        keywords: ['grocery', 'groceries', 'food', 'restaurant', 'dining', 'supermarket', 'market']
      },
      'bills': { 
        label: 'Bills & Utilities', 
        color: 'bg-green-600',
        keywords: ['bill', 'bills', 'utility', 'utilities', 'electricity', 'water', 'gas', 'internet', 'phone']
      },
      'shopping': { 
        label: 'Shopping & Retail', 
        color: 'bg-purple-600',
        keywords: ['shopping', 'retail', 'clothing', 'fashion', 'store', 'mall', 'purchase']
      },
      'entertainment': { 
        label: 'Entertainment', 
        color: 'bg-yellow-600',
        keywords: ['entertainment', 'movie', 'cinema', 'game', 'sport', 'subscription', 'streaming', 'netflix', 'spotify']
      },
      'transport': { 
        label: 'Transport', 
        color: 'bg-red-600',
        keywords: ['transport', 'transportation', 'uber', 'taxi', 'gas', 'fuel', 'parking', 'bus', 'train']
      },
      'other': { 
        label: 'Other', 
        color: 'bg-gray-600',
        keywords: []
      }
    };

    // Calculate spending by category
    const categoryTotals: { [key: string]: number } = {};
    let totalExpenses = 0;

    monthlyExpenses.forEach(t => {
      const amount = Math.abs(t.amount || 0);
      totalExpenses += amount;

      // Determine category from transaction category or merchant name
      let categoryKey = 'other';
      const searchText = `${t.category || ''} ${t.merchantName || ''} ${t.description || ''}`.toLowerCase();

      for (const [key, config] of Object.entries(categoryMap)) {
        if (key === 'other') continue;
        if (config.keywords.some(keyword => searchText.includes(keyword))) {
          categoryKey = key;
          break;
        }
      }

      // Also check if transaction has explicit category
      if (t.category) {
        const categoryLower = t.category.toLowerCase();
        if (categoryMap[categoryLower]) {
          categoryKey = categoryLower;
        }
      }

      categoryTotals[categoryKey] = (categoryTotals[categoryKey] || 0) + amount;
    });

    // Convert to array and calculate percentages
    const spendingData = Object.entries(categoryTotals)
      .map(([key, amount]) => ({
        label: categoryMap[key].label,
        amount,
        percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        color: categoryMap[key].color
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 categories

    // If no expenses, return default message
    if (spendingData.length === 0) {
      return { spendingData: [], totalExpenses: 0 };
    }

    return { spendingData, totalExpenses };
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

  const handleQuickTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transferForm.accountId) {
      alert('Please select an account');
      return;
    }
    
    if (!transferForm.recipientName || !transferForm.recipientAccount) {
      alert('Please enter recipient details');
      return;
    }
    
    if (!transferForm.amount || parseFloat(transferForm.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: transferForm.accountId,
          recipientName: transferForm.recipientName,
          recipientAccount: transferForm.recipientAccount,
          amount: parseFloat(transferForm.amount),
          description: transferForm.description || 'Quick transfer',
          status: 'Completed',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Transfer successful!');
        setShowTransferModal(false);
        setTransferForm({
          accountId: '',
          recipientName: '',
          recipientAccount: '',
          amount: '',
          description: ''
        });
        // Refresh data
        if (user) {
          fetchUserData(user._id);
        }
      } else {
        alert(data.error || 'Transfer failed');
      }
    } catch (error) {
      console.error('Error processing transfer:', error);
      alert('Failed to process transfer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 p-6 fixed h-full shadow-xl">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">NC</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Neon Capital</h1>
          </div>
          {user && (
            <div className="ml-1">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
            </div>
          )}
        </div>
        
        <nav className="space-y-1">
          <Link 
            href="/dashboard" 
            onClick={() => setActiveNav("dashboard")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
              activeNav === "dashboard" 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" 
                : "text-gray-600 hover:bg-gray-100/80"
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
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
              activeNav === "transfer" 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" 
                : "text-gray-600 hover:bg-gray-100/80"
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
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
              activeNav === "transactions" 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" 
                : "text-gray-600 hover:bg-gray-100/80"
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
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
              activeNav === "accounts" 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" 
                : "text-gray-600 hover:bg-gray-100/80"
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
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
              activeNav === "investments" 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" 
                : "text-gray-600 hover:bg-gray-100/80"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Investments
          </Link>
        </nav>

        <div className="absolute bottom-8 space-y-2 w-52">
          <Link 
            href="/dashboard/settings"
            onClick={() => setActiveNav("settings")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
              activeNav === "settings" 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" 
                : "text-gray-600 hover:bg-gray-100/80"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl w-full text-left font-medium transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">

        {/* Welcome Message */}
        {user && (
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Welcome back, {user.firstName}!
            </h2>
            <p className="text-gray-600 mt-2 text-lg">Here's your financial overview</p>
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Total Balance Card */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 shadow-2xl shadow-blue-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-blue-100">Total Balance</h3>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
                  {accounts.length} Accounts
                </span>
              </div>
              <p className="text-5xl font-bold text-white mb-6">
                {formatCurrency(calculateTotalBalance())}
              </p>
              <div className="flex gap-8 text-sm">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex-1">
                  <p className="text-blue-100 mb-1 text-xs">Income</p>
                  <p className="font-bold text-green-300 text-lg">
                    {formatCurrency(calculateTotalIncome())}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex-1">
                  <p className="text-blue-100 mb-1 text-xs">Expenses</p>
                  <p className="font-bold text-red-300 text-lg">
                    {formatCurrency(calculateTotalExpenses())}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Investments Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-gray-700">Total Investments</h3>
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 rounded-full text-white text-xs font-medium">
                  {investments.length} Assets
                </span>
              </div>
              <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                {formatCurrency(calculateInvestmentValue())}
              </p>
              <div className="flex gap-1 items-end h-20 bg-gradient-to-t from-indigo-50 to-transparent rounded-xl p-2">
                {investments.length > 0 ? (
                  investments.slice(0, 12).map((inv, i) => {
                    const gain = ((inv.currentPrice - inv.purchasePrice) / inv.purchasePrice) * 100;
                    const height = Math.min(Math.max(gain + 50, 20), 100);
                    return (
                      <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t hover:from-indigo-700 hover:to-purple-600 transition-all" style={{ height: `${height}%` }}></div>
                    );
                  })
                ) : (
                  [30, 40, 35, 45, 50, 60, 55, 70, 65, 75, 80, 90].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-indigo-300 to-purple-300 rounded-t opacity-40" style={{ height: `${height}%` }}></div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions and Quick Transfer Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
              <Link href="/dashboard/transactions" className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                View all →
              </Link>
            </div>
            <div className="flex gap-2 mb-6 text-sm">
              <button onClick={() => setActiveTab("all")} className={`px-5 py-2 rounded-xl font-medium transition-all ${activeTab === "all" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                All
              </button>
              <button onClick={() => setActiveTab("expense")} className={`px-5 py-2 rounded-xl font-medium transition-all ${activeTab === "expense" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                Expenses
              </button>
              <button onClick={() => setActiveTab("income")} className={`px-5 py-2 rounded-xl font-medium transition-all ${activeTab === "income" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                Income
              </button>
            </div>
            <div className="space-y-3">
              {getRecentTransactions().length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <div className="text-5xl mb-3">💸</div>
                  <p className="text-gray-600 font-medium">No transactions yet</p>
                  <Link href="/dashboard/transactions" className="text-blue-600 text-sm font-medium hover:text-blue-700 mt-2 inline-block">
                    Add your first transaction →
                  </Link>
                </div>
              ) : (
                getRecentTransactions()
                  .filter(t => activeTab === 'all' || t.type === activeTab)
                  .map((transaction, i) => {
                    const categoryColors: any = {
                      'Groceries': 'from-purple-500 to-purple-600',
                      'Restaurant': 'from-blue-500 to-blue-600',
                      'Shopping': 'from-pink-500 to-pink-600',
                      'Transport': 'from-green-500 to-green-600',
                      'Utilities': 'from-yellow-500 to-yellow-600',
                      'Salary': 'from-orange-500 to-orange-600',
                      'Entertainment': 'from-indigo-500 to-indigo-600',
                      'Healthcare': 'from-red-500 to-red-600',
                      'Other': 'from-gray-500 to-gray-600',
                    };
                    const colorGradient = categoryColors[transaction.category] || 'from-gray-500 to-gray-600';
                    
                    return (
                      <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${colorGradient} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                            {transaction.type === 'income' ? "💰" : "🛍️"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {transaction.merchantName || transaction.description}
                            </p>
                            <p className="text-sm text-gray-500">{transaction.category}</p>
                          </div>
                        </div>
                        <span className={`font-bold text-lg ${transaction.type === 'income' ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </span>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Quick Transfer */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Quick Transfer</h3>
                <button 
                  onClick={() => setShowTransferModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/30"
                >
                  Transfer Now →
                </button>
              </div>
              <div className="flex gap-6">
                <button 
                  onClick={() => setShowTransferModal(true)}
                  className="text-center hover:scale-110 transition-transform"
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 hover:bg-white/30 transition-all">
                    <span className="text-3xl">➕</span>
                  </div>
                  <p className="text-sm font-medium">Add New</p>
                </button>
                {["MP", "LS", "OW", "KP"].map((initials, i) => (
                  <button 
                    key={i} 
                    onClick={() => setShowTransferModal(true)}
                    className="text-center hover:scale-110 transition-transform"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-2 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                      {initials}
                    </div>
                    <p className="text-sm font-medium">{["Maria", "Leonard", "Oscar", "Karen"][i]}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Goals */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Savings Goals</h3>
                <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">Coming Soon</span>
              </div>
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-4xl">🎯</span>
                </div>
                <p className="text-gray-900 font-bold text-lg mb-2">Set Your Financial Goals</p>
                <p className="text-gray-600">
                  Track savings for vacations, emergency funds, or major purchases
                </p>
              </div>
            </div>
          </div>

          {/* Spending Overview */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Spending Overview</h3>
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">This Month</span>
            </div>
            {(() => {
              const { spendingData, totalExpenses } = calculateSpendingByCategory();
              
              if (spendingData.length === 0) {
                return (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <div className="text-5xl mb-3">📊</div>
                    <p className="text-gray-900 font-semibold mb-2">No expenses this month</p>
                    <p className="text-sm text-gray-600">Your spending will appear here once you make transactions</p>
                  </div>
                );
              }

              return (
                <>
                  <div className="space-y-5">
                    {spendingData.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-gray-900">{item.label}</span>
                          <span className="font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                              className={`${item.color} rounded-full h-3 transition-all duration-700 shadow-md`} 
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 w-12 text-right">{item.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4">
                      <span className="font-bold text-gray-900">Total Spending</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{formatCurrency(totalExpenses)}</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </main>

      {/* Quick Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl">
            <button 
              onClick={() => setShowTransferModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-all"
            >
              ×
            </button>
            
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">💸</span>
              </div>
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">Quick Transfer</h2>
            </div>
            
            <form onSubmit={handleQuickTransfer} className="space-y-5">
              {/* From Account */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  From Account
                </label>
                <select
                  value={transferForm.accountId}
                  onChange={(e) => setTransferForm({...transferForm, accountId: e.target.value})}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-medium transition-all"
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.accountType} - {formatCurrency(account.balance, account.currency)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={transferForm.recipientName}
                  onChange={(e) => setTransferForm({...transferForm, recipientName: e.target.value})}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-medium transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Recipient Account */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Recipient Account / IBAN
                </label>
                <input
                  type="text"
                  value={transferForm.recipientAccount}
                  onChange={(e) => setTransferForm({...transferForm, recipientAccount: e.target.value})}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-medium transition-all"
                  placeholder="GB29 NWBK 6016 1331 9268 19"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-medium transition-all"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={transferForm.description}
                  onChange={(e) => setTransferForm({...transferForm, description: e.target.value})}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-medium transition-all"
                  placeholder="Payment for..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all shadow-lg shadow-blue-500/30"
                >
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}