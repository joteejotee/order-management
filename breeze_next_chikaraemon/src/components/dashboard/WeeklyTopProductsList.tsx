import type { FC } from 'react';
import type { Product } from '@/types/dashboard';

interface WeeklyTopProductsListProps {
  products: Product[];
}

export const WeeklyTopProductsList: FC<WeeklyTopProductsListProps> = ({
  products,
}) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold mb-4 text-gray-800">
        今週の売れ筋 TOP5
      </h3>
      {products.length === 0 ? (
        <p className="text-sm text-gray-500">データがありません。</p>
      ) : (
        <ol className="list-decimal list-inside space-y-1">
          {products.map((product, idx) => (
            <li key={product.id} className="text-sm text-gray-700">
              {idx + 1}. {product.name}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
