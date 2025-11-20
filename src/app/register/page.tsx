import Image from "next/image";

export default function Register() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 py-16 px-4 flex flex-col items-center font-sans">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <Image src="/bank-logo.svg" alt="Neon Capital Logo" width={64} height={64} className="mb-4" />
        <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-300 mb-6">Open Account</h1>
        <form className="w-full flex flex-col gap-6">
          <input type="text" placeholder="Full Name" className="px-4 py-3 rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-zinc-100" required />
          <input type="email" placeholder="Email Address" className="px-4 py-3 rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-zinc-100" required />
          <input type="password" placeholder="Password" className="px-4 py-3 rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-zinc-100" required />
          <input type="text" placeholder="Phone Number" className="px-4 py-3 rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-zinc-100" />
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded transition-colors">Register</button>
        </form>
        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account? <a href="/login" className="text-blue-700 hover:underline">Login</a>
        </div>
      </div>
    </main>
  );
}
