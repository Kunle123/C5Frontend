// app/page.tsx (for App Router) or pages/index.tsx (for Pages Router)
import { LandingPage } from '@/components/LandingPage';

export default function HomePage() {
  return <LandingPage />;
}

// Alternative layout if you want to include navigation
// app/layout.tsx or pages/_app.tsx
import { Navigation } from '@/components/Navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

// components/Navigation.tsx (optional - if you need a header)
import React, { useState } from 'react';
import Link from 'next/link';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-teal-600">
              Candidate 5
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/features" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-teal-600 focus:outline-none focus:text-teal-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link href="/features" className="text-gray-700 hover:text-teal-600 block px-3 py-2 text-base font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-teal-600 block px-3 py-2 text-base font-medium">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-teal-600 block px-3 py-2 text-base font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-teal-600 block px-3 py-2 text-base font-medium">
                Contact
              </Link>
              <div className="border-t border-gray-200 pt-4">
                <Link href="/login" className="text-gray-700 hover:text-teal-600 block px-3 py-2 text-base font-medium">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-teal-600 hover:bg-teal-700 text-white block px-3 py-2 rounded-lg font-medium mt-2 text-center">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

