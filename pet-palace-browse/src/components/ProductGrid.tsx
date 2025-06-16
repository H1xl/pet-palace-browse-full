
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, loading = false }) => {
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3 animate-pulse">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Товары не найдены</h3>
          <p className="text-sm text-gray-400">Попробуйте изменить фильтры поиска</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <ProductCard 
              product={product} 
              onClick={onProductClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
