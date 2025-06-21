import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/api';
import { toast } from 'react-toastify';
import {
  FaSearch,
  FaEye,
  FaShoppingCart,
  FaUser,
  FaCalendarAlt,
  FaTimes,
  FaCheck,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBox,
  FaEdit,
  FaBan,
  FaMoneyBillWave,
  FaShippingFast
} from 'react-icons/fa';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [orderStatusId, setOrderStatusId] = useState('');
  const [paymentStatusId, setPaymentStatusId] = useState('');
  const [page, setPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
  }, [page, search, orderStatusId, paymentStatusId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllOrders({
        page,
        limit: 10,
        search,
        order_status_id: orderStatusId,
        payment_status_id: paymentStatusId
      });
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      // Dựa vào database schema
      setOrderStatuses([
        { id: 1, name: 'Pending', label: 'Chờ xử lý' },
        { id: 2, name: 'Confirmed', label: 'Đã xác nhận' },
        { id: 3, name: 'Processing', label: 'Đang xử lý' },
        { id: 4, name: 'Shipping', label: 'Đang giao hàng' },
        { id: 5, name: 'Delivered', label: 'Đã giao hàng' },
        { id: 6, name: 'Cancelled', label: 'Đã hủy' }
      ]);

      setPaymentStatuses([
        { id: 1, name: 'Pending', label: 'Chờ thanh toán' },
        { id: 2, name: 'Paid', label: 'Đã thanh toán' },
        { id: 3, name: 'Failed', label: 'Thanh toán thất bại' },
        { id: 4, name: 'Refunded', label: 'Đã hoàn tiền' }
      ]);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await adminAPI.getOrderDetails(orderId);
      setSelectedOrder(response.order);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Lỗi khi tải chi tiết đơn hàng');
    }
  };

  const updateOrderStatus = async (orderId, newStatusId) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { order_status_id: newStatusId });
      toast.success('Cập nhật trạng thái đơn hàng thành công');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        fetchOrderDetails(orderId);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  const updatePaymentStatus = async (orderId, newStatusId) => {
    try {
      await adminAPI.updatePaymentStatus(orderId, { payment_status_id: newStatusId });
      toast.success('Cập nhật trạng thái thanh toán thành công');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        fetchOrderDetails(orderId);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Lỗi khi cập nhật trạng thái thanh toán');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipping':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FaClock className="w-4 h-4" />;
      case 'confirmed':
        return <FaCheck className="w-4 h-4" />;
      case 'processing':
        return <FaBox className="w-4 h-4" />;
      case 'shipping':
        return <FaTruck className="w-4 h-4" />;
      case 'delivered':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FaBan className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (statuses, statusId) => {
    const status = statuses.find(s => s.id === parseInt(statusId));
    return status ? status.label : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaShoppingCart className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.OrderStatus?.name === 'Pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Đã giao</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.OrderStatus?.name === 'Delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaBan className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Đã hủy</p>
              <p className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.OrderStatus?.name === 'Cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={orderStatusId}
            onChange={(e) => setOrderStatusId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái đơn hàng</option>
            {orderStatuses.map(status => (
              <option key={status.id} value={status.id}>{status.label}</option>
            ))}
          </select>
          <select
            value={paymentStatusId}
            onChange={(e) => setPaymentStatusId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái thanh toán</option>
            {paymentStatuses.map(status => (
              <option key={status.id} value={status.id}>{status.label}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setPage(1);
              fetchOrders();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaShoppingCart className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-blue-600">
                            #{order.id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.OrderDetails?.length || 0} sản phẩm
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.User?.first_name} {order.User?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.User?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCalendarAlt className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {new Date(order.order_date).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.order_date).toLocaleTimeString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {formatPrice(order.total_amount)}₫
                      </div>
                      <div className="text-xs text-gray-500">
                        Phí ship: {formatPrice(order.shipping_fee)}₫
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.order_status_id}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-medium px-3 py-1 rounded-full border focus:ring-2 focus:ring-blue-500 ${getOrderStatusColor(order.OrderStatus?.name)}`}
                      >
                        {orderStatuses.map(status => (
                          <option key={status.id} value={status.id}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.payment_status_id}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                        className={`text-xs font-medium px-3 py-1 rounded-full border focus:ring-2 focus:ring-blue-500 ${getPaymentStatusColor(order.PaymentStatus?.name)}`}
                      >
                        {paymentStatuses.map(status => (
                          <option key={status.id} value={status.id}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => fetchOrderDetails(order.id)}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} trong{' '}
                {pagination.total} kết quả
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Trước
                </button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded">
                  {page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FaShoppingCart className="mr-2 text-blue-600" />
                Chi tiết đơn hàng #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Details */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FaShoppingCart className="mr-2 text-blue-600" />
                    Thông tin đơn hàng
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Mã đơn hàng:</span>
                      <span className="font-bold text-blue-600">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ngày đặt:</span>
                      <span>{new Date(selectedOrder.order_date).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Trạng thái:</span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getOrderStatusColor(selectedOrder.OrderStatus?.name)}`}>
                        {getOrderStatusIcon(selectedOrder.OrderStatus?.name)}
                        <span className="ml-1">{getStatusLabel(orderStatuses, selectedOrder.order_status_id)}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Thanh toán:</span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getPaymentStatusColor(selectedOrder.PaymentStatus?.name)}`}>
                        {selectedOrder.PaymentStatus?.name === 'Paid' ? <FaMoneyBillWave className="inline mr-1" /> : <FaClock className="inline mr-1" />}
                        {getStatusLabel(paymentStatuses, selectedOrder.payment_status_id)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FaUser className="mr-2 text-green-600" />
                    Thông tin khách hàng
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Họ tên:</span>
                      <span className="font-medium">
                        {selectedOrder.User?.first_name} {selectedOrder.User?.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{selectedOrder.User?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Điện thoại:</span>
                      <span>{selectedOrder.User?.phone || 'Chưa có'}</span>
                    </div>
                  </div>
                </div>

                {/* Payment & Shipping */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FaCreditCard className="mr-2 text-purple-600" />
                    Thanh toán & Giao hàng
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Phương thức TT:</span>
                      <span className="font-medium">{selectedOrder.PaymentMethod?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vận chuyển:</span>
                      <span>{selectedOrder.Shipment?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí ship:</span>
                      <span className="font-medium text-orange-600">{formatPrice(selectedOrder.shipping_fee)}₫</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-orange-600" />
                  Địa chỉ giao hàng
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Người nhận:</strong> {selectedOrder.UserAddress?.recipient_name}</p>
                    <p><strong>Điện thoại:</strong> {selectedOrder.UserAddress?.recipient_phone}</p>
                  </div>
                  <div>
                    <p><strong>Địa chỉ:</strong> {selectedOrder.UserAddress?.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaBox className="mr-2 text-gray-600" />
                  Sản phẩm đặt hàng
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Sản phẩm
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Màu sắc
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Kích thước
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Số lượng
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Đơn giá
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.OrderDetails?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {item.Product?.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.Color?.name && (
                              <div className="flex items-center">
                                <span 
                                  className="inline-block w-4 h-4 rounded-full mr-2 border border-gray-300" 
                                  style={{backgroundColor: item.Color?.hex_code}}
                                ></span>
                                {item.Color?.name}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.Size?.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center font-medium">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatPrice(item.unit_price)}₫
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">
                            {formatPrice(item.total_price)}₫
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-green-600" />
                  Tổng kết đơn hàng
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span className="font-medium">{formatPrice(selectedOrder.subtotal)}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="font-medium text-orange-600">{formatPrice(selectedOrder.shipping_fee)}₫</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá ({selectedOrder.Voucher?.code}):</span>
                      <span className="font-medium">-{formatPrice(selectedOrder.discount_amount)}₫</span>
                    </div>
                  )}
                  {selectedOrder.note && (
                    <div className="border-t border-gray-300 pt-3">
                      <span className="text-gray-600">Ghi chú: </span>
                      <span className="italic">{selectedOrder.note}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng:</span>
                      <span className="text-red-600">{formatPrice(selectedOrder.total_amount)}₫</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cập nhật trạng thái đơn hàng
                  </label>
                  <select
                    value={selectedOrder.order_status_id}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {orderStatuses.map(status => (
                      <option key={status.id} value={status.id}>{status.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cập nhật trạng thái thanh toán
                  </label>
                  <select
                    value={selectedOrder.payment_status_id}
                    onChange={(e) => updatePaymentStatus(selectedOrder.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {paymentStatuses.map(status => (
                      <option key={status.id} value={status.id}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;