import type { FC } from 'react';
import type { Product } from '@/types/dashboard';

interface InventoryListProps {
  title: string;
  products: Product[];
  color?: 'blue' | 'green' | 'red' | 'amber';
}

export const InventoryList: FC<InventoryListProps> = ({
  title,
  products,
  color = 'red',
}) => {
  // カラー設定に基づくスタイルマッピング
  const colorStyles = {
    red: {
      border: 'border-gray-200',
      badge: 'bg-red-100 text-gray-800',
      title: 'text-gray-800',
    },
    amber: {
      border: 'border-gray-200',
      badge: 'bg-amber-100 text-gray-800',
      title: 'text-gray-800',
    },
    blue: {
      border: 'border-gray-200',
      badge: 'bg-blue-100 text-gray-800',
      title: 'text-gray-800',
    },
    green: {
      border: 'border-gray-200',
      badge: 'bg-green-100 text-gray-800',
      title: 'text-gray-800',
    },
  };

  const styles = colorStyles[color];

  return (
    <div className={`rounded-xl border ${styles.border} bg-white p-6 h-full`}>
      <h3 className={`text-base font-semibold mb-4 ${styles.title}`}>
        {title}
      </h3>
      {products.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">該当する商品はありません。</p>
        </div>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-auto pr-2">
          {products.map(product => (
            <li
              key={product.id}
              className="text-sm py-2 px-3 rounded-lg bg-white border border-gray-200 flex justify-between items-center"
            >
              <span className="font-medium text-gray-800">{product.name}</span>
              {product.stock !== undefined && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${styles.badge}`}
                >
                  {product.stock === 0 ? '在庫切れ' : `残り${product.stock}個`}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
