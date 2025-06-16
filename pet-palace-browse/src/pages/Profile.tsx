
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, ShoppingBag, User, Package, ListChecks, LogOut, Crown, UserCircle, Users, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import OrdersManagement from '@/components/OrdersManagement';
import ProductsManagement from '@/components/ProductsManagement';
import UserManagement from '@/components/UserManagement';
import ProfileEditor from '@/components/ProfileEditor';
import { apiService, APIError } from '@/services/api';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!apiService.isAuthenticated()) {
          navigate('/login');
          return;
        }

        const user = apiService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        setCurrentUser(user);
        
        // Load user orders
        try {
          const userOrders = await apiService.getMyOrders();
          setOrders(userOrders);
        } catch (error) {
          if (error instanceof APIError && error.status === 0) {
            toast({
              title: "Предупреждение",
              description: "Не удается загрузить данные заказов. Сервер недоступен.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate, toast]);

  const handleLogout = () => {
    apiService.logout();
    navigate('/login');
  };

  const handleEditSuccess = (updatedUser: any) => {
    setCurrentUser(updatedUser);
    setIsEditing(false);
    toast({
      title: "Успех",
      description: "Профиль успешно обновлен",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pet-light-blue to-pet-light-orange">
        <div className="w-full max-w-md px-4 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <div className="text-center mb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-pet-blue rounded-full flex items-center justify-center animate-bounce-gentle">
              <UserCircle size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-medium text-gray-900">Загрузка профиля...</h2>
            <p className="text-sm text-gray-500 mt-1">Пожалуйста, подождите</p>
          </div>
          <Progress value={70} className="h-2" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar cartItemCount={0} currentPage="" />
      
      <div className="container mx-auto px-6 py-8 flex-1">
        {/* Заголовок профиля */}
        <div className="bg-gradient-to-r from-pet-blue to-pet-orange rounded-xl p-6 mb-8 text-white opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white/20">
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {currentUser?.full_name?.charAt(0).toUpperCase() || currentUser?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Добро пожаловать, {currentUser.full_name || currentUser.username}!</h1>
                <div className="flex items-center gap-2 mt-1">
                  {isAdmin ? (
                    <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-400">
                      <Crown size={14} className="mr-1" />
                      Администратор
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-500 text-blue-100 hover:bg-blue-400">
                      <User size={14} className="mr-1" />
                      Клиент
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30" 
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Выйти
            </Button>
          </div>
        </div>
        
        {/* Основной контент */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} bg-gray-100 p-1 m-1 rounded-lg`}>
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                <User size={16} />
                <span className="hidden sm:inline">Профиль</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Заказы</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                  <Settings size={16} />
                  <span className="hidden sm:inline">Управление</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="profile" className="p-6 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
              {isEditing ? (
                <ProfileEditor 
                  user={currentUser}
                  onCancel={() => setIsEditing(false)}
                  onSuccess={handleEditSuccess}
                />
              ) : (
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="text-pet-blue" />
                        Информация о пользователе
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit size={16} />
                        Редактировать
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      {isAdmin 
                        ? "Панель управления администратора зоомагазина" 
                        : "Добро пожаловать в ваш личный кабинет"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">ФИО</h3>
                          <p className="text-lg font-semibold">{currentUser.full_name || 'Не указано'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Логин</h3>
                          <p className="text-lg font-semibold">{currentUser.username}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                          <p className="text-lg font-semibold">{currentUser.email}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Телефон</h3>
                          <p className="text-lg font-semibold">{currentUser.phone || 'Не указан'}</p>
                        </div>
                        <div className="p-4 bg-pet-light-blue rounded-lg">
                          <h3 className="text-sm font-medium text-pet-blue mb-1">Роль</h3>
                          <p className="text-lg font-semibold text-pet-blue">{isAdmin ? 'Администратор' : 'Клиент'}</p>
                        </div>
                        <div className="p-4 bg-pet-light-orange rounded-lg">
                          <h3 className="text-sm font-medium text-pet-orange mb-1">Статус</h3>
                          <p className="text-lg font-semibold text-pet-orange">
                            {currentUser.status === 'active' ? 'Активен' : 'Заблокирован'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full transition-all duration-200 hover:scale-105" 
                      onClick={() => navigate('/')}
                    >
                      Вернуться на главную
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="orders" className="p-6 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="text-pet-blue" />
                    История заказов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Заказ #{order.id}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                              <p className="font-medium">{order.total} ₽</p>
                            </div>
                            <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">У вас пока нет заказов</p>
                      <p className="text-gray-400 text-sm mt-2">
                        После создания заказа они появятся здесь
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="admin" className="p-0 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                  <Tabs defaultValue="products" className="w-full">
                    <TabsList className="mb-6 bg-white shadow-sm">
                      <TabsTrigger value="products" className="flex items-center gap-2 px-6 py-3">
                        <Package size={16} />
                        <span>Товары</span>
                      </TabsTrigger>
                      <TabsTrigger value="orders-management" className="flex items-center gap-2 px-6 py-3">
                        <ListChecks size={16} />
                        <span>Заказы</span>
                      </TabsTrigger>
                      <TabsTrigger value="users" className="flex items-center gap-2 px-6 py-3">
                        <Users size={16} />
                        <span>Пользователи</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="products" className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                      <ProductsManagement />
                    </TabsContent>
                    
                    <TabsContent value="orders-management" className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                      <OrdersManagement />
                    </TabsContent>
                    
                    <TabsContent value="users" className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                      <UserManagement />
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
