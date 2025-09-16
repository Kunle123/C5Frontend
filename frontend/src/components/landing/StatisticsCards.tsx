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
