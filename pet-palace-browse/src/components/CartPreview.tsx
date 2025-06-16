
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { CartItem } from '@/types/product';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

interface CartPreviewProps {
  cartItems: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ 
  cartItems, 
  onRemoveFromCart,
  onUpdateQuantity
}) => {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.discount > 0 
      ? Math.round(item.price * (1 - item.discount / 100)) 
      : item.price;
    return total + (price * item.quantity);
  }, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart size={20} />
          <span className="ml-2">Корзина</span>
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-pet-orange">{totalItems}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
          <SheetDescription>
            У вас {totalItems} {totalItems === 1 ? 'товар' : 'товаров'} в корзине
          </SheetDescription>
        </SheetHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">Ваша корзина пуста</p>
          </div>
        ) : (
          <div className="py-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 py-2 border-b">
                <div className="w-16 h-16 overflow-hidden rounded-md shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.name}</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    {item.discount > 0 ? (
                      <>
                        <span className="text-sm font-semibold text-pet-blue">
                          {Math.round(item.price * (1 - item.discount / 100))} ₽
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {item.price} ₽
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-pet-blue">{item.price} ₽</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 rounded-full" 
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 rounded-full" 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-auto h-8 w-8 text-gray-400 hover:text-destructive" 
                      onClick={() => onRemoveFromCart(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {cartItems.length > 0 && (
          <SheetFooter className="mt-4 sm:mt-0">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between py-4 border-t border-b">
                <span className="font-semibold">Итого:</span>
                <span className="font-bold text-lg">{subtotal} ₽</span>
              </div>
              <div className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Button className="w-full bg-pet-blue hover:bg-blue-600">
                    Оформить заказ
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Продолжить покупки
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartPreview;
