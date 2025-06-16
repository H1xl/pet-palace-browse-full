
import React, { useState, useEffect } from "react";
import { Award, Heart, ShieldCheck } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { CartItem } from "@/types/product";

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Загружаем корзину из localStorage при монтировании компонента
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar-during-animation">
      <div className="nav-animate">
        <Navbar 
          cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
          currentPage="home" 
        />
      </div>
      
      <div className="animate-fade-in-up">
        <Hero />
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 animate-slide-in-down animate-delay-200">
            Почему выбирают нас?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md animate-scale-in animate-delay-300">
              <div className="bg-pet-light-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                <Award className="h-8 w-8 text-pet-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Высококачественные товары</h3>
              <p className="text-gray-600">Мы тщательно отбираем только лучшие товары от проверенных производителей для ваших питомцев.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md animate-scale-in animate-delay-400">
              <div className="bg-pet-light-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                <Heart className="h-8 w-8 text-pet-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Забота о питомцах</h3>
              <p className="text-gray-600">Каждый товар подобран с учетом здоровья и комфорта ваших любимых животных.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md animate-scale-in animate-delay-500">
              <div className="bg-pet-light-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                <ShieldCheck className="h-8 w-8 text-pet-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Гарантия качества</h3>
              <p className="text-gray-600">Мы предоставляем гарантию на все товары и готовы помочь в случае любых проблем.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="animate-fade-in animate-delay-300">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
