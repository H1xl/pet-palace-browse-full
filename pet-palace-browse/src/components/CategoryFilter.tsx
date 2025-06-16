
import React from 'react';
import { Cat, Dog, Bird, Fish, Mouse, Package2 } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const categories = [
  { id: 'all', name: 'Все товары', icon: Package2 },
  { id: 'dog', name: 'Для собак', icon: Dog },
  { id: 'cat', name: 'Для кошек', icon: Cat },
  { id: 'bird', name: 'Для птиц', icon: Bird },
  { id: 'fish', name: 'Для рыб', icon: Fish },
  { id: 'rodent', name: 'Для грызунов', icon: Mouse },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-6">
        <h2 className="text-lg font-medium mb-3">Категории</h2>
        <div className="flex flex-nowrap overflow-x-auto pb-2 gap-3 -mx-2 px-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`flex flex-col items-center min-w-[80px] p-2 rounded-lg transition-colors ${
                  selectedCategory === category.id 
                  ? "bg-pet-light-blue text-pet-blue" 
                  : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                  <CategoryIcon size={18} className={selectedCategory === category.id ? "text-pet-blue" : "text-gray-500"} />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
