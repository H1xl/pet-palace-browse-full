import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from 'lucide-react';
import { ProductFormData } from '@/types/productForm';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  pet_type: string;
  product_type: string;
  discount: number;
  is_new: boolean;
  in_stock: boolean;
  brand?: string;
  weight?: string;
  specifications?: string;
}

interface ProductEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductFormData) => void;
  product?: ProductFormData | null;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ isOpen, onClose, onSave, product: initialProduct }) => {
  const [product, setProduct] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    pet_type: 'dog',
    product_type: 'food',
    discount: 0,
    is_new: false,
    in_stock: true,
    brand: '',
    weight: '',
    specifications: ''
  });

  useEffect(() => {
    if (initialProduct) {
      setProduct({
        ...initialProduct,
        image_url: initialProduct.image_url || '',
        brand: initialProduct.brand || '',
        weight: initialProduct.weight || '',
        specifications: initialProduct.specifications || ''
      });
    }
  }, [initialProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    const newValue = type === 'checkbox' ? checked : 
                     type === 'number' ? parseFloat(value) || 0 : value;

    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: newValue,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <Button variant="ghost" onClick={onClose} className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Вернуться к списку товаров
          </Button>

          <h1 className="text-2xl font-bold mb-6">
            {initialProduct ? 'Редактировать товар' : 'Добавить новый товар'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Название товара *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Цена *</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="discount">Скидка (%)</Label>
                <Input
                  type="number"
                  id="discount"
                  name="discount"
                  value={product.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="image_url">URL изображения</Label>
              <Input
                type="url"
                id="image_url"
                name="image_url"
                value={product.image_url}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Категория *</Label>
                <Input
                  type="text"
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="brand">Бренд</Label>
                <Input
                  type="text"
                  id="brand"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pet_type">Тип животного *</Label>
                <Select value={product.pet_type} onValueChange={(value) => handleSelectChange('pet_type', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тип животного" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Собаки</SelectItem>
                    <SelectItem value="cat">Кошки</SelectItem>
                    <SelectItem value="bird">Птицы</SelectItem>
                    <SelectItem value="fish">Рыбы</SelectItem>
                    <SelectItem value="rodent">Грызуны</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="product_type">Тип товара *</Label>
                <Select value={product.product_type} onValueChange={(value) => handleSelectChange('product_type', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тип товара" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Корм</SelectItem>
                    <SelectItem value="toys">Игрушки</SelectItem>
                    <SelectItem value="accessories">Аксессуары</SelectItem>
                    <SelectItem value="cages">Клетки</SelectItem>
                    <SelectItem value="care">Уход</SelectItem>
                    <SelectItem value="medicine">Медицина</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="weight">Вес</Label>
              <Input
                type="text"
                id="weight"
                name="weight"
                value={product.weight}
                onChange={handleChange}
                placeholder="например: 1кг, 500г"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="specifications">Характеристики</Label>
              <Textarea
                id="specifications"
                name="specifications"
                value={product.specifications}
                onChange={handleChange}
                placeholder="Дополнительные характеристики товара"
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_new"
                  name="is_new"
                  checked={product.is_new}
                  onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_new: checked }))}
                />
                <Label htmlFor="is_new">Новинка</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="in_stock"
                  name="in_stock"
                  checked={product.in_stock}
                  onCheckedChange={(checked) => setProduct(prev => ({ ...prev, in_stock: checked }))}
                />
                <Label htmlFor="in_stock">В наличии</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Отменить
              </Button>
              <Button type="submit">
                {initialProduct ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;
