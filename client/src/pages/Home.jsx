import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import BuildShot from '../components/ui/BuildShot';

export function Home() {
  const [popularPizzas, setPopularPizzas] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await api.get('/pizzas');
        if (res.data?.pizzas?.length > 0) {
          setPopularPizzas(res.data.pizzas.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not fetch pizzas for home:', err);
      }
    };
    fetchPopular();
  }, []);

  const defaultPizzas = [
    {
      _id: '1',
      name: 'Margherita Classica',
      description: 'Fresh basil, whole-milk mozzarella, San Marzano D.O.P. tomato sauce',
      basePrice: 299,
      category: 'veg',
      image: '/images/pizzas/margherita.jpg'
    },
    {
      _id: '2',
      name: 'Rustic Pepperoni',
      description: 'Cupping charred pepperoni, smoked provolone, hot honey drizzle',
      basePrice: 449,
      category: 'non-veg',
      image: '/images/pizzas/pepperoni.jpg'
    },
    {
      _id: '3',
      name: 'Tuscan Garden',
      description: 'Fire-roasted bell peppers, red onion, button mushrooms, kalamata olives',
      basePrice: 379,
      category: 'veg',
      image: '/images/pizzas/tuscan-garden.jpg'
    },
  ];

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

  const displayPizzas = popularPizzas.length > 0 ? popularPizzas : defaultPizzas;

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DCBE]/70 border border-[#DCD0B0] text-xs font-mono font-semibold text-[#4A121A]">
              🔥 OVEN-FIRED HANDMADE CRUSTS
            </div>
            <h1 className="text-5xl sm:text-6xl font-display font-extrabold text-[#4A121A] leading-[1.1]">
              Build the pizza <br />
              <span className="text-[#E4572E]">you actually want.</span>
            </h1>
            <p className="text-lg text-[#736254] max-w-lg leading-relaxed">
              Not a clone of delivery apps. CRUST gives you total architectural control over your pie &mdash; from crust size and sauce base to custom cheese blends and toppings.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/build-your-pizza">
                <Button variant="customer-primary" size="lg">Build your pizza</Button>
              </Link>
              <Link to="/menu">
                <Button variant="customer-secondary" size="lg">Explore menu</Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="max-w-md mx-auto w-full">
            <BuildShot size="large" sauce="tomato" cheese="mozzarella" />
          </div>
        </div>
      </section>

      {/* Popular Handcrafted Pizzas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-[#4A121A]">Popular from the oven</h2>
            <p className="text-sm text-[#736254] mt-1">Tested recipes perfected by our pizzaiolos</p>
          </div>
          <Link to="/menu" className="text-sm font-semibold text-[#E4572E] hover:underline">
            View full menu &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPizzas.map((pizza) => (
            <div
              key={pizza._id}
              className="group bg-[#FFFFFF] rounded-[24px] p-5 border border-[#E2D6C2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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
                <p className="text-sm text-[#736254] leading-relaxed line-clamp-2">{pizza.description}</p>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#F4EDE0]">
                <div>
                  <span className="font-mono font-bold text-xl text-[#E4572E]">₹{pizza.basePrice}</span>
                  <span className="text-[11px] text-[#736254] block">Medium 10"</span>
                </div>
                <Link to={`/pizza/${pizza._id}`}>
                  <Button variant="customer-secondary" size="sm">Order & Customize &rarr;</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#F4EDE0]/60 border-y border-[#E2D6C2] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-[#4A121A]">The CRUST Philosophy</h2>
            <p className="text-sm text-[#736254] mt-2">Every pizza is treated like an architectural project</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Layer by layer', desc: 'Select crust size, sauce coverage, and exact cheese blend ratio.' },
              { step: '02', title: 'Ingredient precision', desc: 'Every topping is tracked by weight and fresh kitchen stock.' },
              { step: '03', title: 'Live oven ticket', desc: 'Track your order through kitchen prep to your doorstep in real time.' },
            ].map(s => (
              <div key={s.step} className="bg-white p-6 rounded-[20px] border border-[#E2D6C2] shadow-sm">
                <span className="font-mono text-3xl font-extrabold text-[#E4572E]">{s.step}</span>
                <h3 className="font-body font-bold text-base text-[#2C1810] mt-2">{s.title}</h3>
                <p className="text-xs text-[#736254] mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
