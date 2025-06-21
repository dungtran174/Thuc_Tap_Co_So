import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaEdit, FaPlus, FaTruck, FaCreditCard, FaTag, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { 
  addressAPI, 
  shipmentAPI, 
  paymentMethodAPI, 
  voucherAPI, 
  orderAPI 
} from '../api/api';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Data từ CartPage
  const { selectedItems, totalAmount } = location.state || {};
  
  // States
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [note, setNote] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipient_name: '',
    recipient_phone: '',
    address: '',
    is_default: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedItems || selectedItems.length === 0) {
      toast.error('Không có sản phẩm để thanh toán');
      navigate('/cart');
      return;
    }

    fetchData();
  }, [user, selectedItems, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [addressRes, shipmentRes, paymentRes] = await Promise.all([
        addressAPI.getAll(),
        shipmentAPI.getAll(),
        paymentMethodAPI.getAll()
      ]);

      setAddresses(addressRes.addresses || []);
      setShipments(shipmentRes.shipments || []);
      setPaymentMethods(paymentRes.payment_methods || []);

      // Set default selections
      const defaultAddress = addressRes.addresses?.find(addr => addr.is_default) || addressRes.addresses?.[0];
      if (defaultAddress) setSelectedAddress(defaultAddress);

      const defaultShipment = shipmentRes.shipments?.[0];
      if (defaultShipment) setSelectedShipment(defaultShipment);

      const defaultPayment = paymentRes.payment_methods?.[0];
      if (defaultPayment) setSelectedPaymentMethod(defaultPayment);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    const shippingFee = selectedShipment ? parseFloat(selectedShipment.price) : 0;
    const discountAmount = appliedVoucher ? parseFloat(appliedVoucher.discount_amount) : 0;
    const total = subtotal + shippingFee - discountAmount;

    return {
      subtotal,
      shippingFee,
      discountAmount,
      total: Math.max(0, total)
    };
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.warning('Vui lòng nhập mã voucher');
      return;
    }

    try {
      setVoucherLoading(true);
      const { subtotal } = calculateTotals();
      
      const response = await voucherAPI.apply({
        code: voucherCode,
        subtotal
      });

      setAppliedVoucher(response.voucher);
      toast.success('Áp dụng mã voucher thành công');
    } catch (error) {
      console.error('Error applying voucher:', error);
      toast.error(error.response?.data?.message || 'Mã voucher không hợp lệ');
      setAppliedVoucher(null);
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherCode('');
    setAppliedVoucher(null);
    toast.info('Đã hủy mã voucher');
  };

  const handleAddAddress = async () => {
    try {
      if (!newAddress.recipient_name || !newAddress.recipient_phone || !newAddress.address) {
        toast.warning('Vui lòng điền đầy đủ thông tin địa chỉ');
        return;
      }

      const response = await addressAPI.create(newAddress);
      
      setAddresses(prev => [...prev, response.address]);
      setSelectedAddress(response.address);
      setShowAddressModal(false);
      setNewAddress({
        recipient_name: '',
        recipient_phone: '',
        address: '',
        is_default: false
      });
      
      toast.success('Thêm địa chỉ thành công');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Lỗi thêm địa chỉ');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!selectedAddress) {
        toast.warning('Vui lòng chọn địa chỉ giao hàng');
        return;
      }
      if (!selectedShipment) {
        toast.warning('Vui lòng chọn phương thức vận chuyển');
        return;
      }
      if (!selectedPaymentMethod) {
        toast.warning('Vui lòng chọn phương thức thanh toán');
        return;
      }

      setSubmitting(true);

      const orderData = {
        user_address_id: selectedAddress.id,
        selected_cart_items: selectedItems,
        payment_method_id: selectedPaymentMethod.id,
        shipment_id: selectedShipment.id,
        voucher_code: appliedVoucher ? appliedVoucher.code : null,
        note: note.trim()
      };

      const response = await orderAPI.create(orderData);

      if (response.success) {
        refreshCartCount();
        toast.success('Đặt hàng thành công!');

        // Nếu có payment_url (VNPAY), chuyển hướng thanh toán
        // Kiểm tra nếu payment method là VNPay
        if (selectedPaymentMethod.name === 'VNPay') {
          // Tạo URL thanh toán VNPay
          const vnpayResponse = await fetch('/api/payment/vnpay/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ orderId: response.order.id })
          });

          const vnpayData = await vnpayResponse.json();

          if (vnpayData.success) {
            toast.success('Đang chuyển đến trang thanh toán VNPay...');
            // Chuyển hướng đến VNPay
            window.location.href = vnpayData.paymentUrl;
            return;
          } else {
            toast.error('Lỗi tạo thanh toán VNPay: ' + vnpayData.message);
            return;
          }
        } else {
          // Các phương thức thanh toán khác (COD, etc.)
          toast.success('Đặt hàng thành công!');
          navigate('/my-orders', { 
            state: { 
              newOrderId: response.order.id,
              message: 'Đặt hàng thành công!' 
            }
          });
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Lỗi đặt hàng');
    } finally {
      setSubmitting(false);
    }
  };

  const getProductImage = (item) => {
    if (item.color && item.product?.ProductColors) {
      const productColor = item.product.ProductColors.find(
        pc => pc.color_id === item.color_id
      );
      if (productColor?.image) {
        return productColor.image;
      }
    }
    return item.product?.image_url || '/placeholder-image.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Địa chỉ giao hàng */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  Địa chỉ giao hàng
                </h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                >
                  <FaPlus className="mr-1" />
                  Thêm địa chỉ mới
                </button>
              </div>

              {selectedAddress ? (
                <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{selectedAddress.recipient_name}</p>
                      <p className="text-gray-600">{selectedAddress.recipient_phone}</p>
                      <p className="text-gray-600">{selectedAddress.address}</p>
                      {selectedAddress.is_default && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                          Địa chỉ mặc định
                        </span>
                      )}
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      <FaEdit />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Chưa có địa chỉ nào được chọn
                </div>
              )}

              {/* Danh sách địa chỉ khác */}
              {addresses.length > 1 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Hoặc chọn địa chỉ khác:</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {addresses
                      .filter(addr => addr.id !== selectedAddress?.id)
                      .map(address => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddress(address)}
                          className="border border-gray-200 rounded p-3 cursor-pointer hover:bg-gray-50"
                        >
                          <p className="font-medium text-sm">{address.recipient_name}</p>
                          <p className="text-xs text-gray-600">{address.address}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sản phẩm đã chọn */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sản phẩm đã chọn ({selectedItems.length})
              </h2>
              
              <div className="space-y-4">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={getProductImage(item)}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {item.color && (
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full border mr-1"
                              style={{ backgroundColor: item.color.hex_code }}
                            />
                            <span>{item.color.name}</span>
                          </div>
                        )}
                        {item.size && <span>Size: {item.size.name}</span>}
                        <span>SL: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{formatPrice(item.unit_price)}₫</p>
                      <p className="font-semibold text-red-600">{formatPrice(item.total_price)}₫</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ghi chú */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ghi chú đơn hàng</h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>

            {/* Phương thức vận chuyển */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FaTruck className="mr-2 text-blue-600" />
                Phương thức vận chuyển
              </h2>
              
              <div className="space-y-3">
                {shipments.map(shipment => (
                  <label
                    key={shipment.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="shipment"
                      value={shipment.id}
                      checked={selectedShipment?.id === shipment.id}
                      onChange={() => setSelectedShipment(shipment)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{shipment.name}</p>
                      <p className="text-sm text-gray-600">{shipment.description}</p>
                      {shipment.estimated_days && (
                        <p className="text-xs text-gray-500">
                          Dự kiến giao trong {shipment.estimated_days} ngày
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-blue-600">
                      {shipment.price === 0 ? 'Miễn phí' : `${formatPrice(shipment.price)}₫`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-blue-600" />
                Phương thức thanh toán
              </h2>
              
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <label
                    key={method.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPaymentMethod?.id === method.id}
                      onChange={() => setSelectedPaymentMethod(method)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      {method.name === 'VNPay' && (
                        <p className="text-xs text-blue-600 mt-1">
                          Hỗ trợ: ATM, Visa, MasterCard, QR Code
                        </p>
                      )}
                    </div>
                    {method.name === 'VNPay' && (
                      <img 
                        src="/images/vnpay-logo.png" 
                        alt="VNPay" 
                        className="h-6 ml-2"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
              
              {/* Mã giảm giá */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <FaTag className="mr-2 text-blue-600" />
                  <span className="font-medium text-gray-900">Mã giảm giá</span>
                </div>
                
                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">{appliedVoucher.code}</p>
                      <p className="text-sm text-green-600">
                        Giảm {formatPrice(appliedVoucher.discount_amount)}₫
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveVoucher}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="flex">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleApplyVoucher}
                      disabled={voucherLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {voucherLoading ? '...' : 'Áp dụng'}
                    </button>
                  </div>
                )}
              </div>

              {/* Chi tiết giá */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">{formatPrice(totals.subtotal)}₫</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">
                    {totals.shippingFee === 0 ? 'Miễn phí' : `${formatPrice(totals.shippingFee)}₫`}
                  </span>
                </div>
                
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(totals.discountAmount)}₫
                    </span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                    <span className="text-xl font-bold text-red-600">
                      {formatPrice(totals.total)}₫
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={submitting || !selectedAddress || !selectedShipment || !selectedPaymentMethod}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting ? 'Đang xử lý...' : 
                selectedPaymentMethod?.name === 'VNPay' ? 'Thanh toán với VNPay' : 'Đặt hàng'}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm địa chỉ */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Thêm địa chỉ mới</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên người nhận *
                </label>
                <input
                  type="text"
                  value={newAddress.recipient_name}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, recipient_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên người nhận"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={newAddress.recipient_phone}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, recipient_phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ *
                </label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newAddress.is_default}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, is_default: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</span>
              </label>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddAddress}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thêm địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;