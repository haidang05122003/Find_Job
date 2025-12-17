import React from 'react';

const HeroIllustration = () => {
  return (
    <div className="relative w-full h-full flex justify-center items-center p-4">
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-2xl drop-shadow-md"
      >
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
            <feOffset dx="0" dy="5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.1" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Blob */}
        <path
          d="M400,100 C550,100 650,200 650,350 C650,500 550,550 400,550 C250,550 150,500 150,350 C150,200 250,100 400,100 Z"
          fill="url(#bg-gradient)"
        />

        {/* Decor: Background Elements */}
        <circle cx="200" cy="250" r="10" fill="#BFDBFE" />
        <circle cx="600" cy="200" r="15" fill="#BFDBFE" />
        <path d="M620,450 L640,430 M630,460 L650,440" stroke="#BFDBFE" strokeWidth="3" />

        {/* Main Character Group */}
        <g transform="translate(250, 180)">

          {/* Chair Back */}
          <path d="M80,200 L220,200 C230,200 240,210 240,220 L240,350 L60,350 L60,220 C60,210 70,200 80,200 Z" fill="#94A3B8" />

          {/* Character Body (Simplified Modern Style) */}
          <g transform="translate(50, 20)">
            {/* Hair (Back) */}
            <path d="M70,80 C70,50 90,30 120,30 C150,30 170,50 170,80 L170,110 L70,110 Z" fill="#1E293B" />
            {/* Neck */}
            <rect x="105" y="100" width="30" height="40" fill="#FFD7B5" />
            {/* Shirt */}
            <path d="M50,140 C50,140 70,130 120,130 C170,130 190,140 190,140 L190,280 L50,280 Z" fill="#3B82F6" />
            {/* Head */}
            <circle cx="120" cy="90" r="45" fill="#FFD7B5" />
            {/* Hair (Front/Bangs) */}
            <path d="M75,80 C75,50 100,40 120,40 C140,40 165,50 165,80 C165,80 140,70 120,70 C100,70 75,80 75,80" fill="#1E293B" />
            {/* Glasses */}
            <g stroke="#1E293B" strokeWidth="2" fill="none">
              <circle cx="100" cy="90" r="12" fill="rgba(255,255,255,0.2)" />
              <circle cx="140" cy="90" r="12" fill="rgba(255,255,255,0.2)" />
              <line x1="112" y1="90" x2="128" y2="90" />
            </g>
          </g>

          {/* Desk */}
          <path d="M-50,320 L350,320 L330,350 L-30,350 Z" fill="#E2E8F0" />
          <rect x="-30" y="350" width="20" height="150" fill="#CBD5E1" />
          <rect x="310" y="350" width="20" height="150" fill="#CBD5E1" />

          {/* Laptop */}
          <g transform="translate(80, 240)">
            {/* Screen */}
            <rect x="0" y="0" width="140" height="90" rx="5" fill="#1E293B" />
            <rect x="5" y="5" width="130" height="80" fill="#FFFFFF" />
            {/* Code lines */}
            <rect x="15" y="15" width="60" height="6" rx="2" fill="#E2E8F0" />
            <rect x="15" y="25" width="90" height="6" rx="2" fill="#E2E8F0" />
            <rect x="15" y="35" width="70" height="6" rx="2" fill="#E2E8F0" />
            <circle cx="110" cy="60" r="15" fill="#3B82F6" opacity="0.2" />

            {/* Base */}
            <path d="M-10,95 L150,95 L150,105 L-10,105 Z" fill="#CBD5E1" />
          </g>

          {/* Coffee Mug */}
          <g transform="translate(250, 300)">
            <path d="M0,0 L30,0 L28,30 C28,35 25,40 20,40 L10,40 C5,40 2,35 2,30 Z" fill="#EF4444" />
            <path d="M30,5 C35,5 38,10 38,15 C38,20 35,25 30,25" stroke="#EF4444" strokeWidth="4" fill="none" />
          </g>
        </g>

        {/* Floating Icons (Static Posed) */}
        {/* Loupe / Search */}
        <g transform="translate(600, 150) rotate(15)">
          <circle cx="0" cy="0" r="30" fill="white" stroke="#3B82F6" strokeWidth="3" />
          <path d="M20,20 L35,35" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" />
          <circle cx="0" cy="0" r="12" fill="#DBEAFE" />
        </g>

        {/* Briefcase */}
        <g transform="translate(180, 180) rotate(-10)">
          <rect x="0" y="0" width="60" height="45" rx="4" fill="#F59E0B" />
          <path d="M20,0 L20,-10 C20,-15 25,-15 30,-15 C35,-15 40,-15 40,-10 L40,0" stroke="#F59E0B" strokeWidth="4" fill="none" />
          <rect x="25" y="15" width="10" height="8" fill="#FCD34D" />
        </g>

        {/* Checkmark/Success */}
        <g transform="translate(620, 400) rotate(-5)">
          <circle cx="0" cy="0" r="25" fill="#10B981" />
          <path d="M-10,0 L-3,7 L12,-8" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

      </svg>
    </div>
  );
};

export default HeroIllustration;
