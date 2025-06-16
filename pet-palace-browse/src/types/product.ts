
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: string;
  petType: 'cat' | 'dog' | 'bird' | 'fish' | 'rodent';
  productType: 'food' | 'toys' | 'accessories' | 'cages' | 'care' | 'medicine';
  discount: number;
  new: boolean;
  dateAdded: string;
  inStock: boolean;
  brand?: string;
  weight?: string;
  specifications?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductFilters {
  category: string;
  productType: string;
  priceRange: [number, number];
  showOnlyNew: boolean;
  showOnlyDiscounted: boolean;
  inStock: boolean;
}

export interface ProductSort {
  field: 'price' | 'dateAdded' | 'name';
  direction: 'asc' | 'desc';
}
