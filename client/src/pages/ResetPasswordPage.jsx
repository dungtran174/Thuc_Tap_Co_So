import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [form, setForm] = useState({ 
    newPassword: "", 
    confirmPassword: "" 
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/user/reset-password`, {
        token: params.get("token"),
        newPassword: form.newPassword
      });
      setSuccess(true);
      toast.success("Đổi mật khẩu thành công!");
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại hoặc token hết hạn!");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <FaLock className="text-white text-2xl" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đặt lại mật khẩu
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nhập mật khẩu mới để hoàn tất quá trình đặt lại
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
          {success ? (
            /* Success State */
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Đặt lại mật khẩu thành công!
                </h3>
                <p className="text-gray-600">
                  Mật khẩu của bạn đã được cập nhật thành công.
                </p>
                <p className="text-sm text-gray-500">
                  Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <FaArrowLeft className="mr-2" />
                  Đi đến trang đăng nhập
                </button>
              </div>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={form.newPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Validation Hints */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Mật khẩu phải:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li className={form.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                    Có ít nhất 6 ký tự
                  </li>
                  <li className={form.newPassword === form.confirmPassword && form.confirmPassword !== '' ? 'text-green-600' : 'text-gray-500'}>
                    Mật khẩu xác nhận phải khớp
                  </li>
                </ul>
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
                    Đang xử lý...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          {!success && (
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

export default ResetPasswordPage;