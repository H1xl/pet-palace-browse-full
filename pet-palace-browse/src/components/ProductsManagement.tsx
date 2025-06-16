import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductEditor from './ProductEditor';
import ErrorPage from './ErrorPage';
import { Product } from '@/types/product';
import { ProductFormData } from '@/types/productForm';
import { apiService, APIError } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Package2 } from 'lucide-react';

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const productsData = await apiService.getProducts();
      setProducts(productsData);
    } catch (error) {
      if (error instanceof APIError) {
        setApiError(error.message);
      } else {
        setApiError("Произошла неизвестная ошибка при загрузке товаров");
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  };

  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      const newProduct = await apiService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      setIsEditorOpen(false);
      toast({
        title: "Успешно",
        description: "Товар создан успешно"
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

  const handleEditProduct = async (productData: ProductFormData) => {
    if (!editingProduct) return;

    try {
      const updatedProduct = await apiService.updateProduct(editingProduct.id, productData);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setIsEditorOpen(false);
      setEditingProduct(null);
      toast({
        title: "Успешно",
        description: "Товар обновлен успешно"
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

  const handleDeleteProduct = async (productId: string) => {
    try {
      await apiService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Успешно",
        description: "Товар удален успешно"
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

  const openCreateEditor = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (product: Product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const convertProductToFormData = (product: Product): ProductFormData => {
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image,
      category: product.category,
      pet_type: product.petType,
      product_type: product.productType,
      discount: product.discount,
      is_new: product.new,
      in_stock: product.inStock,
      brand: product.brand,
      weight: product.weight,
      specifications: Array.isArray(product.specifications) ? product.specifications.join('\n') : product.specifications
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-lg">Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <ErrorPage
        title="Ошибка загрузки товаров"
        message={apiError}
        onRetry={loadProducts}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Управление товарами</h2>
        <Button onClick={openCreateEditor} className="flex items-center gap-2">
          <Plus size={18} />
          Добавить товар
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Поиск товаров..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditEditor(product)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                  <Package2 size={32} className="text-gray-400" />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{product.price} ₽</span>
                  {product.discount > 0 && (
                    <Badge className="bg-red-100 text-red-800">-{product.discount}%</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.new && <Badge className="bg-green-100 text-green-800">Новинка</Badge>}
                  {!product.inStock && <Badge variant="destructive">Нет в наличии</Badge>}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            {searchTerm ? 'Товары не найдены' : 'Нет товаров'}
          </h3>
          <p className="text-sm text-gray-400">
            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Добавьте первый товар для начала работы'}
          </p>
        </div>
      )}

      <ProductEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingProduct(null);
        }}
        onSave={editingProduct ? handleEditProduct : handleCreateProduct}
        product={editingProduct ? convertProductToFormData(editingProduct) : null}
      />
    </div>
  );
};

export default ProductsManagement;
