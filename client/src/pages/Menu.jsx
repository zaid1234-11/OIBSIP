import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export function Menu() {
  const mockPizzas = [
    { id: 1, name: 'Margherita Classica', desc: 'San Marzano tomato, fresh mozzarella, sweet basil leaves, EVOO', price: 299, category: 'veg' },
    { id: 2, name: 'Rustic Pepperoni', desc: 'Crispy cupping pepperoni, aged mozzarella, oregano, hot honey', price: 449, category: 'non-veg' },
    { id: 3, name: 'Tuscan Garden', desc: 'Roasted bell peppers, red onions, button mushrooms, black olives', price: 379, category: 'veg' },
    { id: 4, name: 'Quattro Formaggi', desc: 'Mozzarella, gorgonzola, smoked provolone, shaved parmesan', price: 499, category: 'veg' },
    { id: 5, name: 'Spicy Diavola', desc: 'Calabrian chili paste, spicy salami, red onions, mozzarella', price: 469, category: 'non-veg' },
    { id: 6, name: 'Smoked BBQ Chicken', desc: 'Hickory BBQ sauce base, roasted chicken strips, caramelized onions', price: 479, category: 'non-veg' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-[#4A121A]">Oven Menu</h1>
          <p className="text-sm text-[#736254] mt-1">Select a signature pie or customize any item to your exact tastes</p>
        </div>
        <Link to="/build-your-pizza">
          <Button variant="customer-primary" size="md">Start from scratch &rarr;</Button>
        </Link>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-8">
        {['All Pizzas', 'Vegetarian', 'Non-Vegetarian'].map((filter, i) => (
          <button
            key={filter}
            className={`px-5 py-2 rounded-full text-xs font-semibold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              i === 0
                ? 'bg-[#E4572E] text-white shadow-sm'
                : 'bg-white text-[#736254] border border-[#E2D6C2] hover:border-[#4A121A]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockPizzas.map(pizza => (
          <div key={pizza.id} className="bg-white rounded-[20px] p-6 border border-[#E2D6C2] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-full h-44 rounded-[14px] bg-gradient-to-br from-[#F4EDE0] to-[#EAE0CE] flex items-center justify-center mb-5 border border-[#E8DCBE]">
                <span className="font-display text-4xl">🍕</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-body font-bold text-lg text-[#2C1810]">{pizza.name}</h3>
                <span className={`w-2 h-2 rounded-full ${pizza.category === 'veg' ? 'bg-[#456B4E]' : 'bg-[#E4572E]'}`} />
              </div>
              <p className="text-sm text-[#736254] leading-relaxed">{pizza.desc}</p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#F4EDE0]">
              <span className="font-mono font-bold text-xl text-[#E4572E]">{'\u20B9'}{pizza.price}</span>
              <Link to={`/pizza/${pizza.id}`}>
                <Button variant="customer-secondary" size="sm">Details</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
