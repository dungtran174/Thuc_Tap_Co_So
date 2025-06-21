import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart count khi user đăng nhập
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [isLoggedIn, user]);

  // Hàm lấy số lượng sản phẩm trong giỏ hàng
  const fetchCartCount = async () => {
    if (!isLoggedIn) {
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.get();
      
      if (response.success && response.cart?.items) {
        // Tính tổng số lượng sản phẩm (quantity của tất cả items)
        const totalCount = response.cart.items.length;
        setCartCount(totalCount);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Hàm refresh cart count (gọi sau khi thêm/xóa/cập nhật)
  const refreshCartCount = () => {
    fetchCartCount();
  };

  const value = {
    cartCount,
    loading,
    refreshCartCount,
    fetchCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};