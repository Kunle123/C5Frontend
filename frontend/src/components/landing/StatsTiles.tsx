import React from 'react';

const EDGE_MARGIN = 16; // px

export const StatsTiles: React.FC = () => (
  <div className="flex flex-col md:flex-row gap-4 w-full max-w-[956px] mx-auto">
    {/* Tile 1: 80% */}
    <div className="relative w-[375px] h-[151px] md:w-[240px] md:h-[205px] lg:w-[300px] lg:h-[250px] bg-[#BEDED5] rounded-[10px] overflow-hidden mx-auto">
      {/* 80% (number group) */}
      <div className="flex flex-row items-end absolute left-4 top-4" style={{ zIndex: 1 }}>
        <span
          style={{ fontFamily: "'Anton', sans-serif" }}
          className="text-[80px] md:text-[80px] lg:text-[100px] text-[#555454] leading-[80px] md:leading-[80px] lg:leading-[100px] font-normal"
        >
          80
        </span>
        <span
          style={{ fontFamily: "'Anton', sans-serif" }}
          className="text-[50px] md:text-[50px] lg:text-[64px] text-[#555454] leading-[50px] md:leading-[50px] lg:leading-[64px] font-normal ml-0"
        >
          %
        </span>
      </div>
      {/* Rotated CVs, absolutely positioned so 's' baseline aligns with bottom of 80, not overlapping icon */}
      <span
        className="absolute"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '60px',
          color: '#fff',
          lineHeight: '60px',
          fontWeight: 400,
          transform: 'rotate(90deg)',
          left: '140px', // move closer to number group
          bottom: '37px', // aligns with bottom of 80
          display: 'inline-block',
          whiteSpace: 'nowrap',
          zIndex: 2,
        }}
      >
        CVs
      </span>
      {/* never seen by a recruiter */}
      <span
        className="absolute left-6"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 24,
          color: "#555454",
          lineHeight: "32px",
          fontWeight: 400,
          bottom: '37px',
          maxWidth: undefined,
        }}
      >
        <span className="block lg:max-w-[180px]" style={{ wordBreak: 'break-word' }}>
          never seen by a recruiter
        </span>
      </span>
      {/* Bin Icon */}
      <img
        src="/bin.svg"
        alt="Bin"
        className="absolute w-[48px] md:w-[50px] md:h-auto lg:w-[72px] lg:h-[72px]"
        style={{ filter: 'invert(1)', right: EDGE_MARGIN, bottom: '52px' }}
      />
    </div>
    {/* Tile 2: 28 days */}
    <div className="relative w-[375px] h-[151px] md:w-[240px] md:h-[205px] lg:w-[300px] lg:h-[250px] bg-[#BEDED5] rounded-[10px] overflow-hidden mx-auto">
      <div className="flex flex-row items-end absolute left-4 top-4">
        <span
          style={{ fontFamily: "'Anton', sans-serif" }}
          className="text-[80px] md:text-[80px] lg:text-[100px] text-[#555454] leading-[80px] md:leading-[80px] lg:leading-[100px] font-normal"
        >
          28
        </span>
        <span
          style={{ fontFamily: "'Anton', sans-serif" }}
          className="text-[60px] md:text-[60px] lg:text-[64px] text-white leading-[60px] md:leading-[60px] lg:leading-[64px] font-normal ml-2"
        >
          days
        </span>
      </div>
      {/* spent between Jobs */}
      <span
        className="absolute left-6"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 24,
          color: "#555454",
          lineHeight: "32px",
          fontWeight: 400,
          bottom: '37px',
          maxWidth: undefined,
        }}
      >
        <span className="block lg:max-w-[180px]" style={{ wordBreak: 'break-word' }}>
          spent between<br />Jobs
        </span>
      </span>
      {/* Calendar Icon */}
      <img
        src="/calendar.svg"
        alt="Calendar"
        className="absolute w-[48px] md:w-[50px] md:h-auto lg:w-[72px] lg:h-[72px]"
        style={{ filter: 'invert(1)', right: EDGE_MARGIN, bottom: '52px' }}
      />
    </div>
    {/* Tile 3: 8 secs */}
    <div className="relative w-[375px] h-[151px] md:w-[240px] md:h-[205px] lg:w-[300px] lg:h-[250px] bg-[#BEDED5] rounded-[10px] overflow-hidden mx-auto">
      <div className="flex flex-row items-end absolute left-4 top-4">
        <span
          style={{ fontFamily: "'Anton', sans-serif" }}
          className="text-[80px] md:text-[80px] lg:text-[100px] text-[#555454] leading-[80px] md:leading-[80px] lg:leading-[100px] font-normal"
        >
          8
        </span>
        <span
          style={{ fontFamily: "'Anton', sans-serif" }}
          className="text-[60px] md:text-[60px] lg:text-[64px] text-white leading-[60px] md:leading-[60px] lg:leading-[64px] font-normal ml-2"
        >
          secs
        </span>
      </div>
      {/* to make an impression */}
      <span
        className="absolute left-6"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 24,
          color: "#555454",
          lineHeight: "32px",
          fontWeight: 400,
          bottom: '37px',
          maxWidth: undefined,
        }}
      >
        <span className="block lg:max-w-[180px]" style={{ wordBreak: 'break-word' }}>
          to make an<br />impression
        </span>
      </span>
      {/* Stopwatch Icon */}
      <img
        src="/stopwatch.svg"
        alt="Stopwatch"
        className="absolute w-[48px] md:w-[50px] md:h-auto lg:w-[72px] lg:h-[72px]"
        style={{ filter: 'invert(1)', right: EDGE_MARGIN, bottom: '52px' }}
      />
    </div>
  </div>
);
