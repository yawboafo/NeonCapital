import Image from "next/image";

const promotions = [
  {
    id: 1,
    badge: "NEW CUSTOMER",
    title: "$300 Welcome Bonus",
    subtitle: "Open a new checking account",
    description: "Get a $300 cash bonus when you open a new Neon Capital checking account and complete qualifying activities within 90 days.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
    requirements: [
      "Open a new personal checking account",
      "Set up direct deposit of $500+ within 60 days",
      "Complete 10 debit card purchases within 60 days",
      "Maintain minimum balance of $1,500 for 90 days"
    ],
    terms: "Offer valid for new customers only. Bonus will be deposited within 120 days of meeting requirements.",
    expires: "December 31, 2025",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 2,
    badge: "LIMITED TIME",
    title: "0% APR Auto Loans",
    subtitle: "For 60 months on new vehicles",
    description: "Finance your dream car with 0% APR for 60 months on new and certified pre-owned vehicles. Save thousands in interest!",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    requirements: [
      "Minimum credit score of 720",
      "Maximum loan amount of $50,000",
      "Vehicle must be model year 2024 or newer",
      "Automatic payment enrollment required"
    ],
    terms: "Subject to credit approval. Offer applies to new auto loans only. Vehicle restrictions apply.",
    expires: "November 30, 2025",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 3,
    badge: "CREDIT CARD",
    title: "3% Cashback Everywhere",
    subtitle: "Plus $200 sign-up bonus",
    description: "Earn 3% unlimited cashback on all purchases with our premium credit card. Plus, get a $200 bonus after spending $1,000 in the first 3 months.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
    requirements: [
      "Spend $1,000 in first 3 months",
      "No annual fee for the first year",
      "Good to excellent credit required",
      "Must be 18 years or older"
    ],
    terms: "Standard APR applies after promotional period. Annual fee of $95 applies after first year.",
    expires: "Ongoing offer",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 4,
    badge: "HIGH YIELD",
    title: "2.5% APY Savings Account",
    subtitle: "No minimum balance required",
    description: "Grow your savings faster with our high-yield savings account. Earn 2.5% APY with no monthly fees and no minimum balance requirements.",
    image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=800&q=80",
    requirements: [
      "Open online within 90 days",
      "Link to existing checking account",
      "Enroll in paperless statements",
      "Maintain account in good standing"
    ],
    terms: "APY is variable and subject to change. Fees may reduce earnings. FDIC insured up to $250,000.",
    expires: "January 31, 2026",
    color: "from-yellow-500 to-orange-600"
  },
  {
    id: 5,
    badge: "MORTGAGE",
    title: "3.25% Fixed Rate Mortgage",
    subtitle: "15-year fixed rate home loans",
    description: "Lock in historically low rates with our 15-year fixed mortgage. Refinance or purchase your dream home with exceptional rates and service.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    requirements: [
      "Minimum down payment of 20%",
      "Credit score of 680 or higher",
      "Debt-to-income ratio below 43%",
      "Property appraisal required"
    ],
    terms: "Rate based on creditworthiness. Points and closing costs may apply. Subject to property approval.",
    expires: "December 15, 2025",
    color: "from-red-500 to-rose-600"
  },
  {
    id: 6,
    badge: "REFER & EARN",
    title: "Earn $50 Per Referral",
    subtitle: "Unlimited referral rewards",
    description: "Share the benefits of Neon Capital with friends and family. Earn $50 for each person who opens a qualified account using your referral.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    requirements: [
      "Be an existing Neon Capital customer",
      "Friend opens qualifying account",
      "Friend maintains account for 90 days",
      "No limit on number of referrals"
    ],
    terms: "Both referrer and referee must meet requirements. Bonus paid within 120 days of account opening.",
    expires: "Ongoing offer",
    color: "from-teal-500 to-cyan-600"
  }
];

export default function Promotions() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 py-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Current Promotions</h1>
          <p className="text-lg md:text-xl text-blue-100">Exclusive offers and rewards for Neon Capital customers</p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 left-4 bg-gradient-to-r ${promo.color} text-white px-4 py-1 rounded-full text-xs font-bold uppercase shadow-lg`}>
                  {promo.badge}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                  {promo.title}
                </h2>
                <p className="text-sm md:text-base text-blue-600 dark:text-blue-400 font-semibold mb-4">
                  {promo.subtitle}
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
                  {promo.description}
                </p>

                {/* Requirements */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
                    How to Qualify:
                  </h3>
                  <ul className="space-y-2">
                    {promo.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Terms */}
                <div className="bg-blue-50 dark:bg-zinc-800 rounded-lg p-4 mb-4">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <strong className="text-zinc-800 dark:text-zinc-200">Terms & Conditions:</strong> {promo.terms}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Expires: </span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">{promo.expires}</span>
                  </div>
                  <a
                    href="/login"
                    className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition shadow-lg"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-white/90 dark:bg-zinc-900/90 rounded-xl p-6 md:p-8 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            All promotions are subject to approval and verification. Terms and conditions apply. Offers may be modified or terminated at any time without notice. 
            Please contact customer service for complete details. Neon Capital is a Member FDIC. Equal Housing Lender.
          </p>
        </div>
      </div>
    </main>
  );
}