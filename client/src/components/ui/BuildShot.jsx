import React from 'react';
import { Sparkles } from 'lucide-react';

export function BuildShot({
  size = 'medium',
  sauce = 'tomato',
  cheese = 'mozzarella',
  toppings = [],
  className = '',
}) {
  return (
    <div
      className={`
        relative w-full aspect-square rounded-[20px] overflow-hidden
        bg-gradient-to-br from-[#F4EDE0] via-[#EAE0CE] to-[#DFD3BE]
        border border-[#E2D6C2] shadow-md flex items-center justify-center p-6
        ${className}
      `}
    >
      {/* Wooden Peel / Board Motif */}
      <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#C8BBA7]/60 pointer-events-none" />

      {/* Pizza Base Graphic (SVG) */}
      <div className="relative w-4/5 h-4/5 flex items-center justify-center transition-transform duration-300 hover:scale-105">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
          {/* Crust */}
          <circle cx="100" cy="100" r="92" fill="#D98A44" stroke="#B86826" strokeWidth="4" />
          {/* Baked spots on crust */}
          <circle cx="45" cy="50" r="5" fill="#8C4215" opacity="0.6" />
          <circle cx="155" cy="65" r="4" fill="#8C4215" opacity="0.6" />
          <circle cx="140" cy="150" r="6" fill="#8C4215" opacity="0.6" />
          <circle cx="60" cy="145" r="4" fill="#8C4215" opacity="0.6" />

          {/* Sauce Layer */}
          <circle cx="100" cy="100" r="76" fill="#C33C14" />

          {/* Melted Cheese Layer */}
          <circle cx="100" cy="100" r="70" fill="#F4CA4A" opacity="0.92" />
          {/* Golden toasted cheese patches */}
          <circle cx="85" cy="80" r="14" fill="#E59F27" opacity="0.75" />
          <circle cx="120" cy="115" r="18" fill="#E59F27" opacity="0.75" />
          <circle cx="95" cy="125" r="12" fill="#E59F27" opacity="0.7" />

          {/* Toppings Representation */}
          {/* Basil Leaves */}
          <path d="M70,85 Q80,70 95,85 Q80,100 70,85 Z" fill="#386641" />
          <path d="M125,75 Q135,60 150,75 Q135,90 125,75 Z" fill="#386641" />
          <path d="M90,140 Q100,125 115,140 Q100,155 90,140 Z" fill="#386641" />

          {/* Pepperoni Slices */}
          <circle cx="80" cy="110" r="13" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
          <circle cx="125" cy="100" r="13" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
          <circle cx="100" cy="70" r="13" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
          <circle cx="130" cy="135" r="12" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
        </svg>

        {/* Floating badge indicator */}
        <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm border border-[#E2D6C2] px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E4572E]" />
          <span className="font-mono text-xs font-semibold text-[#4A121A] uppercase tracking-wider">
            Live Preview
          </span>
        </div>
      </div>
    </div>
  );
}

export default BuildShot;
