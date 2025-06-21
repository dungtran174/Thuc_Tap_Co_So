import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaShieldAlt } from 'react-icons/fa';

const VNPayMockPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const orderInfo = searchParams.get('orderInfo');
  const returnUrl = searchParams.get('returnUrl');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(Number(price) || 0);
  };

  const handlePayment = (success) => {
    setLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      const returnUrlWithParams = `${returnUrl}?orderId=${orderId}&success=${success}`;
      window.location.href = returnUrlWithParams;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <FaShieldAlt className="text-3xl mx-auto mb-2" />
          <h1 className="text-xl font-bold">VNPay Demo Payment</h1>
          <p className="text-blue-100 text-sm">Trang thanh toán mô phỏng</p>
        </div>

        {/* Payment Info */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin thanh toán
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium">#{orderId}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Nội dung:</span>
                <span className="font-medium">{orderInfo}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatPrice(amount)}₫
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Phương thức thanh toán
            </h3>
            <div className="space-y-2">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <FaCreditCard className="text-blue-600 mr-2" />
                  <span className="text-sm">Thẻ ATM nội địa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FaLock className="text-yellow-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Đây là trang thanh toán mô phỏng
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Không có giao dịch thật nào được thực hiện
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Đang xử lý...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => handlePayment(true)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                ✅ Thanh toán thành công (Demo)
              </button>
              
              <button
                onClick={() => handlePayment(false)}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                ❌ Thanh toán thất bại (Demo)
              </button>
              
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Quay lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VNPayMockPage;