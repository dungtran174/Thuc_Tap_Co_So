import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext'; // Import useCart

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount, loading: cartLoading } = useCart(); // Lấy cartCount và loading từ CartContext
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  
  // Hiển thị tên người dùng
  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
    : '';

  // Navigation menu items
  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Cửa hàng', path: '/shop' },
    { name: 'Giới thiệu', path: '/about' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-100 text-sm">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="hidden md:block">
              <span className="text-gray-600">Miễn phí vận chuyển đơn hàng từ 500.000đ</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>Hotline: </span>
              <a href="tel:0865496126" className="font-semibold text-blue-600 hover:text-blue-800">
                0865 496 126
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
              ApparelStore
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..." 
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Shopping Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors group">
              <FaShoppingCart size={24} />
              
              {/* Badge hiển thị số lượng */}
              {isLoggedIn && (
                <>
                  {cartCount > 0 ? (
                    // Hiển thị số lượng
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  ) : (
                    // Giỏ hàng trống - hiển thị badge xám
                    <span className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                      0
                    </span>
                  )}
                </>
              )}
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isLoggedIn ? `Giỏ hàng (${cartCount})` : 'Đăng nhập để xem giỏ hàng'}
              </div>
            </Link>
            
            {/* User Account */}
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
                >
                  <div className="hidden md:block text-right">
                    <p className="text-xs text-gray-500">Xin chào,</p>
                    <p className="font-semibold text-sm">{displayName}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaUser size={16} className="text-white" />
                  </div>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-20 border">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{displayName}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Link 
                      to="/user/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser className="inline mr-2" />
                      Thông tin cá nhân
                    </Link>
                    <Link
                      to="/my-orders"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FaShoppingBag className="mr-2" />
                      Đơn hàng của tôi
                    </Link>
                    
                    <Link 
                      to="/cart" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaShoppingCart className="inline mr-2" />
                      Giỏ hàng ({cartCount})
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden text-gray-700 hover:text-blue-600 transition-colors"
            >
              {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Cart link for mobile */}
              {isLoggedIn && (
                <Link
                  to="/cart"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaShoppingCart className="inline mr-2" />
                  Giỏ hàng ({cartCount})
                </Link>
              )}
            </div>
            
            {!isLoggedIn && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <Link 
                  to="/login" 
                  className="block w-full text-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;