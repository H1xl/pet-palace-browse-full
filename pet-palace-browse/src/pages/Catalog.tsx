
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import FiltersModal from "@/components/FiltersModal";
import ProductDetailModal from "@/components/ProductDetailModal";
import { Product, ProductFilters, ProductSort, CartItem } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Filter, Search, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import { apiService, APIError } from "@/services/api";

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { toast } = useToast();

  const currentUser = apiService.getCurrentUser();
  const isLoggedIn = apiService.isAuthenticated();
  const cartKey = currentUser ? `cartItems_${currentUser.id}` : 'cartItems_guest';

  const [filters, setFilters] = useState<ProductFilters>({
    category: 'all',
    productType: 'all',
    priceRange: [0, 10000],
    showOnlyNew: false,
    showOnlyDiscounted: false,
    inStock: false,
  });

  const [sort, setSort] = useState<ProductSort>({
    field: 'name',
    direction: 'asc',
  });

  // Загрузка товаров из API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true);
      setApiError(null);
      const productsData = await apiService.getProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      // Устанавливаем максимальную цену на основе загруженных товаров
      const maxPrice = Math.max(...productsData.map((p: any) => p.price));
      setFilters(prev => ({
        ...prev,
        priceRange: [0, maxPrice]
      }));
    } catch (error) {
      if (error instanceof APIError) {
        setApiError(error.message);
      } else {
        setApiError("Произошла неизвестная ошибка при загрузке товаров");
      }
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Загрузка корзины из API
  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
    } else {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [isLoggedIn, currentUser]);

  const loadCart = async () => {
    if (!isLoggedIn) return;
    
    try {
      const cartData = await apiService.getCart();
      setCartItems(cartData);
    } catch (error) {
      // Fallback к localStorage при ошибке API
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  };

  // Сохранение корзины
  useEffect(() => {
    if (isLoggedIn) {
      // Корзина сохраняется через API при добавлении товаров
    } else {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, cartKey, isLoggedIn]);

  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 10000;

  const applyFiltersAndSort = () => {
    setLoading(true);
    
    setTimeout(() => {
      let result = [...products];

      // Поиск
      if (searchTerm.trim()) {
        result = result.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Фильтрация по категории
      if (filters.category !== 'all') {
        result = result.filter(product => product.petType === filters.category);
      }

      // Фильтрация по типу товара
      if (filters.productType !== 'all') {
        result = result.filter(product => product.productType === filters.productType);
      }

      // Фильтрация по цене
      result = result.filter(product => {
        const finalPrice = product.discount > 0 
          ? product.price * (1 - product.discount / 100)
          : product.price;
        return finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];
      });

      // Фильтрация по новинкам
      if (filters.showOnlyNew) {
        result = result.filter(product => product.new);
      }

      // Фильтрация по скидкам
      if (filters.showOnlyDiscounted) {
        result = result.filter(product => product.discount > 0);
      }

      // Фильтрация по наличию
      if (filters.inStock) {
        result = result.filter(product => product.inStock);
      }

      // Сортировка
      result.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sort.field) {
          case 'price':
            aValue = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
            bValue = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
            break;
          case 'dateAdded':
            aValue = new Date(a.dateAdded);
            bValue = new Date(b.dateAdded);
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          default:
            return 0;
        }

        if (sort.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      setFilteredProducts(result);
      setLoading(false);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFiltersAndSort();
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      productType: 'all',
      priceRange: [0, maxPrice],
      showOnlyNew: false,
      showOnlyDiscounted: false,
      inStock: false,
    });
    setSort({
      field: 'name',
      direction: 'asc',
    });
    setSearchTerm('');
    setTimeout(() => {
      setFilteredProducts(products);
    }, 100);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn) {
      toast({
        title: "Необходима авторизация",
        description: "Для добавления товаров в корзину необходимо авторизоваться",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLoggedIn) {
        // Добавляем через API
        await apiService.addToCart(product.id, 1);
        await loadCart(); // Перезагружаем корзину
      } else {
        // Локальное добавление для гостей
        setCartItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
          if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + 1
            };
            return updatedItems;
          } else {
            return [...prevItems, { ...product, quantity: 1 }];
          }
        });
      }

      toast({
        title: "Товар добавлен в корзину",
        description: `${product.name} был добавлен в вашу корзину.`
      });
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Ошибка",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const hasActiveFilters = filters.category !== 'all' || 
    filters.productType !== 'all' || 
    filters.showOnlyNew || 
    filters.showOnlyDiscounted || 
    filters.inStock || 
    searchTerm.trim() !== '';

  // Error state
  if (apiError && !isLoadingProducts) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          cartItemCount={isLoggedIn ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0} 
          currentPage="catalog" 
        />
        <div className="container mx-auto px-6 py-8 flex-1 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка загрузки данных</AlertTitle>
              <AlertDescription className="mt-2">
                {apiError}
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button onClick={loadProducts} className="flex items-center gap-2">
                <RefreshCw size={16} />
                Попробовать снова
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoadingProducts) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          cartItemCount={isLoggedIn ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0} 
          currentPage="catalog" 
        />
        <div className="container mx-auto px-6 py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Загрузка каталога...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar-during-animation">
      <div className="nav-animate opacity-0">
        <Navbar 
          cartItemCount={isLoggedIn ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0} 
          currentPage="catalog" 
        />
      </div>
      
      <div className="container mx-auto px-6 py-8 opacity-0 animate-fade-in-up animate-delay-100">
        <h1 className="text-3xl font-bold mb-6 opacity-0 animate-slide-in-down">Каталог товаров</h1>
        
        {/* Поиск и фильтры */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 opacity-0 animate-slide-in-left animate-delay-200">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Input 
              type="text" 
              placeholder="Поиск товаров..." 
              className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-pet-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <Search size={18} />
            </button>
          </form>
          
          <Button 
            onClick={() => setIsFiltersOpen(true)}
            variant="outline"
            className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <Filter size={18} />
            Фильтры и сортировка
          </Button>
        </div>

        {/* Активные фильтры */}
        <div className="mb-4 opacity-0 animate-slide-in-right animate-delay-300">
          <div className="text-sm text-gray-600">
            {hasActiveFilters && (
              <Button 
                variant="destructive" 
                onClick={resetFilters}
                className="ml-2 h-auto p-2 text-sm flex items-center gap-1 hover:scale-105 transition-transform duration-200"
                size="sm"
              >
                <RotateCcw size={14} />
                Сбросить фильтры
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="opacity-0 animate-fade-in animate-delay-400">
        <ProductGrid 
          products={filteredProducts}
          onProductClick={handleProductClick}
          loading={loading}
        />
      </div>

      {/* Поле найденных товаров - отображается только при фильтрации */}
      {hasActiveFilters && (
        <div className="container mx-auto px-6 pb-4 opacity-0 animate-scale-in animate-delay-500">
          <div className="bg-gradient-to-r from-pet-light-blue to-pet-light-orange border-l-4 border-pet-blue rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Найдено товаров: <span className="font-bold text-pet-blue text-lg">{filteredProducts.length}</span>
              </p>
              <div className="text-xs text-gray-500">
                {searchTerm && `по запросу "${searchTerm}"`}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onApply={() => {
          applyFiltersAndSort();
          setIsFiltersOpen(false);
        }}
        onReset={resetFilters}
        maxPrice={maxPrice}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        showAddToCart={isLoggedIn}
      />
      
      <div className="opacity-0 animate-fade-in animate-delay-300">
        <Footer />
      </div>
    </div>
  );
};

export default Catalog;
