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

