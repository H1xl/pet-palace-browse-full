
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { Cat, Dog, Bird, Fish, Mouse, Package2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, APIError } from '@/services/api';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  showAddToCart?: boolean;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  showAddToCart = false 
}) => {
  const { toast } = useToast();
  const [imageError, setImageError] = React.useState(false);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);

  React.useEffect(() => {
    if (product) {
      setImageError(false);
    }
  }, [product]);

  if (!product) return null;

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

  const finalPrice = product.discount > 0 
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToCartClick = async () => {
    if (!apiService.isAuthenticated()) {
      toast({
        title: "Необходима авторизация",
        description: "Для добавления товаров в корзину необходимо авторизоваться",
        variant: "destructive"
      });
      return;
    }

    setIsAddingToCart(true);
    
    try {
      await apiService.addToCart(product.id, 1);
      toast({
        title: "Товар добавлен в корзину",
        description: `${product.name} был добавлен в вашу корзину.`
      });
      
      // Вызываем callback для обновления состояния корзины в родительском компоненте
      if (onAddToCart) {
        onAddToCart(product);
      }
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Ошибка",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-enter">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold opacity-0 animate-fade-in-up">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Изображение и основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <div className="relative group">
              {product.image && !imageError ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-64 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getCategoryIcon(product.petType)}
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 space-y-1">
                {product.discount > 0 && (
                  <Badge className="bg-pet-orange animate-scale-in">-{product.discount}%</Badge>
                )}
                {product.new && (
                  <Badge className="bg-pet-blue animate-scale-in">Новинка</Badge>
                )}
                {!product.inStock && (
                  <Badge className="bg-gray-500 animate-scale-in">Нет в наличии</Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getCategoryIcon(product.petType)}
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-pet-blue">{finalPrice} ₽</span>
                  {product.discount > 0 && (
                    <span className="text-lg text-gray-400 line-through">{product.price} ₽</span>
                  )}
                </div>
                
                {product.brand && (
                  <p className="text-sm text-gray-600">Бренд: <span className="font-medium">{product.brand}</span></p>
                )}
                
                {product.weight && (
                  <p className="text-sm text-gray-600">Вес: <span className="font-medium">{product.weight}</span></p>
                )}
              </div>
              
              {showAddToCart && product.inStock && (
                <Button 
                  onClick={handleAddToCartClick}
                  disabled={isAddingToCart}
                  className="w-full flex items-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart size={18} />
                  {isAddingToCart ? "Добавляем..." : "Добавить в корзину"}
                </Button>
              )}
              
              {!product.inStock && (
                <Button disabled className="w-full">
                  Нет в наличии
                </Button>
              )}
            </div>
          </div>
          
          {/* Описание */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            <h3 className="text-lg font-semibold mb-2">Описание</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {/* Характеристики */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <h3 className="text-lg font-semibold mb-3">Характеристики</h3>
              <ul className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex items-start gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'forwards' }}>
                    <span className="w-2 h-2 bg-pet-blue rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
