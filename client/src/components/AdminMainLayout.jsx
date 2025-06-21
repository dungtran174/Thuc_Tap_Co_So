import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaTachometerAlt,
  FaUsers,
  FaShoppingCart,
  FaBox,
  FaTags,
  FaTicketAlt,
  FaTruck,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle
} from 'react-icons/fa';

const AdminMainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/users', name: 'Quản lý người dùng', icon: FaUsers },
    { path: '/admin/orders', name: 'Quản lý đơn hàng', icon: FaShoppingCart },
    { path: '/admin/products', name: 'Quản lý sản phẩm', icon: FaBox },
    { path: '/admin/categories', name: 'Quản lý danh mục', icon: FaTags },
    { path: '/admin/brands', name: 'Quản lý nhãn hàng', icon: FaTags },
    { path: '/admin/vouchers', name: 'Quản lý voucher', icon: FaTicketAlt },
    { path: '/admin/shipments', name: 'Quản lý vận chuyển', icon: FaTruck },
    { path: '/admin/reports', name: 'Báo cáo', icon: FaChartBar }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} w-5 h-5`} />
                    {sidebarOpen && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-700">
          {sidebarOpen && (
            <div className="mb-3 p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <FaUserCircle className="w-8 h-8 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
          >
            <FaSignOutAlt className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} w-5 h-5`} />
            {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                {menuItems.find(item => isActive(item.path))?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminMainLayout;