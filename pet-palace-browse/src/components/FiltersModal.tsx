
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ProductFilters, ProductSort } from '@/types/product';
import { Cat, Dog, Bird, Fish, Mouse, Package2 } from 'lucide-react';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  sort: ProductSort;
  onFiltersChange: (filters: ProductFilters) => void;
  onSortChange: (sort: ProductSort) => void;
  onApply: () => void;
  onReset: () => void;
  maxPrice: number;
}

const categories = [
  { id: 'all', name: 'Все товары', icon: Package2 },
  { id: 'cat', name: 'Для кошек', icon: Cat },
  { id: 'dog', name: 'Для собак', icon: Dog },
  { id: 'bird', name: 'Для птиц', icon: Bird },
  { id: 'fish', name: 'Для рыб', icon: Fish },
  { id: 'rodent', name: 'Для грызунов', icon: Mouse },
];

const productTypes = [
  { id: 'all', name: 'Все типы' },
  { id: 'food', name: 'Корм' },
  { id: 'toys', name: 'Игрушки' },
  { id: 'accessories', name: 'Аксессуары' },
  { id: 'cages', name: 'Клетки и домики' },
  { id: 'care', name: 'Уход' },
  { id: 'medicine', name: 'Лекарства' },
];

const FiltersModal: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onApply,
  onReset,
  maxPrice,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Фильтры и сортировка</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Категория животных */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Категория</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => onFiltersChange({ ...filters, category: category.id })}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                      filters.category === category.id
                        ? 'border-pet-blue bg-pet-light-blue text-pet-blue'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CategoryIcon size={16} />
                    <span className="text-xs">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Тип товара */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Тип товара</Label>
            <Select value={filters.productType} onValueChange={(value) => onFiltersChange({ ...filters, productType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип товара" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Диапазон цен */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Цена: {filters.priceRange[0]} - {filters.priceRange[1]} ₽
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
              max={maxPrice}
              min={0}
              step={100}
              className="w-full"
            />
          </div>

          {/* Чекбоксы */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new"
                checked={filters.showOnlyNew}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, showOnlyNew: !!checked })}
              />
              <Label htmlFor="new" className="text-sm">Только новинки</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discount"
                checked={filters.showOnlyDiscounted}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, showOnlyDiscounted: !!checked })}
              />
              <Label htmlFor="discount" className="text-sm">Только со скидкой</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={filters.inStock}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, inStock: !!checked })}
              />
              <Label htmlFor="inStock" className="text-sm">Только в наличии</Label>
            </div>
          </div>

          {/* Сортировка */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Сортировка</Label>
            <div className="grid grid-cols-2 gap-2">
              <Select value={sort.field} onValueChange={(value) => onSortChange({ ...sort, field: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Поле" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">По цене</SelectItem>
                  <SelectItem value="dateAdded">По дате</SelectItem>
                  <SelectItem value="name">По названию</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sort.direction} onValueChange={(value) => onSortChange({ ...sort, direction: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Направление" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">По возрастанию</SelectItem>
                  <SelectItem value="desc">По убыванию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onReset} variant="outline" className="flex-1">
              Сбросить
            </Button>
            <Button onClick={onApply} className="flex-1">
              Применить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FiltersModal;
