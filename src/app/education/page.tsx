"use client";

import { useState } from "react";
import Image from "next/image";

const categories = [
  {
    id: "basics",
    title: "Banking Basics",
    icon: "📚",
    description: "Essential knowledge for managing your bank accounts",
    articles: [
      {
        title: "Understanding Checking vs. Savings Accounts",
        readTime: "5 min read",
        summary: "Learn the key differences between checking and savings accounts, and how to choose the right one for your needs.",
        content: [
          "Checking accounts are designed for frequent transactions like paying bills and making purchases. They typically offer unlimited withdrawals and come with debit cards and check-writing privileges.",
          "Savings accounts are meant for storing money you don't need immediate access to. They earn interest on your balance and may have withdrawal limits.",
          "Key differences: Checking accounts prioritize accessibility while savings accounts prioritize earning interest. Many people maintain both types for different purposes.",
          "Tip: Keep 1-2 months of expenses in checking and build 3-6 months of emergency savings in your savings account."
        ]
      },
      {
        title: "How to Set Up Direct Deposit",
        readTime: "4 min read",
        summary: "Step-by-step guide to getting your paycheck deposited directly into your account.",
        content: [
          "Direct deposit is the electronic transfer of your paycheck directly into your bank account, eliminating the need for paper checks.",
          "To set up: 1) Obtain your bank account and routing numbers from your bank or mobile app, 2) Complete your employer's direct deposit form, 3) Specify the amount or percentage to deposit.",
          "Benefits include: Faster access to funds (often 1-2 days earlier), no risk of lost checks, automatic savings if you split deposits between accounts, and reduced trips to the bank.",
          "You can typically split deposits between multiple accounts, such as 80% to checking and 20% to savings for automatic saving."
        ]
      },
      {
        title: "Reading Your Bank Statement",
        readTime: "6 min read",
        summary: "Understand every section of your monthly bank statement and why it matters.",
        content: [
          "Bank statements provide a detailed record of all account activity over a period, typically one month.",
          "Key sections: Account summary shows beginning and ending balances; Transaction history lists all deposits, withdrawals, and fees; Interest earned (for savings accounts); Check images or numbers.",
          "Review statements monthly to: Verify all transactions are legitimate, identify unauthorized charges quickly, track spending patterns, and catch bank errors.",
          "Pro tip: Set up account alerts for large transactions, low balances, and unusual activity to catch issues before your statement arrives."
        ]
      }
    ]
  },
  {
    id: "saving",
    title: "Saving & Budgeting",
    icon: "💰",
    description: "Build wealth and achieve your financial goals",
    articles: [
      {
        title: "The 50/30/20 Budget Rule",
        readTime: "7 min read",
        summary: "A simple yet effective budgeting framework that works for any income level.",
        content: [
          "The 50/30/20 rule divides your after-tax income into three categories: 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
          "Needs (50%): Essential expenses like housing, utilities, groceries, transportation, insurance, and minimum debt payments. If your needs exceed 50%, look for ways to reduce these costs.",
          "Wants (30%): Discretionary spending like dining out, entertainment, hobbies, subscriptions, and vacations. This category offers the most flexibility for adjustments.",
          "Savings (20%): Emergency fund, retirement contributions, investments, and extra debt payments beyond minimums. Automate this category to ensure you save before spending.",
          "Getting started: Track expenses for one month, categorize them, calculate percentages, and adjust spending to align with the 50/30/20 framework."
        ]
      },
      {
        title: "Building Your Emergency Fund",
        readTime: "8 min read",
        summary: "Why you need emergency savings and how to build it step by step.",
        content: [
          "An emergency fund is money set aside to cover unexpected expenses or income loss. It prevents you from going into debt when life happens.",
          "Goal amount: Start with $1,000 for minor emergencies, then build to 3-6 months of living expenses. Self-employed individuals should aim for 6-12 months.",
          "Where to keep it: High-yield savings account that's separate from your checking but easily accessible. Avoid investments that fluctuate in value.",
          "Building strategy: Set up automatic transfers on payday (even $25-50/week adds up), deposit windfalls like tax refunds or bonuses, save any unspent budget money.",
          "When to use it: Job loss, medical emergencies, major car repairs, essential home repairs. Not for: vacations, planned purchases, or wants.",
          "After using your fund, make replenishing it a priority before returning to other financial goals."
        ]
      },
      {
        title: "Smart Saving Strategies",
        readTime: "6 min read",
        summary: "Proven techniques to save more money without feeling deprived.",
        content: [
          "Pay yourself first: Treat savings as a non-negotiable bill. Automate transfers to savings right after payday before spending money.",
          "The 24-hour rule: Wait 24 hours before making non-essential purchases. Often, the impulse fades and you'll save money.",
          "Round-up savings: Use apps or bank features that round up purchases to the nearest dollar and save the difference. $0.50 here and there adds up quickly.",
          "Challenge yourself: Try no-spend weekends, pack lunch 3x/week, or cut one subscription monthly. Small changes create significant savings over time.",
          "Track progress visually: Use savings trackers or apps that show your progress toward goals. Seeing growth motivates continued saving."
        ]
      }
    ]
  },
  {
    id: "credit",
    title: "Credit & Loans",
    icon: "💳",
    description: "Master credit management and borrowing wisely",
    articles: [
      {
        title: "Understanding Your Credit Score",
        readTime: "9 min read",
        summary: "How credit scores work and proven strategies to improve yours.",
        content: [
          "Credit scores range from 300-850 and predict how likely you are to repay borrowed money. Lenders use them to decide if they'll approve you and at what interest rate.",
          "FICO score breakdown: Payment history (35%), amounts owed (30%), length of credit history (15%), new credit (10%), credit mix (10%).",
          "What hurts your score: Late payments (especially 30+ days), high credit card balances, collections, bankruptcies, and applying for too much credit at once.",
          "Improvement strategies: Pay all bills on time (set up autopay), keep credit card balances below 30% of limits (ideally under 10%), don't close old accounts, dispute errors on your credit report.",
          "Check your credit: Get free reports annually at AnnualCreditReport.com. Many banks and credit cards now offer free credit score monitoring.",
          "Building from scratch: Become an authorized user on someone's card, get a secured credit card, or try a credit-builder loan."
        ]
      },
      {
        title: "Choosing the Right Credit Card",
        readTime: "7 min read",
        summary: "Compare card types and find the best match for your spending habits.",
        content: [
          "Credit card types: Cashback (earn percentage on purchases), travel rewards (points for flights/hotels), balance transfer (0% APR for debt payoff), secured (for building credit).",
          "Key factors to compare: Annual fee, APR (if you carry balances), rewards rate, sign-up bonus, foreign transaction fees, and additional benefits.",
          "Cashback cards work best if you: Want simplicity, spend in various categories, prefer cash over travel perks, and pay balances in full monthly.",
          "Travel cards work best if you: Travel frequently, can maximize category bonuses, value perks like lounge access, and spend enough to offset annual fees.",
          "Red flags: High annual fees without justifiable benefits, extremely high APRs, confusing reward structures, or many customer complaints.",
          "Using credit responsibly: Pay full balance monthly to avoid interest, keep utilization under 30%, use for planned purchases only, and review statements for errors or fraud."
        ]
      },
      {
        title: "Mortgage Basics for First-Time Buyers",
        readTime: "10 min read",
        summary: "Everything you need to know about home loans before you start shopping.",
        content: [
          "A mortgage is a loan used to purchase a home. You repay it over 15-30 years with interest. The home serves as collateral, meaning the lender can foreclose if you don't pay.",
          "Mortgage types: Fixed-rate (same payment for entire loan), ARM (adjustable rate that changes), FHA (government-backed, lower down payment), VA (for veterans), and jumbo (for expensive homes).",
          "Down payment: Traditional loans require 20%, but FHA allows 3.5% and conventional can go as low as 3%. Larger down payments mean lower monthly payments and no PMI.",
          "Pre-approval process: Lender reviews your finances and tells you how much you can borrow. Get pre-approved before house hunting to strengthen offers.",
          "True cost includes: Principal and interest, property taxes, homeowners insurance, HOA fees, and PMI (if down payment <20%). Use mortgage calculators to estimate total monthly costs.",
          "Improving your rate: Increase credit score, save larger down payment, compare multiple lenders, consider points, and choose shorter loan terms if affordable."
        ]
      }
    ]
  },
  {
    id: "investing",
    title: "Investing & Retirement",
    icon: "📈",
    description: "Grow your wealth for the long term",
    articles: [
      {
        title: "Investing 101: Getting Started",
        readTime: "11 min read",
        summary: "A beginner's guide to investing in stocks, bonds, and retirement accounts.",
        content: [
          "Investing means putting your money into assets that have potential to grow in value over time, like stocks, bonds, real estate, or mutual funds.",
          "Key concepts: Risk vs. return (higher potential returns come with higher risk), diversification (spreading money across different investments), and compound growth (earnings generate more earnings).",
          "Common investments: Stocks (ownership in companies), bonds (loans to companies/governments), mutual funds (professionally managed collection of stocks/bonds), ETFs (trade like stocks, diversified like mutual funds).",
          "Where to invest: 401(k) through employer (often with matching!), IRA for individual retirement savings, brokerage account for non-retirement investing, robo-advisors for automated management.",
          "Start investing when: You have emergency fund established, high-interest debt paid off, and can commit to long-term (5+ years). Don't invest money needed within 2-3 years.",
          "Beginning steps: Open account, start with target-date fund or diversified ETF, invest consistently (dollar-cost averaging), and avoid trying to time the market."
        ]
      },
      {
        title: "Retirement Account Comparison",
        readTime: "8 min read",
        summary: "401(k), IRA, Roth IRA, and other retirement accounts explained and compared.",
        content: [
          "401(k): Employer-sponsored retirement plan. Contributions reduce current taxable income, and employer may match contributions (free money!). 2025 limit: $23,000 ($30,500 if 50+).",
          "Traditional IRA: Individual retirement account with tax-deductible contributions (if eligible). Earnings grow tax-deferred. 2025 limit: $7,000 ($8,000 if 50+). Withdrawals taxed as income.",
          "Roth IRA: Contributions made with after-tax dollars, but withdrawals in retirement are tax-free. Same limits as traditional IRA. Best for younger workers expecting higher future tax rates.",
          "Which to prioritize: 1) 401(k) to get full employer match, 2) Max Roth IRA if eligible, 3) Return to 401(k) to max contribution, 4) Consider taxable brokerage if still have funds.",
          "Key rules: Can't withdraw before 59½ without penalties (some exceptions exist), required minimum distributions start at 73, income limits apply to some accounts.",
          "Pro tip: If employer offers both Traditional and Roth 401(k), consider splitting contributions to diversify your tax exposure in retirement."
        ]
      },
      {
        title: "Understanding Market Volatility",
        readTime: "7 min read",
        summary: "Stay calm during market ups and downs and stick to your long-term plan.",
        content: [
          "Market volatility means prices go up and down, sometimes dramatically. It's normal and happens for various reasons: economic news, company earnings, global events, or investor emotions.",
          "Historical perspective: Despite crashes and corrections, the stock market has averaged 10% annual returns over the long term. Every major downturn has eventually recovered.",
          "Why volatility matters less for long-term investors: If you won't need the money for 10+ years, short-term drops are temporary. Time in the market beats timing the market.",
          "Emotional mistakes to avoid: Panic selling during downturns (locks in losses), market timing (impossible to do consistently), checking accounts obsessively (increases anxiety without benefit).",
          "Smart strategies: Continue regular contributions during downturns (buying low), rebalance annually to maintain target allocation, focus on time horizon not daily changes.",
          "When to be concerned: If market movements are causing you to lose sleep, your allocation may be too aggressive. Consider adjusting to a more conservative mix."
        ]
      }
    ]
  },
  {
    id: "security",
    title: "Security & Fraud Prevention",
    icon: "🔒",
    description: "Protect your accounts and personal information",
    articles: [
      {
        title: "Online Banking Security Essentials",
        readTime: "6 min read",
        summary: "Best practices to keep your accounts safe from cybercriminals.",
        content: [
          "Use strong, unique passwords for each financial account. Combine uppercase, lowercase, numbers, and symbols. Never reuse passwords across sites.",
          "Enable two-factor authentication (2FA) on all financial accounts. This requires a second verification method (text, app, or key) beyond just your password.",
          "Safe browsing: Only access banking on secure networks (avoid public Wi-Fi), verify the website URL before logging in, never click links in emails claiming to be from your bank.",
          "Device security: Keep operating system and apps updated, use antivirus software, enable device passwords/biometrics, and be cautious about downloading apps.",
          "Red flags: Unexpected account alerts, emails requesting personal information, websites with slight spelling variations, pressure to act immediately.",
          "If compromised: Contact your bank immediately, change passwords, monitor accounts closely, consider fraud alerts or credit freeze, and report to authorities."
        ]
      },
      {
        title: "Recognizing Common Scams",
        readTime: "8 min read",
        summary: "Learn to spot and avoid the most prevalent financial scams targeting consumers.",
        content: [
          "Phishing: Fake emails/texts pretending to be from your bank requesting personal information or passwords. Banks never ask for sensitive data via email.",
          "Phone scams: Callers impersonating IRS, bank, or tech support claiming urgent problems requiring immediate payment or information. Hang up and call official numbers directly.",
          "Romance scams: Online relationships that eventually request money for emergencies. Never send money to someone you've only met online.",
          "Investment scams: Promises of guaranteed high returns, pressure to invest immediately, or opportunities that seem too good to be true. Legitimate investments carry risk and aren't pressured.",
          "Overpayment scams: Someone pays with fake check that exceeds amount owed and asks you to wire back difference. Check bounces, and you're out the money.",
          "Protection tips: Verify independently before acting, never share account credentials, be skeptical of unsolicited contact, and trust your instincts if something feels wrong.",
          "Reporting: Contact your bank immediately if you've shared information or sent money. File reports with FTC (reportfraud.ftc.gov) and local police."
        ]
      },
      {
        title: "Identity Theft Protection",
        readTime: "7 min read",
        summary: "Safeguard your identity and know what to do if it's compromised.",
        content: [
          "Identity theft occurs when someone uses your personal information (SSN, account numbers, credit cards) to commit fraud or theft in your name.",
          "Prevention strategies: Shred financial documents, monitor credit reports regularly, secure mail delivery, limit information sharing on social media, and use secure passwords.",
          "Warning signs: Unexplained accounts or charges, bills for unfamiliar accounts, denied credit unexpectedly, IRS notice about duplicate tax returns, or missing expected mail.",
          "Immediate actions if compromised: Place fraud alert on credit reports, close affected accounts, file police report, report to FTC at IdentityTheft.gov, and contact IRS if tax-related.",
          "Credit freeze: Prevents new accounts from being opened in your name. Free to place and remove. Contact all three credit bureaus: Equifax, Experian, and TransUnion.",
          "Recovery timeline: Can take months to fully resolve. Keep detailed records of all correspondence, follow up regularly, and consider identity theft monitoring services.",
          "Long-term monitoring: Check credit reports annually (free at AnnualCreditReport.com), review bank/card statements monthly, and set up account alerts for unusual activity."
        ]
      }
    ]
  }
];

