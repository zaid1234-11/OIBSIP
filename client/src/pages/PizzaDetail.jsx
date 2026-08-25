import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

  const handleAddStandard = async () => {
    if (!user) {
      addToast('Please log in to add items to your pizza box.', { type: 'info' });
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
        <BuildShot size="medium" />

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
