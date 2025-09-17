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
                src="/hero-woman-desk.png"
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

