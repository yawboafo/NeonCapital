"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const accountTypes = [
  {
    name: "Basic",
    features: ["Free Checking Account", "Debit Card", "Online Banking", "Mobile App Access"],
    fee: "No Monthly Fee",
    button: "Open Account",
    popular: false,
  },
  {
    name: "Premium",
    features: ["Interest Checking", "Premium Debit Card", "Priority Customer Service", "Worldwide ATM Access"],
    fee: "£10/month",
    button: "Open Account",
    popular: true,
  },
  {
    name: "Business",
    features: ["Business Checking", "Merchant Services", "Business Credit Card", "Dedicated Account Manager"],
    fee: "£25/month",
    button: "Open Account",
    popular: false,
  },
  {
    name: "Wealth",
    features: ["Private Banking", "Investment Advisory", "Exclusive Benefits", "Personal Relationship Manager"],
    fee: "Contact Us",
    button: "Learn More",
    popular: false,
  },
];

const slides = [
  {
    title: "Welcome to Neon Capital Bank",
    description: "Your trusted partner for personal and business banking. Experience security, service, and innovation.",
    buttonText: "Login to Your Account",
    buttonLink: "/login",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80",
    imageAlt: "Professional Bankers"
  },
  {
    title: "Digital Banking Made Simple",
    description: "Manage your finances anytime, anywhere with our award-winning mobile app and online banking platform.",
    buttonText: "Explore Digital Services",
    buttonLink: "/products",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=500&q=80",
    imageAlt: "Mobile Banking"
  },
  {
    title: "Competitive Rates & Rewards",
    description: "Earn up to 2.5% APY on savings accounts. Get cashback on every purchase with our premium credit cards.",
    buttonText: "View Promotions",
    buttonLink: "/promotions",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80",
    imageAlt: "Savings & Rewards"
  },
  {
    title: "Business Banking Solutions",
    description: "Grow your business with tailored banking services, merchant solutions, and dedicated account managers.",
    buttonText: "Learn More",
    buttonLink: "/products",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80",
    imageAlt: "Business Banking"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Hero Section - Modern Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all border border-white/20"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all border border-white/20"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slides Content */}
          <div className="relative min-h-[500px] md:min-h-[450px]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 h-full">
                  <div className="flex-1 text-center lg:text-left max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 px-4 py-1.5 rounded-full mb-6">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm text-blue-200 font-medium">Secure Banking • FDIC Insured</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <a 
                        href={slide.buttonLink} 
                        className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
                      >
                        {slide.buttonText}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                      <a 
                        href="/contact" 
                        className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 backdrop-blur-sm"
                      >
                        Contact Us
                      </a>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center w-full max-w-md lg:max-w-lg">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-purple-600/30 rounded-2xl blur-2xl" />
                      <Image 
                        src={slide.image} 
                        alt={slide.imageAlt} 
                        width={480} 
                        height={400} 
                        className="relative rounded-2xl shadow-2xl object-cover border border-white/10" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-blue-500 w-8' : 'bg-white/30 hover:bg-white/50 w-2'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2h6v4H7V6zm8 8v-2h2v2h-2zm2-4h-2V8h2v2zm-4 4H7v-2h6v2zm-8-2H3v-2h2v2zm0 2v-2H3a2 2 0 002 2zm8-8V4h2a2 2 0 012 2h-4z" clipRule="evenodd" />
                </svg>
                <span>FDIC Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>50,000+ Customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banking Features Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">Our Services</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Banking Services Built for You</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to manage your finances, all in one secure platform.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-3 text-slate-900">Personal Accounts</h3>
              <p className="text-slate-600 leading-relaxed">Comprehensive checking, savings, and digital banking solutions tailored for your everyday financial needs.</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-purple-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/25">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-3 text-slate-900">Cards & Payments</h3>
              <p className="text-slate-600 leading-relaxed">Advanced debit, credit, and contactless payment solutions with worldwide acceptance and security.</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/25">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-3 text-slate-900">Loans & Mortgages</h3>
              <p className="text-slate-600 leading-relaxed">Competitive rates and flexible lending options for homes, vehicles, and achieving your personal goals.</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-amber-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/25">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-3 text-slate-900">Security & Support</h3>
              <p className="text-slate-600 leading-relaxed">Round-the-clock customer service and industry-leading security measures for complete peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Account Types Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">Account Options</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Choose Your Account</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Find the perfect account that fits your lifestyle and financial goals.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {accountTypes.map((type) => (
              <div key={type.name} className={`relative bg-white rounded-2xl p-8 border-2 ${type.popular ? 'border-blue-500 shadow-lg' : 'border-slate-200'} flex flex-col transition-all hover:shadow-lg hover:-translate-y-1`}>
                {type.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{type.name}</h3>
                  <div className="text-slate-600">
                    <span className="text-3xl font-bold text-slate-900">{type.fee === "No Monthly Fee" ? "£0" : type.fee === "Contact Us" ? "Custom" : type.fee.replace("/month", "")}</span>
                    {type.fee !== "No Monthly Fee" && type.fee !== "Contact Us" && <span className="text-sm">/month</span>}
                  </div>
                </div>
                <ul className="flex-grow space-y-3 mb-8">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="/login" 
                  className={`w-full py-3 rounded-xl font-semibold text-center transition-all \${
                    type.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  {type.button}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 text-sm font-semibold rounded-full mb-4 border border-blue-500/30">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">See what our customers have to say about their experience with Neon Capital.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[
              { quote: "Neon Capital has transformed how I manage my finances. Their online banking platform is seamless and secure!", author: "Sarah M.", location: "London" },
              { quote: "Excellent customer service and competitive rates. I've been banking with them for 5 years and couldn't be happier.", author: "David C.", location: "United Kingdom" },
              { quote: "The business banking solutions have helped my company grow. Their dedicated account managers are incredibly helpful.", author: "James T.", location: "Toronto" },
              { quote: "Fast, reliable, and trustworthy. Neon Capital is my go-to bank for all my financial needs.", author: "Dr. Jennifer L.", location: "London" },
            ].map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/70 transition-all">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-slate-400">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-10">Open your account in minutes and experience modern banking today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5">
              Open Free Account
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all">
              Talk to an Expert
            </a>
          </div>
        </div>
      </section>

      {/* Partners & Payment Methods Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full mb-4">Trusted Partners</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Secure Payment Methods</h2>
            <p className="text-slate-600 max-w-xl mx-auto">We partner with the world&apos;s leading payment providers to ensure your transactions are safe and seamless.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {/* Visa */}
            <div className="group flex items-center justify-center w-24 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <svg viewBox="0 0 1000 324.68" className="h-8 w-auto" preserveAspectRatio="xMidYMid">
                <path fill="#1A1F71" d="M651.19 0.5c-70.93 0-134.32 36.77-134.32 104.69 0 77.9 112.42 83.28 112.42 122.42 0 16.48-18.88 31.23-51.14 31.23-45.77 0-79.98-20.61-79.98-20.61l-14.64 68.55s39.41 17.41 91.73 17.41c77.55 0 138.58-38.57 138.58-107.66 0-82.32-113.16-87.06-113.16-123.86 0-12.91 15.5-27.03 47.66-27.03 36.29 0 65.89 14.99 65.89 14.99l14.33-66.2S696.61 0.5 651.19 0.5zM2.22 5.5L0 17.28s29.58 5.42 56.26 16.1c34.36 13.07 36.79 20.71 42.56 43.38l63.01 243.36h84.94L361.58 5.5h-84.61l-74.59 213.96-30.31-181.92c-2.83-18.4-17.51-32.04-36.04-32.04H2.22zM409.47 5.5l-66.63 314.62h80.82L490.03 5.5h-80.56zM822.49 5.5c-18.53 0-28.54 10.16-35.78 27.98L667.47 320.12h84.93l16.88-46.72h103.69l9.8 46.72h74.95L890.83 5.5h-68.34zm11.75 84.35l24.47 117.07h-67l42.53-117.07z"/>
              </svg>
            </div>
            
            {/* Mastercard */}
            <div className="group flex items-center justify-center w-24 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <svg viewBox="0 0 152.407 108" className="h-10 w-auto" preserveAspectRatio="xMidYMid">
                <g>
                  <rect fill="none" width="152.407" height="108"/>
                  <g>
                    <rect fill="#FF5F00" x="60.4117" y="25.6968" width="31.5" height="56.6064"/>
                    <path fill="#EB001B" d="M62.4117,54c0-11.4792,5.3604-21.6936,13.7096-28.3032C68.3477,19.0272,58.3721,15,47.4117,15C21.2957,15,0,36.5016,0,54c0,17.4984,21.2957,39,47.4117,39c10.9604,0,20.936-4.0272,28.7096-10.6968C67.7721,75.6936,62.4117,65.4792,62.4117,54z"/>
                    <path fill="#F79E1B" d="M152.4117,54c0,17.4984-21.2957,39-47.4117,39c-10.9604,0-20.936-4.0272-28.7096-10.6968c8.3492-6.6096,13.7096-16.824,13.7096-28.3032c0-11.4792-5.3604-21.6936-13.7096-28.3032C83.5641,19.0272,93.5396,15,104.5,15c26.116,0,47.9117,21.5016,47.9117,39z"/>
                  </g>
                </g>
              </svg>
            </div>
            
            {/* American Express */}
            <div className="group flex items-center justify-center w-24 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <svg viewBox="0 0 750 471" className="h-8 w-auto" preserveAspectRatio="xMidYMid">
                <rect fill="#2557D6" width="750" height="471" rx="40"/>
                <path fill="#FFFFFF" d="M0,221.729l36.857-85.417h66.418l6.076,12.686V136.312h82.069l16.617,45.2l16.055-45.2h271.188v10.638c0,0,17.923-10.638,46.018-10.638l88.402,0.336l6.216,12.476v-12.812h69.309l11.396,17.5v-17.5h70.035v135.417H710.721l-10.656-17.593v17.593h-86.824l-7.953-18.548h-21.101l-7.766,18.548h-47.385c-24.238,0-41.227-10.405-41.227-10.405v10.405h-102.61l-16.523-18.625v18.625H155.327l-7.953-18.548h-21.054l-7.813,18.548H73.715c-24.731,0-41.46-10.218-41.46-10.218v10.218H0V221.729z M227.363,245.5h28.818V169.896h-39.973l-22.361,53.666l-23.962-53.666h-38.932V245.5h28.13v-54.009l27.755,54.009h23.522l27.003-54.009V245.5z M148.429,245.5h-79.088l-31.67-36.937L6.469,245.5H0v-75.604h31.67l31.296,36.75l30.884-36.75h54.578V245.5z M351.094,245.5h-91.088v-75.604h91.088v21.771h-62.271v8.813h60.783v20.584h-60.783v9.299h62.271V245.5z M419.893,245.5h-37.117l-40.395-54.009V245.5h-28.818v-75.604h38.837l38.675,51.665v-51.665h28.818V245.5z M425.686,245.5v-75.604h46.158c24.191,0,39.16,11.732,39.16,29.984c0,19.297-14.921,30.453-41.788,30.453h-15.13V245.5H425.686z M454.086,211.16h14.642c8.094,0,13.236-4.303,13.236-10.779c0-6.477-5.142-10.638-13.236-10.638h-14.642V211.16z M522.885,245.5v-75.604h28.818v53.833h44.645V245.5H522.885z M602.179,245.5v-75.604h91.088v21.771h-62.271v8.813h60.783v20.584h-60.783v9.299h62.271V245.5H602.179z M750,245.5h-31.949l-32.41-36.937l-31.202,36.937h-6.469v-75.604h31.67l31.296,36.75l30.884-36.75h8.18V245.5z"/>
              </svg>
            </div>
            
            {/* PayPal */}
            <div className="group flex items-center justify-center w-24 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <svg viewBox="0 0 124 33" className="h-8 w-auto" preserveAspectRatio="xMidYMid">
                <path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"/>
                <path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/>
              </svg>
            </div>
            
            {/* Skrill */}
            <div className="group flex items-center justify-center w-24 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <div className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#862165">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                <span className="text-lg font-bold text-[#862165]">Skrill</span>
              </div>
            </div>
            
            {/* Bitcoin */}
            <div className="group flex items-center justify-center w-24 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <svg viewBox="0 0 32 32" className="h-10 w-auto" preserveAspectRatio="xMidYMid">
                <g fill="none" fillRule="evenodd">
                  <circle cx="16" cy="16" r="16" fill="#F7931A"/>
                  <path fill="#FFF" fillRule="nonzero" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.113-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.171-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.314-1.256-.314l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/>
                </g>
              </svg>
            </div>
            
            {/* Wire Transfer */}
            <div className="group flex items-center justify-center w-24 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <div className="flex flex-col items-center">
                <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span className="text-xs text-slate-500 mt-1 font-medium">Wire Transfer</span>
              </div>
            </div>
          </div>
          
          {/* Security badges */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>PCI DSS Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span>FCA Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2h6v4H7V6zm8 8v-2h2v2h-2zm2-4h-2V8h2v2zm-4 4H7v-2h6v2zm-8-2H3v-2h2v2zm0 2v-2H3a2 2 0 002 2zm8-8V4h2a2 2 0 012 2h-4z" clipRule="evenodd" />
                </svg>
                <span>FSCS Protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-white">Neon Capital</span>
              </div>
              <p className="text-sm leading-relaxed">Your trusted partner for modern digital banking solutions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/products" className="hover:text-white transition">Personal Banking</a></li>
                <li><a href="/products" className="hover:text-white transition">Business Banking</a></li>
                <li><a href="/products" className="hover:text-white transition">Credit Cards</a></li>
                <li><a href="/products" className="hover:text-white transition">Loans</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
                <li><a href="/promotions" className="hover:text-white transition">Promotions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>info@neonbankcapital.com</li>
                <li>+447476937605</li>
                <li>85 King William St, London EC4N 7BL</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2025 Neon Capital. All Rights Reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
