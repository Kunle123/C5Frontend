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

