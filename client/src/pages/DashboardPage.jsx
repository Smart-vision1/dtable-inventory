import { useGetDashboardQuery } from '../features/dashboard/dashboardApi';
import StatCard from '../components/StatCard';
import Navbar from '../components/Navbar';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const DashboardPage = () => {
  const { data, isLoading, isError, error, refetch } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">Failed to load dashboard data.</p>
            <p className="text-red-500 text-sm mt-1">{error?.data?.message || 'Unknown error'}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  const {
    totalProducts = 0,
    lowStockCount = 0,
    lowStockProducts = [],
    recentMovements = [],
    totalStockValue = 0,
  } = data || {};

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your inventory</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={totalProducts}
            subtitle="Unique SKUs in system"
            icon="📦"
            color="blue"
          />
          <StatCard
            title="Low Stock Alerts"
            value={lowStockCount}
            subtitle="Items at or below threshold"
            icon="⚠️"
            color={lowStockCount > 0 ? 'red' : 'green'}
          />
          <StatCard
            title="Total Stock Value"
            value={formatCurrency(totalStockValue)}
            subtitle="Combined inventory value"
            icon="💰"
            color="green"
          />
          <StatCard
            title="Recent Movements"
            value={recentMovements.length}
            subtitle="Shown below (last 10)"
            icon="🔄"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span> Low Stock Items
              </h2>
              {lowStockCount > 5 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Showing 5 of {lowStockCount} items
                </p>
              )}
            </div>
            <div className="p-5">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-2xl mb-2">✅</p>
                  <p className="text-sm">All products are well-stocked!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">{item.quantity} left</p>
                        <p className="text-xs text-gray-400">threshold: {item.lowStockThreshold}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-blue-500">🔄</span> Recent Movements
              </h2>
            </div>
            <div className="p-5">
              {recentMovements.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-2xl mb-2">📋</p>
                  <p className="text-sm">No stock movements recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentMovements.map((movement) => (
                    <div
                      key={movement._id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            movement.type === 'IN'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {movement.type === 'IN' ? '+' : '-'}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {movement.product?.name || 'Unknown Product'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(movement.timestamp)} · by {movement.createdBy?.username || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          movement.type === 'IN' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
