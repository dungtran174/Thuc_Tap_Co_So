import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const VNPayReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    handlePaymentReturn();
  }, []);

  const handlePaymentReturn = async () => {
    try {
      const params = Object.fromEntries(searchParams.entries());
      
      const response = await fetch(`/api/payment/vnpay/return?${searchParams.toString()}`);
      const data = await response.json();

      setResult(data);

      if (data.success) {
        toast.success('Thanh toán thành công!');
        setTimeout(() => {
          navigate('/my-orders', { 
            state: { 
              message: 'Đơn hàng đã được thanh toán thành công!',
              paymentSuccess: true 
            }
          });
        }, 3000);
      } else {
        toast.error('Thanh toán thất bại!');
        setTimeout(() => {
          navigate('/my-orders');
        }, 5000);
      }
    } catch (error) {
      console.error('Payment return error:', error);
      toast.error('Lỗi xử lý kết quả thanh toán');
      setResult({
        success: false,
        message: 'Lỗi xử lý kết quả thanh toán'
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(Number(price) || 0));
  };

  if (processing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Đang xử lý kết quả thanh toán...
          </h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {result?.success ? (
          <>
            <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 mb-4">
              Đơn hàng #{result.orderId} đã được thanh toán thành công
            </p>
            {result.amount && (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Số tiền đã thanh toán:</p>
                <p className="text-xl font-bold text-green-600">
                  {formatPrice(result.amount)}₫
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 mb-6">
              Bạn sẽ được chuyển đến trang đơn hàng trong 3 giây...
            </p>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-5xl text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh toán thất bại!
            </h2>
            <p className="text-gray-600 mb-6">
              {result?.message || 'Có lỗi xảy ra trong quá trình thanh toán'}
            </p>
          </>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/my-orders')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xem đơn hàng
          </button>
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VNPayReturnPage;