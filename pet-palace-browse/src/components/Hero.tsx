
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-pet-light-blue to-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
              Всё для ваших питомцев в одном месте
            </h1>
            <p className="text-lg text-gray-600 mb-6 md:pr-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              От корма премиум-класса до игрушек и аксессуаров — мы заботимся о здоровье и счастье ваших любимцев.
            </p>
            <div className="flex space-x-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button className="bg-pet-blue hover:bg-blue-600 text-white" asChild>
                <Link to="/catalog">Каталог товаров</Link>
              </Button>
              <Button variant="outline" className="border-pet-blue text-pet-blue hover:bg-pet-light-blue" asChild>
                <Link to="/about">О нас</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-pet-orange rounded-full opacity-25"></div>
              <img 
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=500&q=80" 
                alt="Счастливые питомцы" 
                className="rounded-lg shadow-2xl relative z-10"
                width="500"
                height="400"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pet-blue rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
