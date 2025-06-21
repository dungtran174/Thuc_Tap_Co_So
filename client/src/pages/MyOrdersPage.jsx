import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaShoppingBag, 
  FaEye, 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight,
  FaCalendar,
  FaCreditCard,
  FaTruck 
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { orderAPI } from '../api/api';

const MyOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders(1);

    // Hiển thị thông báo nếu có từ CheckoutPage
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [user, navigate, location.state]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders({ page, limit: pagination.limit });
      
      if (response.success) {
        setOrders(response.orders);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Lỗi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      setCancellingOrder(orderId);
      const response = await orderAPI.cancel(orderId);
      
      if (response.success) {
        toast.success('Hủy đơn hàng thành công');
        fetchOrders(pagination.page); // Refresh current page
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Lỗi hủy đơn hàng');
    } finally {
      setCancellingOrder(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(Number(price) || 0));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-purple-100 text-purple-800',
      'Shipping': 'bg-indigo-100 text-indigo-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Returned': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Paid': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800',
      'Refunded': 'bg-blue-100 text-blue-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const canCancelOrder = (orderStatus) => {
    return ['Pending', 'Confirmed'].includes(orderStatus);
  };

  const getProductImage = (orderDetail) => {
    if (orderDetail.Color && orderDetail.Product?.ProductColors) {
      const productColor = orderDetail.Product.ProductColors.find(
        pc => pc.color_id === orderDetail.color_id
      );
      if (productColor?.image) {
        return productColor.image;
      }
    }
    return orderDetail.Product?.image_url || '/placeholder-image.jpg';
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FaShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Bạn chưa có đơn hàng nào
            </h2>
            <p className="text-gray-500 mb-8">
              Hãy khám phá các sản phẩm và tạo đơn hàng đầu tiên của bạn
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bắt đầu mua sắm
            </button>
          </div>
        ) : (
          <>
            {/* Danh sách đơn hàng */}
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Header đơn hàng */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaCalendar className="mr-1" />
                          <span>Đặt ngày: {formatDate(order.order_date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.OrderStatus?.name)}`}>
                            {order.OrderStatus?.name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.PaymentStatus?.name)}`}>
                            {order.PaymentStatus?.name}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(order.total_amount)}₫
                        </span>
                        <button
                          onClick={() => handleViewOrderDetail(order)}
                          className="text-blue-600 hover:text-blue-700 p-2"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        {canCancelOrder(order.OrderStatus?.name) && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingOrder === order.id}
                            className="text-red-600 hover:text-red-700 px-3 py-1 border border-red-200 rounded text-sm disabled:opacity-50"
                          >
                            {cancellingOrder === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sản phẩm trong đơn hàng */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.OrderDetails?.slice(0, 3).map((orderDetail) => (
                        <div key={orderDetail.id} className="flex items-center space-x-4">
                          <img
                            src={getProductImage(orderDetail)}
                            alt={orderDetail.Product?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{orderDetail.Product?.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              {orderDetail.Color && (
                                <div className="flex items-center">
                                  <div
                                    className="w-4 h-4 rounded-full border mr-1"
                                    style={{ backgroundColor: orderDetail.Color.hex_code }}
                                  />
                                  <span>{orderDetail.Color.name}</span>
                                </div>
                              )}
                              {orderDetail.Size && <span>Size: {orderDetail.Size.name}</span>}
                              <span>SL: {orderDetail.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(orderDetail.total_price)}₫
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {order.OrderDetails?.length > 3 && (
                        <div className="text-center py-2">
                          <span className="text-sm text-gray-500">
                            và {order.OrderDetails.length - 3} sản phẩm khác...
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Thông tin giao hàng và thanh toán */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FaTruck className="mr-2" />
                          <span>Vận chuyển: {order.Shipment?.name}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaCreditCard className="mr-2" />
                          <span>Thanh toán: {order.PaymentMethod?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => fetchOrders(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <FaChevronLeft className="mr-1" />
                  Trước
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, pagination.page - 2) + i;
                    if (pageNum > pagination.totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchOrders(pageNum)}
                        disabled={loading}
                        className={`px-3 py-2 border rounded-lg ${
                          pageNum === pagination.page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => fetchOrders(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages || loading}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                  <FaChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết đơn hàng #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Thông tin đơn hàng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Thông tin đơn hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Ngày đặt:</span> {formatDate(selectedOrder.order_date)}</p>
                    <p><span className="font-medium">Trạng thái:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.OrderStatus?.name)}`}>
                        {selectedOrder.OrderStatus?.name}
                      </span>
                    </p>
                    <p><span className="font-medium">Thanh toán:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(selectedOrder.PaymentStatus?.name)}`}>
                        {selectedOrder.PaymentStatus?.name}
                      </span>
                    </p>
                    <p><span className="font-medium">Phương thức thanh toán:</span> {selectedOrder.PaymentMethod?.name}</p>
                    <p><span className="font-medium">Vận chuyển:</span> {selectedOrder.Shipment?.name}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Địa chỉ giao hàng</h4>
                  <div className="text-sm">
                    <p className="font-medium">{selectedOrder.UserAddress?.recipient_name}</p>
                    <p>{selectedOrder.UserAddress?.recipient_phone}</p>
                    <p>{selectedOrder.UserAddress?.address}</p>
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              {selectedOrder.note && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Ghi chú</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedOrder.note}</p>
                </div>
              )}

              {/* Sản phẩm */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Sản phẩm đã đặt</h4>
                <div className="space-y-4">
                  {selectedOrder.OrderDetails?.map((orderDetail) => (
                    <div key={orderDetail.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={getProductImage(orderDetail)}
                        alt={orderDetail.Product?.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{orderDetail.Product?.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          {orderDetail.Color && (
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full border mr-1"
                                style={{ backgroundColor: orderDetail.Color.hex_code }}
                              />
                              <span>{orderDetail.Color.name}</span>
                            </div>
                          )}
                          {orderDetail.Size && <span>Size: {orderDetail.Size.name}</span>}
                          <span>Số lượng: {orderDetail.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{formatPrice(orderDetail.unit_price)}₫ / sản phẩm</p>
                        <p className="font-semibold text-red-600">{formatPrice(orderDetail.total_price)}₫</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(selectedOrder.subtotal)}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(selectedOrder.shipping_fee)}₫</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatPrice(selectedOrder.discount_amount)}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">{formatPrice(selectedOrder.total_amount)}₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-between">
              {canCancelOrder(selectedOrder.OrderStatus?.name) && (
                <button
                  onClick={() => {
                    setShowOrderDetail(false);
                    handleCancelOrder(selectedOrder.id);
                  }}
                  disabled={cancellingOrder === selectedOrder.id}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  {cancellingOrder === selectedOrder.id ? 'Đang hủy...' : 'Hủy đơn hàng'}
                </button>
              )}
              <div className="flex-1"></div>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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

export default MyOrdersPage;