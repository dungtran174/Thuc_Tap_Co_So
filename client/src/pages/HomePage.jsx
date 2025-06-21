import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductSlider from '../components/ProductSlider';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { categoryAPI, productAPI } from '../api/api';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [categoriesRes, bestSellingRes, newProductsRes, featuredRes] = await Promise.all([
        categoryAPI.getAll(),
        productAPI.getBestSelling(8),
        productAPI.getNewest(8),
        productAPI.getFeatured(6)
      ]);

      setCategories(categoriesRes.categories || []);
      setBestSellingProducts(bestSellingRes.rows || []);
      setNewProducts(newProductsRes.rows || []);
      setFeaturedProducts(featuredRes.rows || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Thời Trang Hiện Đại
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Khám phá bộ sưu tập mới nhất với phong cách độc đáo và chất lượng cao
            </p>
            <div className="space-x-4">
              <Link
                to="/shop"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Mua Sắm Ngay
              </Link>
              <Link
                to="/shop?sortBy=view_count"
                className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Sản Phẩm Hot
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Danh Mục Sản Phẩm</h2>
            <p className="text-gray-600 text-lg">Tìm kiếm theo danh mục yêu thích của bạn</p>
          </div>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.slice(0, 6).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">📂</div>
              <p>Không có danh mục nào</p>
            </div>
          )}
        </section>

        {/* Best Selling Products */}
        <section className="py-20">
          <ProductSlider 
            products={bestSellingProducts}
            title="Sản Phẩm Bán Chạy"
            viewAllLink="/shop?sortBy=view_count&order=DESC"
          />
        </section>

        {/* New Products */}
        <section className="py-20">
          <ProductSlider 
            products={newProducts}
            title="Sản Phẩm Mới"
            viewAllLink="/shop?sortBy=created_at&order=DESC"
          />
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sản Phẩm Nổi Bật</h2>
            <p className="text-gray-600 text-lg">Những sản phẩm được chúng tôi khuyên dùng</p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">⭐</div>
              <p>Không có sản phẩm nổi bật</p>
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Đăng Ký Nhận Tin</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt ngay trong hộp thư của bạn
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
                />
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors transform hover:scale-105">
                  Đăng Ký
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;