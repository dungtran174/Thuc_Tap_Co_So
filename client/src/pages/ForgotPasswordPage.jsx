import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaSpinner } from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/user/forgot-password`, { email });
      setSent(true);
      toast.success("Vui lòng kiểm tra email để đặt lại mật khẩu!");
    } catch (error) {
      toast.error("Không gửi được email! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <FaEnvelope className="text-white text-2xl" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Quên mật khẩu?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </p>
        <p className="mt-1 text-center text-sm text-gray-500">
          Nhớ mật khẩu?{' '}
          <Link 
            to="/login" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      {/* Form Section */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          {sent ? (
            /* Success State */
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Email đã được gửi!
                </h3>
                <p className="text-gray-600">
                  Chúng tôi đã gửi liên kết đặt lại mật khẩu đến:
                </p>
                <p className="font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                  {email}
                </p>
                <p className="text-sm text-gray-500">
                  Vui lòng kiểm tra hộp thư (kể cả thư mục spam) và làm theo hướng dẫn.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Gửi lại email
                </button>
                
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <FaArrowLeft className="mr-2" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi liên kết đặt lại"
                )}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          {!sent && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                >
                  <FaArrowLeft className="mr-2" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <Link 
            to="/register" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Đăng ký ngay
          </Link>
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Bằng việc sử dụng dịch vụ, bạn đồng ý với{' '}
          <Link to="/terms" className="text-blue-600 hover:text-blue-500">
            Điều khoản sử dụng
          </Link>{' '}
          và{' '}
          <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
            Chính sách bảo mật
          </Link>{' '}
          của chúng tôi.
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;