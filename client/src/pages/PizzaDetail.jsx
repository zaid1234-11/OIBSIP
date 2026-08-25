import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Camera, Layers } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import BuildShot from '../components/ui/BuildShot';
import { useToast } from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export function PizzaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  const [pizza, setPizza] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingStandard, setAddingStandard] = useState(false);
  const [viewMode, setViewMode] = useState('photo'); // 'photo' | 'builder'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pizzaRes, optionsRes] = await Promise.all([
          api.get(`/pizzas/${id}`),
          api.get('/options')
        ]);
        setPizza(pizzaRes.data.pizza);
        setOptions(optionsRes.data.options || []);
      } catch (err) {
        console.error('Failed to load pizza detail:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const getPizzaImage = (pizza) => {
    if (!pizza) return '/images/pizzas/margherita.jpg';
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

  const handleAddStandard = async () => {
    if (!user) {
      addToast('Please sign in to add items to your pizza box.', { type: 'info' });
      navigate('/login', { state: { from: { pathname: `/pizza/${id}` } } });
      return;
    }

    const mediumSize = options.find(o => o.type === 'size' && o.name.toLowerCase().includes('medium')) || options.find(o => o.type === 'size');
    const tomatoSauce = options.find(o => o.type === 'sauce' && o.name.toLowerCase().includes('tomato')) || options.find(o => o.type === 'sauce');
    const mozzarella = options.find(o => o.type === 'cheese' && o.name.toLowerCase().includes('mozzarella')) || options.find(o => o.type === 'cheese');

    if (!mediumSize || !tomatoSauce || !mozzarella) {
      addToast('Standard builder options unavailable.', { type: 'error' });
      return;
    }

    setAddingStandard(true);
    const res = await addItem({
      pizzaId: pizza._id,
      sizeId: mediumSize._id,
      sauceId: tomatoSauce._id,
      cheeseId: mozzarella._id,
      toppingIds: [],
      quantity: 1
    });
    setAddingStandard(false);

    if (res.success) {
      addToast(`Added standard ${pizza?.name} to your box!`, { type: 'success' });
      navigate('/cart');
    } else {
      addToast(res.error || 'Failed to add pizza to box.', { type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Skeleton variant="card" className="h-96 w-full rounded-[24px]" />
      </div>
    );
  }

  if (!pizza) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-bold text-[#4A121A]">Pizza Not Found</h2>
        <p className="text-sm text-[#736254] mt-2">The requested pizza recipe could not be found.</p>
        <Link to="/menu" className="mt-4 inline-block">
          <Button variant="customer-secondary">Return to Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Visual Column */}
        <div className="space-y-4">
          <div className="relative w-full aspect-square rounded-[24px] overflow-hidden border border-[#E2D6C2] shadow-lg bg-[#F4EDE0]">
            {viewMode === 'photo' ? (
              <img
                src={getPizzaImage(pizza)}
                alt={pizza.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/images/pizzas/margherita.jpg';
                }}
              />
            ) : (
              <BuildShot
                size="medium"
                sauce="tomato"
                cheese="mozzarella"
                toppings={pizza.category === 'veg' ? [{ name: 'Basil' }] : [{ name: 'Pepperoni' }]}
              />
            )}

            {/* View Switcher Tag */}
            <div className="absolute top-4 left-4 flex gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/20">
              <button
                type="button"
                onClick={() => setViewMode('photo')}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'photo' ? 'bg-[#E4572E] text-white shadow' : 'text-white/80 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> Oven Photo
              </button>
              <button
                type="button"
                onClick={() => setViewMode('builder')}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'builder' ? 'bg-[#E4572E] text-white shadow' : 'text-white/80 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Architecture
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                  pizza.category === 'veg'
                    ? 'bg-[#456B4E]/15 text-[#456B4E] border border-[#456B4E]/30'
                    : 'bg-[#E4572E]/15 text-[#E4572E] border border-[#E4572E]/30'
                }`}
              >
                {pizza.category === 'veg' ? '🌿 Vegetarian' : '🍖 Non-Vegetarian'}
              </span>
              <span className="text-xs font-mono text-[#736254]">✦ Signature Recipe</span>
            </div>
            <h1 className="text-4xl font-display font-extrabold text-[#4A121A]">{pizza.name}</h1>
            <p className="text-sm text-[#736254] mt-2 leading-relaxed">{pizza.description}</p>
          </div>

          {/* Default Recipe List */}
          <div className="bg-white p-5 rounded-[20px] border border-[#E2D6C2] space-y-3 shadow-sm">
            <div className="text-xs font-mono font-bold text-[#4A121A] uppercase tracking-wider">
              Default Kitchen Formula
            </div>
            <div className="space-y-1.5 text-xs text-[#736254]">
              {pizza.defaultRecipe && pizza.defaultRecipe.length > 0 ? (
                pizza.defaultRecipe.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>✦ {item.ingredient?.name || 'Artisanal Ingredient'}</span>
                    <span className="font-mono text-[#2C1810]">
                      {item.quantity} {item.ingredient?.unit || 'g'}
                    </span>
                  </div>
                ))
              ) : (
                <p>Fermented sourdough crust, crushed San Marzano tomatoes, mozzarella, and fresh basil.</p>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-extrabold text-[#E4572E]">₹{pizza.basePrice}</span>
            <span className="text-xs text-[#736254]">Medium 10" standard build • Taxes incl.</span>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/build-your-pizza">
              <Button variant="customer-primary" size="lg">
                Customize in Builder &rarr;
              </Button>
            </Link>
            <Button
              variant="customer-secondary"
              size="lg"
              onClick={handleAddStandard}
              loading={addingStandard}
            >
              Add Standard to Box
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaDetail;
