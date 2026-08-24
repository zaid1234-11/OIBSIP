import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function RollingPrice({ value, currency = '₹', className = '' }) {
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    setPrevValue(value);
  }, [value]);

  const formatted = Math.round(value).toString();

  return (
    <span className={`inline-flex items-baseline font-mono font-bold ${className}`}>
      <span className="mr-0.5">{currency}</span>
      <span className="inline-flex overflow-hidden h-[1.25em]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={formatted}
            initial={{ y: formatted > prevValue ? 20 : -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: formatted > prevValue ? -20 : 20, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 24,
              mass: 0.8
            }}
            className="inline-block"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-sm font-normal text-[#736254] ml-0.5">.00</span>
    </span>
  );
}

export default RollingPrice;
