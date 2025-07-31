import ProductCard from '@/components/ProductCard';

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

export default function ProductGrid({
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

  const getGridColumns = () => {
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
  };

  return (
    <div className={`grid ${getGridColumns()} gap-6 ${className}`}>
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