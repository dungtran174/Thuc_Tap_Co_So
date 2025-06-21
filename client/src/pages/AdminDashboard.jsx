import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/api';
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaChartLine
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, [period]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getDashboardStats({ period });
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Không thể tải dữ liệu thống kê');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Lỗi khi tải dữ liệu thống kê');
      
      // Set fallback data for development
      setStats({
        overview: {
          totalRevenue: 0,
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0
        },
        revenueChart: [],
        ordersByStatus: [],
        topProducts: [],
        recentOrders: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const StatCard = ({ title, value, icon: Icon, color, change, suffix = '' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}{suffix}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              <span>{Math.abs(change)}% so với kỳ trước</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Đang tải dữ liệu thống kê...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải dữ liệu</h2>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchDashboardStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan về hoạt động kinh doanh</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7">7 ngày qua</option>
          <option value="30">30 ngày qua</option>
          <option value="90">90 ngày qua</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value={formatPrice((stats?.overview?.totalRevenue || 0) / 10)} // Chia 10 tạm thời
          suffix="₫"
          icon={FaDollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Tổng người dùng"
          value={stats?.overview?.totalUsers || 0}
          icon={FaUsers}
          color="bg-blue-500"
        />
        <StatCard
          title="Sản phẩm hoạt động"
          value={stats?.overview?.totalProducts || 0}
          icon={FaBox}
          color="bg-purple-500"
        />
        <StatCard
          title={`Đơn hàng (${period} ngày qua)`}
          value={stats?.overview?.totalOrders || 0}
          icon={FaShoppingCart}
          color="bg-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Biểu đồ doanh thu</h3>
          <FaChartLine className="text-blue-500" />
        </div>
        {stats?.revenueChart?.length > 0 ? (
          <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={stats.revenueChart}
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }} // Cân đối margin
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  width={60} // Giảm width để cân đối
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}K`;
                    }
                    return value.toString();
                  }}
                />
                <Tooltip 
                  formatter={(value) => [`${formatPrice(value)}₫`, 'Doanh thu']}
                  labelFormatter={(label) => `Ngày: ${label}`}
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <FaChartLine className="mx-auto w-12 h-12 text-gray-300 mb-2" />
              <p>Chưa có dữ liệu doanh thu</p>
            </div>
          </div>
        )}
      </div>

  {/* Orders by Status */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng theo trạng thái</h3>
        {stats?.ordersByStatus?.length > 0 ? (
          <div className="w-full flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={90} // Tăng size pie chart
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Số đơn hàng']}
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <FaShoppingCart className="mx-auto w-12 h-12 text-gray-300 mb-2" />
              <p>Chưa có dữ liệu đơn hàng</p>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top sản phẩm bán chạy</h3>
          </div>
          <div className="p-6">
            {stats?.topProducts?.length > 0 ? (
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">Đã bán: {product.total_sold} sản phẩm</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        {formatPrice(product.total_revenue)}₫
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(product.price)}₫/sp
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaBox className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                <p>Chưa có dữ liệu sản phẩm</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
          </div>
          <div className="p-6">
            {stats?.recentOrders?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FaShoppingCart className="w-4 h-4 text-orange-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          #{order.id} - {order.User?.first_name} {order.User?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(order.total_amount)}₫
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.OrderStatus?.name === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.OrderStatus?.name === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.OrderStatus?.name === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        order.OrderStatus?.name === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.OrderStatus?.label || order.OrderStatus?.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaShoppingCart className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                <p>Chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;