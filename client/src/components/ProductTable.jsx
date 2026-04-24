import { useSelector } from 'react-redux';
import { useDeleteProductMutation } from '../features/products/productsApi';

const StatusBadge = ({ quantity, threshold }) => {
  if (quantity === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Out of Stock
      </span>
    );
  }
  if (quantity <= threshold) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
      In Stock
    </span>
  );
};

const ProductTable = ({ products, onEdit, onStock }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This action cannot be undone.`)) return;
    try {
      await deleteProduct(product._id).unwrap();
    } catch {
      alert('Failed to delete product. Please try again.');
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-3">📦</p>
        <p className="font-medium">No products found.</p>
        {isAdmin && <p className="text-sm mt-1">Click "Add Product" to get started.</p>}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Qty
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {isAdmin && (
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {product.sku}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-600">{product.category}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={`text-sm font-bold ${
                    product.quantity === 0
                      ? 'text-red-600'
                      : product.quantity <= product.lowStockThreshold
                      ? 'text-yellow-600'
                      : 'text-gray-900'
                  }`}
                >
                  {product.quantity}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <StatusBadge quantity={product.quantity} threshold={product.lowStockThreshold} />
              </td>
              {isAdmin && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onStock(product)}
                      className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                      title="Record stock movement"
                    >
                      Stock
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      disabled={isDeleting}
                      className="px-2 py-1 text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
