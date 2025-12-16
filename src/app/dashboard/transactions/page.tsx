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

  const getCategoryColor = (index: number) => {
    const colors = ['bg-purple-200', 'bg-blue-200', 'bg-orange-200', 'bg-green-200', 'bg-pink-200', 'bg-yellow-200'];
    return colors[index % colors.length];
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading transactions...</div>
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
          <Link href="/dashboard/transactions" onClick={() => setActiveNav("transactions")} className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium">
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
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Transactions overview</h2>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Account Info */}
          <div className="space-y-6">
            {/* Account Selector */}
            <select 
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border-none"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              {accounts.map(account => (
                <option key={account._id} value={account._id}>
                  {account.accountName} - {formatCurrency(account.balance, account.currency)}
                </option>
              ))}
            </select>

            {accountDetails && (
              <>
                {/* Account Card */}
                <div className="bg-gray-900 text-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{accountDetails.accountName}</h3>
                    {accountDetails.interestRate && (
                      <span className="text-cyan-400 text-sm">📈 {accountDetails.interestRate}%</span>
                    )}
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-3xl font-bold">{formatCurrency(stats.balance, accountDetails.currency)}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Available</p>
                    <p className="text-xl font-semibold">{formatCurrency(stats.available, accountDetails.currency)}</p>
                  </div>
                  <div className="border-t border-gray-700 pt-4 mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">▲ Income</p>
                      <p className="font-semibold">{formatCurrency(stats.income, accountDetails.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">▼ Expenses</p>
                      <p className="font-semibold">{formatCurrency(stats.expenses, accountDetails.currency)}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-gray-400">
                    {accountDetails.iban && <p>IBAN: {accountDetails.iban}</p>}
                    {accountDetails.accountNumber && <p>Account: {accountDetails.accountNumber}</p>}
                  </div>
                </div>

                {/* Account Info Card */}
                <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-8 bg-yellow-300 rounded"></div>
                    <div className="text-2xl">💳</div>
                  </div>
                  <p className="text-sm mb-2">{accountDetails.accountType}</p>
                  <p className="text-2xl font-bold mb-8">{formatCurrency(accountDetails.balance, accountDetails.currency)}</p>
                  <div className="space-y-1">
                    {accountDetails.accountNumber && <p className="text-sm">Account: {accountDetails.accountNumber}</p>}
                    <div className="flex justify-between">
                      <p className="text-sm">{user?.firstName} {user?.lastName}</p>
                      {accountDetails.sortCode && <p className="text-sm">{accountDetails.sortCode}</p>}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Spending Overview */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Spending overview</h3>
                <div className="flex gap-2">
                  <button className="text-gray-400">◀</button>
                  <button className="text-gray-400">▶</button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
                <div className="h-40 flex items-end justify-between gap-2">
                  {[60, 45, 80, 95, 70, 55, 85].map((height, i) => (
                    <div key={i} className="flex-1 bg-blue-300 rounded-t" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Transactions List */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Transactions</h3>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setFilterTab("all")}
                  className={`px-6 py-2 rounded-full font-medium ${
                    filterTab === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  All ({accountTransactions.length})
                </button>
                <button
                  onClick={() => setFilterTab("expenses")}
                  className={`px-6 py-2 rounded-full font-medium ${
                    filterTab === "expenses" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Expenses ({accountTransactions.filter(t => t.type === 'expense').length})
                </button>
                <button
                  onClick={() => setFilterTab("income")}
                  className={`px-6 py-2 rounded-full font-medium ${
                    filterTab === "income" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Income ({accountTransactions.filter(t => t.type === 'income').length})
                </button>
              </div>

              {/* Transactions List */}
              <div className="space-y-6">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No transactions found</p>
                  </div>
                ) : (
                  Object.keys(groupedTransactions).map((dateKey, dateIndex) => (
                    <div key={dateKey}>
                      <h4 className="text-sm font-semibold text-gray-500 mb-3">{dateKey}</h4>
                      {groupedTransactions[dateKey].map((transaction: any, index: number) => (
                        <div key={transaction._id} className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 ${getCategoryColor(index)} rounded-full flex items-center justify-center text-xl`}>
                              {getCategoryIcon(transaction.category)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.category}</p>
                              {transaction.reference && (
                                <p className="text-xs text-gray-400">Ref: {transaction.reference}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${transaction.type === 'income' ? "text-green-600" : "text-red-600"}`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, accountDetails?.currency)}
                            </p>
                            <p className={`text-xs mt-1 font-medium ${
                              transaction.status === 'success' ? 'text-green-600' :
                              transaction.status === 'pending' ? 'text-yellow-600' :
                              transaction.status === 'failed' ? 'text-red-600' : 'text-gray-400'
                            }`}>
                              {transaction.status === 'success' ? 'Success' : 
                               transaction.status === 'pending' ? 'Pending' : 
                               transaction.status === 'failed' ? 'Failed' : 'Success'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}