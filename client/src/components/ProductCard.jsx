import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Lấy ảnh sản phẩm
  const getProductImage = () => {
    if (imageError) {
      return 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image';
    }
    if (product.ProductColors && product.ProductColors.length > 0 && product.ProductColors[0].image) {
      return product.ProductColors[0].image;
    }
    
    return product.image || 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image';
  };

  // Tính giá hiển thị
  const getPrice = () => {
    let originalPrice = product.original_price;
    let salePrice = product.sale_price;

    // Nếu không có giá ở Product, lấy giá thấp nhất từ ProductSize
    if (!originalPrice && product.ProductSizes && product.ProductSizes.length > 0) {
      const prices = product.ProductSizes.map(size => ({
        original: size.original_price || 0,
        sale: size.sale_price || size.original_price || 0
      }));
      
      originalPrice = Math.min(...prices.map(p => p.original));
      const minSalePrice = Math.min(...prices.map(p => p.sale));
      salePrice = minSalePrice < originalPrice ? minSalePrice : null;
    }

    return { originalPrice: originalPrice || 0, salePrice };
  };

  const { originalPrice, salePrice } = getPrice();

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Tính phần trăm giảm giá
  const getDiscountPercentage = () => {
    if (salePrice && originalPrice > salePrice) {
      return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    }
    return 0;
  };

  // Render rating stars
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  // Event handlers
  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log('Adding to cart:', product.id);
    // TODO: Implement add to cart functionality
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    console.log('Adding to wishlist:', product.id);
    // TODO: Implement wishlist functionality
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          -{discountPercentage}%
        </div>
      )}

      {/* New Badge */}
      {product.is_new && (
        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          MỚI
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={getProductImage()}
          alt={product.name || 'Product Image'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-2 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleQuickView}
            className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
            title="Xem nhanh"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors transform hover:scale-110"
            title="Thêm vào giỏ hàng"
          >
            <FaShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={handleWishlist}
            className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
            title="Yêu thích"
          >
            <FaHeart className="w-4 h-4" />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {product.status === 'out_of_stock' && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-2">
          {product.Brand && (
            <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
              {product.Brand.name}
            </span>
          )}
          {product.Category && (
            <span className="text-gray-400 text-xs">
              {product.Category.name}
            </span>
          )}
        </div>
        
        {/* Product Name */}
        <h3 
          className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors text-sm leading-5"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          {renderStars(product.average_rating)}
          <span className="text-xs text-gray-500">
            ({product.review_count || 0})
          </span>
        </div>
        
        {/* Price */}
        <div className="mb-3">
          {salePrice ? (
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-red-600 font-bold text-lg">
                {formatPrice(salePrice)}₫
              </span>
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(originalPrice)}₫
              </span>
            </div>
          ) : (
            <span className="text-gray-900 font-bold text-lg">
              {formatPrice(originalPrice)}₫
            </span>
          )}
        </div>

        {/* Product Features */}
        <div className="space-y-2">
          {/* Colors Available */}
          {product.ProductColors && product.ProductColors.length > 0 && (
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">Màu sắc:</span>
              <div className="flex space-x-1">
                {product.ProductColors.slice(0, 4).map((productColor, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors cursor-pointer"
                    style={{ backgroundColor: productColor.Color?.hex_code || '#cccccc' }}
                    title={productColor.Color?.name}
                  />
                ))}
                {product.ProductColors.length > 4 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    +{product.ProductColors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sizes Available */}
          {product.ProductSizes && product.ProductSizes.length > 0 && (
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">Size:</span>
              <div className="flex space-x-1">
                {product.ProductSizes.slice(0, 4).map((productSize, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border"
                    title={`Size ${productSize.Size?.name} - Còn ${productSize.quantity} sản phẩm`}
                  >
                    {productSize.Size?.name}
                  </span>
                ))}
                {product.ProductSizes.length > 4 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    +{product.ProductSizes.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Mobile */}
        <div className="mt-4 flex space-x-2 md:hidden">
          <button
            onClick={handleProductClick}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Xem chi tiết
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
            title="Thêm vào giỏ hàng"
          >
            <FaShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Info Tooltip */}
      {product.short_description && (
        <div className="absolute bottom-full left-0 right-0 bg-gray-900 text-white text-xs p-2 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
          <p className="line-clamp-2">{product.short_description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;