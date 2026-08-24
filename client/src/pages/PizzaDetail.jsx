import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import BuildShot from '../components/ui/BuildShot';

export function PizzaDetail() {
  const { id } = useParams();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <BuildShot />
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#E8DCBE] text-xs font-mono font-bold text-[#4A121A] uppercase tracking-wider mb-3">
              Recipe #{id || 1} &bull; Vegetarian
            </span>
            <h1 className="text-4xl font-display font-extrabold text-[#4A121A]">Margherita Classica</h1>
            <p className="text-sm text-[#736254] mt-2 leading-relaxed">
              Crafted with hand-stretched sourdough, crushed San Marzano D.O.P. tomatoes, fresh fiordilatte mozzarella, torn sweet basil, and extra virgin olive oil.
            </p>
          </div>

          <div className="bg-white p-5 rounded-[16px] border border-[#E2D6C2] space-y-2">
            <div className="text-xs font-mono text-[#736254] uppercase tracking-wider">Default Specs</div>
            <div className="text-sm font-medium text-[#2C1810]">10" Medium Crust &bull; Tomato Sauce &bull; Mozzarella &bull; Basil</div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-extrabold text-[#E4572E]">{'\u20B9'}299</span>
            <span className="text-xs text-[#736254]">Taxes included</span>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/build-your-pizza">
              <Button variant="customer-primary" size="lg">Customize this recipe</Button>
            </Link>
            <Button variant="customer-secondary" size="lg">Add standard to cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaDetail;
