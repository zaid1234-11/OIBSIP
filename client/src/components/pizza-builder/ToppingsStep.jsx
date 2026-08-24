import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import usePizzaStore from '../../store/pizzaStore';

export function ToppingsStep() {
  const { toppings, selectedToppings, toggleTopping } = usePizzaStore();
  const [filter, setFilter] = useState('all');

  const filteredToppings = toppings.filter((t) => {
    if (filter === 'veg') {
      return !t.name.includes('Pepperoni') && !t.name.includes('Chicken') && !t.name.includes('Salami');
    }
    if (filter === 'non-veg') {
      return t.name.includes('Pepperoni') || t.name.includes('Chicken') || t.name.includes('Salami');
    }
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 25
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#4A121A]">4. Topping Tray</h2>
          <p className="text-xs text-[#736254] mt-1">Select your favorite artisanal toppings. Out-of-stock items are disabled.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'veg', label: 'Vegetarian' },
            { key: 'non-veg', label: 'Non-Vegetarian' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                filter === tab.key
                  ? 'bg-[#E4572E] text-white shadow-sm'
                  : 'bg-white text-[#736254] border border-[#E2D6C2] hover:border-[#4A121A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spring-Eased Staggered Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredToppings.map((topping) => {
          const isSelected = selectedToppings.some((t) => t._id === topping._id);
          const isAvailable = topping.isAvailable !== false;

          return (
            <motion.button
              key={topping._id}
              variants={itemVariants}
              type="button"
              disabled={!isAvailable}
              onClick={() => isAvailable && toggleTopping(topping)}
              className={`p-4 rounded-[18px] text-left transition-all relative flex flex-col justify-between ${
                !isAvailable
                  ? 'opacity-55 cursor-not-allowed bg-[#F4EDE0]/50 border border-dashed border-[#C8BBA7]'
                  : isSelected
                    ? 'border-2 border-[#E4572E] bg-[#FAF6EE] shadow-md ring-2 ring-[#E4572E]/20 cursor-pointer'
                    : 'border border-[#E2D6C2] bg-white hover:border-[#DCD0B0] hover:shadow-sm cursor-pointer'
              }`}
            >
              {isSelected && isAvailable && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#E4572E] text-white flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3" />
                </div>
              )}

              <div>
                <h3 className={`font-body font-bold text-sm ${!isAvailable ? 'line-through text-[#9E8C7E]' : 'text-[#2C1810]'}`}>
                  {topping.name}
                </h3>
                {!isAvailable && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#C33C14] mt-1 bg-[#E4572E]/10 px-2 py-0.5 rounded">
                    <AlertCircle className="w-3 h-3" /> Currently unavailable
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-[#E8DCBE]/60 flex justify-between items-baseline">
                <span className="text-[11px] font-mono uppercase text-[#736254]">Topping</span>
                <span className={`font-mono font-bold text-sm ${!isAvailable ? 'text-[#9E8C7E]' : 'text-[#E4572E]'}`}>
                  +₹{topping.priceModifier}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

export default ToppingsStep;
