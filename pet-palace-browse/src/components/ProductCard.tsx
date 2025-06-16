
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { Cat, Dog, Bird, Fish, Mouse, Package2, Hand } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const getCategoryIcon = (petType: string) => {
    switch (petType) {
      case 'cat':
        return <Cat size={48} className="text-gray-400" />;
      case 'dog':
        return <Dog size={48} className="text-gray-400" />;
      case 'bird':
        return <Bird size={48} className="text-gray-400" />;
      case 'fish':
        return <Fish size={48} className="text-gray-400" />;
      case 'rodent':
        return <Mouse size={48} className="text-gray-400" />;
      default:
        return <Package2 size={48} className="text-gray-400" />;
    }
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card 
      className="product-card overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 relative group opacity-0 animate-fade-in-up"
      onClick={() => onClick(product)}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Повернутая иконка указательного пальца в правом нижнем углу */}
      <div className="absolute bottom-3 right-3 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-200 pointer-events-none transform -rotate-45 scale-150">
        <Hand size={24} className="text-gray-600" />
      </div>
      
      <div className="relative pt-4 px-4 z-10">
        {product.discount > 0 && (
          <Badge className="absolute top-6 left-6 bg-pet-orange animate-scale-in z-20">-{product.discount}%</Badge>
        )}
        {product.new && (
          <Badge className="absolute top-6 right-6 bg-pet-blue animate-scale-in z-20">Новинка</Badge>
        )}
        {!product.inStock && (
          <Badge className="absolute top-6 left-6 bg-gray-500 animate-scale-in z-20">Нет в наличии</Badge>
        )}
        
        <div className="h-48 flex items-center justify-center mb-4 overflow-hidden rounded-md bg-gray-100 group-hover:bg-gray-50 transition-colors duration-200">
          {product.image && !imageError ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
              onError={handleImageError}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              {getCategoryIcon(product.petType)}
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="flex-grow z-10 relative">
        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
        <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-pet-blue transition-colors duration-200">{product.name}</h3>
        <div className="flex items-baseline gap-2 mb-2">
          {product.discount > 0 ? (
            <>
              <span className="text-xl font-bold text-pet-blue">
                {Math.round(product.price * (1 - product.discount / 100))} ₽
              </span>
              <span className="text-sm text-gray-400 line-through">
                {product.price} ₽
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-pet-blue">{product.price} ₽</span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        {product.brand && (
          <p className="text-xs text-gray-500 mt-1">Бренд: {product.brand}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
