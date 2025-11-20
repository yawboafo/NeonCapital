"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("users");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Neon Capital Management</p>
              </div>
            </div>
            <Link href="/dashboard" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              Back to User Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-white rounded-xl shadow-sm p-4 h-fit sticky top-8">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection("users")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === "users"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">👥</span>
                User Management
              </button>
              <button
                onClick={() => setActiveSection("accounts")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === "accounts"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">🏦</span>
                Bank Accounts
              </button>
              <button
                onClick={() => setActiveSection("transfers")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === "transfers"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">💸</span>
                Transfers
              </button>
              <button
                onClick={() => setActiveSection("transactions")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === "transactions"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">📊</span>
                Transactions
              </button>
              <button
                onClick={() => setActiveSection("investments")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === "investments"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">📈</span>
                Investments
              </button>
              <button
                onClick={() => setActiveSection("cards")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === "cards"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">💳</span>
                Cards
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {activeSection === "users" && <UserManagement />}
            {activeSection === "accounts" && <AccountManagement />}
            {activeSection === "transfers" && <TransferManagement />}
            {activeSection === "transactions" && <TransactionManagement />}
            {activeSection === "investments" && <InvestmentManagement />}
            {activeSection === "cards" && <CardManagement />}
          </main>
        </div>
      </div>
    </div>
  );
}

// User Management Component
function UserManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    dateOfBirth: '', nationality: '', address: '', city: '', postalCode: '',
    idType: 'Passport', idNumber: ''
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('User created successfully!');
        setShowCreateForm(false);
        setFormData({
          firstName: '', lastName: '', email: '', phone: '', password: '',
          dateOfBirth: '', nationality: '', address: '', city: '', postalCode: '',
          idType: 'Passport', idNumber: ''
        });
        fetchUsers();
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('User deleted successfully');
        fetchUsers();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      dateOfBirth: user.dateOfBirth || '',
      nationality: user.nationality || '',
      address: user.address || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      idType: user.idType || 'Passport',
      idNumber: user.idNumber || ''
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: any = { _id: editingUser._id, ...formData };
      
      // Don't send password if it's empty (user doesn't want to change it)
      if (!formData.password) {
        delete updateData.password;
      }

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        alert('User updated successfully!');
        setShowEditForm(false);
        setEditingUser(null);
        setFormData({
          firstName: '', lastName: '', email: '', phone: '', password: '',
          dateOfBirth: '', nationality: '', address: '', city: '', postalCode: '',
          idType: 'Passport', idNumber: ''
        });
        fetchUsers();
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setShowEditForm(false);
    setEditingUser(null);
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', password: '',
      dateOfBirth: '', nationality: '', address: '', city: '', postalCode: '',
      idType: 'Passport', idNumber: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setShowEditForm(false);
              setEditingUser(null);
              setFormData({
                firstName: '', lastName: '', email: '', phone: '', password: '',
                dateOfBirth: '', nationality: '', address: '', city: '', postalCode: '',
                idType: 'Passport', idNumber: ''
              });
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {showCreateForm ? "Cancel" : "+ Create New User"}
          </button>
        </div>

        {/* Edit User Form */}
        {showEditForm && (
          <form onSubmit={handleUpdateUser} className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User: {editingUser.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+44 20 1234 5678" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password (leave empty to keep current)</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="New Password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input type="text" value={formData.nationality} onChange={(e) => setFormData({...formData, nationality: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="United Kingdom" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="123 Main Street, London" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="London" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <input type="text" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="SW1A 1AA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Type</label>
                <select value={formData.idType} onChange={(e) => setFormData({...formData, idType: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Passport</option>
                  <option>Driver's License</option>
                  <option>National ID</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                <input type="text" value={formData.idNumber} onChange={(e) => setFormData({...formData, idNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="123456789" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400">
                {loading ? 'Updating...' : 'Update User'}
              </button>
              <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Create User Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateUser} className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+44 20 1234 5678" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input type="text" value={formData.nationality} onChange={(e) => setFormData({...formData, nationality: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="United Kingdom" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="123 Main Street, London" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="London" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <input type="text" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="SW1A 1AA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Type</label>
                <select value={formData.idType} onChange={(e) => setFormData({...formData, idType: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Passport</option>
                  <option>Driver's License</option>
                  <option>National ID</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                <input type="text" value={formData.idNumber} onChange={(e) => setFormData({...formData, idNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="123456789" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400">
                {loading ? 'Creating...' : 'Create User'}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Users List */}
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No users found. Create your first user above.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{user.name?.charAt(0) || 'U'}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-900 mr-3 font-medium">Edit</button>
                      <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Account Management Component
function AccountManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '', accountType: 'Checking Account', accountName: '', currency: 'GBP',
    balance: '', IBAN: '', sortCode: '', accountNumber: '', interestRate: ''
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      const data = await response.json();
      if (data.success) setAccounts(data.accounts);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Account created successfully!');
        setShowCreateForm(false);
        setFormData({ userId: '', accountType: 'Checking Account', accountName: '', currency: 'GBP', balance: '', IBAN: '', sortCode: '', accountNumber: '', interestRate: '' });
        fetchAccounts();
      } else {
        alert(data.error || 'Failed to create account');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setFormData({
      userId: account.userId || '',
      accountType: account.accountType || 'Checking Account',
      accountName: account.accountName || '',
      currency: account.currency || 'GBP',
      balance: account.balance?.toString() || '',
      IBAN: account.IBAN || '',
      sortCode: account.sortCode || '',
      accountNumber: account.accountNumber || '',
      interestRate: account.interestRate?.toString() || ''
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: editingAccount._id, ...formData }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Account updated successfully!');
        setShowEditForm(false);
        setEditingAccount(null);
        setFormData({ userId: '', accountType: 'Checking Account', accountName: '', currency: 'GBP', balance: '', IBAN: '', sortCode: '', accountNumber: '', interestRate: '' });
        fetchAccounts();
      } else {
        alert(data.error || 'Failed to update account');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to close this account?')) return;
    try {
      const response = await fetch(`/api/accounts?id=${accountId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        alert('Account closed successfully');
        fetchAccounts();
      } else {
        alert(data.error || 'Failed to close account');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown User';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bank Account Management</h2>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setShowEditForm(false);
              setEditingAccount(null);
              setFormData({ userId: '', accountType: 'Checking Account', accountName: '', currency: 'GBP', balance: '', IBAN: '', sortCode: '', accountNumber: '', interestRate: '' });
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {showCreateForm ? "Cancel" : "+ Create New Account"}
          </button>
        </div>

        {showEditForm && (
          <form onSubmit={handleUpdateAccount} className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Account</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select required value={formData.userId} onChange={(e) => setFormData({...formData, userId: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name} - {user.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <select value={formData.accountType} onChange={(e) => setFormData({...formData, accountType: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Checking Account</option>
                  <option>Savings Account</option>
                  <option>Investment Account</option>
                  <option>Budget Account</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                <input type="text" required value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Main Checking" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>GBP</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Balance</label>
                <input type="number" step="0.01" required value={formData.balance} onChange={(e) => setFormData({...formData, balance: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IBAN</label>
                <input type="text" value={formData.IBAN} onChange={(e) => setFormData({...formData, IBAN: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="GB29NWBK60161331926819" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Code</label>
                <input type="text" value={formData.sortCode} onChange={(e) => setFormData({...formData, sortCode: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="60-16-13" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input type="text" value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="31926819" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                <input type="number" step="0.01" value={formData.interestRate} onChange={(e) => setFormData({...formData, interestRate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400">
                {loading ? 'Updating...' : 'Update Account'}
              </button>
              <button type="button" onClick={() => { setShowEditForm(false); setEditingAccount(null); }} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {showCreateForm && (
          <form onSubmit={handleCreateAccount} className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Bank Account</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select User *</label>
                <select required value={formData.userId} onChange={(e) => setFormData({...formData, userId: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name} - {user.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <select value={formData.accountType} onChange={(e) => setFormData({...formData, accountType: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Checking Account</option>
                  <option>Savings Account</option>
                  <option>Investment Account</option>
                  <option>Budget Account</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
                <input type="text" required value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Main Checking" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>GBP</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Balance *</label>
                <input type="number" step="0.01" required value={formData.balance} onChange={(e) => setFormData({...formData, balance: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IBAN</label>
                <input type="text" value={formData.IBAN} onChange={(e) => setFormData({...formData, IBAN: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="GB29NWBK60161331926819" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Code</label>
                <input type="text" value={formData.sortCode} onChange={(e) => setFormData({...formData, sortCode: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="60-16-13" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input type="text" value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="31926819" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                <input type="number" step="0.01" value={formData.interestRate} onChange={(e) => setFormData({...formData, interestRate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400">
                {loading ? 'Creating...' : 'Create Account'}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Accounts List */}
        <div className="grid gap-4">
          {accounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No accounts found. Create your first account above.</p>
            </div>
          ) : (
            accounts.map((account) => (
              <div key={account._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{getUserName(account.userId)} - {account.accountType}</h4>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{account.currency === 'GBP' ? '£' : account.currency === 'USD' ? '$' : '€'}{parseFloat(account.balance).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{account.accountName}</p>
                    {account.IBAN && <p className="text-sm text-gray-500">IBAN: {account.IBAN}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditAccount(account)} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteAccount(account._id)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Transfer Management Component
function TransferManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    recipientName: "",
    recipientAccount: "",
    amount: "",
    currency: "GBP",
    type: "Domestic",
    status: "Pending",
  });

  useEffect(() => {
    fetchUsers();
    fetchTransfers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTransfers = async () => {
    try {
      const response = await fetch("/api/transfers");
      const data = await response.json();
      if (data.success) setTransfers(data.transfers);
    } catch (error) {
      console.error("Error fetching transfers:", error);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown";
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ userId: "", recipientName: "", recipientAccount: "", amount: "", currency: "GBP", type: "Domestic", status: "Pending" });
        setShowCreateForm(false);
        fetchTransfers();
      }
    } catch (error) {
      console.error("Error creating transfer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransfer = (transfer: any) => {
    setEditingTransfer(transfer);
    setFormData({
      userId: transfer.userId,
      recipientName: transfer.recipientName,
      recipientAccount: transfer.recipientAccount,
      amount: transfer.amount.toString(),
      currency: transfer.currency,
      type: transfer.type,
      status: transfer.status,
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransfer) return;
    setLoading(true);
    try {
      const response = await fetch("/api/transfers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transferId: editingTransfer._id, ...formData, amount: parseFloat(formData.amount) }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ userId: "", recipientName: "", recipientAccount: "", amount: "", currency: "GBP", type: "Domestic", status: "Pending" });
        setShowEditForm(false);
        setEditingTransfer(null);
        fetchTransfers();
      }
    } catch (error) {
      console.error("Error updating transfer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransfer = async (transferId: string) => {
    if (!confirm("Delete this transfer?")) return;
    try {
      const response = await fetch("/api/transfers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transferId }),
      });
      const data = await response.json();
      if (data.success) fetchTransfers();
    } catch (error) {
      console.error("Error deleting transfer:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Transfer Management</h2>
          <button
            onClick={() => { setShowCreateForm(!showCreateForm); setShowEditForm(false); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {showCreateForm ? "Cancel" : "+ Create New Transfer"}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateTransfer} className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Transfer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select User</option>
                  {users.map((user) => <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                <input type="text" value={formData.recipientName} onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Account</label>
                <input type="text" value={formData.recipientAccount} onChange={(e) => setFormData({ ...formData, recipientAccount: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Domestic">Domestic</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                {loading ? "Creating..." : "Create Transfer"}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </form>
        )}

        {showEditForm && editingTransfer && (
          <form onSubmit={handleUpdateTransfer} className="bg-blue-50 p-6 rounded-lg mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Transfer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select User</option>
                  {users.map((user) => <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                <input type="text" value={formData.recipientName} onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Account</label>
                <input type="text" value={formData.recipientAccount} onChange={(e) => setFormData({ ...formData, recipientAccount: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Domestic">Domestic</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                {loading ? "Updating..." : "Update Transfer"}
              </button>
              <button type="button" onClick={() => { setShowEditForm(false); setEditingTransfer(null); }} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          {transfers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No transfers found. Create one to get started.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transfers.map((transfer) => (
                  <tr key={transfer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getUserName(transfer.userId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{transfer.recipientName}</div>
                      <div className="text-xs text-gray-500">{transfer.recipientAccount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {transfer.currency === "GBP" && "£"}{transfer.currency === "USD" && "$"}{transfer.currency === "EUR" && "€"}
                      {transfer.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transfer.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transfer.status === "Completed" ? "bg-green-100 text-green-800" : transfer.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      }`}>
                        {transfer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(transfer.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEditTransfer(transfer)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button onClick={() => handleDeleteTransfer(transfer._id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Transaction Management Component
function TransactionManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Transaction Management</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {showCreateForm ? "Cancel" : "+ Add Transaction"}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Transaction</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>John Doe - Checking (£10,000.00)</option>
                  <option>John Doe - Savings (£8,000.00)</option>
                  <option>Jane Smith - Checking (£15,500.00)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Expense</option>
                  <option>Income</option>
                  <option>Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Groceries</option>
                  <option>Restaurant</option>
                  <option>Shopping</option>
                  <option>Transport</option>
                  <option>Utilities</option>
                  <option>Salary</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Store Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Date</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Transaction description" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Add Transaction
              </button>
              <button onClick={() => setShowCreateForm(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { date: "2025-11-19", account: "John Doe - Checking", merchant: "Tesco", category: "Groceries", amount: "-£92.50", type: "expense" },
                { date: "2025-11-19", account: "Jane Smith - Checking", merchant: "Amazon", category: "Shopping", amount: "-£156.00", type: "expense" },
                { date: "2025-11-18", account: "John Doe - Checking", merchant: "Salary Deposit", category: "Income", amount: "+£3,000.00", type: "income" },
              ].map((transaction, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.account}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.merchant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Investment Management Component
function InvestmentManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Investment Management</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {showCreateForm ? "Cancel" : "+ Add Investment"}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Investment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">User Account</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>John Doe - Investment Account</option>
                  <option>Jane Smith - Investment Account</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Stocks</option>
                  <option>Bonds</option>
                  <option>Mutual Funds</option>
                  <option>ETF</option>
                  <option>Cryptocurrency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Apple Inc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ticker Symbol</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="AAPL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price (per unit)</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="150.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (per unit)</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="180.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform/Broker</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Interactive Brokers" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Add Investment
              </button>
              <button onClick={() => setShowCreateForm(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Investments List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { user: "John Doe", asset: "Apple Inc. (AAPL)", type: "Stocks", qty: "10", value: "£1,800.00", return: "+20%" },
                { user: "John Doe", asset: "S&P 500 ETF", type: "ETF", qty: "50", value: "£5,500.00", return: "+12%" },
                { user: "Jane Smith", asset: "Tesla (TSLA)", type: "Stocks", qty: "5", value: "£1,200.00", return: "-8%" },
              ].map((investment, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investment.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investment.asset}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{investment.value}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                    investment.return.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}>
                    {investment.return}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Sell</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Card Management Component
function CardManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Card Management</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {showCreateForm ? "Cancel" : "+ Issue New Card"}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue New Card</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>John Doe - john@example.com</option>
                  <option>Jane Smith - jane@example.com</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Debit Card</option>
                  <option>Credit Card</option>
                  <option>Virtual Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Tier</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Standard</option>
                  <option>Gold</option>
                  <option>Platinum</option>
                  <option>Black</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Linked Account</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Checking Account - £10,000.00</option>
                  <option>Savings Account - £8,000.00</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="4532 1234 5678 9010" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input type="text" maxLength={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="123" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input type="month" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Limit</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="1000.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PIN</label>
                <input type="password" maxLength={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="****" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Active</option>
                  <option>Blocked</option>
                  <option>Expired</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Issue Card
              </button>
              <button onClick={() => setShowCreateForm(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cards List */}
        <div className="grid gap-4">
          {[
            { user: "John Doe", type: "Debit", number: "**** **** **** 9010", expiry: "12/27", status: "Active", limit: "£1,000/day" },
            { user: "John Doe", type: "Credit", number: "**** **** **** 5432", expiry: "08/26", status: "Active", limit: "£5,000/day" },
            { user: "Jane Smith", type: "Debit", number: "**** **** **** 7890", expiry: "03/28", status: "Active", limit: "£1,500/day" },
          ].map((card, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-semibold text-gray-900">{card.user} - {card.type} Card</h4>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{card.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Card Number</p>
                      <p className="text-sm font-mono font-medium text-gray-900">{card.number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Expiry</p>
                      <p className="text-sm font-medium text-gray-900">{card.expiry}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Daily Limit</p>
                      <p className="text-sm font-medium text-gray-900">{card.limit}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-6">
                  <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg text-sm font-medium transition-colors">
                    Block
                  </button>
                  <button className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
