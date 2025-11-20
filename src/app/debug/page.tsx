'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any>(null);

  const checkUser = async () => {
    const response = await fetch(`/api/debug/users?phone=${encodeURIComponent(phone)}`);
    const data = await response.json();
    setResult(data);
  };

  const testLogin = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const data = await response.json();
    setResult(data);
  };

  const getAllUsers = async () => {
    const response = await fetch('/api/debug/users');
    const data = await response.json();
    setAllUsers(data);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug Authentication</h1>
      
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Login</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={checkUser}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Check User in DB
            </button>
            <button
              onClick={testLogin}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Login
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <button
          onClick={getAllUsers}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Get All Users
        </button>
      </div>

      {result && (
        <div className="mb-8 p-6 bg-white border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {allUsers && (
        <div className="p-6 bg-white border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(allUsers, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
