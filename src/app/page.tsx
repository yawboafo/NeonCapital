

import Image from "next/image";

const accountTypes = [
  {
    name: "Bronze",
    earnings: "Avg. up to 30% daily",
    bonus: "Up to 150% Bonus",
    volume: "15 Lot Max Trade Volume",
    manager: "Account Manager",
    software: "PrimeBTRobotic Software",
  },
  {
    name: "Silver",
    earnings: "Avg. up to 50% daily",
    bonus: "",
    volume: "35 Lot Max Trade Volume",
    manager: "Account Manager",
    software: "PrimeBTRobotic Software",
  },
  {
    name: "Gold",
    earnings: "Avg. up to 65% daily",
    bonus: "",
    volume: "Unlimited Trade Volume",
    manager: "Personal Account Manager",
    software: "PrimeBTRobotic Software",
  },
  {
    name: "Diamond",
    earnings: "Avg. up to 75% daily",
    bonus: "",
    volume: "Unlimited Trade Volume",
    manager: "Personal Account Manager",
    software: "PrimeBTRobotic Software",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 font-sans text-zinc-900 dark:text-zinc-100">

      {/* Hero Section - Modern Banking Look */}
      <section className="relative w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 py-20 px-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1 z-10 flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-lg leading-tight">Welcome to Neon Capital Bank</h1>
          <p className="text-2xl mb-8 text-blue-100 font-medium">Your trusted partner for personal and business banking. Experience security, service, and innovation.</p>
          <div className="flex gap-4">
            <a href="/login" className="inline-block px-10 py-4 rounded-full bg-blue-700 text-white font-bold text-xl shadow-lg hover:bg-blue-800 transition">Login</a>
            <a href="/register" className="inline-block px-10 py-4 rounded-full bg-yellow-400 text-blue-900 font-bold text-xl shadow-lg hover:bg-yellow-500 transition">Open Account</a>
          </div>
        </div>
        <div className="flex-1 flex justify-center z-10">
          <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80" alt="Professional Bankers" width={400} height={400} className="rounded-xl shadow-2xl object-cover" />
        </div>
        {/* Decorative background image placeholder */}
        <div className="absolute inset-0 opacity-10 bg-[url('/hero-bg.svg')] bg-cover bg-center pointer-events-none" />
      </section>

      {/* Banking Features Section */}
      <section className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-8 shadow-lg flex flex-col items-center">
          <span className="text-4xl mb-4">🏦</span>
          <h3 className="font-bold text-xl mb-2">Personal Accounts</h3>
          <p className="text-zinc-600 dark:text-zinc-300">Checking, savings, and digital banking for everyday needs.</p>
        </div>
        <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-8 shadow-lg flex flex-col items-center">
          <span className="text-4xl mb-4">💳</span>
          <h3 className="font-bold text-xl mb-2">Cards & Payments</h3>
          <p className="text-zinc-600 dark:text-zinc-300">Debit, credit, and contactless payments with global access.</p>
        </div>
        <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-8 shadow-lg flex flex-col items-center">
          <span className="text-4xl mb-4">🏠</span>
          <h3 className="font-bold text-xl mb-2">Loans & Mortgages</h3>
          <p className="text-zinc-600 dark:text-zinc-300">Flexible lending for homes, cars, and personal goals.</p>
        </div>
        <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-8 shadow-lg flex flex-col items-center">
          <span className="text-4xl mb-4">🔒</span>
          <h3 className="font-bold text-xl mb-2">Security & Support</h3>
          <p className="text-zinc-600 dark:text-zinc-300">24/7 customer service and advanced security for your peace of mind.</p>
        </div>
      </section>


      {/* Account Types Section */}
      <section className="max-w-6xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Trading Account Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {accountTypes.map((type) => (
            <div key={type.name} className="bg-white/90 dark:bg-zinc-900 rounded-xl p-8 shadow-lg flex flex-col items-center">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">{type.name}</h3>
              <ul className="mb-6 text-zinc-700 dark:text-zinc-300 text-center">
                <li>{type.earnings}</li>
                {type.bonus && <li>{type.bonus}</li>}
                <li>{type.volume}</li>
                <li>{type.manager}</li>
                <li>{type.software}</li>
              </ul>
              <a href="#" className="px-6 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800 transition">Open Live Account</a>
            </div>
          ))}
        </div>
      </section>

      {/* Copy Trading Promo */}
      <section className="max-w-6xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-4">Copy Trades with Neon Capital</h2>
          <p className="text-lg text-blue-100 mb-6">Automatically copy trades of successful traders. Let professionals work for you!</p>
          <a href="#" className="px-8 py-3 rounded-lg bg-yellow-400 text-blue-900 font-bold text-lg shadow-lg hover:bg-yellow-500 transition">Start Trading</a>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="/bank-logo.svg" alt="Copy Trading" width={120} height={120} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Testimonies & Happy Traders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-8 shadow-lg">
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">“I opened an account 3 weeks ago and am already getting results every time without failing. Thanks again!”</p>
            <span className="font-bold text-blue-900 dark:text-blue-300">Jared A. - Johannesburg</span>
          </div>
          <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-8 shadow-lg">
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">“No more staring at charts not knowing what to do. Now I sit and relax while the robot trades for me.”</p>
            <span className="font-bold text-blue-900 dark:text-blue-300">David C. - United Kingdom</span>
          </div>
          <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-8 shadow-lg">
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">“Up 52% on my account. Using IFX Expert Robot. It’s like taking candies from a baby!”</p>
            <span className="font-bold text-blue-900 dark:text-blue-300">Jerry Copeland - Canada</span>
          </div>
          <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-8 shadow-lg">
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">“Quick cash out! Neon Capital trading is the best cryptocurrency trading.”</p>
            <span className="font-bold text-blue-900 dark:text-blue-300">Dr. Juliet D. - United Kingdom</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image src="/bank-logo.svg" alt="Neon Capital Logo" width={32} height={32} />
            <span className="font-bold text-lg">Neon Capital</span>
          </div>
          <div className="text-sm">contact@neoncapital.com | 123 Finance Avenue, New York, NY</div>
          <div className="text-sm">© 2025 Neon Capital. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
}
