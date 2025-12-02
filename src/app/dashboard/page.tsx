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
    // Total Balance = Income - Expenses
    const income = calculateTotalIncome();
    const expenses = calculateTotalExpenses();
    return income - expenses;
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

  const calculateInvestmentGain = () => {
    const totalCost = investments.reduce((sum, inv) => 
      sum + ((inv.purchasePrice || 0) * (inv.quantity || 0)), 0
    );
    const currentValue = calculateInvestmentValue();
    const gain = currentValue - totalCost;
    const gainPercent = totalCost > 0 ? ((gain / totalCost) * 100) : 0;
    return { gain, gainPercent, totalCost };
  };

  const getRecentTransactions = () => {
    return transactions
      .sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt).getTime();
        const dateB = new Date(b.date || b.createdAt).getTime();
        return dateB - dateA;
      })
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 fixed h-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">NC</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">NeonCapital</h1>
          </div>
        </div>
        
        <nav className="space-y-1">
          <Link 
            href="/dashboard" 
            onClick={() => setActiveNav("dashboard")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeNav === "dashboard" 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-700 hover:bg-gray-100"
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
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeNav === "transfer" 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-700 hover:bg-gray-100"
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
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeNav === "transactions" 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-700 hover:bg-gray-100"
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
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeNav === "accounts" 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-700 hover:bg-gray-100"
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
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeNav === "investments" 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-700 hover:bg-gray-100"
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
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeNav === "settings" 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left font-medium transition-colors">
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName}
            </h2>
            <p className="text-gray-600 mt-1">Here's your financial overview</p>
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Total Balance Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Total Balance</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                {accounts.length} Accounts
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-6">
              {formatCurrency(calculateTotalBalance())}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg px-4 py-3">
                <p className="text-green-700 text-xs mb-1">Income</p>
                <p className="font-semibold text-green-900">
                  {formatCurrency(calculateTotalIncome())}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg px-4 py-3">
                <p className="text-red-700 text-xs mb-1">Expenses</p>
                <p className="font-semibold text-red-900">
                  {formatCurrency(calculateTotalExpenses())}
                </p>
              </div>
            </div>
          </div>

          {/* Total Investments Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Total Investments</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                {investments.length} Assets
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-3">
              {formatCurrency(calculateInvestmentValue())}
            </p>
            {investments.length > 0 ? (
              <>
                <div className={`flex items-center gap-2 mb-4 ${calculateInvestmentGain().gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {calculateInvestmentGain().gain >= 0 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    )}
                  </svg>
                  <span className="font-semibold text-lg">
                    {calculateInvestmentGain().gainPercent >= 0 ? '+' : ''}{calculateInvestmentGain().gainPercent.toFixed(2)}%
                  </span>
                  <span className="text-sm font-medium">
                    {calculateInvestmentGain().gain >= 0 ? '+' : ''}{formatCurrency(calculateInvestmentGain().gain)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg px-4 py-3">
                    <p className="text-blue-700 text-xs mb-1">Total Cost</p>
                    <p className="font-semibold text-blue-900">
                      {formatCurrency(calculateInvestmentGain().totalCost)}
                    </p>
                  </div>
                  <div className={`rounded-lg px-4 py-3 ${calculateInvestmentGain().gain >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className={`text-xs mb-1 ${calculateInvestmentGain().gain >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {calculateInvestmentGain().gain >= 0 ? 'Total Gain' : 'Total Loss'}
                    </p>
                    <p className={`font-semibold ${calculateInvestmentGain().gain >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                      {formatCurrency(Math.abs(calculateInvestmentGain().gain))}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                <p>No investments yet</p>
                <Link href="/dashboard/investments" className="text-blue-600 hover:underline mt-1 inline-block">
                  Add your first investment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Transactions and Quick Transfer Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <Link href="/dashboard/transactions" className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                View all
              </Link>
            </div>
            <div className="flex gap-2 mb-6 text-sm">
              <button onClick={() => setActiveTab("all")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                All
              </button>
              <button onClick={() => setActiveTab("expense")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "expense" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                Expenses
              </button>
              <button onClick={() => setActiveTab("income")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "income" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                Income
              </button>
            </div>
            <div className="space-y-3">
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
                      'Groceries': 'bg-purple-100',
                      'Restaurant': 'bg-blue-100',
                      'Shopping': 'bg-pink-100',
                      'Transport': 'bg-green-100',
                      'Utilities': 'bg-yellow-100',
                      'Salary': 'bg-orange-100',
                      'Entertainment': 'bg-indigo-100',
                      'Healthcare': 'bg-red-100',
                      'Other': 'bg-gray-100',
                    };
                    const categoryIcons: any = {
                      'Groceries': '🛒',
                      'Restaurant': '🍽️',
                      'Shopping': '🛍️',
                      'Transport': '🚗',
                      'Utilities': '💡',
                      'Salary': '💰',
                      'Entertainment': '🎬',
                      'Healthcare': '🏥',
                      'Other': '📦',
                    };
                    const bgColor = categoryColors[transaction.category] || 'bg-gray-100';
                    const icon = categoryIcons[transaction.category] || '📦';
                    
                    return (
                      <div key={transaction._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center text-lg`}>
                            {icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {transaction.merchantName || transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">{transaction.category}</p>
                            <p className="text-xs text-gray-400">{new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <span className={`font-semibold text-sm ${transaction.type === 'income' ? "text-green-600" : "text-gray-900"}`}>
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
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Quick Transfer</h3>
              <button 
                onClick={() => setShowTransferModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              >
                Transfer
              </button>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowTransferModal(true)}
                className="text-center group"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-gray-200 transition-colors">
                  <span className="text-2xl">➕</span>
                </div>
                <p className="text-xs text-gray-600">Add</p>
              </button>
              {["MP", "LS", "OW", "KP"].map((initials, i) => (
                <button 
                  key={i} 
                  onClick={() => setShowTransferModal(true)}
                  className="text-center group"
                >
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-2 text-white font-semibold group-hover:bg-blue-700 transition-colors">
                    {initials}
                  </div>
                  <p className="text-xs text-gray-600">{["Maria", "Leo", "Oscar", "Karen"][i]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Goals */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Savings Goals</h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">Coming Soon</span>
            </div>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <p className="text-gray-900 font-semibold mb-2">Set Your Financial Goals</p>
              <p className="text-sm text-gray-600">
                Track savings for vacations, emergency funds, or major purchases
              </p>
            </div>
          </div>

          {/* Spending Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Spending Overview</h3>
              <span className="text-xs text-gray-500">This Month</span>
            </div>
            {(() => {
              const { spendingData, totalExpenses } = calculateSpendingByCategory();
              
              if (spendingData.length === 0) {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-2">No expenses this month</p>
                    <p className="text-sm text-gray-500">Your spending will appear here once you make transactions</p>
                  </div>
                );
              }

              return (
                <>
                  <div className="space-y-4">
                    {spendingData.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="font-medium text-gray-700">{item.label}</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`${item.color} rounded-full h-2 transition-all duration-500`} 
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-500 w-10 text-right">{item.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Spending</span>
                      <span className="text-xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</span>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-xl">
            <button 
              onClick={() => setShowTransferModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Transfer</h2>
            
            <form onSubmit={handleQuickTransfer} className="space-y-4">
              {/* From Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Account
                </label>
                <select
                  value={transferForm.accountId}
                  onChange={(e) => setTransferForm({...transferForm, accountId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={transferForm.recipientName}
                  onChange={(e) => setTransferForm({...transferForm, recipientName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Recipient Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Account / IBAN
                </label>
                <input
                  type="text"
                  value={transferForm.recipientAccount}
                  onChange={(e) => setTransferForm({...transferForm, recipientAccount: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="GB29 NWBK 6016 1331 9268 19"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={transferForm.description}
                  onChange={(e) => setTransferForm({...transferForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Payment for..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
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