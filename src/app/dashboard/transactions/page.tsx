"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Transactions() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("transactions");
  const [filterTab, setFilterTab] = useState("all");
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
      const [accountsRes, transactionsRes] = await Promise.all([
        fetch(`/api/accounts?userId=${userId}`),
        fetch(`/api/transactions?userId=${userId}`)
      ]);

      const accountsData = await accountsRes.json();
      const transactionsData = await transactionsRes.json();

      if (accountsData.success) {
        setAccounts(accountsData.accounts || []);
        if (accountsData.accounts.length > 0) {
          setSelectedAccount(accountsData.accounts[0]._id);
        }
      }

      if (transactionsData.success) {
        setTransactions(transactionsData.transactions || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const getSelectedAccountDetails = () => {
    return accounts.find(acc => acc._id === selectedAccount) || null;
  };

  const getCategoryIcon = (category: string) => {
    const icons: any = {
      'Transfer': '💸',
      'Groceries': '🛒',
      'Food': '🍔',
      'Salary': '💰',
      'Shopping': '🛍️',
      'Transport': '🚗',
      'Entertainment': '🎬',
      'Bills': '📄',
      'Healthcare': '🏥',
      'Education': '📚'
    };
    return icons[category] || '💳';
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      'Transfer': 'bg-violet-100',
      'Groceries': 'bg-emerald-100',
      'Food': 'bg-orange-100',
      'Salary': 'bg-green-100',
      'Shopping': 'bg-pink-100',
      'Transport': 'bg-blue-100',
      'Entertainment': 'bg-purple-100',
      'Bills': 'bg-slate-100',
      'Healthcare': 'bg-red-100',
      'Education': 'bg-indigo-100'
    };
    return colors[category] || 'bg-slate-100';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  const groupTransactionsByDate = (transactions: any[]) => {
    const grouped: any = {};
    transactions.forEach(transaction => {
      const dateKey = formatDate(transaction.date || transaction.createdAt);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    return grouped;
  };

  const accountTransactions = selectedAccount 
    ? transactions.filter(t => t.accountId === selectedAccount)
    : transactions;

  const filteredTransactions = accountTransactions.filter(t => {
    const matchesFilter = filterTab === "all" || 
                         (filterTab === "expenses" && t.type === "expense") ||
                         (filterTab === "income" && t.type === "income");
    const matchesSearch = !searchQuery || 
                         t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const calculateStats = () => {
    const accountDetails = getSelectedAccountDetails();
    if (!accountDetails) return { balance: 0, available: 0, income: 0, expenses: 0 };

    const accountTxns = transactions.filter(t => t.accountId === selectedAccount);
    const income = accountTxns.filter(t => t.type === 'income' && t.status !== 'failed').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const expenses = accountTxns.filter(t => t.type === 'expense' && t.status !== 'failed').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return {
      balance: accountDetails.balance || 0,
      available: accountDetails.balance || 0,
      income,
      expenses
    };
  };

  const stats = calculateStats();
  const accountDetails = getSelectedAccountDetails();

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
          <p className="text-slate-600 font-medium">Loading transactions...</p>
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
              <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
              <p className="text-slate-500 text-sm">View and manage your transaction history</p>
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
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Account Info */}
              <div className="space-y-6">
                {/* Account Selector */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Account</label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border-none appearance-none cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                      {accounts.map(account => (
                        <option key={account._id} value={account._id}>
                          {account.accountName} - {formatCurrency(account.balance, account.currency)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {accountDetails && (
                  <>
                    {/* Account Card */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Current Balance</p>
                          <p className="text-3xl font-bold">{formatCurrency(stats.balance, accountDetails.currency)}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider">Income</p>
                          </div>
                          <p className="text-lg font-semibold text-emerald-400">{formatCurrency(stats.income, accountDetails.currency)}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider">Expenses</p>
                          </div>
                          <p className="text-lg font-semibold text-red-400">{formatCurrency(stats.expenses, accountDetails.currency)}</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <div>
                          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Account</p>
                          <p className="font-semibold">{accountDetails.accountName}</p>
                        </div>
                        {accountDetails.iban && (
                          <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">IBAN</p>
                            <p className="font-mono text-sm">{accountDetails.iban}</p>
                          </div>
                        )}
                        {accountDetails.accountNumber && (
                          <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Account Number</p>
                            <p className="font-mono">{accountDetails.accountNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                      <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Total Transactions</span>
                          <span className="font-semibold text-slate-900">{accountTransactions.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Income Count</span>
                          <span className="font-semibold text-emerald-600">{accountTransactions.filter(t => t.type === 'income').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Expense Count</span>
                          <span className="font-semibold text-red-600">{accountTransactions.filter(t => t.type === 'expense').length}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column - Transactions List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">Transaction History</h2>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                      <button
                        onClick={() => setFilterTab("all")}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                          filterTab === "all" 
                            ? "bg-white text-slate-900 shadow-sm" 
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        All ({accountTransactions.length})
                      </button>
                      <button
                        onClick={() => setFilterTab("expenses")}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                          filterTab === "expenses" 
                            ? "bg-white text-slate-900 shadow-sm" 
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Expenses ({accountTransactions.filter(t => t.type === 'expense').length})
                      </button>
                      <button
                        onClick={() => setFilterTab("income")}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                          filterTab === "income" 
                            ? "bg-white text-slate-900 shadow-sm" 
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Income ({accountTransactions.filter(t => t.type === 'income').length})
                      </button>
                    </div>

                    {/* Transactions List */}
                    <div className="space-y-6">
                      {filteredTransactions.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-slate-600 font-medium">No transactions found</p>
                          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
                        </div>
                      ) : (
                        Object.keys(groupedTransactions).map((dateKey) => (
                          <div key={dateKey}>
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{dateKey}</h4>
                            <div className="space-y-2">
                              {groupedTransactions[dateKey].map((transaction: any) => (
                                <div 
                                  key={transaction._id} 
                                  className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100/50 rounded-xl transition-colors group"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${getCategoryColor(transaction.category)} rounded-xl flex items-center justify-center text-xl`}>
                                      {getCategoryIcon(transaction.category)}
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-900">{transaction.description}</p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-sm text-slate-500">{transaction.category}</span>
                                        {transaction.reference && (
                                          <>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="text-xs text-slate-400">Ref: {transaction.reference}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className={`font-semibold ${transaction.type === 'income' ? "text-emerald-600" : "text-slate-900"}`}>
                                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, accountDetails?.currency)}
                                    </p>
                                    <p className={`text-xs mt-1 font-medium ${
                                      transaction.status === 'success' ? 'text-emerald-600' :
                                      transaction.status === 'pending' ? 'text-amber-600' :
                                      transaction.status === 'failed' ? 'text-red-600' : 'text-emerald-600'
                                    }`}>
                                      {transaction.status === 'success' ? '✓ Success' : 
                                       transaction.status === 'pending' ? '◌ Pending' : 
                                       transaction.status === 'failed' ? '✕ Failed' : '✓ Success'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
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
