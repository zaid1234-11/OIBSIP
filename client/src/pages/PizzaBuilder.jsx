import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingBag, RotateCcw, AlertTriangle } from 'lucide-react';
import usePizzaStore from '../store/pizzaStore';
import Button from '../components/ui/Button';
import BuildShot from '../components/ui/BuildShot';
import RollingPrice from '../components/ui/RollingPrice';
import { useToast } from '../components/ui/Toast';
import SizeStep from '../components/pizza-builder/SizeStep';
import SauceStep from '../components/pizza-builder/SauceStep';
import CheeseStep from '../components/pizza-builder/CheeseStep';
import ToppingsStep from '../components/pizza-builder/ToppingsStep';

export function PizzaBuilder() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    fetchCatalogue,
    loading,
    selectedSize,
    selectedSauce,
    selectedCheese,
    selectedToppings,
    currentPrice,
    isAvailable,
    priceErrors,
    resetBuilder
  } = usePizzaStore();

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const steps = [
    { title: 'Size & Crust', component: <SizeStep /> },
    { title: 'Sauce Base', component: <SauceStep /> },
    { title: 'Cheese Blend', component: <CheeseStep /> },
    { title: 'Toppings Tray', component: <ToppingsStep /> }
  ];

  const handleAddToCart = () => {
    if (!isAvailable) {
      addToast('Cannot add build: some selected items are out of stock.', { type: 'error' });
      return;
    }
    addToast(`Added custom ${selectedSize?.name || 'Pizza'} to cart!`, { type: 'success' });
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <span className="font-mono text-xs font-semibold text-[#E4572E] uppercase tracking-wider">
            Architectural Pizza Constructor
          </span>
          <h1 className="text-4xl font-display font-extrabold text-[#4A121A] mt-1">Build Your Pizza</h1>
          <p className="text-sm text-[#736254] mt-1">
            Construct your custom pie layer-by-layer with live kitchen inventory pricing.
          </p>
        </div>
        <Button variant="customer-secondary" size="sm" onClick={resetBuilder} className="flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> Reset Build
        </Button>
      </div>

      {/* Step Indicators */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
        {steps.map((s, idx) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setCurrentStep(idx)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none flex-shrink-0"
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                currentStep === idx
                  ? 'bg-[#E4572E] text-white shadow-md ring-2 ring-[#E4572E]/20 scale-105'
                  : currentStep > idx
                    ? 'bg-[#456B4E] text-white'
                    : 'bg-[#E8DCBE] text-[#736254]'
              }`}
            >
              {currentStep > idx ? '✓' : idx + 1}
            </span>
            <span
              className={`text-sm font-semibold transition-colors ${
                currentStep === idx ? 'text-[#4A121A]' : 'text-[#736254]'
              }`}
            >
              {s.title}
            </span>
            {idx < steps.length - 1 && <div className="w-6 h-px bg-[#DCD0B0] mx-1" />}
          </button>
        ))}
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Step Component (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2D6C2] shadow-sm space-y-6">
          {steps[currentStep].component}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-[#F4EDE0] flex justify-between items-center">
            {currentStep > 0 ? (
              <Button
                variant="customer-secondary"
                size="md"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
            ) : (
              <div />
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                variant="customer-primary"
                size="md"
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              >
                Next Step <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="customer-primary"
                size="md"
                onClick={handleAddToCart}
                disabled={!isAvailable}
              >
                <ShoppingBag className="w-4 h-4 mr-1.5" /> Add Build to Box
              </Button>
            )}
          </div>
        </div>

        {/* Right Sticky Preview & Ticket Stub (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <BuildShot
            size={selectedSize?.name || 'medium'}
            sauce={selectedSauce?.name || 'tomato'}
            cheese={selectedCheese?.name || 'mozzarella'}
            toppings={selectedToppings}
          />

          {/* Ticket Summary Stub */}
          <div className="bg-[#FAF6EE] rounded-[24px] p-6 border border-[#E2D6C2] shadow-md space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-[#DCD0B0]">
              <div>
                <span className="font-mono text-xs font-semibold text-[#736254] uppercase tracking-wider block">
                  Kitchen Spec Sheet
                </span>
                <span className="font-display font-bold text-base text-[#4A121A]">
                  Custom {selectedSize?.name || 'Pie'}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-[#E4572E] bg-white px-2.5 py-1 rounded-full border border-[#E2D6C2]">
                TICKET #DRAFT
              </span>
            </div>

            {/* Itemized spec list */}
            <div className="space-y-2 text-xs py-1">
              <div className="flex justify-between items-center text-[#2C1810]">
                <span>Crust: <strong>{selectedSize?.name || 'Medium (10")'}</strong></span>
                <span className="font-mono font-semibold">₹{selectedSize?.priceModifier || 299}</span>
              </div>
              <div className="flex justify-between items-center text-[#736254]">
                <span>Sauce: {selectedSauce?.name || 'San Marzano Tomato'}</span>
                <span className="font-mono">{selectedSauce?.priceModifier ? `+₹${selectedSauce.priceModifier}` : 'Included'}</span>
              </div>
              <div className="flex justify-between items-center text-[#736254]">
                <span>Cheese: {selectedCheese?.name || 'Whole Milk Mozzarella'}</span>
                <span className="font-mono">{selectedCheese?.priceModifier ? `+₹${selectedCheese.priceModifier}` : 'Included'}</span>
              </div>

              {selectedToppings.length > 0 && (
                <div className="pt-2 border-t border-dashed border-[#E8DCBE] space-y-1">
                  <span className="font-mono text-[11px] uppercase font-bold text-[#4A121A] block">
                    Toppings ({selectedToppings.length}):
                  </span>
                  {selectedToppings.map((t) => (
                    <div key={t._id} className="flex justify-between items-center text-[#736254]">
                      <span>• {t.name}</span>
                      <span className="font-mono font-medium">+₹{t.priceModifier}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Out-of-Stock Notice */}
            {!isAvailable && (
              <div className="p-3 rounded-[14px] bg-[#E4572E]/10 border border-[#E4572E]/30 text-xs font-semibold text-[#C33C14] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{priceErrors[0] || 'One or more selected toppings are out of stock.'}</span>
              </div>
            )}

            {/* Rolling Total */}
            <div className="pt-3 border-t border-[#DCD0B0] flex justify-between items-baseline">
              <div>
                <span className="font-bold text-sm text-[#2C1810] block">Calculated Total</span>
                <span className="text-[11px] text-[#736254]">Server verified • Taxes incl.</span>
              </div>
              <RollingPrice value={currentPrice} className="text-3xl text-[#E4572E]" />
            </div>

            <Button
              variant="customer-primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className="w-full mt-2"
            >
              <ShoppingBag className="w-4 h-4 mr-2" /> Add Custom Build to Box
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaBuilder;
