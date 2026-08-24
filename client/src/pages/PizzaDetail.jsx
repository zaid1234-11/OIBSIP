import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import BuildShot from '../components/ui/BuildShot';
import { useToast } from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';

export function PizzaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/pizzas/${id}`);
        setPizza(response.data.pizza);
      } catch (err) {
        console.error('Failed to load pizza detail:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPizza();
    }
  }, [id]);

  const handleAddStandard = () => {
    addToast(`Added standard ${pizza?.name} to cart!`, { type: 'success' });
    navigate('/cart');
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
                {pizza.category === 'veg' ? '🌿 Vegetarian' : '🥩 Non-Vegetarian'}
              </span>
              <span className="text-xs font-mono text-[#736254]">• Signature Recipe</span>
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
                    <span>• {item.ingredient?.name || 'Artisanal Ingredient'}</span>
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
            <Button variant="customer-secondary" size="lg" onClick={handleAddStandard}>
              Add Standard to Box
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaDetail;
