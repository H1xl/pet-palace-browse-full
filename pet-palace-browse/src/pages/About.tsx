
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Users, Heart, Shield, Truck, Phone } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col hide-scrollbar-during-animation">
      <div className="nav-animate">
        <Navbar cartItemCount={0} currentPage="about" />
      </div>
      
      <div className="flex-1 animate-fade-in">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-pet-blue to-pet-orange text-white py-16 animate-slide-in-down">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-scale-in animate-delay-200">
              О нашем зоомагазине
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto animate-fade-in-up animate-delay-300">
              Мы заботимся о ваших питомцах уже более 10 лет, предоставляя качественные товары и профессиональные услуги
            </p>
          </div>
        </div>

        {/* Основная информация */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left animate-delay-400">
              <h2 className="text-3xl font-bold mb-6">Наша история</h2>
              <p className="text-gray-600 mb-4">
                Зоомагазин "ПетДом" был основан в 2014 году группой энтузиастов, которые любят животных и понимают, 
                насколько важно обеспечить наших четвероногих друзей всем необходимым для счастливой и здоровой жизни.
              </p>
              <p className="text-gray-600 mb-4">
                За годы работы мы накопили огромный опыт в области зоотоваров и можем предложить нашим клиентам 
                только самые качественные и проверенные товары от ведущих мировых производителей.
              </p>
              <p className="text-gray-600">
                Сегодня мы гордимся тем, что стали одним из самых доверенных зоомагазинов в городе, 
                где каждый владелец питомца может найти всё необходимое для своего любимца.
              </p>
            </div>
            <div className="animate-slide-in-right animate-delay-500">
              <img 
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80" 
                alt="Зоомагазин" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Наши преимущества */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 animate-slide-in-down animate-delay-200">
              Почему выбирают нас?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center animate-scale-in animate-delay-300">
                <div className="bg-pet-light-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                  <Award className="h-8 w-8 text-pet-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Качественные товары</h3>
                <p className="text-gray-600">
                  Мы работаем только с проверенными поставщиками и предлагаем товары высокого качества
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center animate-scale-in animate-delay-400">
                <div className="bg-pet-light-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                  <Users className="h-8 w-8 text-pet-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Опытная команда</h3>
                <p className="text-gray-600">
                  Наши консультанты - опытные специалисты, готовые помочь с выбором товаров
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center animate-scale-in animate-delay-500">
                <div className="bg-pet-light-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                  <Heart className="h-8 w-8 text-pet-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Любовь к животным</h3>
                <p className="text-gray-600">
                  Мы искренне любим животных и понимаем потребности каждого питомца
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Услуги */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 animate-slide-in-down animate-delay-200">
            Наши услуги
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4 animate-slide-in-left animate-delay-300">
              <div className="bg-pet-orange p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Гарантия качества</h3>
                <p className="text-gray-600">Предоставляем гарантию на все товары и готовы заменить некачественный товар</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 animate-slide-in-up animate-delay-400">
              <div className="bg-pet-orange p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Быстрая доставка</h3>
                <p className="text-gray-600">Доставляем заказы по городу в день заказа или на следующий день</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 animate-slide-in-right animate-delay-500">
              <div className="bg-pet-orange p-2 rounded-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Консультации</h3>
                <p className="text-gray-600">Наши специалисты всегда готовы проконсультировать по уходу за питомцами</p>
              </div>
            </div>
          </div>
        </div>

        {/* Контакты */}
        <div className="bg-pet-blue text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8 animate-scale-in animate-delay-200">
              Свяжитесь с нами
            </h2>
            <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up animate-delay-300">
              <div>
                <h3 className="text-xl font-semibold mb-2">Адрес</h3>
                <p>г. Москва, ул. Примерная, д. 123</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Телефон</h3>
                <p>+7 (495) 123-45-67</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p>info@petdom.ru</p>
              </div>
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

export default About;
