import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI, brandAPI } from '../api/api';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    material: searchParams.get('material') || '',
    origin: searchParams.get('origin') || '',
    sortBy: searchParams.get('sortBy') || 'created_at',
    order: searchParams.get('order') || 'DESC',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 6  // Changed from 12 to 6 products per page
  });

  useEffect(() => {
    fetchFilters();
  }, []);
  useEffect(() => {
    fetchProducts();
    updateURL();
  }, [filters]);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        handleFilterChange('search', searchInput);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const fetchFilters = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        categoryAPI.getAll(),
        brandAPI.getAll()
      ]);

      setCategories(categoriesRes.categories || []);
      setBrands(brandsRes.brands || []);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          params[key] = value;
        }
      });

      const response = await productAPI.getAll(params);
      setProducts(response.rows || []);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && key !== 'limit') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split('-');
    setFilters(prev => ({
      ...prev,
      sortBy,
      order,
      page: 1
    }));
  };  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      category: '',
      brand: '',
      material: '',
      origin: '',
      sortBy: 'created_at',
      order: 'DESC',
      page: 1,
      limit: 6  // Changed from 12 to 6
    });
  };

  const totalPages = Math.ceil(totalCount / filters.limit);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cửa Hàng</h1>
          <p className="text-gray-600 text-lg">Khám phá bộ sưu tập thời trang đa dạng của chúng tôi</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Bộ Lọc</h3>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm sản phẩm
                </label>                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Danh mục
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    Tất cả danh mục
                  </label>
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={filters.category === category.id.toString()}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nhãn hàng
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="brand"
                      value=""
                      checked={filters.brand === ''}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    Tất cả nhãn hàng
                  </label>
                  {brands.map(brand => (
                    <label key={brand.id} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand.id}
                        checked={filters.brand === brand.id.toString()}
                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      {brand.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chất liệu
                </label>
                <input
                  type="text"
                  value={filters.material}
                  onChange={(e) => handleFilterChange('material', e.target.value)}
                  placeholder="VD: Cotton, Polyester..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Origin */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xuất xứ
                </label>
                <input
                  type="text"
                  value={filters.origin}
                  onChange={(e) => handleFilterChange('origin', e.target.value)}
                  placeholder="VD: Vietnam, China..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Sản Phẩm
                  </h2>
                  <p className="text-gray-600">
                    Hiển thị {products.length} / {totalCount} sản phẩm
                  </p>
                </div>
                
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Sắp xếp theo:
                  </label>
                  <select
                    value={`${filters.sortBy}-${filters.order}`}
                    onChange={handleSortChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="created_at-DESC">Mới nhất</option>
                    <option value="created_at-ASC">Cũ nhất</option>
                    <option value="original_price-ASC">Giá: Thấp đến cao</option>
                    <option value="original_price-DESC">Giá: Cao đến thấp</option>
                    <option value="view_count-DESC">Phổ biến nhất</option>
                    <option value="name-ASC">Tên: A-Z</option>
                    <option value="name-DESC">Tên: Z-A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải sản phẩm...</p>
                </div>
              </div>
            ) : products.length > 0 ? (
              <>                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-8">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Trước
                      </button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        const page = Math.max(1, Math.min(totalPages - 4, filters.page - 2)) + index;
                        if (page > totalPages) return null;
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                              filters.page === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === totalPages}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Sau →
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-400 text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500 mb-6">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;