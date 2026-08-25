import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw, AlertTriangle, Edit3, Check, X } from 'lucide-react';
import api from '../services/api';
import StockBadge from '../components/ui/StockBadge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

export function Inventory() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStockValue, setEditStockValue] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    unit: 'kg',
    currentStock: 10,
    minimumStock: 5,
    maximumStock: 50,
    costPerUnit: 100
  });
  const [creating, setCreating] = useState(false);
  const { addToast } = useToast();

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ingredients');
      setIngredients(response.data.ingredients || []);
    } catch (err) {
      console.error('Failed to load ingredients:', err);
      addToast('Failed to load inventory.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleStartEdit = (ing) => {
    setEditingId(ing._id);
    setEditStockValue(ing.currentStock);
  };

  const handleSaveStock = async (id) => {
    try {
      await api.put(`/ingredients/${id}`, { currentStock: Number(editStockValue) });
      addToast('Stock level updated.', { type: 'success' });
      setEditingId(null);
      fetchIngredients();
    } catch (err) {
      addToast('Failed to update stock level.', { type: 'error' });
    }
  };

  const handleQuickAdjust = async (ing, delta) => {
    const newStock = Math.max(0, ing.currentStock + delta);
    try {
      await api.put(`/ingredients/${ing._id}`, { currentStock: newStock });
      addToast(`${ing.name} stock adjusted to ${newStock} ${ing.unit}`, { type: 'info' });
      fetchIngredients();
    } catch (err) {
      addToast('Failed to adjust stock.', { type: 'error' });
    }
  };

  const handleCreateIngredient = async (e) => {
    e.preventDefault();
    if (!newIngredient.name.trim()) return;

    setCreating(true);
    try {
      await api.post('/ingredients', newIngredient);
      addToast(`Ingredient '${newIngredient.name}' created.`, { type: 'success' });
      setShowAddModal(false);
      setNewIngredient({
        name: '',
        unit: 'kg',
        currentStock: 10,
        minimumStock: 5,
        maximumStock: 50,
        costPerUnit: 100
      });
      fetchIngredients();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to create ingredient.', { type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const getStockLevel = (current, min) => {
    if (current <= 0) return 'critical';
    if (current <= min) return 'low';
    return 'healthy';
  };

  const lowStockCount = ingredients.filter(i => i.currentStock <= i.minimumStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#4A433C]/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#F6EEDF]">Kitchen Pantry & Stock</h1>
          <p className="text-xs font-mono text-[#9E8C7E] mt-1">
            Real-time tracking of pizza dough, cheeses, sauces, and toppings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="admin-secondary" size="sm" onClick={fetchIngredients} className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button variant="admin-primary" size="sm" onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Ingredient
          </Button>
        </div>
      </div>

      {/* Low stock alert banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-[16px] bg-[#F2B705]/10 border border-[#F2B705]/30 text-[#F2B705] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs">
              <strong className="block text-sm">{lowStockCount} ingredient(s) are below threshold!</strong>
              Restock needed immediately to prevent pizza builder outages.
            </div>
          </div>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#F2B705]/20">
            ATTENTION REQUIRED
          </span>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-[#2A2421] rounded-[20px] border border-[#4A433C]/40 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 space-y-4">
            <Skeleton variant="card" className="h-12 w-full rounded-lg" />
            <Skeleton variant="card" className="h-12 w-full rounded-lg" />
            <Skeleton variant="card" className="h-12 w-full rounded-lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#4A433C]/40 text-[11px] font-mono text-[#9E8C7E] uppercase tracking-wider bg-black/20">
                  <th className="py-3.5 px-5 font-semibold">Ingredient</th>
                  <th className="py-3.5 px-4 font-semibold">Unit</th>
                  <th className="py-3.5 px-4 font-semibold">Current Stock</th>
                  <th className="py-3.5 px-4 font-semibold">Min / Max</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-5 text-right font-semibold">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A433C]/20 text-xs text-[#F6EEDF]">
                {ingredients.map((ing) => {
                  const level = getStockLevel(ing.currentStock, ing.minimumStock);
                  const isEditing = editingId === ing._id;

                  return (
                    <tr key={ing._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-5 font-bold text-sm text-[#F6EEDF]">
                        {ing.name}
                      </td>
                      <td className="py-4 px-4 font-mono text-[#9E8C7E]">
                        {ing.unit}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-base">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editStockValue}
                              onChange={(e) => setEditStockValue(e.target.value)}
                              className="w-20 px-2 py-1 rounded bg-[#1E1A17] border border-[#E4572E] text-xs font-mono text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveStock(ing._id)}
                              className="p-1 rounded bg-[#456B4E] hover:bg-[#38563e] text-white cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded bg-white/10 hover:bg-white/20 text-[#9E8C7E] cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => handleStartEdit(ing)}
                            className="cursor-pointer hover:text-[#E4572E] transition-colors inline-flex items-center gap-1.5"
                            title="Click to edit stock level"
                          >
                            {ing.currentStock}
                            <Edit3 className="w-3 h-3 text-[#9E8C7E] opacity-50 hover:opacity-100" />
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono text-[#9E8C7E]">
                        {ing.minimumStock} / {ing.maximumStock} {ing.unit}
                      </td>
                      <td className="py-4 px-4">
                        <StockBadge level={level} />
                      </td>
                      <td className="py-4 px-5 text-right space-x-1.5">
                        <button
                          onClick={() => handleQuickAdjust(ing, -5)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-[#9E8C7E] hover:text-white transition-colors cursor-pointer"
                          title="Subtract 5 units"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(ing, 5)}
                          className="px-2 py-1 rounded bg-[#E4572E]/15 hover:bg-[#E4572E]/30 text-xs font-mono font-bold text-[#E4572E] transition-colors cursor-pointer"
                          title="Add 5 units"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(ing, 20)}
                          className="px-2 py-1 rounded bg-[#456B4E]/15 hover:bg-[#456B4E]/30 text-xs font-mono font-bold text-[#456B4E] transition-colors cursor-pointer"
                          title="Restock +20 units"
                        >
                          +20
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#2C2621] rounded-[24px] border border-[#4A433C] w-full max-w-md p-7 space-y-5 shadow-2xl text-[#F6EEDF]">
            <div className="flex justify-between items-center pb-3 border-b border-[#4A433C]">
              <h2 className="text-xl font-display font-bold">Add Kitchen Ingredient</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#9E8C7E] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIngredient} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1">Ingredient Name</label>
                <input
                  type="text"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  placeholder="e.g. Buffalo Mozzarella"
                  required
                  className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1">Unit</label>
                  <select
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                    className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="unit">Units (count)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newIngredient.currentStock}
                    onChange={(e) => setNewIngredient({ ...newIngredient, currentStock: Number(e.target.value) })}
                    required
                    className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm font-mono text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1">Min Threshold</label>
                  <input
                    type="number"
                    min="0"
                    value={newIngredient.minimumStock}
                    onChange={(e) => setNewIngredient({ ...newIngredient, minimumStock: Number(e.target.value) })}
                    required
                    className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm font-mono text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={newIngredient.maximumStock}
                    onChange={(e) => setNewIngredient({ ...newIngredient, maximumStock: Number(e.target.value) })}
                    required
                    className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm font-mono text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#4A433C]">
                <Button type="button" variant="admin-ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="admin-primary" loading={creating}>
                  Add Ingredient
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
