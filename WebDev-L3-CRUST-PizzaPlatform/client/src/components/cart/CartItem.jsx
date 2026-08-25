import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import useCartStore from '../../store/cartStore';

export function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();

  const title = item.pizza?.name || 'Custom Built Pizza';
  const sizeName = item.size?.name || 'Medium';
  const sauceName = item.sauce?.name || 'San Marzano';
  const cheeseName = item.cheese?.name || 'Mozzarella';
  const toppings = item.toppings || [];

  return (
    <div className="p-5 rounded-[20px] bg-white border border-[#E2D6C2] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Left Details */}
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl select-none">🍕</span>
          <h3 className="font-display font-bold text-lg text-[#4A121A]">{title}</h3>
          <span className="font-mono text-xs text-[#E4572E] bg-[#E4572E]/10 px-2 py-0.5 rounded-full font-bold">
            {sizeName}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#736254]">
          <span className="bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#E8DCBE]">
            Sauce: {sauceName}
          </span>
          <span className="bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#E8DCBE]">
            Cheese: {cheeseName}
          </span>
        </div>

        {toppings.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {toppings.map((t, idx) => (
              <span
                key={t._id || idx}
                className="text-[11px] font-mono bg-[#EAE0CE]/60 text-[#4A121A] px-2 py-0.5 rounded-full font-medium"
              >
                +{t.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls and Total */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F4EDE0]">
        {/* Quantity Increment/Decrement */}
        <div className="flex items-center gap-2 bg-[#FAF6EE] px-2.5 py-1 rounded-full border border-[#E8DCBE]">
          <button
            type="button"
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-[#4A121A] transition-colors cursor-pointer"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono font-bold text-sm text-[#4A121A] w-5 text-center">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-[#4A121A] transition-colors cursor-pointer"
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right min-w-[70px]">
          <div className="font-mono font-bold text-lg text-[#E4572E]">
            ₹{item.unitPrice * item.quantity}
          </div>
          <div className="text-[11px] font-mono text-[#736254]">
            ₹{item.unitPrice} each
          </div>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => removeItem(item._id)}
          className="p-2 text-[#736254] hover:text-[#C33C14] hover:bg-[#E4572E]/10 rounded-full transition-colors cursor-pointer"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
