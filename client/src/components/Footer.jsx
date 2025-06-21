import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
                ApparelStore
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed">
                Chúng tôi mang đến những sản phẩm thời trang chất lượng cao với phong cách hiện đại và giá cả hợp lý.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <FaMapMarkerAlt className="text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <FaPhone className="text-blue-400 flex-shrink-0" />
                  <a href="tel:0865496126" className="text-gray-300 hover:text-white transition-colors">
                    0865 496 126
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <FaEnvelope className="text-blue-400 flex-shrink-0" />
                  <a href="mailto:contact@apparelstore.com" className="text-gray-300 hover:text-white transition-colors">
                    contact@apparelstore.com
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Liên Kết Nhanh</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Cửa hàng
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link to="/shop?sortBy=view_count&order=DESC" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Sản phẩm bán chạy
                  </Link>
                </li>
                <li>
                  <Link to="/shop?sortBy=created_at&order=DESC" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Sản phẩm mới
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Hỗ Trợ Khách Hàng</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Hướng dẫn mua hàng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Chính sách đổi trả
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Chính sách bảo hành
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Chính sách vận chuyển
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Phương thức thanh toán
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Kết Nối Với Chúng Tôi</h3>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook size={18} />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter size={18} />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  aria-label="YouTube"
                >
                  <FaYoutube size={18} />
                </a>
              </div>

              {/* Newsletter */}
              <div className="space-y-3">
                <p className="text-sm text-gray-300">Đăng ký nhận tin khuyến mãi</p>
                <form className="flex flex-col space-y-2">
                  <input 
                    type="email" 
                    placeholder="Nhập email của bạn..." 
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  <button 
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Đăng Ký
                  </button>
                </form>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <p className="text-sm text-gray-300">Phương thức thanh toán</p>
                <div className="flex space-x-2">
                  <div className="w-8 h-6 bg-white rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">VISA</span>
                  </div>
                  <div className="w-8 h-6 bg-white rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-red-600">MC</span>
                  </div>
                  <div className="w-8 h-6 bg-white rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-800">ATM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-900 py-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} ApparelStore. Tất cả các quyền được bảo lưu.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;