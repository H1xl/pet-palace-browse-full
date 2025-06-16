
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get current user from localStorage
  const currentUser = localStorage.getItem('currentUser');
  const isLoggedIn = !!currentUser;
  const cartKey = currentUser ? `cartItems_${currentUser}` : 'cartItems_guest';

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [cartKey]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "Товар удален",
      description: "Товар был удален из корзины"
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Корзина очищена",
      description: "Все товары были удалены из корзины"
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discount > 0 
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast({
        title: "Необходима авторизация",
        description: "Для оформления заказа необходимо войти в систему",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте товары в корзину для оформления заказа",
        variant: "destructive"
      });
      return;
    }

    // Очищаем корзину после оформления заказа
    clearCart();
    
    toast({
      title: "Заказ создан!",
      description: "Ваш заказ успешно создан. Мы свяжемся с вами в ближайшее время.",
    });
    
    navigate('/profile');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col animate-fade-in">
        <Navbar cartItemCount={0} currentPage="cart" />
        <div className="container mx-auto px-6 py-8 flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md animate-scale-in">
            <CardHeader>
              <CardTitle className="text-center">Доступ ограничен</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">Для просмотра корзины необходимо войти в систему</p>
              <Button onClick={() => navigate('/login')} className="w-full transition-all duration-200 hover:scale-105">
                Войти в систему
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Navbar cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)} currentPage="cart" />
      
      <div className="container mx-auto px-6 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-500 mb-2">Ваша корзина пуста</h2>
            <p className="text-gray-400 mb-6">Добавьте товары из каталога</p>
            <Button onClick={() => navigate('/catalog')} className="transition-all duration-200 hover:scale-105">
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Список товаров */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => {
                const itemPrice = item.discount > 0 
                  ? item.price * (1 - item.discount / 100)
                  : item.price;
                  
                return (
                  <Card key={item.id} className="animate-fade-in transition-all duration-200 hover:shadow-md" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Изображение товара */}
                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="text-gray-400" size={24} />
                            </div>
                          )}
                        </div>
                        
                        {/* Информация о товаре */}
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-pet-blue">
                              {Math.round(itemPrice)} ₽
                            </span>
                            {item.discount > 0 && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  {item.price} ₽
                                </span>
                                <Badge className="bg-pet-orange text-xs">
                                  -{item.discount}%
                                </Badge>
                              </>
                            )}
                          </div>
                          
                          {/* Количество и управление */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="transition-all duration-200 hover:scale-110"
                              >
                                <Minus size={14} />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-16 text-center"
                                min="1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="transition-all duration-200 hover:scale-110"
                              >
                                <Plus size={14} />
                              </Button>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Общая стоимость за товар */}
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {Math.round(itemPrice * item.quantity)} ₽
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Итоговая информация */}
            <div className="space-y-4">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Итого</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Товары ({cartItems.reduce((total, item) => total + item.quantity, 0)} шт.)</span>
                    <span>{Math.round(calculateTotal())} ₽</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>К оплате</span>
                    <span>{Math.round(calculateTotal())} ₽</span>
                  </div>
                  
                  <Button onClick={handleCheckout} className="w-full transition-all duration-200 hover:scale-105" size="lg">
                    Создать заказ
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={clearCart} 
                    className="w-full transition-all duration-200 hover:scale-105"
                  >
                    Очистить корзину
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
