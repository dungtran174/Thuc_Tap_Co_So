import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { productAPI, reviewAPI, cartAPI } from '../api/api';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaShare, FaPlus, FaMinus, FaUser } from 'react-icons/fa';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  
  // Product states
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Selection states
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState('');
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  
  // UI states
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProductDetail();
    fetchReviews();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      
      if (response && response.success) {
        setProduct(response.product);
        setCurrentImage(response.product.image);
        
        // Set default selections
        if (response.product.ProductColors?.length > 0) {
          setSelectedColor(response.product.ProductColors[0]);
          if (response.product.ProductColors[0].image) {
            setCurrentImage(response.product.ProductColors[0].image);
          }
        }
        
        if (response.product.ProductSizes?.length > 0) {
          setSelectedSize(response.product.ProductSizes[0]);
        }
        
        // Fetch related products
        fetchRelatedProducts(response.product.category_id, response.product.brand_id);
      } else {
        setError('Không tìm thấy sản phẩm');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Có lỗi xảy ra khi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId, brandId) => {
    try {
      const response = await productAPI.getAll({
        category: categoryId,
        brand: brandId,
        limit: 4
      });
      
      if (response && response.rows) {
        // Exclude current product
        const filtered = response.rows.filter(p => p.id !== parseInt(id));
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await reviewAPI.getByProductId(id);
      
      if (response && response.success) {
        setReviews(response.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (color.image) {
      setCurrentImage(color.image);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1); // Reset quantity when size changes
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxQuantity = selectedSize?.quantity || 0;
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  // Format giá tiền VNĐ chuẩn (1000000 -> 1.000.000)
  const formatPrice = (price) => {
    if (!price) return '0';
    
    // Chuyển thành số nguyên (loại bỏ phần thập phân nếu có)
    const intPrice = Math.floor(Number(price));
    
    // Chuyển thành chuỗi và thêm dấu chấm ngăn cách hàng nghìn
    return intPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const getCurrentPrice = () => {
    if (selectedSize && selectedSize.sale_price) {
      return selectedSize.sale_price;
    }
    if (selectedSize && selectedSize.original_price) {
      return selectedSize.original_price;
    }
    return product?.sale_price || product?.original_price || 0;
  };

  const getOriginalPrice = () => {
    if (selectedSize && selectedSize.original_price) {
      return selectedSize.original_price;
    }
    return product?.original_price || 0;
  };

  // Tính phần trăm giảm giá
  const getDiscountPercentage = () => {
    const currentPrice = getCurrentPrice();
    const originalPrice = getOriginalPrice();
    
    if (originalPrice && currentPrice && originalPrice > currentPrice) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const getAvailableQuantity = () => {
    return selectedSize?.quantity || 0;
  };

  const canAddToCart = () => {
    return selectedColor && selectedSize && quantity > 0 && quantity <= getAvailableQuantity();
  };

  const handleAddToCart = async () => {
    if (!canAddToCart()) {
      toast.error('Vui lòng chọn đầy đủ màu sắc và kích thước');
      return;
    }

    try {
      const cartItem = {
        product_id: product.id,
        color_id: selectedColor.color_id,
        size_id: selectedSize.size_id,
        quantity: quantity
      };

      await cartAPI.add(cartItem);
      // API call to add to cart would go here
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      refreshCartCount(); // Refresh cart count in context
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vui lòng đăng nhập để đánh giá sản phẩm');
      navigate('/login');
      return;
    }

    try {
      const reviewData = {
        product_id: parseInt(id),
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment
      };

      const response = await reviewAPI.create(reviewData);
      
      if (response && response.success) {
        toast.success('Đánh giá của bạn đã được gửi thành công!');
        setNewReview({ rating: 5, title: '', comment: '' });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  const renderStars = (rating, size = 'text-base') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className={`text-yellow-400 ${size}`} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className={`text-yellow-400 ${size}`} />);
      } else {
        stars.push(<FaRegStar key={i} className={`text-gray-300 ${size}`} />);
      }
    }
    
    return <div className="flex items-center">{stars}</div>;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về trang sản phẩm
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = getDiscountPercentage();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-blue-600">Trang chủ</a>
          <span>/</span>
          <a href="/products" className="hover:text-blue-600">Sản phẩm</a>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                    -{discountPercentage}%
                  </div>
                )}

                <img
                  src={currentImage || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Thumbnails */}
              <div className="flex space-x-2 overflow-x-auto">
                <img
                  src={product.image}
                  alt="Main"
                  onClick={() => setCurrentImage(product.image)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                    currentImage === product.image ? 'border-blue-500' : 'border-gray-300'
                  }`}
                />
                {product.ProductColors?.map((colorOption, index) => (
                  colorOption.image && (
                    <img
                      key={index}
                      src={colorOption.image}
                      alt={`Color ${index}`}
                      onClick={() => setCurrentImage(colorOption.image)}
                      className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                        currentImage === colorOption.image ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    />
                  )
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                {renderStars(getAverageRating())}
                <span className="text-gray-600">({reviews.length} đánh giá)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(getCurrentPrice())}₫
                  </span>
                  {getOriginalPrice() > getCurrentPrice() && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(getOriginalPrice())}₫
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="text-green-600 font-medium mt-1">
                    Tiết kiệm {formatPrice(getOriginalPrice() - getCurrentPrice())}₫ ({discountPercentage}%)
                  </p>
                )}
              </div>


              {/* Short Description */}
              <p className="text-gray-600 mb-6">{product.short_description}</p>

              {/* Color Selection */}
              {product.ProductColors?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Màu sắc</h3>
                  <div className="flex space-x-3">
                    {product.ProductColors.map((colorOption) => (
                      <button
                        key={colorOption.id}
                        onClick={() => handleColorSelect(colorOption)}
                        className={`w-12 h-12 rounded-lg border-4 transition-all ${
                          selectedColor?.id === colorOption.id
                            ? 'border-blue-500 scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: colorOption.Color?.hex_code || '#ccc' }}
                        title={colorOption.Color?.name}
                      />
                    ))}
                  </div>
                  {selectedColor && (
                    <p className="text-sm text-gray-600 mt-2">
                      Đã chọn: {selectedColor.Color?.name}
                    </p>
                  )}
                </div>
              )}

              {/* Size Selection */}
              {product.ProductSizes?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kích thước</h3>
                  <div className="flex space-x-2">
                    {product.ProductSizes.map((sizeOption) => (
                      <button
                        key={sizeOption.id}
                        onClick={() => handleSizeSelect(sizeOption)}
                        disabled={sizeOption.quantity === 0}
                        className={`px-4 py-2 border rounded-lg transition-all ${
                          selectedSize?.id === sizeOption.id
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : sizeOption.quantity === 0
                            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {sizeOption.Size?.name}
                      </button>
                    ))}
                  </div>
                  {selectedSize && (
                    <p className="text-sm text-gray-600 mt-2">
                      Còn lại: {getAvailableQuantity()} sản phẩm
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Số lượng</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaMinus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= getAvailableQuantity()}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart()}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <FaShoppingCart />
                  <span>Thêm vào giỏ hàng</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaHeart className="w-6 h-6" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaShare className="w-6 h-6" />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex">
                  <span className="font-medium w-24">Danh mục:</span>
                  <span>{product.Category?.name}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Nhãn hàng:</span>
                  <span>{product.Brand?.name}</span>
                </div>
                {product.material && (
                  <div className="flex">
                    <span className="font-medium w-24">Chất liệu:</span>
                    <span>{product.material}</span>
                  </div>
                )}
                {product.origin && (
                  <div className="flex">
                    <span className="font-medium w-24">Xuất xứ:</span>
                    <span>{product.origin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Mô tả sản phẩm
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Đánh giá ({reviews.length})
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.long_description || product.short_description }} />
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Review Summary */}
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl font-bold text-gray-900">
                      {getAverageRating()}
                    </div>
                    <div>
                      {renderStars(getAverageRating(), 'text-xl')}
                      <p className="text-gray-600">{reviews.length} đánh giá</p>
                    </div>
                  </div>

                  {user && !showReviewForm && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Viết đánh giá
                    </button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h3>
                    
                    {/* Rating */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đánh giá *
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="text-2xl focus:outline-none"
                          >
                            <FaStar
                              className={star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tiêu đề đánh giá"
                      />
                    </div>

                    {/* Comment */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bình luận *
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Gửi đánh giá
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải đánh giá...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <FaUser className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.User?.first_name || review.User?.username || 'Người dùng'}
                              </h4>
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            {review.title && (
                              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                            )}
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                    {user && (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Viết đánh giá đầu tiên
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;