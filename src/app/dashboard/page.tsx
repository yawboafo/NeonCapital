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
  const [showTaxInfoModal, setShowTaxInfoModal] = useState(false);
  const [transferForm, setTransferForm] = useState({
    accountId: '',
    recipientName: '',
    recipientAccount: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchUserData(parsedUser._id);
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const userRes = await fetch(`/api/users?userId=${userId}`);
      const userData = await userRes.json();
      if (userData.success && userData.users && userData.users.length > 0) {
        const freshUser = userData.users[0];
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      }

      const accountsRes = await fetch(`/api/accounts?userId=${userId}`);
      const accountsData = await accountsRes.json();
      setAccounts(accountsData.accounts || []);

      const transactionsRes = await fetch(`/api/transactions?userId=${userId}`);
      const transactionsData = await transactionsRes.json();
      setTransactions(transactionsData.transactions || []);

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
      .filter(t => t.type === 'expense' && t.status !== 'failed')
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
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      return t.type === 'expense' && 
             t.status !== 'failed' &&
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const categoryMap: { [key: string]: { label: string; color: string; keywords: string[] } } = {
      'groceries': { label: 'Groceries & Food', color: 'bg-blue-500', keywords: ['grocery', 'groceries', 'food', 'restaurant', 'dining', 'supermarket', 'market'] },
      'bills': { label: 'Bills & Utilities', color: 'bg-emerald-500', keywords: ['bill', 'bills', 'utility', 'utilities', 'electricity', 'water', 'gas', 'internet', 'phone'] },
      'shopping': { label: 'Shopping & Retail', color: 'bg-purple-500', keywords: ['shopping', 'retail', 'clothing', 'fashion', 'store', 'mall', 'purchase'] },
      'entertainment': { label: 'Entertainment', color: 'bg-amber-500', keywords: ['entertainment', 'movie', 'cinema', 'game', 'sport', 'subscription', 'streaming', 'netflix', 'spotify'] },
      'transport': { label: 'Transport', color: 'bg-rose-500', keywords: ['transport', 'transportation', 'uber', 'taxi', 'gas', 'fuel', 'parking', 'bus', 'train'] },
      'other': { label: 'Other', color: 'bg-slate-500', keywords: [] }
    };

    const categoryTotals: { [key: string]: number } = {};
    let totalExpenses = 0;

    monthlyExpenses.forEach(t => {
      const amount = Math.abs(t.amount || 0);
      totalExpenses += amount;

      let categoryKey = 'other';
      const searchText = `${t.category || ''} ${t.merchantName || ''} ${t.description || ''}`.toLowerCase();

      for (const [key, config] of Object.entries(categoryMap)) {
        if (key === 'other') continue;
        if (config.keywords.some(keyword => searchText.includes(keyword))) {
          categoryKey = key;
          break;
        }
      }

      if (t.category) {
        const categoryLower = t.category.toLowerCase();
        if (categoryMap[categoryLower]) {
          categoryKey = categoryLower;
        }
      }

      categoryTotals[categoryKey] = (categoryTotals[categoryKey] || 0) + amount;
    });

    const spendingData = Object.entries(categoryTotals)
      .map(([key, amount]) => ({
        label: categoryMap[key].label,
        amount,
        percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        color: categoryMap[key].color
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          accountId: transferForm.accountId,
          recipientName: transferForm.recipientName,
          recipientAccount: transferForm.recipientAccount,
          recipientIban: transferForm.recipientAccount,
          amount: parseFloat(transferForm.amount),
          description: transferForm.description || 'Quick transfer',
          status: 'Completed',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Transfer successful!');
        setShowTransferModal(false);
        setTransferForm({ accountId: '', recipientName: '', recipientAccount: '', amount: '', description: '' });
        if (user) fetchUserData(user._id);
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 fixed h-full flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">NeonCapital</h1>
              <p className="text-xs text-slate-500">Banking Dashboard</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Menu</p>
          {[
            { id: 'dashboard', label: 'Overview', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'accounts', label: 'Accounts', href: '/dashboard/accounts', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
            { id: 'transfer', label: 'Transfers', href: '/dashboard/transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
            { id: 'transactions', label: 'Transactions', href: '/dashboard/transactions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { id: 'investments', label: 'Investments', href: '/dashboard/investments', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          ].map((item) => (
            <Link 
              key={item.id}
              href={item.href} 
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all \${
                activeNav === item.id 
                  ? "bg-blue-50 text-blue-600 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <svg className={`w-5 h-5 ${activeNav === item.id ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              <span>{item.label}</span>
              {activeNav === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</p>
          {[
            { id: 'support', label: 'Support', href: '/dashboard/support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
            { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
          ].map((item) => (
            <Link 
              key={item.id}
              href={item.href}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all \${
                activeNav === item.id 
                  ? "bg-blue-50 text-blue-600 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <svg className={`w-5 h-5 ${activeNav === item.id ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </Link>
          ))}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl w-full text-left font-medium transition-all mt-1"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        {user && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user.firstName}</h2>
                <p className="text-slate-500 mt-1">Here's your financial overview</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-semibold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Hold Warning */}
        {user?.showWarning && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Account on Hold</h3>
                <p className="text-red-700 mb-4 leading-relaxed">
                  {user?.warningMessage || 'Your account is currently on hold pending tax payment. Please contact support to resolve this issue and restore full account access.'}
                </p>
                <div className="flex gap-3">
                  <Link 
                    href="/dashboard/support"
                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/25"
                  >
                    Contact Support
                  </Link>
                  <button 
                    onClick={() => setShowTaxInfoModal(true)}
                    className="px-5 py-2.5 bg-white border border-red-200 text-red-700 rounded-xl font-medium hover:bg-red-50 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-slate-600">Total Balance</h3>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">{accounts.length} Accounts</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-6">{formatCurrency(calculateTotalBalance())}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-xl px-4 py-3">
                <p className="text-emerald-600 text-xs font-medium mb-1">Income</p>
                <p className="font-bold text-emerald-700">{formatCurrency(calculateTotalIncome())}</p>
              </div>
              <div className="bg-rose-50 rounded-xl px-4 py-3">
                <p className="text-rose-600 text-xs font-medium mb-1">Expenses</p>
                <p className="font-bold text-rose-700">{formatCurrency(calculateTotalExpenses())}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-slate-600">Investments</h3>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold">{investments.length} Assets</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-3">{formatCurrency(calculateInvestmentValue())}</p>
            {investments.length > 0 ? (
              <>
                <div className={`flex items-center gap-2 mb-4 ${calculateInvestmentGain().gain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={calculateInvestmentGain().gain >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                  </svg>
                  <span className="font-semibold">{calculateInvestmentGain().gainPercent >= 0 ? '+' : ''}{calculateInvestmentGain().gainPercent.toFixed(2)}%</span>
                  <span className="text-sm font-medium">{calculateInvestmentGain().gain >= 0 ? '+' : ''}{formatCurrency(calculateInvestmentGain().gain)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl px-4 py-3">
                    <p className="text-slate-500 text-xs font-medium mb-1">Total Cost</p>
                    <p className="font-bold text-slate-700">{formatCurrency(calculateInvestmentGain().totalCost)}</p>
                  </div>
                  <div className={`rounded-xl px-4 py-3 ${calculateInvestmentGain().gain >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                    <p className={`text-xs font-medium mb-1 ${calculateInvestmentGain().gain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {calculateInvestmentGain().gain >= 0 ? 'Total Gain' : 'Total Loss'}
                    </p>
                    <p className={`font-bold ${calculateInvestmentGain().gain >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {formatCurrency(Math.abs(calculateInvestmentGain().gain))}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm">
                <p>No investments yet</p>
                <Link href="/dashboard/investments" className="text-blue-600 hover:text-blue-700 font-medium mt-1 inline-block">Add your first investment</Link>
              </div>
            )}
          </div>
        </div>

        {/* Transactions and Quick Transfer */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
              <Link href="/dashboard/transactions" className="text-blue-600 text-sm font-medium hover:text-blue-700">View all</Link>
            </div>
            <div className="flex gap-2 mb-6">
              {['all', 'expense', 'income'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {tab === 'all' ? 'All' : tab === 'expense' ? 'Expenses' : 'Income'}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {getRecentTransactions().length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="font-medium">No transactions yet</p>
                </div>
              ) : (
                getRecentTransactions()
                  .filter(t => activeTab === 'all' || t.type === activeTab)
                  .map((t) => {
                    const icons: any = { 'Groceries': '🛒', 'Restaurant': '🍽️', 'Shopping': '🛍️', 'Transport': '🚗', 'Utilities': '💡', 'Salary': '💰', 'Entertainment': '🎬', 'Healthcare': '��', 'Other': '📦' };
                    return (
                      <div key={t._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">{icons[t.category] || '📦'}</div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{t.merchantName || t.description}</p>
                            <p className="text-xs text-slate-500">{new Date(t.date || t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold text-sm ${t.type === 'income' ? "text-emerald-600" : "text-slate-900"}`}>
                            {t.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Quick Transfer</h3>
              <button onClick={() => setShowTransferModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-600/25">
                Transfer
              </button>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowTransferModal(true)} className="text-center group">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-2 group-hover:bg-slate-200 transition-colors border-2 border-dashed border-slate-300">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-xs text-slate-600 font-medium">Add</p>
              </button>
              {["MP", "LS", "OW", "KP"].map((initials, i) => (
                <button key={i} onClick={() => setShowTransferModal(true)} className="text-center group">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-2 text-white font-semibold text-sm group-hover:from-blue-600 group-hover:to-blue-700 transition-colors shadow-lg shadow-blue-500/25">
                    {initials}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{["Maria", "Leo", "Oscar", "Karen"][i]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Savings Goals</h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">Coming Soon</span>
            </div>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <p className="text-slate-900 font-semibold mb-2">Set Your Financial Goals</p>
              <p className="text-sm text-slate-500">Track savings for vacations, emergency funds, or major purchases</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Spending Overview</h3>
              <span className="text-xs text-slate-500 font-medium">This Month</span>
            </div>
            {(() => {
              const { spendingData, totalExpenses } = calculateSpendingByCategory();
              if (spendingData.length === 0) {
                return (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-medium mb-1">No expenses this month</p>
                    <p className="text-sm text-slate-500">Your spending will appear here</p>
                  </div>
                );
              }
              return (
                <>
                  <div className="space-y-4">
                    {spendingData.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="font-medium text-slate-700">{item.label}</span>
                          <span className="font-semibold text-slate-900">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className={`${item.color} rounded-full h-2 transition-all duration-500`} style={{ width: `${item.percent}%` }}></div>
                          </div>
                          <span className="text-xs font-semibold text-slate-500 w-10 text-right">{item.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Total Spending</span>
                      <span className="text-xl font-bold text-slate-900">{formatCurrency(totalExpenses)}</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </main>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Quick Transfer</h2>
              <button onClick={() => setShowTransferModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleQuickTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">From Account</label>
                <select
                  value={transferForm.accountId}
                  onChange={(e) => setTransferForm({...transferForm, accountId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>{account.accountType} - {formatCurrency(account.balance, account.currency)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Name</label>
                <input type="text" value={transferForm.recipientName} onChange={(e) => setTransferForm({...transferForm, recipientName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Account / IBAN</label>
                <input type="text" value={transferForm.recipientAccount} onChange={(e) => setTransferForm({...transferForm, recipientAccount: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="GB29 NWBK 6016 1331 9268 19" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                <input type="number" step="0.01" value={transferForm.amount} onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="0.00" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
                <input type="text" value={transferForm.description} onChange={(e) => setTransferForm({...transferForm, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Payment for..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTransferModal(false)} className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-600/25">Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tax Info Modal */}
      {showTaxInfoModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Account Hold - Tax Payment Required</h2>
                  <p className="text-slate-500 text-sm mt-1">Important information about your account status</p>
                </div>
              </div>
              <button onClick={() => setShowTaxInfoModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Why is my account on hold?</h3>
                <p className="text-red-800 leading-relaxed">Your account has been temporarily placed on hold due to outstanding tax obligations. This is a standard regulatory requirement to ensure compliance with financial regulations.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">What does this mean?</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span>You cannot make withdrawals or transfers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span>Some account features are restricted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>You can still view your account balance and transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Your funds remain safe and secure</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">How to resolve this?</h3>
                <p className="text-blue-800 mb-4 leading-relaxed">To restore full access to your account, please contact our support team. They will guide you through the tax payment process.</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-blue-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span className="font-medium">Phone: +447476937605</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="font-medium">Email: support@neonbankcapital.com</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowTaxInfoModal(false)} className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Close</button>
                <Link href="/dashboard/support" className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors text-center shadow-lg shadow-red-600/25">Contact Support Now</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
