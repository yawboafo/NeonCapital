import Image from "next/image";
export default function Education() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 py-16 px-4 flex flex-col items-center font-sans">
      <div className="max-w-4xl w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-10 flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-300 mb-4">Financial Education</h1>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6">Learn more about managing your money, saving, investing, and planning for the future with our resources.</p>
          <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
            <li className="bg-green-50 dark:bg-zinc-800 rounded-lg px-4 py-2">Money Management Tips</li>
            <li className="bg-green-50 dark:bg-zinc-800 rounded-lg px-4 py-2">Saving & Investing Guides</li>
            <li className="bg-green-50 dark:bg-zinc-800 rounded-lg px-4 py-2">Loan & Mortgage Advice</li>
            <li className="bg-green-50 dark:bg-zinc-800 rounded-lg px-4 py-2">Security Best Practices</li>
          </ul>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Education" width={400} height={300} className="rounded-xl shadow-lg" />
        </div>
      </div>
    </main>
  );
}