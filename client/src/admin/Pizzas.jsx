import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function Pizzas() {
  const [pizzas, setPizzas] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPizza, setEditingPizza] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 299,
    category: 'veg',
    isAvailable: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchPizzasAndIngredients = async () => {
    try {
      setLoading(true);
      const [pizzaRes, ingRes] = await Promise.all([
        api.get('/pizzas'),
        api.get('/ingredients')
      ]);
      setPizzas(pizzaRes.data.pizzas || []);
      setIngredients(ingRes.data.ingredients || []);
    } catch (err) {
      console.error('Failed to load pizza catalogue:', err);
      addToast('Failed to load pizzas from database.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzasAndIngredients();
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

  const handleOpenAdd = () => {
    setEditingPizza(null);
    setFormData({
      name: '',
      description: '',
      basePrice: 299,
      category: 'veg',
      isAvailable: true
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (pizza) => {
    setEditingPizza(pizza);
    setFormData({
      name: pizza.name,
      description: pizza.description,
      basePrice: pizza.basePrice,
      category: pizza.category,
      isAvailable: pizza.isAvailable !== false
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (editingPizza) {
        await api.put(`/pizzas/${editingPizza._id}`, formData);
        addToast(`Updated '${formData.name}' successfully!`, { type: 'success' });
      } else {
        await api.post('/pizzas', formData);
        addToast(`Created '${formData.name}' successfully!`, { type: 'success' });
      }

      setShowModal(false);
      fetchPizzasAndIngredients();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save pizza.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'?`)) return;

    try {
      await api.delete(`/pizzas/${id}`);
      addToast(`Deleted '${name}' from catalogue.`, { type: 'info' });
      fetchPizzasAndIngredients();
    } catch (err) {
      addToast('Failed to delete pizza.', { type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#4A433C]/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#F6EEDF]">Pizza Catalogue Management</h1>
          <p className="text-xs font-mono text-[#9E8C7E] mt-1">
            Control signature recipe definitions, pricing, and live customer visibility
          </p>
        </div>
        <Button variant="admin-primary" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Signature Pizza
        </Button>
      </div>

      {/* Catalogue Table Card */}
      <div className="bg-[#2A2421] rounded-[20px] border border-[#4A433C]/40 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-[#9E8C7E]">
            Loading pizza collection...
          </div>
        ) : pizzas.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[#9E8C7E] space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-[#9E8C7E]" />
            <p>No signature pizzas currently found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#4A433C]/40 text-[11px] font-mono text-[#9E8C7E] uppercase tracking-wider bg-black/20">
                  <th className="px-6 py-4">Pizza Spec & Photo</th>
                  <th className="px-6 py-4">Dietary</th>
                  <th className="px-6 py-4">Base Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A433C]/20 text-xs text-[#F6EEDF]">
                {pizzas.map((pizza) => (
                  <tr key={pizza._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getPizzaImage(pizza)}
                          alt={pizza.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#4A433C]/60 flex-shrink-0"
                          onError={(e) => { e.target.src = '/images/pizzas/margherita.jpg'; }}
                        />
                        <div>
                          <div className="font-bold text-[#F6EEDF] text-base">{pizza.name}</div>
                          <div className="text-xs text-[#9E8C7E] mt-0.5 line-clamp-1 max-w-md">
                            {pizza.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                          pizza.category === 'veg'
                            ? 'bg-[#456B4E]/20 text-[#456B4E] border border-[#456B4E]/40'
                            : 'bg-[#E4572E]/20 text-[#E4572E] border border-[#E4572E]/40'
                        }`}
                      >
                        {pizza.category === 'veg' ? '🌿 Veg' : '🍖 Non-Veg'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-base text-[#F6EEDF]">
                      ₹{pizza.basePrice}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full ${
                          pizza.isAvailable !== false
                            ? 'bg-[#456B4E]/15 text-[#456B4E]'
                            : 'bg-[#E4572E]/15 text-[#E4572E]'
                        }`}
                      >
                        {pizza.isAvailable !== false ? '✓ Active' : '✕ Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(pizza)}
                        className="p-2 text-[#9E8C7E] hover:text-[#F6EEDF] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit Pizza"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pizza._id, pizza.name)}
                        className="p-2 text-[#E4572E] hover:bg-[#E4572E]/15 rounded-lg transition-colors cursor-pointer"
                        title="Delete Pizza"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#2C2621] rounded-[24px] border border-[#4A433C] w-full max-w-lg p-7 space-y-6 shadow-2xl text-[#F6EEDF]">
            <div className="flex justify-between items-center pb-3 border-b border-[#4A433C]">
              <h2 className="text-xl font-display font-bold">
                {editingPizza ? `Edit '${editingPizza.name}'` : 'Add New Signature Pizza'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-[#9E8C7E] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-[12px] bg-[#E4572E]/15 border border-[#E4572E]/30 text-xs text-[#E4572E]">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1">Pizza Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Truffle Burrata Special"
                  required
                  className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe crust, sauces, and ingredient formula..."
                  rows={3}
                  required
                  className="w-full p-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    required
                    className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm font-mono text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-[#E4572E] bg-[#1E1A17] border-[#4A433C]"
                />
                <label htmlFor="isAvailable" className="text-xs text-[#F6EEDF] cursor-pointer">
                  Available for ordering (unchecked hides from menu)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#4A433C]">
                <Button
                  type="button"
                  variant="admin-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="admin-primary"
                  loading={saving}
                >
                  {editingPizza ? 'Save Changes' : 'Create Pizza'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pizzas;
