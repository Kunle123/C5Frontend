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
}