export default function Education() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const toggleArticle = (title: string) => {
    setExpandedArticle(expandedArticle === title ? null : title);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 py-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Financial Education Center</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Empower yourself with knowledge. Learn everything from banking basics to advanced investing strategies.
          </p>
        </div>

        {/* Category Selection */}
        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left group"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h2 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">
                  {category.title}
                </h2>
                <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-blue-700 dark:text-blue-400 font-semibold">
                  <span className="text-sm">{category.articles.length} Articles</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setExpandedArticle(null);
              }}
              className="mb-6 flex items-center gap-2 text-white hover:text-blue-200 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Back to Categories</span>
            </button>

            {/* Selected Category Content */}
            {categories
              .filter((cat) => cat.id === selectedCategory)
              .map((category) => (
                <div key={category.id}>
                  <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 md:p-8 mb-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl">{category.icon}</span>
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-300">
                          {category.title}
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400">{category.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Articles */}
                  <div className="space-y-4">
                    {category.articles.map((article) => (
                      <div
                        key={article.title}
                        className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleArticle(article.title)}
                          className="w-full text-left p-6 md:p-8 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                                {article.title}
                              </h3>
                              <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mb-2">
                                {article.summary}
                              </p>
                              <span className="inline-block text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                📖 {article.readTime}
                              </span>
                            </div>
                            <svg
                              className={`w-6 h-6 text-blue-900 dark:text-blue-300 transition-transform duration-300 flex-shrink-0 ${
                                expandedArticle === article.title ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {expandedArticle === article.title && (
                          <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-blue-100 dark:border-zinc-700 animate-fadeIn">
                            <div className="prose dark:prose-invert max-w-none mt-6">
                              {article.content.map((paragraph, index) => (
                                <p key={index} className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4 text-sm md:text-base">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700 flex gap-4">
                              <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition shadow-lg">
                                Related Products
                              </button>
                              <button className="px-6 py-3 bg-white dark:bg-zinc-800 text-blue-900 dark:text-blue-300 font-semibold rounded-lg border-2 border-blue-700 hover:bg-blue-50 dark:hover:bg-zinc-700 transition">
                                Save Article
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Additional Resources */}
        {!selectedCategory && (
          <div className="mt-12 bg-white/90 dark:bg-zinc-900/90 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-300 mb-4 text-center">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Free Webinars</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Join our monthly financial literacy webinars</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Expert Consultations</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Schedule one-on-one sessions with our advisors</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Newsletter</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Get weekly tips delivered to your inbox</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}