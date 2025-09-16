import React from "react";

export default function Landing() {
  return (
    <main className="bg-white w-full min-h-screen">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center pt-12 pb-16 px-4 md:px-8 lg:px-0">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Headline and CTA */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Land interviews <span className="text-teal-500">twice as fast</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl">
              Candidate 5 tailors your CV in minutes, making you twice as likely to land an interview.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
              <a href="/signup" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-center">
                Get Started Free
              </a>
              <a href="#how-it-works" className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-center">
                Learn More
              </a>
            </div>
            <div className="mt-8 space-y-4 text-sm text-gray-600 max-w-lg">
              <p>With the Career Arc you'll have a foundation for all future job applications.</p>
              <p>The Application Widget will also show your match, highlight any gaps and help you prep those for the future.</p>
              <p>Receive your covering letter and CV, we'll help make sure they are perfect for each job posting.</p>
            </div>
          </div>
          {/* Right: Hero Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="/hero-woman-desk.png"
              alt="Professional woman working at desk with plants"
              className="rounded-lg object-cover w-full max-w-lg h-96 shadow-lg"
            />
          </div>
        </div>
        {/* Statistics Cards */}
        <div className="w-full max-w-7xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-teal-50 border border-teal-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">80%</div>
            <div className="text-sm font-semibold text-gray-800 mb-1">never seen by a recruiter</div>
            <div className="text-xs text-gray-600 leading-relaxed">CVs are filtered out by ATS systems before reaching human eyes</div>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">28</div>
            <div className="text-sm font-semibold text-gray-800 mb-1">days</div>
            <div className="text-sm font-semibold text-gray-800 mb-2">spent between jobs</div>
            <div className="text-xs text-gray-600 leading-relaxed">Average time job seekers spend looking for their next role</div>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">8</div>
            <div className="text-sm font-semibold text-gray-800 mb-1">hours</div>
            <div className="text-sm font-semibold text-gray-800 mb-2">to write a CV</div>
            <div className="text-xs text-gray-600 leading-relaxed">Time typically spent crafting and perfecting a resume</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">HOW IT WORKS</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center lg:text-left">
              <img src="/paste-job-posting.png" alt="Paste a job posting" className="w-full h-48 object-cover rounded-lg mb-6" />
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-xl mr-3">📋</div>
                <h3 className="text-xl font-semibold text-gray-900">Paste a job posting</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Candidate 5 will parse the job posting and extract the key requirements, skills, and qualifications that employers are looking for.</p>
            </div>
            {/* Step 2 */}
            <div className="text-center lg:text-left">
              <img src="/showcase-skills.png" alt="Showcase your skills" className="w-full h-48 object-cover rounded-lg mb-6" />
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-xl mr-3">⭐</div>
                <h3 className="text-xl font-semibold text-gray-900">Showcase your skills</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Our AI will analyze your experience and highlight the most relevant skills and achievements that match the job requirements.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center lg:text-left">
              <img src="/stay-informed.png" alt="Stay Informed" className="w-full h-48 object-cover rounded-lg mb-6" />
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-xl mr-3">📊</div>
                <h3 className="text-xl font-semibold text-gray-900">Stay Informed</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Track your applications and get insights on your job search progress with our comprehensive dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Testimonials</h2>
          <div className="mb-8">
            <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
              "Have you ever wondered how some services launch with hundreds of testimonials?"
            </blockquote>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              We know figuring it out takes time. What we can promise is that we'll work with you to make sure you're getting the best possible results from our service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                "Candidate 5 helped me land my dream job in just 2 weeks. The AI-powered CV optimization made all the difference."
              </p>
              <div className="font-semibold text-gray-900">Sarah Johnson</div>
              <div className="text-sm text-gray-600">Marketing Manager</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                "I was getting no responses to my applications. After using Candidate 5, I got 3 interviews in the first week."
              </p>
              <div className="font-semibold text-gray-900">Michael Chen</div>
              <div className="text-sm text-gray-600">Software Developer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </footer>
    </main>
  );
}