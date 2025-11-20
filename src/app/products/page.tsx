"use client";

import { useState } from "react";

const products = [
  {
    id: 1,
    title: "Personal Checking & Savings",
    icon: "💳",
    shortDesc: "Smart banking solutions for your everyday financial needs",
    details: {
      description: "Our personal checking and savings accounts offer you complete control over your finances with competitive interest rates, no hidden fees, and 24/7 online access.",
      features: [
        "Zero monthly maintenance fees with minimum balance",
        "High-yield savings with up to 2.5% APY",
        "Free online and mobile banking",
        "Unlimited ATM access nationwide",
        "Overdraft protection available",
        "Automatic savings plans"
      ],
      requirements: "Minimum opening deposit of $25 for checking, $100 for savings"
    }
  },
  {
    id: 2,
    title: "Business Banking",
    icon: "🏢",
    shortDesc: "Comprehensive banking solutions to help your business grow",
    details: {
      description: "Tailored banking services for small businesses, startups, and established enterprises. Manage your business finances efficiently with our suite of business banking products.",
      features: [
        "Business checking accounts with unlimited transactions",
        "Merchant services and payment processing",
        "Business credit cards with rewards",
        "Business loans and lines of credit",
        "Payroll services and direct deposit",
        "Cash management solutions",
        "Dedicated business relationship manager"
      ],
      requirements: "Valid business registration and EIN required"
    }
  },
  {
    id: 3,
    title: "Home & Auto Loans",
    icon: "🏠",
    shortDesc: "Competitive rates for your major life purchases",
    details: {
      description: "Finance your dream home or vehicle with our flexible loan options. We offer competitive interest rates, flexible terms, and a streamlined application process.",
      features: [
        "Home mortgages starting at 3.5% APR",
        "Auto loans with terms up to 84 months",
        "Pre-approval available in 24 hours",
        "No prepayment penalties",
        "Refinancing options available",
        "First-time homebuyer programs",
        "Online application and tracking"
      ],
      requirements: "Credit check, proof of income, and down payment required"
    }
  },
  {
    id: 4,
    title: "Credit & Debit Cards",
    icon: "💰",
    shortDesc: "Secure payment options with rewards and protection",
    details: {
      description: "Choose from our range of credit and debit cards designed to fit your lifestyle. Enjoy rewards, cashback, and fraud protection on every purchase.",
      features: [
        "0% introductory APR for 12 months on credit cards",
        "Up to 3% cashback on eligible purchases",
        "No foreign transaction fees",
        "EMV chip and contactless payment",
        "Real-time fraud monitoring and alerts",
        "Virtual card numbers for online shopping",
        "Travel insurance and purchase protection"
      ],
      requirements: "Credit approval required for credit cards, checking account for debit cards"
    }
  },
  {
    id: 5,
    title: "Investment & Wealth Management",
    icon: "📈",
    shortDesc: "Build and protect your wealth for the future",
    details: {
      description: "Grow your wealth with our investment services and personalized wealth management solutions. Our expert advisors will help you create a portfolio aligned with your financial goals.",
      features: [
        "Individual and retirement investment accounts (IRA, 401k)",
        "Robo-advisor and human advisor options",
        "Diversified portfolio management",
        "Tax-advantaged investment strategies",
        "Estate planning services",
        "Financial planning and consultation",
        "Low management fees starting at 0.25%"
      ],
      requirements: "Minimum investment of $1,000 to start"
    }
  },
  {
    id: 6,
    title: "Digital Wallet & Mobile Banking",
    icon: "📱",
    shortDesc: "Bank on the go with our advanced mobile technology",
    details: {
      description: "Experience the future of banking with our fully-featured mobile app and digital wallet. Manage your accounts, transfer money, and pay bills anytime, anywhere.",
      features: [
        "Mobile check deposit",
        "Person-to-person payments (P2P)",
        "Bill pay and autopay scheduling",
        "Biometric authentication (Face ID, Touch ID)",
        "Real-time transaction notifications",
        "Budgeting and spending insights",
        "Integration with Apple Pay, Google Pay, Samsung Pay"
      ],
      requirements: "Compatible smartphone and active account"
    }
  }
];

export default function Products() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Our Banking Products</h1>
          <p className="text-lg md:text-xl text-blue-100">Comprehensive financial solutions designed for your needs</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
            >
              <button
                onClick={() => toggleExpand(product.id)}
                className="w-full text-left p-6 md:p-8 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-4xl md:text-5xl">{product.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mb-1">
                      {product.title}
                    </h2>
                    <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
                      {product.shortDesc}
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-6 h-6 text-blue-900 dark:text-blue-300 transition-transform duration-300 ${
                    expandedId === product.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedId === product.id && (
                <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2 border-t border-blue-100 dark:border-zinc-700 animate-fadeIn">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        Overview
                      </h3>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {product.details.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {product.details.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        Requirements
                      </h3>
                      <p className="text-zinc-700 dark:text-zinc-300 bg-blue-50 dark:bg-zinc-800 rounded-lg p-4">
                        {product.details.requirements}
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <a
                        href="/login"
                        className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition shadow-lg"
                      >
                        Apply Now
                      </a>
                      <button className="px-6 py-3 bg-white dark:bg-zinc-800 text-blue-900 dark:text-blue-300 font-semibold rounded-lg border-2 border-blue-700 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-zinc-700 transition">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}