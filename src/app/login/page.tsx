"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      setStep('otp');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/bank-logo.svg" alt="Neon Capital Logo" width={64} height={64} />
          <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-2">Neon Capital Login</h1>
        </div>
        {step === 'login' ? (
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
                placeholder="e.g. +1 555 123 4567"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-700 text-white font-bold rounded-md shadow-lg hover:bg-blue-800 transition"
            >
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
                placeholder="Enter any digits"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-green-600 text-white font-bold rounded-md shadow-lg hover:bg-green-700 transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
