import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      title: 'Paste a job posting',
      description: 'Candidate 5 will parse the job posting and extract the key requirements, skills, and qualifications that employers are looking for.',
      icon: '📋',
      illustration: '/paste-job-posting.png'
    },
    {
      title: 'Showcase your skills',
      description: 'Our AI will analyze your experience and highlight the most relevant skills and achievements that match the job requirements.',
      icon: '⭐',
      illustration: '/showcase-skills.png'
    },
    {
      title: 'Stay Informed',
      description: 'Track your applications and get insights on your job search progress with our comprehensive dashboard.',
      icon: '📊',
      illustration: '/stay-informed.png'
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
