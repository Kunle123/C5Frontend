// components/LandingPage.tsx
import React from 'react';
import { HeroSection } from './HeroSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TestimonialsSection } from './TestimonialsSection';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

// components/HeroSection.tsx
import React from 'react';
import { StatisticsCards } from './StatisticsCards';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Land interviews{' '}
              <span className="text-teal-500">twice as fast</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              Candidate 5 tailors your CV in minutes, making you twice as 
              likely to land an interview.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Get Started Free
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Learn More
              </button>
            </div>

            {/* Additional Text */}
            <div className="mt-8 space-y-4 text-sm text-gray-600">
              <p>
                With the Career Arc you'll have a foundation for all future job 
                applications.
              </p>
              <p>
                The Application Widget will also your match, highlight any 
                gaps and help you prep those for the future.
              </p>
              <p>
                Receive your covering letter and CV, we'll help make sure they 
                are perfect for each job posting.
              </p>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 lg:aspect-w-3 lg:aspect-h-4">
              <img
                src="/api/placeholder/600/500"
                alt="Professional woman working at desk with plants"
                className="rounded-lg object-cover w-full h-full shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <StatisticsCards />
      </div>
    </section>
  );
};

// components/StatisticsCards.tsx
import React from 'react';

export const StatisticsCards: React.FC = () => {
  const stats = [
    {
      percentage: '80%',
      title: 'never seen by a recruiter',
      description: 'CVs are filtered out by ATS systems before reaching human eyes'
    },
    {
      percentage: '28',
      title: 'days',
      subtitle: 'spent between jobs',
      description: 'Average time job seekers spend looking for their next role'
    },
    {
      percentage: '8',
      title: 'hours',
      subtitle: 'to write a CV',
      description: 'Time typically spent crafting and perfecting a resume'
    }
  ];

  return (
    <div className="mt-16 lg:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-teal-50 border border-teal-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">
              {stat.percentage}
            </div>
            <div className="text-sm font-semibold text-gray-800 mb-1">
              {stat.title}
            </div>
            {stat.subtitle && (
              <div className="text-sm font-semibold text-gray-800 mb-2">
                {stat.subtitle}
              </div>
            )}
            <div className="text-xs text-gray-600 leading-relaxed">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// components/HowItWorksSection.tsx
import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      title: 'Paste a job posting',
      description: 'Candidate 5 will parse the job posting and extract the key requirements, skills, and qualifications that employers are looking for.',
      icon: '📋',
      illustration: '/api/placeholder/300/200'
    },
    {
      title: 'Showcase your skills',
      description: 'Our AI will analyze your experience and highlight the most relevant skills and achievements that match the job requirements.',
      icon: '⭐',
      illustration: '/api/placeholder/300/200'
    },
    {
      title: 'Stay Informed',
      description: 'Track your applications and get insights on your job search progress with our comprehensive dashboard.',
      icon: '📊',
      illustration: '/api/placeholder/300/200'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            HOW IT WORKS
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center lg:text-left">
              {/* Mobile/Tablet Layout */}
              <div className="lg:hidden mb-8">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center text-2xl mr-4">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <img
                  src={step.illustration}
                  alt={step.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block">
                <img
                  src={step.illustration}
                  alt={step.title}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-xl mr-3">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// components/TestimonialsSection.tsx
import React from 'react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
          Testimonials
        </h2>
        
        <div className="mb-8">
          <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
            "Have you ever wondered how some services launch with hundreds of testimonials?"
          </blockquote>
          
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            We know figuring it out takes time. What we can promise is that we'll work with you to make sure you're getting the best possible results from our service.
          </p>
        </div>

        {/* Placeholder for actual testimonials */}
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
  );
};

// components/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Candidate 5</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered CV optimization to help you land interviews twice as fast.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">CV Optimization</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ATS Proof</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career Arc</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Application Tracker</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Support */}
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
          <p className="text-sm text-gray-400">
            © 2024 Candidate 5. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

