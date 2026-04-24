import { useState } from 'react';
import { useCreateMovementMutation } from '../features/movements/movementsApi';

const StockModal = ({ product, onClose }) => {
  const [form, setForm] = useState({ type: 'IN', quantity: '', note: '' });
  const [apiError, setApiError] = useState('');

  const [createMovement, { isLoading }] = useCreateMovementMutation();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!form.quantity || parseInt(form.quantity) < 1) {
      setApiError('Quantity must be at least 1.');
      return;
    }

    try {
      await createMovement({
        productId: product._id,
        type: form.type,
        quantity: parseInt(form.quantity),
        note: form.note,
      }).unwrap();
      onClose();
    } catch (err) {
      setApiError(err?.data?.message || 'Failed to record stock movement.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Record Stock Movement</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {product.name}{' '}
              <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                {product.sku}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            disabled={isLoading}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <span className="text-gray-500">Current Stock:</span>{' '}
            <span className="font-bold text-gray-900">{product.quantity} units</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Movement Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  form.type === 'IN'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="IN"
                  checked={form.type === 'IN'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-lg">+</span>
                <span className="font-medium">Stock In</span>
              </label>
              <label
                className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  form.type === 'OUT'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="OUT"
                  checked={form.type === 'OUT'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-lg">&minus;</span>
                <span className="font-medium">Stock Out</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              min="1"
              max={form.type === 'OUT' ? product.quantity : undefined}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
            />
            {form.type === 'OUT' && (
              <p className="text-xs text-gray-400 mt-1">
                Maximum: {product.quantity} units
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (optional)
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="e.g. Monthly restock, Office distribution..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                form.type === 'IN'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? 'Saving...' : `Record ${form.type}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockModal;
