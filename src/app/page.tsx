

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
      <section className="relative w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 py-12 md:py-20 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-8">
        <div className="flex-1 z-10 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 text-white drop-shadow-lg leading-tight">Welcome to Neon Capital Bank</h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 font-medium">Your trusted partner for personal and business banking. Experience security, service, and innovation.</p>
          <div className="flex justify-center md:justify-start">
            <a href="/login" className="inline-block px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-full bg-white text-blue-900 font-bold text-base sm:text-lg md:text-xl shadow-lg hover:bg-blue-50 transition">Login to Your Account</a>
          </div>
        </div>
        <div className="flex-1 flex justify-center z-10 w-full md:w-auto">
          <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80" alt="Professional Bankers" width={400} height={400} className="rounded-xl shadow-2xl object-cover w-full max-w-xs sm:max-w-sm md:max-w-md" />
        </div>
        {/* Decorative background image placeholder */}
        <div className="absolute inset-0 opacity-10 bg-[url('/hero-bg.svg')] bg-cover bg-center pointer-events-none" />
      </section>

      {/* Banking Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">Our Banking Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4 md:mb-6">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 text-gray-900">Personal Accounts</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">Comprehensive checking, savings, and digital banking solutions tailored for your everyday financial needs.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-4 md:mb-6">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 text-gray-900">Cards & Payments</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">Advanced debit, credit, and contactless payment solutions with worldwide acceptance and security.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-4 md:mb-6">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 text-gray-900">Loans & Mortgages</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">Competitive rates and flexible lending options for homes, vehicles, and achieving your personal goals.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center mb-4 md:mb-6">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 text-gray-900">Security & Support</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">Round-the-clock customer service and industry-leading security measures for complete peace of mind.</p>
          </div>
        </div>
      </section>


      {/* Account Types Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 md:mb-8 text-center md:text-left">Trading Account Types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {accountTypes.map((type) => (
            <div key={type.name} className="bg-white/90 dark:bg-zinc-900 rounded-xl p-6 md:p-8 shadow-lg flex flex-col items-center">
              <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">{type.name}</h3>
              <ul className="mb-4 md:mb-6 text-zinc-700 dark:text-zinc-300 text-center text-sm md:text-base space-y-1">
                <li>{type.earnings}</li>
                {type.bonus && <li>{type.bonus}</li>}
                <li>{type.volume}</li>
                <li>{type.manager}</li>
                <li className="text-xs md:text-sm">{type.software}</li>
              </ul>
              <a href="#" className="px-4 md:px-6 py-2 rounded bg-blue-700 text-white text-sm md:text-base font-semibold hover:bg-blue-800 transition">Open Live Account</a>
            </div>
          ))}
        </div>
      </section>

      {/* Copy Trading Promo */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 md:mb-4">Copy Trades with Neon Capital</h2>
          <p className="text-base sm:text-lg text-blue-100 mb-4 md:mb-6">Automatically copy trades of successful traders. Let professionals work for you!</p>
          <a href="#" className="inline-block px-6 sm:px-8 py-2 sm:py-3 rounded-lg bg-yellow-400 text-blue-900 font-bold text-base sm:text-lg shadow-lg hover:bg-yellow-500 transition">Start Trading</a>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="/bank-logo.svg" alt="Copy Trading" width={120} height={120} className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32" />
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
      <footer className="bg-blue-900 text-white py-6 md:py-8 mt-8 md:mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <Image src="/bank-logo.svg" alt="Neon Capital Logo" width={32} height={32} />
            <span className="font-bold text-base md:text-lg">Neon Capital</span>
          </div>
          <div className="text-xs sm:text-sm">contact@neoncapital.com | 123 Finance Avenue, New York, NY</div>
          <div className="text-xs sm:text-sm">© 2025 Neon Capital. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
}
