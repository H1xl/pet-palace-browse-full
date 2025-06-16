import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Mail, Phone, Lock, UserPlus, Eye, EyeOff, LogIn } from 'lucide-react';
import { apiService, APIError } from '@/services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'ФИО обязательно для заполнения';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Логин обязателен для заполнения';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Логин должен содержать минимум 3 символа';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (formData.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{10,14}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Некорректный формат телефона';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await apiService.register({
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      });

      toast({
        title: "Регистрация успешна",
        description: "Аккаунт создан. Теперь вы можете войти в систему.",
      });
      
      navigate('/login');
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 0) {
          toast({
            title: "Сервер недоступен",
            description: "Не удается подключиться к серверу. Проверьте подключение к интернету и попробуйте позже.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Ошибка регистрации",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Ошибка",
          description: "Произошла неизвестная ошибка",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar-during-animation">
      <div className="nav-animate opacity-0">
        <Navbar cartItemCount={0} currentPage="" />
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-pet-light-blue to-pet-light-orange opacity-0 animate-fade-in">
        <Card className="w-full max-w-md opacity-0 animate-scale-in shadow-2xl animate-delay-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-pet-blue rounded-full flex items-center justify-center animate-bounce-gentle">
              <UserPlus size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 opacity-0 form-animation">
              <div className="space-y-2">
                <div className="flex items-center border rounded-md px-3 py-2 bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-pet-blue focus-within:border-pet-blue">
                  <User size={18} className="text-gray-500 mr-2" />
                  <Input 
                    type="text" 
                    placeholder="ФИО" 
                    value={formData.full_name} 
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>
                {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center border rounded-md px-3 py-2 bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-pet-blue focus-within:border-pet-blue">
                  <User size={18} className="text-gray-500 mr-2" />
                  <Input 
                    type="text" 
                    placeholder="Логин" 
                    value={formData.username} 
                    onChange={(e) => handleChange('username', e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center border rounded-md px-3 py-2 bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-pet-blue focus-within:border-pet-blue">
                  <Mail size={18} className="text-gray-500 mr-2" />
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center border rounded-md px-3 py-2 bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-pet-blue focus-within:border-pet-blue">
                  <Phone size={18} className="text-gray-500 mr-2" />
                  <Input 
                    type="tel" 
                    placeholder="Телефон" 
                    value={formData.phone} 
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center border rounded-md px-3 py-2 bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-pet-blue focus-within:border-pet-blue">
                  <Lock size={18} className="text-gray-500 mr-2" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Пароль" 
                    value={formData.password} 
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center border rounded-md px-3 py-2 bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-pet-blue focus-within:border-pet-blue">
                  <Lock size={18} className="text-gray-500 mr-2" />
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Подтвердите пароль" 
                    value={formData.confirmPassword} 
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-pet-blue hover:bg-blue-600 transition-all duration-200 hover:scale-105 btn-hover-effect"
                disabled={isLoading}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-gray-500 text-center">
              Уже есть аккаунт?
            </p>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full flex items-center gap-2 hover:scale-105 transition-all duration-200"
            >
              <LogIn size={18} />
              Войти
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="opacity-0 animate-fade-in animate-delay-300">
        <Footer />
      </div>
    </div>
  );
};

export default Register;
