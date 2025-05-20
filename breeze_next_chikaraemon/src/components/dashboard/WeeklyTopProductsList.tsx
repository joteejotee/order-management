import type { FC } from 'react';
import type { Product } from '@/types/dashboard';
import { Crown } from 'lucide-react';

interface WeeklyTopProductsListProps {
  products: Product[];
}

export const WeeklyTopProductsList: FC<WeeklyTopProductsListProps> = ({
  products,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 h-full">
      <h3 className="text-base font-semibold mb-4 text-gray-800">
        今週の売れ筋 TOP5
      </h3>
      {products.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">データがありません。</p>
        </div>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-auto pr-2">
          {products.map((product, idx) => (
            <li key={product.id} className="py-2 px-3 rounded-lg bg-white">
              <div className="flex items-center">
                {idx === 0 ? (
                  <div className="flex items-center justify-center w-6 h-6 mr-3">
                    <Crown size={18} className="text-yellow-500" />
                  </div>
                ) : idx === 1 ? (
                  <div className="flex items-center justify-center w-6 h-6 mr-3">
                    <Crown size={18} className="text-gray-400" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full mr-3 font-bold text-xs bg-gray-200 text-gray-700">
                    {idx + 1}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {product.name}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
