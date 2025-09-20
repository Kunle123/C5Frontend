import React from 'react';

const EDGE_MARGIN = 16; // px

export const StatsTiles: React.FC = () => (
  <div className="flex flex-col md:flex-row gap-4 w-full max-w-[956px] mx-auto">
    {/* Tile 1: 80% */}
    <div className="relative w-[375px] h-[151px] md:w-[240px] md:h-[205px] lg:w-[300px] lg:h-[250px] bg-[#BEDED5] rounded-[10px] overflow-hidden mx-auto">
      <div className="flex flex-col gap-[1px] md:gap-0 h-full justify-between px-0 pt-4 pb-4">
        {/* 80% (number group) */}
        <div className="flex flex-row items-baseline pl-4" style={{ zIndex: 1 }}>
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
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: '60px',
              color: '#fff',
              lineHeight: '60px',
              fontWeight: 400,
              transform: 'rotate(0deg)',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              zIndex: 2,
            }}
            className="ml-2"
          >
            CVs
          </span>
        </div>
        {/* Supporting text and icon row for Tile 1 */}
        <div className="flex flex-row items-end pl-6">
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 24,
              color: "#555454",
              lineHeight: "32px",
              fontWeight: 400,
              maxWidth: undefined,
            }}
            className="block lg:max-w-[180px]"
          >
            never seen by a recruiter
          </span>
        </div>
        <img
          src="/bin.svg"
          alt="Bin"
          className="absolute right-[3px] bottom-4 w-[82px] h-[82px] md:w-[50px] md:h-auto lg:w-[72px] lg:h-[72px]"
          style={{ filter: 'invert(1)' }}
        />
      </div>
    </div>
    {/* Tile 2: 28 days */}
    <div className="relative w-[375px] h-[151px] md:w-[240px] md:h-[205px] lg:w-[300px] lg:h-[250px] bg-[#BEDED5] rounded-[10px] overflow-hidden mx-auto">
      <div className="flex flex-col gap-[1px] md:gap-0 h-full justify-between px-0 pt-4 pb-4">
        <div className="flex flex-row items-end pl-4">
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
        {/* Supporting text and icon row for Tile 2 */}
        <div className="flex flex-row items-end pl-6">
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 24,
              color: "#555454",
              lineHeight: "32px",
              fontWeight: 400,
              maxWidth: undefined,
            }}
            className="block lg:max-w-[180px]"
          >
            spent between
            <br className="md:block hidden" />
            jobs
          </span>
        </div>
        <img
          src="/calendar.svg"
          alt="Calendar"
          className="absolute right-[3px] bottom-4 w-[82px] h-[82px] md:w-[50px] md:h-auto lg:w-[72px] lg:h-[72px]"
          style={{ filter: 'invert(1)' }}
        />
      </div>
    </div>
    {/* Tile 3: 8 secs */}
    <div className="relative w-[375px] h-[151px] md:w-[240px] md:h-[205px] lg:w-[300px] lg:h-[250px] bg-[#BEDED5] rounded-[10px] overflow-hidden mx-auto">
      <div className="flex flex-col gap-[1px] md:gap-0 h-full justify-between px-0 pt-4 pb-4">
        <div className="flex flex-row items-end pl-4">
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
        {/* Supporting text and icon row for Tile 3 */}
        <div className="flex flex-row items-end pl-6">
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 24,
              color: "#555454",
              lineHeight: "32px",
              fontWeight: 400,
              maxWidth: undefined,
            }}
            className="block lg:max-w-[180px]"
          >
            to make an impression
          </span>
        </div>
        <img
          src="/stopwatch.svg"
          alt="Stopwatch"
          className="absolute right-[3px] bottom-4 w-[82px] h-[82px] md:w-[50px] md:h-auto lg:w-[72px] lg:h-[72px]"
          style={{ filter: 'invert(1)' }}
        />
      </div>
    </div>
  </div>
);
