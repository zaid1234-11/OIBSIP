import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import BuildShot from '../components/ui/BuildShot';

export function Home() {
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
            View all 12 pizzas &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { id: 1, name: 'Margherita Classica', desc: 'Fresh basil, whole-milk mozzarella, San Marzano tomato', price: 299, veg: true },
            { id: 2, name: 'Rustic Pepperoni', desc: 'Cupping pepperoni, smoked provolone, hot honey drizzle', price: 449, veg: false },
            { id: 3, name: 'Tuscan Garden', desc: 'Fire-roasted bell peppers, red onion, button mushrooms, kalamata', price: 379, veg: true },
          ].map(pizza => (
            <div key={pizza.id} className="bg-[#FFFFFF] rounded-[20px] p-6 border border-[#E2D6C2] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-44 rounded-[14px] bg-gradient-to-br from-[#F4EDE0] to-[#EAE0CE] flex items-center justify-center mb-5 border border-[#E8DCBE]">
                  <span className="font-display text-4xl">🍕</span>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-body font-bold text-lg text-[#2C1810]">{pizza.name}</h3>
                  <span className={`w-2 h-2 rounded-full ${pizza.veg ? 'bg-[#456B4E]' : 'bg-[#E4572E]'}`} />
                </div>
                <p className="text-sm text-[#736254] leading-relaxed">{pizza.desc}</p>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#F4EDE0]">
                <span className="font-mono font-bold text-xl text-[#E4572E]">{'\u20B9'}{pizza.price}</span>
                <Link to={`/pizza/${pizza.id}`}>
                  <Button variant="customer-secondary" size="sm">Customize</Button>
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
