// components/EnhancedHeroSection.tsx
// This version more closely matches the Figma design with improved responsive behavior
import React from 'react';

export const EnhancedHeroSection: React.FC = () => {
  return (
    <section className="relative bg-white py-8 sm:py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Hero Content */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Land interviews{' '}
              <span className="text-teal-500">twice as fast</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Candidate 5 tailors your CV in minutes, making you twice as 
              likely to land an interview.
            </p>
          </div>

          {/* Mobile Hero Image */}
          <div className="mb-8">
            <img
              src="/api/placeholder/400/300"
              alt="Professional woman working at desk with plants"
              className="rounded-lg object-cover w-full h-64 shadow-lg"
            />
          </div>

          {/* Mobile Statistics - Stacked */}
          <div className="space-y-4 mb-8">
            <StatCard 
              percentage="80%" 
              title="never seen by a recruiter"
              description="CVs are filtered out by ATS systems"
            />
            <StatCard 
              percentage="28" 
              title="days spent between jobs"
              description="Average job search duration"
            />
            <StatCard 
              percentage="8" 
              title="hours to write a CV"
              description="Time spent crafting resumes"
            />
          </div>

          {/* Mobile CTA */}
          <div className="text-center">
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg mb-3 transition-colors duration-200">
              Get Started Free
            </button>
            <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden lg:hidden md:block">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Land interviews{' '}
              <span className="text-teal-500">twice as fast</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
              Candidate 5 tailors your CV in minutes, making you twice as 
              likely to land an interview.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 items-center mb-12">
            <div>
              <img
                src="/api/placeholder/500/400"
                alt="Professional woman working at desk with plants"
                className="rounded-lg object-cover w-full h-80 shadow-lg"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <StatCard 
                percentage="80%" 
                title="never seen by a recruiter"
                description="CVs filtered by ATS"
              />
              <StatCard 
                percentage="28" 
                title="days between jobs"
                description="Average search time"
              />
              <StatCard 
                percentage="8" 
                title="hours to write CV"
                description="Time investment"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Get Started Free
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div>
              <h1 className="text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Land interviews{' '}
                <span className="text-teal-500">twice as fast</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Candidate 5 tailors your CV in minutes, making you twice as 
                likely to land an interview.
              </p>

              <div className="flex space-x-4 mb-12">
                <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200">
                  Get Started Free
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-8 rounded-lg transition-colors duration-200">
                  Learn More
                </button>
              </div>

              {/* Additional Text */}
              <div className="space-y-3 text-sm text-gray-600">
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

            {/* Right Column - Image and Stats */}
            <div>
              <div className="mb-8">
                <img
                  src="/api/placeholder/600/500"
                  alt="Professional woman working at desk with plants"
                  className="rounded-lg object-cover w-full h-96 shadow-lg"
                />
              </div>
              
              {/* Desktop Statistics - Side by side */}
              <div className="grid grid-cols-3 gap-4">
                <StatCard 
                  percentage="80%" 
                  title="never seen"
                  subtitle="by recruiter"
                  compact
                />
                <StatCard 
                  percentage="28" 
                  title="days"
                  subtitle="between jobs"
                  compact
                />
                <StatCard 
                  percentage="8" 
                  title="hours"
                  subtitle="to write CV"
                  compact
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced StatCard component
interface StatCardProps {
  percentage: string;
  title: string;
  subtitle?: string;
  description?: string;
  compact?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  percentage, 
  title, 
  subtitle, 
  description, 
  compact = false 
}) => {
  if (compact) {
    return (
      <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-teal-600 mb-1">
          {percentage}
        </div>
        <div className="text-xs font-semibold text-gray-800">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs font-semibold text-gray-800">
            {subtitle}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-teal-50 border border-teal-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200">
      <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">
        {percentage}
      </div>
      <div className="text-sm font-semibold text-gray-800 mb-1">
        {title}
      </div>
      {subtitle && (
        <div className="text-sm font-semibold text-gray-800 mb-2">
          {subtitle}
        </div>
      )}
      {description && (
        <div className="text-xs text-gray-600 leading-relaxed">
          {description}
        </div>
      )}
    </div>
  );
};

// Enhanced How It Works Section with better responsive behavior
export const EnhancedHowItWorksSection: React.FC = () => {
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
    <section className="py-12 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-xl mr-4 flex-shrink-0">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
              </div>
              <img
                src={step.illustration}
                alt={step.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Layout - Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <img
                src={step.illustration}
                alt={step.title}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <div className="flex items-center justify-center mb-4">
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
          ))}
        </div>
      </div>
    </section>
  );
};

