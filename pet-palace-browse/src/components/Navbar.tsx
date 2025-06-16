
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiService } from '@/services/api';

interface NavbarProps {
  cartItemCount: number;
  currentPage?: string;
}

const Navbar = ({ cartItemCount, currentPage = '' }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = apiService.getCurrentUser();
    setCurrentUser(user);
  }, [location]);

  const isLoggedIn = apiService.isAuthenticated();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavLinkClass = (page: string) => {
    return `transition-colors ${
      currentPage === page
        ? "text-pet-blue font-medium border-b-2 border-pet-blue"
        : "text-gray-700 hover:text-pet-blue"
    }`;
  };

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    navigate('/');
    window.location.reload();
  };

  const navigateWithProgress = (path: string) => {
    if (path === location.pathname) {
      return;
    }
    
    setIsNavigating(true);
    setProgress(30);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 100);
    
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      navigate(path);
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 300);
    }, 400);
  };

  return (
    <>
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Progress value={progress} className="h-1" />
        </div>
      )}
      
      <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-40">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMenu} 
                className="lg:hidden text-gray-700"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" onClick={(e) => { e.preventDefault(); navigateWithProgress('/'); }} className="flex items-center">
                <span className="text-2xl font-bold text-pet-blue">Сытый<span className="text-pet-orange">зверь</span></span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/" onClick={(e) => { e.preventDefault(); navigateWithProgress('/'); }} className={getNavLinkClass("home")}>Главная</Link>
              <Link to="/catalog" onClick={(e) => { e.preventDefault(); navigateWithProgress('/catalog'); }} className={getNavLinkClass("catalog")}>Каталог</Link>
              <Link to="/about" onClick={(e) => { e.preventDefault(); navigateWithProgress('/about'); }} className={getNavLinkClass("about")}>О нас</Link>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative" aria-label="Меню пользователя">
                    <User size={24} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {isLoggedIn ? (
                    <>
                      <div className="px-2 py-1.5 text-sm font-semibold">
                        Аккаунт: {currentUser?.username || currentUser?.email}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" onClick={(e) => { e.preventDefault(); navigateWithProgress('/profile'); }} className="cursor-pointer w-full">
                          Личный кабинет
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/cart" onClick={(e) => { e.preventDefault(); navigateWithProgress('/cart'); }} className="cursor-pointer w-full flex justify-between items-center">
                          <span>Корзина</span>
                          {cartItemCount > 0 && (
                            <Badge className="bg-pet-orange">{cartItemCount}</Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 flex items-center">
                        <LogOut size={16} className="mr-2" />
                        <span>Выйти</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/login" onClick={(e) => { e.preventDefault(); navigateWithProgress('/login'); }} className="cursor-pointer w-full">
                          Войти
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/cart" onClick={(e) => { e.preventDefault(); navigateWithProgress('/cart'); }} className="cursor-pointer w-full flex justify-between items-center">
                          <span>Корзина</span>
                          {cartItemCount > 0 && (
                            <Badge className="bg-pet-orange">{cartItemCount}</Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link to="/" onClick={(e) => { e.preventDefault(); navigateWithProgress('/'); setIsMenuOpen(false); }} className={`${getNavLinkClass("home")} py-1`}>Главная</Link>
                <Link to="/catalog" onClick={(e) => { e.preventDefault(); navigateWithProgress('/catalog'); setIsMenuOpen(false); }} className={`${getNavLinkClass("catalog")} py-1`}>Каталог</Link>
                <Link to="/about" onClick={(e) => { e.preventDefault(); navigateWithProgress('/about'); setIsMenuOpen(false); }} className={`${getNavLinkClass("about")} py-1`}>О нас</Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
