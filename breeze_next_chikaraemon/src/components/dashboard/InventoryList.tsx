import type { FC } from 'react';
import type { Product } from '@/types/dashboard';

interface InventoryListProps {
  title: string;
  products: Product[];
}

export const InventoryList: FC<InventoryListProps> = ({ title, products }) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold mb-4 text-gray-800">{title}</h3>
      {products.length === 0 ? (
        <p className="text-sm text-gray-500">該当する商品はありません。</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-auto">
          {products.map(product => (
            <li key={product.id} className="text-sm text-gray-700">
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
