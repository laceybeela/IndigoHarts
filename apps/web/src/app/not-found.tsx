import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-sage-300">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">
        Page Not Found
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded bg-sage-600 px-4 py-2 text-sm font-medium text-white hover:bg-sage-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
