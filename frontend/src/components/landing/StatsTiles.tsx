import React from 'react';

export const StatsTiles: React.FC = () => (
  <div className="flex flex-row gap-2 w-[956px] h-[250px] mx-auto">
    {/* Tile 1: 80% */}
    <div className="relative w-[300px] h-[250px] bg-[#BEDED5] rounded-[10px] flex flex-col justify-between p-6 overflow-hidden">
      <div className="flex items-start">
        <span className="font-['Anton'] text-[100px] text-[#555454] leading-none">80%</span>
        <span className="absolute right-6 top-8 font-['Anton'] text-[60px] text-white font-normal transform rotate-90">CVS</span>
      </div>
      <div>
        <div className="text-[#555454] text-[28px] font-bold leading-tight">never seen by a<br />recruiter</div>
        {/* Bin Icon (placeholder SVG) */}
        <svg className="absolute right-8 bottom-8 w-12 h-12" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 48 48">
          <rect x="14" y="20" width="20" height="18" rx="2" fill="#fff" stroke="#fff"/>
          <rect x="18" y="12" width="12" height="8" rx="2" fill="#fff" stroke="#fff"/>
          <line x1="24" y1="20" x2="24" y2="38" stroke="#BEDED5" strokeWidth="2"/>
        </svg>
      </div>
    </div>
    {/* Tile 2: 28 days */}
    <div className="relative w-[300px] h-[250px] bg-[#BEDED5] rounded-[10px] flex flex-col justify-between p-6 overflow-hidden">
      <div className="flex items-start">
        <span className="font-['Anton'] text-[100px] text-[#555454] leading-none">28</span>
        <span className="ml-2 font-['Anton'] text-[60px] text-white font-normal">days</span>
      </div>
      <div>
        <div className="text-[#555454] text-[28px] font-bold leading-tight">spent between<br />Jobs</div>
        {/* Calendar Icon (placeholder SVG) */}
        <svg className="absolute right-8 bottom-8 w-12 h-12" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 48 48">
          <rect x="8" y="14" width="32" height="26" rx="4" fill="#fff" stroke="#fff"/>
          <rect x="8" y="20" width="32" height="2" fill="#BEDED5" stroke="#BEDED5"/>
          <circle cx="16" cy="28" r="2" fill="#BEDED5"/>
          <circle cx="24" cy="28" r="2" fill="#BEDED5"/>
          <circle cx="32" cy="28" r="2" fill="#BEDED5"/>
        </svg>
      </div>
    </div>
    {/* Tile 3: 8 secs */}
    <div className="relative w-[300px] h-[250px] bg-[#BEDED5] rounded-[10px] flex flex-col justify-between p-6 overflow-hidden">
      <div className="flex items-start">
        <span className="font-['Anton'] text-[100px] text-[#555454] leading-none">8</span>
        <span className="ml-2 font-['Anton'] text-[60px] text-white font-normal">secs</span>
      </div>
      <div>
        <div className="text-[#555454] text-[28px] font-bold leading-tight">to make an<br />impression</div>
        {/* Stopwatch Icon (placeholder SVG) */}
        <svg className="absolute right-8 bottom-8 w-12 h-12" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 48 48">
          <circle cx="24" cy="28" r="14" fill="#fff" stroke="#fff"/>
          <path d="M24 28V18" stroke="#BEDED5" strokeWidth="2"/>
          <path d="M24 28L32 28" stroke="#BEDED5" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  </div>
);
