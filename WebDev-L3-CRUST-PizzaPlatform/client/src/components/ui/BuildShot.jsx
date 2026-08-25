import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers } from 'lucide-react';

export function BuildShot({
  size = 'medium',
  sauce = 'tomato',
  cheese = 'mozzarella',
  toppings = [],
  className = ''
}) {
  // Determine active preset state
  let presetKey = 'cheese';
  let presetLabel = 'Dough + Sauce + Mozzarella';

  const count = toppings.length;
  if (count === 0 && (!cheese || cheese.toLowerCase().includes('none'))) {
    presetKey = 'base';
    presetLabel = 'Fermented Dough & Sauce Base';
  } else if (count === 0) {
    presetKey = 'cheese';
    presetLabel = 'Sauce & Melted Cheese Blend';
  } else if (count <= 2) {
    presetKey = 'toppings-light';
    presetLabel = `Artisanal Build (${count} Topping${count > 1 ? 's' : ''})`;
  } else {
    presetKey = 'fully-loaded';
    presetLabel = `Fully Loaded Masterpiece (${count} Toppings)`;
  }

  // High-Resolution Preset Renderers
  const renderPreset = (key) => {
    switch (key) {
      case 'base':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
            {/* Crust */}
            <circle cx="100" cy="100" r="92" fill="#D98A44" stroke="#B86826" strokeWidth="4" />
            <circle cx="45" cy="50" r="5" fill="#8C4215" opacity="0.6" />
            <circle cx="155" cy="65" r="4" fill="#8C4215" opacity="0.6" />
            <circle cx="140" cy="150" r="6" fill="#8C4215" opacity="0.6" />
            <circle cx="60" cy="145" r="4" fill="#8C4215" opacity="0.6" />
            {/* Rich Sauce Layer */}
            <circle cx="100" cy="100" r="76" fill="#C33C14" />
            {/* Herb flecks in sauce */}
            <circle cx="90" cy="90" r="2" fill="#386641" />
            <circle cx="115" cy="85" r="1.5" fill="#386641" />
            <circle cx="105" cy="120" r="2" fill="#386641" />
          </svg>
        );

      case 'cheese':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
            {/* Crust */}
            <circle cx="100" cy="100" r="92" fill="#D98A44" stroke="#B86826" strokeWidth="4" />
            <circle cx="45" cy="50" r="5" fill="#8C4215" opacity="0.6" />
            <circle cx="155" cy="65" r="4" fill="#8C4215" opacity="0.6" />
            <circle cx="140" cy="150" r="6" fill="#8C4215" opacity="0.6" />
            <circle cx="60" cy="145" r="4" fill="#8C4215" opacity="0.6" />
            {/* Sauce */}
            <circle cx="100" cy="100" r="76" fill="#C33C14" />
            {/* Melted Cheese */}
            <circle cx="100" cy="100" r="70" fill="#F4CA4A" opacity="0.94" />
            {/* Toasted Cheese Patches */}
            <circle cx="85" cy="80" r="14" fill="#E59F27" opacity="0.75" />
            <circle cx="120" cy="115" r="18" fill="#E59F27" opacity="0.75" />
            <circle cx="95" cy="125" r="12" fill="#E59F27" opacity="0.7" />
          </svg>
        );

      case 'toppings-light':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
            {/* Crust */}
            <circle cx="100" cy="100" r="92" fill="#D98A44" stroke="#B86826" strokeWidth="4" />
            <circle cx="45" cy="50" r="5" fill="#8C4215" opacity="0.6" />
            <circle cx="155" cy="65" r="4" fill="#8C4215" opacity="0.6" />
            <circle cx="140" cy="150" r="6" fill="#8C4215" opacity="0.6" />
            <circle cx="60" cy="145" r="4" fill="#8C4215" opacity="0.6" />
            {/* Sauce */}
            <circle cx="100" cy="100" r="76" fill="#C33C14" />
            {/* Cheese */}
            <circle cx="100" cy="100" r="70" fill="#F4CA4A" opacity="0.94" />
            <circle cx="85" cy="80" r="14" fill="#E59F27" opacity="0.75" />
            <circle cx="120" cy="115" r="18" fill="#E59F27" opacity="0.75" />
            {/* 1-2 Toppings (Pepperoni & Basil) */}
            <circle cx="75" cy="95" r="13" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
            <circle cx="125" cy="90" r="13" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
            <circle cx="100" cy="130" r="13" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
            <path d="M65,70 Q75,55 90,70 Q75,85 65,70 Z" fill="#386641" />
            <path d="M125,125 Q135,110 150,125 Q135,140 125,125 Z" fill="#386641" />
          </svg>
        );

      case 'fully-loaded':
      default:
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
            {/* Crust */}
            <circle cx="100" cy="100" r="92" fill="#D98A44" stroke="#B86826" strokeWidth="4" />
            <circle cx="45" cy="50" r="5" fill="#8C4215" opacity="0.6" />
            <circle cx="155" cy="65" r="4" fill="#8C4215" opacity="0.6" />
            <circle cx="140" cy="150" r="6" fill="#8C4215" opacity="0.6" />
            <circle cx="60" cy="145" r="4" fill="#8C4215" opacity="0.6" />
            {/* Sauce */}
            <circle cx="100" cy="100" r="76" fill="#C33C14" />
            {/* Cheese */}
            <circle cx="100" cy="100" r="70" fill="#F4CA4A" opacity="0.94" />
            <circle cx="85" cy="80" r="14" fill="#E59F27" opacity="0.75" />
            <circle cx="120" cy="115" r="18" fill="#E59F27" opacity="0.75" />
            {/* Loaded Toppings */}
            <circle cx="70" cy="90" r="12" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
            <circle cx="130" cy="85" r="12" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
            <circle cx="100" cy="65" r="12" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
            <circle cx="95" cy="135" r="12" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
            <circle cx="135" cy="130" r="11" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
            {/* Basil Leaves */}
            <path d="M55,115 Q65,100 80,115 Q65,130 55,115 Z" fill="#386641" />
            <path d="M115,70 Q125,55 140,70 Q125,85 115,70 Z" fill="#386641" />
            <path d="M110,110 Q120,95 135,110 Q120,125 110,110 Z" fill="#386641" />
            {/* Roasted Peppers / Mushrooms */}
            <rect x="75" y="110" width="10" height="6" rx="2" fill="#E4572E" transform="rotate(25 80 113)" />
            <rect x="110" y="85" width="10" height="6" rx="2" fill="#E4572E" transform="rotate(-15 115 88)" />
            <circle cx="85" cy="75" r="6" fill="#6B5B4D" />
            <circle cx="120" cy="140" r="6" fill="#6B5B4D" />
            <circle cx="65" cy="135" r="4" fill="#1E1A17" />
            <circle cx="140" cy="105" r="4" fill="#1E1A17" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
        relative w-full aspect-square rounded-[20px] overflow-hidden
        bg-gradient-to-br from-[#F4EDE0] via-[#EAE0CE] to-[#DFD3BE]
        border border-[#E2D6C2] shadow-md flex items-center justify-center p-6
        ${className}
      `}
    >
      {/* Wooden Peel Board Pattern */}
      <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#C8BBA7]/60 pointer-events-none" />

      {/* Preset Crossfade Container */}
      <div className="relative w-4/5 h-4/5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={presetKey}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {renderPreset(presetKey)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Preset Indicator Tag */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span className="bg-white/90 backdrop-blur-sm border border-[#E2D6C2] px-3 py-1 rounded-full shadow-sm text-[11px] font-medium text-[#4A121A] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#E4572E]" />
          <span>{presetLabel}</span>
        </span>
        <span className="bg-[#E4572E] text-white px-2.5 py-1 rounded-full shadow-sm text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Live
        </span>
      </div>
    </div>
  );
}

export default BuildShot;
