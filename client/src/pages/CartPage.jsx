import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { cartAPI } from '../api/api';

const CartPage = () => {
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [updatingQuantity, setUpdatingQuantity] = useState(new Set());
  
  // States cho popup xác nhận xóa
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Load cart data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user, navigate]);

  // Update select all when items change
  useEffect(() => {
    if (cart?.items?.length > 0) {
      const allSelected = cart.items.every(item => selectedItems.has(item.id));
      setSelectAll(allSelected);
    }
  }, [selectedItems, cart?.items]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const handleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allItemIds = new Set(cart.items.map(item => item.id));
      setSelectedItems(allItemIds);
    }
    setSelectAll(!selectAll);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingQuantity(prev => new Set([...prev, itemId]));
      
      const response = await cartAPI.updateQuantity(itemId, newQuantity);
      
      if (response.success) {
        // Update cart state
        setCart(prevCart => ({
          ...prevCart,
          total_amount: response.cart_total,
          items: prevCart.items.map(item => 
            item.id === itemId 
              ? { 
                  ...item, 
                  quantity: newQuantity,
                  total_price: newQuantity * item.unit_price
                }
              : item
          )
        }));

        refreshCartCount();
        
        toast.success('Đã cập nhật số lượng');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Không thể cập nhật số lượng');
      }
    } finally {
      setUpdatingQuantity(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Hiển thị popup xác nhận xóa
  const handleAskRemoveItem = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  // Xác nhận xóa sản phẩm
  const handleConfirmRemove = async () => {
    if (!itemToDelete) return;

    try {
      const response = await cartAPI.remove(itemToDelete.id);
      
      if (response.success) {
        // Update cart state
        setCart(prevCart => ({
          ...prevCart,
          total_amount: response.cart_total,
          items: prevCart.items.filter(item => item.id !== itemToDelete.id)
        }));
        
        // Remove from selected items
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemToDelete.id);
          return newSet;
        });

        refreshCartCount();
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Không thể xóa sản phẩm');
    } finally {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  // Hủy xóa sản phẩm
  const handleCancelRemove = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const getSelectedTotal = () => {
    if (!cart?.items) return 0;
    
    return cart.items
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + parseFloat(item.total_price), 0);
  };

  const getSelectedCount = () => {
    return selectedItems.size;
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      toast.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
    
    const selectedProducts = cart.items
      .filter(item => selectedItems.has(item.id))
      .map(item => ({
        cart_detail_id: item.id,
        product_id: item.product_id,
        color_id: item.color_id,
        size_id: item.size_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        product: item.Product,
        color: item.Color,
        size: item.Size
      }));
    
    // Navigate to checkout with selected items
    navigate('/checkout', { 
      state: { 
        selectedItems: selectedProducts,
        totalAmount: getSelectedTotal()
      } 
    });
  };

  const getProductImage = (item) => {
    // Ưu tiên ảnh từ ProductColor, fallback về Product image
    if (item.Color && item.Product?.ProductColors) {
      const productColor = item.Product.ProductColors.find(
        pc => pc.color_id === item.color_id
      );
      if (productColor?.image) {
        return productColor.image;
      }
    }
    return item.Product?.image_url || '/placeholder-image.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FaShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-500 mb-8">
              Hãy thêm một số sản phẩm vào giỏ hàng để bắt đầu mua sắm
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header với checkbox chọn tất cả */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="select-all" className="ml-3 text-sm font-medium text-gray-900">
                    Chọn tất cả ({cart.items.length} sản phẩm)
                  </label>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-4"
                      />
                      
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={getProductImage(item)}
                          alt={item.Product?.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.Product?.name}
                        </h3>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          {item.Color && (
                            <div className="flex items-center">
                              <span className="font-medium">Màu:</span>
                              <div className="flex items-center ml-2">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300 mr-1"
                                  style={{ backgroundColor: item.Color.hex_code }}
                                />
                                <span>{item.Color.name}</span>
                              </div>
                            </div>
                          )}
                          
                          {item.Size && (
                            <div>
                              <span className="font-medium">Size:</span>
                              <span className="ml-1">{item.Size.name}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-red-600">
                            {formatPrice(item.unit_price)}₫
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updatingQuantity.has(item.id)}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FaMinus className="w-3 h-3" />
                              </button>
                              <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                                {updatingQuantity.has(item.id) ? '...' : item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={updatingQuantity.has(item.id)}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => handleAskRemoveItem(item)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa sản phẩm"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-right">
                          <span className="text-sm text-gray-600">Thành tiền: </span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(item.total_price)}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sản phẩm đã chọn:</span>
                  <span className="font-medium">{getSelectedCount()} sản phẩm</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">
                    {formatPrice(getSelectedTotal())}₫
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">Miễn phí</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                    <span className="text-xl font-bold text-red-600">
                      {formatPrice(getSelectedTotal())}₫
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={selectedItems.size === 0}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Thanh toán ({getSelectedCount()})
              </button>
              
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup xác nhận xóa sản phẩm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa sản phẩm
              </h3>
              <button
                onClick={handleCancelRemove}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              {itemToDelete && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
                  <img
                    src={getProductImage(itemToDelete)}
                    alt={itemToDelete.Product?.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {itemToDelete.Product?.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {itemToDelete.Color && (
                        <span>Màu: {itemToDelete.Color.name}</span>
                      )}
                      {itemToDelete.Size && (
                        <span>Size: {itemToDelete.Size.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handleCancelRemove}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;