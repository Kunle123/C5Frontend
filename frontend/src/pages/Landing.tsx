import React from "react";
import { StatsTiles } from "../components/landing/StatsTiles";

export default function Landing() {
  return (
    <main className="bg-white w-full min-h-screen flex flex-col items-center justify-start">
      {/* Login Button Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <a
          href="/login"
          className="px-4 py-2 border rounded shadow border-[#555454] text-[#555454] bg-transparent hover:bg-[#f5f5f5] transition-colors"
          style={{ fontWeight: 500 }}
        >
          Log In
        </a>
      </div>
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center pt-12 pb-8 px-4 md:px-8 lg:px-0">
        <h1
          className="mb-8 text-center"
          style={{
            fontFamily: 'Anton, sans-serif',
            fontWeight: 400,
            fontSize: 60,
            color: '#555454',
            lineHeight: '72px',
          }}
        >
          Land interviews twice as fast
        </h1>
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full justify-center items-center">
          <a
            href="/signup"
            className="px-6 py-3 rounded font-semibold text-white bg-[#555454] hover:bg-[#333] shadow transition-colors text-lg w-full sm:w-auto text-center"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            Create Your Free Account
          </a>
          <a
            href="#how-it-works"
            className="px-6 py-3 rounded font-semibold border border-[#555454] text-[#555454] bg-transparent hover:bg-[#f5f5f5] shadow transition-colors text-lg w-full sm:w-auto text-center"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            See How It Works
          </a>
        </div>
        <img
          src="/hero-woman-desk.png"
          alt="Professional woman working at desk with plants"
          className="rounded-lg object-cover shadow-lg w-full max-w-[960px] md:max-w-[768px] lg:max-w-[960px]"
          style={{ width: '100%' }}
        />
        <style>{`
          @media (max-width: 1023px) and (min-width: 768px) {
            .hero-img-tablet { width: 768px !important; }
          }
        `}</style>
        <img
          src="/hero-woman-desk.png"
          alt="Professional woman working at desk with plants"
          className="rounded-lg object-cover shadow-lg hero-img-tablet hidden md:block lg:hidden"
        />
        <p
          className="mt-6 text-center"
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 300,
            fontSize: 36,
            color: '#555454',
            lineHeight: '44px',
            maxWidth: 960,
          }}
        >
          Candidate 5 tailors your CV in minutes, making you twice as likely to land an interview.
        </p>
      </section>
      {/* 888 Stats Tile Row */}
      <div className="mt-12">
        <StatsTiles />
              </div>
      {/* Desktop only: Full-width segment below stats tiles */}
      <div className="hidden lg:block w-full mt-[10px]" style={{ background: '#F7F7F7', height: 450 }}>
        <div className="w-full h-full flex flex-col justify-center items-center px-8">
          <div className="w-full max-w-[960px] mx-auto text-left">
            <p className="text-[32px] font-light leading-tight mb-8" style={{ color: '#555454', fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              With the Career Arc you’ll have a single foundation for all future job applications.
            </p>
            <p className="text-[32px] font-light leading-tight mb-8" style={{ color: '#555454', fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              The Application Wizard will rate your match, highlight any gaps and help you plug these for the future.
            </p>
            <p className="text-[32px] font-light leading-tight" style={{ color: '#555454', fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              Review your covering letter and CV, we’ll help make any last minute tweaks to ensure it’s pitch perfect.
              </p>
            </div>
                    </div>
                  </div>
      {/* Tablet only: Full-width segment below stats tiles */}
      <div className="hidden md:block lg:hidden w-full mt-[10px]" style={{ background: '#F7F7F7', height: 450 }}>
        <div className="w-full h-full flex flex-col justify-center items-center px-4">
          <div className="w-full max-w-[960px] mx-auto text-left">
            <p className="text-[28px] font-light leading-tight mb-8" style={{ color: '#555454', fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              With the Career Arc you’ll have a single foundation for all future job applications.
            </p>
            <p className="text-[28px] font-light leading-tight mb-8" style={{ color: '#555454', fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              The Application Wizard will rate your match, highlight any gaps and help you plug these for the future.
            </p>
            <p className="text-[28px] font-light leading-tight" style={{ color: '#555454', fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              Review your covering letter and CV, we’ll help make any last minute tweaks to ensure it’s pitch perfect.
            </p>
          </div>
        </div>
      </div>
      {/* Mobile only: Full-width segment below stats tiles */}
      <div className="block md:hidden w-full mt-[10px]" style={{ background: '#F7F7F7', height: 450 }}>
        <div className="w-full h-full flex flex-col justify-center items-center px-2">
          <div className="w-full max-w-[960px] mx-auto text-left">
            <p className="text-[24px] font-light leading-tight mb-8" style={{ color: '#555454', fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              With the Career Arc you’ll have a single foundation for all future job applications.
            </p>
            <p className="text-[24px] font-light leading-tight mb-8" style={{ color: '#555454', fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              The Application Wizard will rate your match, highlight any gaps and help you plug these for the future.
            </p>
            <p className="text-[24px] font-light leading-tight" style={{ color: '#555454', fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>
              Review your covering letter and CV, we’ll help make any last minute tweaks to ensure it’s pitch perfect.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section - Desktop/Tablet */}
      <section className="w-full flex-col items-center py-16 bg-white hidden md:block">
        <div className="w-full max-w-[960px] mx-auto">
          <h2 className="text-center mb-8" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 44, color: '#555454' }}>
            HOW IT WORKS
          </h2>
          {/* ...existing flex-row layout... */}
          <div className="flex flex-row w-[960px] h-[508px] mx-auto mb-[10px]">
            {/* Left: Image */}
            <div className="flex-shrink-0 flex items-start justify-start">
              <img src="/paste-job-posting.jpeg" alt="Paste a job posting" className="rounded-lg object-cover shadow-lg w-[300px] h-[300px] lg:w-[450px] lg:h-[450px]" />
        </div>
            {/* Right: Text Box */}
            <div className="flex flex-col justify-center items-end ml-8" style={{ minWidth: 0 }}>
              <div className="flex flex-col items-end text-right" style={{ gap: 10, width: 420 }}>
                <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 44, color: '#555454' }}>
                  Paste a job posting
                </h3>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: 24, color: '#555454', marginTop: 10 }}>
                  Candidate 5 will provide keyword and match analysis so you know which roles suit you best and how to improve your chances.
                </p>
              </div>
                </div>
                </div>
          <div className="flex flex-row w-[960px] h-[508px] mx-auto mb-[10px]">
            {/* Left: Text Box */}
            <div className="flex flex-col justify-center items-start mr-8" style={{ minWidth: 0 }}>
              <div className="flex flex-col items-start text-left" style={{ gap: 10, width: 420 }}>
                <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 44, color: '#555454' }}>
                  Showcase your skills
                </h3>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: 24, color: '#555454', marginTop: 10 }}>
                  Each time you apply for a role our AI will look across your experience highlighting those that fit best and placing a spotlight on your skills.
                </p>
              </div>
            </div>
            {/* Right: Image */}
            <div className="flex-shrink-0 flex items-start justify-end">
              <img src="/showcase-skills.jpeg" alt="Showcase your skills" className="rounded-lg object-cover shadow-lg w-[300px] h-[300px] lg:w-[450px] lg:h-[450px]" />
            </div>
              </div>
          <div className="flex flex-row w-[960px] h-[508px] mx-auto">
            {/* Left: Image */}
            <div className="flex-shrink-0 flex items-start justify-start">
              <img src="/stay-informed.jpeg" alt="Stay Informed" className="rounded-lg object-cover shadow-lg w-[300px] h-[300px] lg:w-[450px] lg:h-[450px]" />
            </div>
            {/* Right: Text Box */}
            <div className="flex flex-col justify-center items-end ml-8" style={{ minWidth: 0 }}>
              <div className="flex flex-col items-end text-right" style={{ gap: 10, width: 420 }}>
                <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 44, color: '#555454' }}>
                  Stay Informed
                </h3>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: 24, color: '#555454', marginTop: 10 }}>
                  It’s easy to lose track of where you are in the applications process. C5 helps you keep track of every role, contact salary range so you’re ready when opportunity comes knocking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section - Mobile Only */}
      <section className="w-full flex flex-col items-center py-8 bg-white md:hidden">
        <h2 className="text-center mb-8" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 32, color: '#555454' }}>
          HOW IT WORKS
            </h2>
        {/* Step 1 */}
        <div className="flex flex-col items-center w-full mb-8">
          <img src="/paste-job-posting.jpeg" alt="Paste a job posting" className="rounded-lg object-cover shadow-lg" style={{ width: 375, height: 375, maxWidth: '100%' }} />
          <h3 className="text-center w-full" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 24, color: '#555454', marginTop: 16 }}>
            Paste a job posting
          </h3>
          <div style={{ width: 375, maxWidth: '100%', margin: '0 auto', background: 'transparent', padding: 0, display: 'flex', justifyContent: 'center' }}>
            <p className="text-left" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: 18, color: '#555454', marginTop: 8, marginBottom: 0 }}>
              Candidate 5 will provide keyword and match analysis so you know which roles suit you best and how to improve your chances.
            </p>
          </div>
        </div>
        {/* Step 2 */}
        <div className="flex flex-col items-center w-full mb-8">
          <img src="/showcase-skills.jpeg" alt="Showcase your skills" className="rounded-lg object-cover shadow-lg" style={{ width: 375, height: 375, maxWidth: '100%' }} />
          <h3 className="text-center w-full" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 24, color: '#555454', marginTop: 16 }}>
            Showcase your skills
          </h3>
          <div style={{ width: 375, maxWidth: '100%', margin: '0 auto', background: 'transparent', padding: 0, display: 'flex', justifyContent: 'center' }}>
            <p className="text-left" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: 18, color: '#555454', marginTop: 8, marginBottom: 0 }}>
              Each time you apply for a role our AI will look across your experience highlighting those that fit best and placing a spotlight on your skills.
            </p>
          </div>
        </div>
        {/* Step 3 */}
        <div className="flex flex-col items-center w-full mb-8">
          <img src="/stay-informed.jpeg" alt="Stay Informed" className="rounded-lg object-cover shadow-lg" style={{ width: 375, height: 375, maxWidth: '100%' }} />
          <h3 className="text-center w-full" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 24, color: '#555454', marginTop: 16 }}>
            Stay Informed
          </h3>
          <div style={{ width: 375, maxWidth: '100%', margin: '0 auto', background: 'transparent', padding: 0, display: 'flex', justifyContent: 'center' }}>
            <p className="text-left" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: 18, color: '#555454', marginTop: 8, marginBottom: 0 }}>
              It’s easy to lose track of where you are in the applications process. C5 helps you keep track of every role, contact salary range so you’re ready when opportunity comes knocking.
            </p>
          </div>
        </div>
      </section>

      {/* Testemonials Section - Desktop/Tablet */}
      <section className="w-full flex-col items-center py-16 bg-white hidden md:block">
        <div className="w-full max-w-[960px] mx-auto">
          <h2 className="text-center mb-8" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 44, color: '#555454' }}>
            Testemonials
          </h2>
          <div style={{ background: '#EEF0F6', borderRadius: 12, maxWidth: 960, margin: '0 auto', padding: 32 }}>
            <p className="text-center" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: 24, color: '#555454', margin: 0 }}>
              Have you ever wondered how some services launch with hundreds of testimonials?
              <br /><br />
              We never figured it out either.
              <br /><br />
              What we can offer is free, full unfettered access to our service so you can make your own mind up.
            </p>
          </div>
        </div>
      </section>
      {/* Testemonials Section - Mobile Only */}
      <section className="w-full flex flex-col items-center py-8 bg-white md:hidden">
        <h2 className="text-center mb-8" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 44, color: '#555454' }}>
          Testemonials
        </h2>
        <div style={{ background: '#EEF0F6', borderRadius: 12, width: '100%', maxWidth: 375, margin: 10, padding: 20 }}>
          <p className="text-center" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: 18, color: '#555454', margin: 0 }}>
            Have you ever wondered how some services launch with hundreds of testimonials?
            <br /><br />
            We never figured it out either.
            <br /><br />
            What we can offer is free, full unfettered access to our service so you can make your own mind up.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 w-full">
        <div className="mx-auto px-0 md:px-4 sm:px-6 lg:px-8 w-full max-w-full">
          <div className="mx-auto" style={{ maxWidth: '100%' }}>
            <div className="mx-auto w-full md:max-w-[768px] lg:max-w-[960px]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Candidate 5</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    AI-powered CV optimization to help you land interviews twice as fast.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-4 text-gray-300">Features</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">CV Optimization</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">ATS Proof</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Career Arc</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Application Tracker</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-4 text-gray-300">Company</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-4 text-gray-300">Support</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                <p className="text-sm text-gray-400">© 2024 Candidate 5. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}