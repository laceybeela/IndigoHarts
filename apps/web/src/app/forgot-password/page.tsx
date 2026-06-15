'use client';

import { useState } from 'react';
import { useAuth } from '@indigo-harts/hooks';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { client } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-sage-700">Indigo Harts</h1>
          <p className="mt-1 text-gray-500">Reset Password</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-card">
          {sent ? (
            <div>
              <p className="mb-4 text-sm text-gray-700">
                If an account exists with that email, you&apos;ll receive a
                password reset link shortly.
              </p>
              <Link
                href="/login"
                className="text-sm font-medium text-sage-600 hover:text-sage-700"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Forgot Password
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              {error && (
                <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-sage-600 px-4 py-2 text-sm font-medium text-white hover:bg-sage-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/login"
                  className="text-sm text-sage-600 hover:text-sage-700"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
