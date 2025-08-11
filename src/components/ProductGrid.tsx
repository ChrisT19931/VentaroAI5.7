import ProductCard from '@/components/ProductCard';
import { memo, useMemo } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string | null;
  slug?: string;
  product_type?: 'digital' | 'physical';
};

type ProductGridProps = {
  products: Product[];
  showAddToCart?: boolean;
  emptyMessage?: string;
  className?: string;
  columns?: 2 | 3 | 4;
};

function ProductGrid({
  products,
  showAddToCart = true,
  emptyMessage = 'No products found',
  className = '',
  columns = 3,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const gridColumns = useMemo(() => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  }, [columns]);

  return (
    <div className={`grid ${gridColumns} gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          description={product.description}
          image_url={product.image_url}
          slug={product.slug}
          productType={product.product_type as 'digital' | 'physical'}
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  );
}

export default memo(ProductGrid, (prevProps, nextProps) => {
  // Only re-render if these props change
  if (prevProps.products.length !== nextProps.products.length) return false;
  if (prevProps.showAddToCart !== nextProps.showAddToCart) return false;
  if (prevProps.columns !== nextProps.columns) return false;
  if (prevProps.className !== nextProps.className) return false;
  
  // Check if products have changed
  for (let i = 0; i < prevProps.products.length; i++) {
    if (prevProps.products[i].id !== nextProps.products[i].id) return false;
    if (prevProps.products[i].price !== nextProps.products[i].price) return false;
  }
  
  return true;
});