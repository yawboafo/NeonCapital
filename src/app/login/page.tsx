"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'password' | 'otp'>('phone');
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      setStep('password');
      setError("");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('OTP sent to your phone number!');
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('New OTP sent to your phone!');
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/bank-logo.svg" alt="Neon Capital Logo" width={64} height={64} />
          <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-2">Neon Capital Login</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {step === 'phone' ? (
          <form className="space-y-6" onSubmit={handlePhoneSubmit}>
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
                placeholder="e.g. +447123456789"
              />
              <p className="mt-1 text-xs text-gray-500">Enter your phone number with country code</p>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-700 text-white font-bold rounded-md shadow-lg hover:bg-blue-800 transition"
            >
              Continue
            </button>
          </form>
        ) : step === 'password' ? (
          <form className="space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="flex-1 py-3 px-6 bg-gray-300 text-gray-700 font-bold rounded-md shadow-lg hover:bg-gray-400 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 bg-green-600 text-white font-bold rounded-md shadow-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Verification Code</label>
              <input
                type="text"
                id="otp"
                name="otp"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              <p className="mt-1 text-xs text-gray-500">Enter the 6-digit code sent to {phone}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('password');
                  setOtp('');
                  setSuccessMessage('');
                }}
                className="flex-1 py-3 px-6 bg-gray-300 text-gray-700 font-bold rounded-md shadow-lg hover:bg-gray-400 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex-1 py-3 px-6 bg-green-600 text-white font-bold rounded-md shadow-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="w-full text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
