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
  const [users, setUsers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountId: "",
    type: "expense",
    category: "Groceries",
    merchantName: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchAccounts();
    fetchTransactions();
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

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts");
      const data = await response.json();
      if (data.success) setAccounts(data.accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      if (data.success) setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const getAccountInfo = (accountId: string) => {
    const account = accounts.find((a) => a._id === accountId);
    if (!account) return "Unknown Account";
    const user = users.find((u) => u._id === account.userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : "Unknown User";
    return `${userName} - ${account.accountName}`;
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ accountId: "", type: "expense", category: "Groceries", merchantName: "", amount: "", description: "" });
        setShowCreateForm(false);
        fetchTransactions();
        fetchAccounts(); // Refresh to update balances
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      const response = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });
      const data = await response.json();
      if (data.success) {
        fetchTransactions();
        fetchAccounts(); // Refresh to update balances
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

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
          <form onSubmit={handleCreateTransaction} className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Transaction</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                <select value={formData.accountId} onChange={(e) => setFormData({ ...formData, accountId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select Account</option>
                  {accounts.map((account) => {
                    const user = users.find((u) => u._id === account.userId);
                    const userName = user ? `${user.firstName} ${user.lastName}` : "Unknown";
                    const balance = Number(account.balance) || 0;
                    return (
                      <option key={account._id} value={account._id}>
                        {userName} - {account.accountName} ({account.currency === "GBP" && "£"}{account.currency === "USD" && "$"}{account.currency === "EUR" && "€"}{balance.toFixed(2)})
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Groceries">Groceries</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Salary">Salary</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Name</label>
                <input type="text" value={formData.merchantName} onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Store Name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="0.00" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Transaction description" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                {loading ? "Adding..." : "Add Transaction"}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No transactions found. Add one to get started.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => {
                  const account = accounts.find((a) => a._id === transaction.accountId);
                  return (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getAccountInfo(transaction.accountId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.merchantName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{transaction.description || "-"}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}
                        {account?.currency === "GBP" && "£"}{account?.currency === "USD" && "$"}{account?.currency === "EUR" && "€"}
                        {transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDeleteTransaction(transaction._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Investment Management Component
function InvestmentManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    assetName: "",
    assetType: "Stocks",
    quantity: "",
    purchasePrice: "",
    currentPrice: "",
    purchaseDate: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchInvestments();
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

  const fetchInvestments = async () => {
    try {
      const response = await fetch("/api/investments");
      const data = await response.json();
      if (data.success) setInvestments(data.investments);
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
  };

  const calculateReturn = (purchasePrice: number, currentPrice: number, quantity: number) => {
    const invested = purchasePrice * quantity;
    const current = currentPrice * quantity;
    const gain = current - invested;
    const percentage = ((gain / invested) * 100).toFixed(2);
    return { gain, percentage };
  };

  const handleCreateInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
          purchasePrice: parseFloat(formData.purchasePrice),
          currentPrice: parseFloat(formData.currentPrice),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ userId: "", assetName: "", assetType: "Stocks", quantity: "", purchasePrice: "", currentPrice: "", purchaseDate: "" });
        setShowCreateForm(false);
        fetchInvestments();
      }
    } catch (error) {
      console.error("Error creating investment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInvestment = (investment: any) => {
    setEditingInvestment(investment);
    setFormData({
      userId: investment.userId,
      assetName: investment.assetName,
      assetType: investment.assetType,
      quantity: investment.quantity.toString(),
      purchasePrice: investment.purchasePrice.toString(),
      currentPrice: investment.currentPrice.toString(),
      purchaseDate: investment.purchaseDate.split("T")[0],
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvestment) return;
    setLoading(true);
    try {
      const response = await fetch("/api/investments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investmentId: editingInvestment._id,
          ...formData,
          quantity: parseFloat(formData.quantity),
          purchasePrice: parseFloat(formData.purchasePrice),
          currentPrice: parseFloat(formData.currentPrice),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ userId: "", assetName: "", assetType: "Stocks", quantity: "", purchasePrice: "", currentPrice: "", purchaseDate: "" });
        setShowEditForm(false);
        setEditingInvestment(null);
        fetchInvestments();
      }
    } catch (error) {
      console.error("Error updating investment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvestment = async (investmentId: string) => {
    if (!confirm("Delete this investment?")) return;
    try {
      const response = await fetch("/api/investments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investmentId }),
      });
      const data = await response.json();
      if (data.success) fetchInvestments();
    } catch (error) {
      console.error("Error deleting investment:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Investment Management</h2>
          <button
            onClick={() => { setShowCreateForm(!showCreateForm); setShowEditForm(false); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {showCreateForm ? "Cancel" : "+ Add Investment"}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateInvestment} className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Investment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
                <input type="text" value={formData.assetName} onChange={(e) => setFormData({ ...formData, assetName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Apple Inc." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                <select value={formData.assetType} onChange={(e) => setFormData({ ...formData, assetType: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Stocks">Stocks</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Mutual Funds">Mutual Funds</option>
                  <option value="ETF">ETF</option>
                  <option value="Cryptocurrency">Cryptocurrency</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input type="number" step="0.01" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="10" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price (per unit)</label>
                <input type="number" step="0.01" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="150.00" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (per unit)</label>
                <input type="number" step="0.01" value={formData.currentPrice} onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="180.00" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                <input type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                {loading ? "Adding..." : "Add Investment"}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </form>
        )}

        {showEditForm && editingInvestment && (
          <form onSubmit={handleUpdateInvestment} className="bg-blue-50 p-6 rounded-lg mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Investment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
                <input type="text" value={formData.assetName} onChange={(e) => setFormData({ ...formData, assetName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                <select value={formData.assetType} onChange={(e) => setFormData({ ...formData, assetType: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Stocks">Stocks</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Mutual Funds">Mutual Funds</option>
                  <option value="ETF">ETF</option>
                  <option value="Cryptocurrency">Cryptocurrency</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input type="number" step="0.01" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price (per unit)</label>
                <input type="number" step="0.01" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (per unit)</label>
                <input type="number" step="0.01" value={formData.currentPrice} onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                <input type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                {loading ? "Updating..." : "Update Investment"}
              </button>
              <button type="button" onClick={() => { setShowEditForm(false); setEditingInvestment(null); }} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          {investments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No investments found. Add one to get started.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {investments.map((investment) => {
                  const { gain, percentage } = calculateReturn(investment.purchasePrice, investment.currentPrice, investment.quantity);
                  const currentValue = investment.currentPrice * investment.quantity;
                  return (
                    <tr key={investment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getUserName(investment.userId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investment.assetName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.assetType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">£{currentValue.toFixed(2)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        gain >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {gain >= 0 ? "+" : ""}£{gain.toFixed(2)} ({percentage}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditInvestment(investment)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button onClick={() => handleDeleteInvestment(investment._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Card Management Component
function CardManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    cardType: "Debit Card",
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
    limit: "",
    balance: "0",
    status: "Active",
  });

  useEffect(() => {
    fetchUsers();
    fetchCards();
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

  const fetchCards = async () => {
    try {
      const response = await fetch("/api/cards");
      const data = await response.json();
      if (data.success) setCards(data.cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          limit: parseFloat(formData.limit),
          balance: parseFloat(formData.balance),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ userId: "", cardType: "Debit Card", cardNumber: "", cardHolderName: "", expiryDate: "", cvv: "", limit: "", balance: "0", status: "Active" });
        setShowCreateForm(false);
        fetchCards();
      }
    } catch (error) {
      console.error("Error creating card:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard = (card: any) => {
    setEditingCard(card);
    setFormData({
      userId: card.userId,
      cardType: card.cardType,
      cardNumber: card.cardNumber,
      cardHolderName: card.cardHolderName,
      expiryDate: card.expiryDate,
      cvv: card.cvv,
      limit: card.limit.toString(),
      balance: card.balance.toString(),
      status: card.status,
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    setLoading(true);
    try {
      const response = await fetch("/api/cards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: editingCard._id,
          ...formData,
          limit: parseFloat(formData.limit),
          balance: parseFloat(formData.balance),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ userId: "", cardType: "Debit Card", cardNumber: "", cardHolderName: "", expiryDate: "", cvv: "", limit: "", balance: "0", status: "Active" });
        setShowEditForm(false);
        setEditingCard(null);
        fetchCards();
      }
    } catch (error) {
      console.error("Error updating card:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Cancel this card?")) return;
    try {
      const response = await fetch("/api/cards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      });
      const data = await response.json();
      if (data.success) fetchCards();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Card Management</h2>
          <button
            onClick={() => { setShowCreateForm(!showCreateForm); setShowEditForm(false); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {showCreateForm ? "Cancel" : "+ Issue New Card"}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateCard} className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue New Card</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName} - {user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                <input type="text" value={formData.cardHolderName} onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select value={formData.cardType} onChange={(e) => setFormData({ ...formData, cardType: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Virtual Card">Virtual Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input type="text" value={formData.cardNumber} onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="4532123456789010" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input type="text" maxLength={3} value={formData.cvv} onChange={(e) => setFormData({ ...formData, cvv: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="123" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (MM/YY)</label>
                <input type="text" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="12/27" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Limit (£)</label>
                <input type="number" step="0.01" value={formData.limit} onChange={(e) => setFormData({ ...formData, limit: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="1000.00" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                {loading ? "Issuing..." : "Issue Card"}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </form>
        )}

        {showEditForm && editingCard && (
          <form onSubmit={handleUpdateCard} className="bg-blue-50 p-6 rounded-lg mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Card</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName} - {user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                <input type="text" value={formData.cardHolderName} onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select value={formData.cardType} onChange={(e) => setFormData({ ...formData, cardType: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Virtual Card">Virtual Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input type="text" value={formData.cardNumber} onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input type="text" maxLength={3} value={formData.cvv} onChange={(e) => setFormData({ ...formData, cvv: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (MM/YY)</label>
                <input type="text" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Limit (£)</label>
                <input type="number" step="0.01" value={formData.limit} onChange={(e) => setFormData({ ...formData, limit: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                {loading ? "Updating..." : "Update Card"}
              </button>
              <button type="button" onClick={() => { setShowEditForm(false); setEditingCard(null); }} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {cards.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No cards found. Issue one to get started.</div>
          ) : (
            cards.map((card) => (
              <div key={card._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-gray-900">{getUserName(card.userId)} - {card.cardType}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        card.status === "Active" ? "bg-green-100 text-green-800" : 
                        card.status === "Blocked" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        {card.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Card Holder</p>
                        <p className="text-sm font-medium text-gray-900">{card.cardHolderName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Card Number</p>
                        <p className="text-sm font-mono font-medium text-gray-900">**** **** **** {card.cardNumber.slice(-4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Expiry</p>
                        <p className="text-sm font-medium text-gray-900">{card.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Daily Limit</p>
                        <p className="text-sm font-medium text-gray-900">£{card.limit.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-6">
                    <button onClick={() => handleEditCard(card)} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCard(card._id)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors">
                      Cancel
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
