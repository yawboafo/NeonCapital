

import Image from "next/image";

const accountTypes = [
  {
    name: "Basic",
    features: ["Free Checking Account", "Debit Card", "Online Banking", "Mobile App Access"],
    fee: "No Monthly Fee",
    button: "Open Account",
  },
  {
    name: "Premium",
    features: ["Interest Checking", "Premium Debit Card", "Priority Customer Service", "Worldwide ATM Access"],
    fee: "$10/month",
    button: "Open Account",
  },
  {
    name: "Business",
    features: ["Business Checking", "Merchant Services", "Business Credit Card", "Dedicated Account Manager"],
    fee: "$25/month",
    button: "Open Account",
  },
  {
    name: "Wealth",
    features: ["Private Banking", "Investment Advisory", "Exclusive Benefits", "Personal Relationship Manager"],
    fee: "Contact Us",
    button: "Learn More",
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
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 md:mb-8 text-center md:text-left">Banking Account Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {accountTypes.map((type) => (
            <div key={type.name} className="bg-white/90 dark:bg-zinc-900 rounded-xl p-6 md:p-8 shadow-lg flex flex-col items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mb-3 text-center">{type.name}</h3>
                <div className="text-center mb-4">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{type.fee}</span>
                </div>
                <ul className="mb-6 text-zinc-700 dark:text-zinc-300 text-left text-sm md:text-base space-y-2">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/login" className="w-full px-4 md:px-6 py-2 rounded bg-blue-700 text-white text-sm md:text-base font-semibold hover:bg-blue-800 transition text-center">{type.button}</a>
            </div>
          ))}
        </div>
      </section>



      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 md:mb-8 text-center md:text-left">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-6 md:p-8 shadow-lg">
            <p className="mb-3 md:mb-4 text-zinc-700 dark:text-zinc-300 text-sm md:text-base">"Neon Capital has transformed how I manage my finances. Their online banking platform is seamless and secure!"</p>
            <span className="font-bold text-blue-900 dark:text-blue-300 text-sm md:text-base">Sarah M. - London</span>
          </div>
          <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-6 md:p-8 shadow-lg">
            <p className="mb-3 md:mb-4 text-zinc-700 dark:text-zinc-300 text-sm md:text-base">"Excellent customer service and competitive rates. I've been banking with them for 5 years and couldn't be happier."</p>
            <span className="font-bold text-blue-900 dark:text-blue-300 text-sm md:text-base">David C. - United Kingdom</span>
          </div>
          <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-6 md:p-8 shadow-lg">
            <p className="mb-3 md:mb-4 text-zinc-700 dark:text-zinc-300 text-sm md:text-base">"The business banking solutions have helped my company grow. Their dedicated account managers are incredibly helpful."</p>
            <span className="font-bold text-blue-900 dark:text-blue-300 text-sm md:text-base">James T. - Toronto</span>
          </div>
          <div className="bg-white/90 dark:bg-zinc-900 rounded-xl p-6 md:p-8 shadow-lg">
            <p className="mb-3 md:mb-4 text-zinc-700 dark:text-zinc-300 text-sm md:text-base">"Fast, reliable, and trustworthy. Neon Capital is my go-to bank for all my financial needs."</p>
            <span className="font-bold text-blue-900 dark:text-blue-300 text-sm md:text-base">Dr. Jennifer L. - London</span>
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
          <div className="text-xs sm:text-sm">contact@neoncapital.com | 85 King William St, London EC4N 7BL</div>
          <div className="text-xs sm:text-sm">© 2025 Neon Capital. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
}
