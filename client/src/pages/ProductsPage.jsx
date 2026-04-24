import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProductsQuery } from '../features/products/productsApi';
import { setPage, setSearch } from '../features/products/productsSlice';
import Navbar from '../components/Navbar';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import StockModal from '../components/StockModal';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentPage, search } = useSelector((state) => state.products);
  const isAdmin = user?.role === 'admin';

  const [searchInput, setSearchInput] = useState(search);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockProduct, setStockProduct] = useState(null);

  const { data, isLoading, isError, error, isFetching } = useGetProductsQuery({
    page: currentPage,
    limit: 10,
    search,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearch(searchInput.trim()));
  };

  const handleSearchClear = () => {
    setSearchInput('');
    dispatch(setSearch(''));
  };

  const handleEdit = useCallback((product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  }, []);

  const handleStock = useCallback((product) => {
    setStockProduct(product);
  }, []);

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCloseStock = () => {
    setStockProduct(null);
  };

  const { products = [], totalPages = 1, totalProducts = 0 } = data || {};

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {totalProducts} product{totalProducts !== 1 ? 's' : ''} total
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>+</span> Add Product
            </button>
          )}
        </div>

        <div className="mb-5">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or SKU..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              {searchInput && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  &times;
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {isLoading || isFetching ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">Failed to load products.</p>
            <p className="text-red-500 text-sm mt-1">
              {error?.data?.message || 'Unknown error'}
            </p>
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onStock={handleStock}
          />
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(setPage(currentPage - 1))}
                disabled={currentPage === 1 || isFetching}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => dispatch(setPage(page))}
                      disabled={isFetching}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                if (Math.abs(page - currentPage) === 2) {
                  return <span key={page} className="px-1 py-1.5 text-gray-400">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => dispatch(setPage(currentPage + 1))}
                disabled={currentPage === totalPages || isFetching}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showProductForm && (
        <ProductForm product={editingProduct} onClose={handleCloseForm} />
      )}

      {stockProduct && (
        <StockModal product={stockProduct} onClose={handleCloseStock} />
      )}
    </>
  );
};

export default ProductsPage;
