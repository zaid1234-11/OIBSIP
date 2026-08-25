import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import Skeleton, { MenuCardSkeleton } from '../components/ui/Skeleton';

export function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const response = await api.get('/pizzas');
        setPizzas(response.data.pizzas || []);
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const getPizzaImage = (pizza) => {
    if (pizza.image && pizza.image.startsWith('/')) return pizza.image;
    if (pizza.image && ['margherita', 'pepperoni', 'tuscan-garden', 'quattro-formaggi', 'diavola', 'bbq-chicken'].includes(pizza.image)) {
      return `/images/pizzas/${pizza.image}.jpg`;
    }
    const nameLower = (pizza.name || '').toLowerCase();
    if (nameLower.includes('pep')) return '/images/pizzas/pepperoni.jpg';
    if (nameLower.includes('margherita')) return '/images/pizzas/margherita.jpg';
    if (nameLower.includes('tuscan') || nameLower.includes('garden')) return '/images/pizzas/tuscan-garden.jpg';
    if (nameLower.includes('formaggi') || nameLower.includes('cheese')) return '/images/pizzas/quattro-formaggi.jpg';
    if (nameLower.includes('diavola') || nameLower.includes('spicy')) return '/images/pizzas/diavola.jpg';
    if (nameLower.includes('chicken') || nameLower.includes('bbq')) return '/images/pizzas/bbq-chicken.jpg';
    return '/images/pizzas/margherita.jpg';
  };

  const filteredPizzas = pizzas.filter((p) => {
    if (filter === 'veg') return p.category === 'veg';
    if (filter === 'non-veg') return p.category === 'non-veg';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <span className="font-mono text-xs font-semibold text-[#E4572E] uppercase tracking-wider">
            Wood-Fired Signature Collection
          </span>
          <h1 className="text-4xl font-display font-extrabold text-[#4A121A] mt-1">Oven Menu</h1>
          <p className="text-sm text-[#736254] mt-1">
            Order one of our perfected master recipes or customize any pie in the architectural builder.
          </p>
        </div>
        <Link to="/build-your-pizza">
          <Button variant="customer-primary" size="md">
            Build from Scratch &rarr;
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-8">
        {[
          { key: 'all', label: 'All Pizzas' },
          { key: 'veg', label: 'Vegetarian' },
          { key: 'non-veg', label: 'Non-Vegetarian' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-5 py-2 rounded-full text-xs font-semibold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              filter === tab.key
                ? 'bg-[#E4572E] text-white shadow-sm'
                : 'bg-white text-[#736254] border border-[#E2D6C2] hover:border-[#4A121A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <MenuCardSkeleton />
          <MenuCardSkeleton />
          <MenuCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPizzas.map((pizza) => (
            <div
              key={pizza._id}
              className="group bg-white rounded-[24px] p-5 border border-[#E2D6C2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-52 rounded-[18px] overflow-hidden mb-5 border border-[#E8DCBE] relative bg-[#F4EDE0]">
                  <img
                    src={getPizzaImage(pizza)}
                    alt={pizza.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/images/pizzas/margherita.jpg';
                    }}
                  />
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase shadow-sm ${
                      pizza.category === 'veg'
                        ? 'bg-[#456B4E] text-white'
                        : 'bg-[#E4572E] text-white'
                    }`}
                  >
                    {pizza.category === 'veg' ? '🌿 Veg' : '🍖 Non-Veg'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-body font-bold text-lg text-[#2C1810]">{pizza.name}</h3>
                </div>
                <p className="text-xs text-[#736254] leading-relaxed line-clamp-2">{pizza.description}</p>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#F4EDE0]">
                <div>
                  <span className="font-mono font-bold text-xl text-[#E4572E]">₹{pizza.basePrice}</span>
                  <span className="text-[11px] text-[#736254] block">Medium 10" Base</span>
                </div>
                <Link to={`/pizza/${pizza._id}`}>
                  <Button variant="customer-secondary" size="sm">
                    Customize &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;
