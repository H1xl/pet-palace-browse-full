
import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 text-pet-blue">Pet<span className="text-pet-orange">Palace</span></h3>
            <p className="text-gray-600 mb-4">
              Ваш надежный партнер в заботе о домашних питомцах. Качественные товары для животных с доставкой.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-pet-blue hover:text-pet-orange transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-pet-blue hover:text-pet-orange transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-pet-blue hover:text-pet-orange transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Покупателям</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-pet-blue transition-colors">Каталог товаров</a></li>
              <li><a href="#" className="hover:text-pet-blue transition-colors">Акции и скидки</a></li>
              <li><a href="#" className="hover:text-pet-blue transition-colors">Доставка и оплата</a></li>
              <li><a href="#" className="hover:text-pet-blue transition-colors">Возврат и обмен</a></li>
              <li><a href="#" className="hover:text-pet-blue transition-colors">Отзывы</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Информация</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-pet-blue transition-colors">О компании</a></li>
              <li><a href="#" className="hover:text-pet-blue transition-colors">Контакты</a></li>
              <li><a href="#" className="hover:text-pet-blue transition-colors">Блог о питомцах</a></li>
              <li><a href="#" className="hover:text-pet-blue transition-colors">Вакансии</a></li>
              <li><a href="#" className="hover:text-pet-blue transition-colors">Партнерам</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Контакты</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Адрес: ул. Пушкина, д. 10</li>
              <li>Телефон: +7 (123) 456-78-90</li>
              <li>Email: info@petpalace.ru</li>
              <li>Режим работы: Пн-Вс, 9:00 - 21:00</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} PetPalace. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
