import Image from "next/image";

const stats = [
  { number: "50,000+", label: "Active Customers" },
  { number: "$2.5B+", label: "Assets Under Management" },
  { number: "15+", label: "Years of Excellence" },
  { number: "99.9%", label: "Uptime Guarantee" }
];

const values = [
  {
    icon: "🛡️",
    title: "Security First",
    description: "Your financial security is our top priority. We employ bank-level encryption, multi-factor authentication, and continuous monitoring to protect your assets."
  },
  {
    icon: "🤝",
    title: "Customer Focused",
    description: "We build lasting relationships by understanding your unique needs and providing personalized solutions that help you achieve your financial goals."
  },
  {
    icon: "💡",
    title: "Innovation Driven",
    description: "We leverage cutting-edge technology to deliver seamless digital banking experiences while maintaining the personal touch of traditional banking."
  },
  {
    icon: "🌍",
    title: "Community Committed",
    description: "We believe in giving back to the communities we serve through financial education programs, local partnerships, and sustainable practices."
  }
];

const team = [
  {
    name: "Sarah Mitchell",
    role: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "25+ years of banking leadership experience"
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    bio: "Former FinTech innovator driving digital transformation"
  },
  {
    name: "Jessica Rodriguez",
    role: "Chief Financial Officer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    bio: "Expert in strategic financial planning and risk management"
  },
  {
    name: "David Thompson",
    role: "Chief Operations Officer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bio: "Optimizing operations for exceptional customer service"
  }
];

const timeline = [
  { year: "2010", event: "Neon Capital Bank founded with a vision to revolutionize modern banking" },
  { year: "2013", event: "Launched first mobile banking app with biometric authentication" },
  { year: "2016", event: "Expanded to 50,000 customers and opened 5 branch locations" },
  { year: "2019", event: "Introduced AI-powered financial advisory services" },
  { year: "2022", event: "Achieved carbon-neutral operations and $2B in assets" },
  { year: "2025", event: "Leading digital-first banking with 100% uptime and award-winning service" }
];

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 font-sans">
      
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">About Neon Capital Bank</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Building the future of banking through innovation, trust, and unwavering commitment to our customers
            </p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <Image 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" 
                  alt="Neon Capital Headquarters" 
                  width={800} 
                  height={600} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-4">Our Story</h2>
                <p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
                  Founded in 2010, Neon Capital Bank emerged from a simple belief: banking should be accessible, transparent, and empowering for everyone. What started as a small team with big ambitions has grown into a trusted financial institution serving over 50,000 customers worldwide.
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  We combine the reliability and security of traditional banking with the convenience and innovation of modern technology. Our mission is to provide exceptional financial services that help individuals and businesses thrive in an ever-changing economy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 rounded-xl p-6 md:p-8 text-center shadow-lg">
                <div className="text-3xl md:text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">
                  {value.title}
                </h3>
                <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Our Journey</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {item.year}
                    </div>
                  </div>
                  <div className="flex-1 pt-3">
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Leadership Team</h2>
          <p className="text-center text-blue-100 mb-12 max-w-2xl mx-auto">
            Our experienced leadership team brings together decades of banking, technology, and financial expertise
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-64">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    width={400} 
                    height={400} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 text-center shadow-lg">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
                Best Digital Bank 2024
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Financial Technology Awards
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 text-center shadow-lg">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
                5-Star Customer Service
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Independent Banking Review
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 text-center shadow-lg">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
                Sustainable Banking Leader
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Green Finance Initiative
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Experience Better Banking?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Neon Capital for their financial needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/login" 
                className="px-8 py-4 bg-white text-blue-900 font-bold rounded-lg shadow-lg hover:bg-blue-50 transition text-center"
              >
                Open an Account
              </a>
              <a 
                href="/products" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-900 transition text-center"
              >
                Explore Products
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}