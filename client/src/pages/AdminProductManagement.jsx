import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/api';
import { toast } from 'react-toastify';
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaImage,
  FaTimes,
  FaUpload,
  FaBox,
  FaTag,
  FaPalette,
  FaRuler,
  FaMoneyBillWave,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
    // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  
  // Data states
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    long_description: '',
    category_id: '',
    brand_id: '',
    origin: '',
    material: '',
    original_price: '',
    sale_price: '',
    status: 'active',
    product_colors: [],
    product_sizes: []
  });
    const [uploadingImages, setUploadingImages] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
    fetchColors();
    fetchSizes();
  }, [page, search, categoryId, brandId, status]);

  // Debug useEffect để theo dõi formData khi edit
  useEffect(() => {
    if (editingProduct) {
      console.log('🐛 Editing product:', editingProduct);
      console.log('🐛 Form data:', formData);
      console.log('🐛 Categories:', categories);
      console.log('🐛 Selected category_id:', formData.category_id);
      console.log('🐛 Category exists:', categories.find(c => String(c.id) === String(formData.category_id)));
      console.log('🐛 Brands:', brands);
      console.log('🐛 Selected brand_id:', formData.brand_id);
      console.log('🐛 Brand exists:', brands.find(b => String(b.id) === String(formData.brand_id)));
    }
  }, [editingProduct, formData, categories, brands]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllProducts({
        page,
        limit: 10,
        search,
        category_id: categoryId,
        brand_id: brandId,
        status
      });
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      console.log('🔄 Fetching categories...');
      const response = await adminAPI.getCategories();
      console.log('📁 Categories response:', response);
      setCategories(response.categories || []);
      console.log('📁 Categories set:', response.categories || []);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      console.log('🔄 Fetching brands...');
      const response = await adminAPI.getBrands();
      console.log('🏢 Brands response:', response);
      setBrands(response.brands || []);
      console.log('🏢 Brands set:', response.brands || []);
    } catch (error) {
      console.error('❌ Error fetching brands:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await adminAPI.getColors();
      setColors(response.colors || []);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await adminAPI.getSizes();
      setSizes(response.sizes || []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };
  const handleImageUpload = async (file, colorId) => {
    if (!file) return null;

    console.log('📤 Starting image upload for color:', colorId);
    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });    // Validate file - Thêm webp vào danh sách
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('File ảnh không được vượt quá 5MB');
      return null;
    }

    try {
      setUploadingImages(prev => ({ ...prev, [colorId]: true }));
      
      const formData = new FormData();
      formData.append('image', file);
      
      console.log('📤 Sending upload request to /products/admin/upload-image');
      
      const response = await adminAPI.uploadImage(formData);
      
      console.log('📥 Upload response:', response);
      
      setUploadingImages(prev => ({ ...prev, [colorId]: false }));
      
      // Kiểm tra response structure
      if (response?.success && response?.url) {
        console.log('✅ Image uploaded successfully:', response.url);
        toast.success('Tải ảnh thành công!');
        return response.url;
      } else {
        console.error('❌ Invalid response structure:', response);
        toast.error('Phản hồi từ server không hợp lệ');
        return null;
      }
      
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      
      setUploadingImages(prev => ({ ...prev, [colorId]: false }));
      
      if (error.response) {
        console.error('Server error response:', error.response);
        toast.error(`Lỗi server (${error.response.status}): ${error.response.data?.message || 'Không thể tải ảnh'}`);
      } else if (error.request) {
        console.error('Network error:', error.request);
        toast.error('Lỗi mạng, vui lòng thử lại');
      } else {
        console.error('Unknown error:', error.message);
        toast.error('Lỗi không xác định khi tải ảnh');
      }
      
      return null;
    }
  };

  const handleColorImageChange = async (colorId, file) => {
    const imageUrl = await handleImageUpload(file, colorId);
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        product_colors: prev.product_colors.map(pc =>
          pc.color_id === colorId ? { ...pc, image: imageUrl } : pc
        )
      }));
    }
  };

  const addProductColor = (colorId) => {
    const colorExists = formData.product_colors.some(pc => pc.color_id === colorId);
    if (colorExists) {
      toast.warning('Màu này đã được thêm');
      return;
    }

    setFormData(prev => ({
      ...prev,
      product_colors: [...prev.product_colors, {
        color_id: colorId,
        image: ''
      }]
    }));
  };

  const removeProductColor = (colorId) => {
    setFormData(prev => ({
      ...prev,
      product_colors: prev.product_colors.filter(pc => pc.color_id !== colorId)
    }));
  };

  const addProductSize = (sizeId) => {
    const sizeExists = formData.product_sizes.some(ps => ps.size_id === sizeId);
    if (sizeExists) {
      toast.warning('Size này đã được thêm');
      return;
    }

    setFormData(prev => ({
      ...prev,
      product_sizes: [...prev.product_sizes, {
        size_id: sizeId,
        original_price: '',
        sale_price: '',
        quantity: 0
      }]
    }));
  };

  const removeProductSize = (sizeId) => {
    setFormData(prev => ({
      ...prev,
      product_sizes: prev.product_sizes.filter(ps => ps.size_id !== sizeId)
    }));
  };

  const updateProductSize = (sizeId, field, value) => {
    setFormData(prev => ({
      ...prev,
      product_sizes: prev.product_sizes.map(ps =>
        ps.size_id === sizeId ? { ...ps, [field]: value } : ps
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, formData);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await adminAPI.createProduct(formData);
        toast.success('Tạo sản phẩm thành công');
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Lỗi khi lưu sản phẩm');
    }
  };  const handleEdit = async (product) => {
    try {
      console.log('📝 Editing product:', product);
      
      // Đảm bảo categories và brands đã được load
      if (categories.length === 0) {
        console.log('📁 Loading categories...');
        await fetchCategories();
      }
      if (brands.length === 0) {
        console.log('🏢 Loading brands...');
        await fetchBrands();
      }
      
      console.log('📁 Available categories:', categories);
      console.log('🏢 Available brands:', brands);
      
      setEditingProduct(product);
      
      const newFormData = {
        name: product.name || '',
        short_description: product.short_description || '',
        long_description: product.long_description || '',
        category_id: product.category_id ? String(product.category_id) : '',
        brand_id: product.brand_id ? String(product.brand_id) : '',
        origin: product.origin || '',
        material: product.material || '',
        original_price: product.original_price || '',
        sale_price: product.sale_price || '',
        status: product.status || 'active',
        product_colors: product.ProductColors?.map(pc => ({
          color_id: pc.color_id,
          image: pc.image || ''
        })) || [],
        product_sizes: product.ProductSizes?.map(ps => ({
          size_id: ps.size_id,
          original_price: ps.original_price || '',
          sale_price: ps.sale_price || '',
          quantity: ps.quantity || 0
        })) || []
      };
      
      console.log('📋 Form data to set:', newFormData);
      console.log('🎯 Category ID:', newFormData.category_id, 'Type:', typeof newFormData.category_id);
      console.log('🎯 Brand ID:', newFormData.brand_id, 'Type:', typeof newFormData.brand_id);
      
      setFormData(newFormData);
      setShowModal(true);
      
    } catch (error) {
      console.error('Error preparing edit:', error);
      toast.error('Lỗi khi chuẩn bị chỉnh sửa sản phẩm');
    }
  };
  const handleDelete = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    
    try {
      console.log('🗑️ Deleting product:', deletingProduct.id);
      await adminAPI.deleteProduct(deletingProduct.id);
      toast.success('Xóa sản phẩm thành công');
      setShowDeleteModal(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
        toast.error(`Lỗi server: ${error.response.data?.message || 'Không thể xóa sản phẩm'}`);
      } else {
        toast.error('Lỗi kết nối khi xóa sản phẩm');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  const handleViewDetail = async (product) => {
    try {
      const response = await adminAPI.getProductDetails(product.id);
      setSelectedProduct(response.product);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Lỗi khi tải chi tiết sản phẩm');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      short_description: '',
      long_description: '',
      category_id: '',
      brand_id: '',
      origin: '',
      material: '',
      original_price: '',
      sale_price: '',
      status: 'active',
      product_colors: [],
      product_sizes: []
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getColorName = (colorId) => {
    const color = colors.find(c => c.id === colorId);
    return color ? color.name : '';
  };

  const getSizeName = (sizeId) => {
    const size = sizes.find(s => s.id === sizeId);
    return size ? size.name : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaBox className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaBox className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaToggleOn className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaToggleOff className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Không hoạt động</p>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => p.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaTag className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Danh mục</p>
              <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          <button
            onClick={() => {
              setPage(1);
              fetchProducts();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thương hiệu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá gốc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá sale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.ProductColors?.[0]?.image || '/default-product.png'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.short_description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.Category?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.Brand?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(product.original_price)}₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sale_price ? `${formatPrice(product.sale_price)}₫` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                        {product.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetail(product)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-green-600 hover:text-green-700"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-700"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} trong{' '}
                {pagination.total} kết quả
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Trước
                </button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded">
                  {page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => {
                      console.log('Category selected:', e.target.value);
                      setFormData({...formData, category_id: e.target.value});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => {
                      const isSelected = String(category.id) === String(formData.category_id);
                      console.log(`Category: ${category.name} (${category.id}) - Selected: ${isSelected}`);
                      return (
                        <option key={category.id} value={String(category.id)}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thương hiệu
                  </label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) => {
                      console.log('Brand selected:', e.target.value);
                      setFormData({...formData, brand_id: e.target.value});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map(brand => {
                      const isSelected = String(brand.id) === String(formData.brand_id);
                      console.log(`Brand: ${brand.name} (${brand.id}) - Selected: ${isSelected}`);
                      return (
                        <option key={brand.id} value={String(brand.id)}>
                          {brand.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xuất xứ
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chất liệu
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({...formData, material: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá gốc *
                  </label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá sale
                  </label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả ngắn
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  value={formData.long_description}
                  onChange={(e) => setFormData({...formData, long_description: e.target.value})}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Product Colors */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <FaPalette className="mr-2" />
                    Màu sắc sản phẩm
                  </h4>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addProductColor(parseInt(e.target.value));
                        e.target.value = '';
                      }
                    }}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Thêm màu</option>
                    {colors.map(color => (
                      <option key={color.id} value={color.id}>{color.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.product_colors.map((productColor, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">
                          {getColorName(productColor.color_id)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProductColor(productColor.color_id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {productColor.image && (
                          <img
                            src={productColor.image}
                            alt={getColorName(productColor.color_id)}
                            className="w-full h-32 object-cover rounded"
                          />
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hình ảnh
                          </label>                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={(e) => handleColorImageChange(productColor.color_id, e.target.files[0])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          {uploadingImages[productColor.color_id] && (
                            <p className="text-sm text-blue-600 mt-1">Đang tải ảnh...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Sizes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <FaRuler className="mr-2" />
                    Kích thước và giá
                  </h4>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addProductSize(parseInt(e.target.value));
                        e.target.value = '';
                      }
                    }}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Thêm size</option>
                    {sizes.map(size => (
                      <option key={size.id} value={size.id}>{size.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  {formData.product_sizes.map((productSize, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">
                          Size {getSizeName(productSize.size_id)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProductSize(productSize.size_id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá gốc
                          </label>
                          <input
                            type="number"
                            value={productSize.original_price}
                            onChange={(e) => updateProductSize(productSize.size_id, 'original_price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá sale
                          </label>
                          <input
                            type="number"
                            value={productSize.sale_price}
                            onChange={(e) => updateProductSize(productSize.size_id, 'sale_price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số lượng
                          </label>
                          <input
                            type="number"
                            value={productSize.quantity}
                            onChange={(e) => updateProductSize(productSize.size_id, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết sản phẩm: {selectedProduct.name}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Thông tin cơ bản</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Tên:</strong> {selectedProduct.name}</p>
                    <p><strong>Danh mục:</strong> {selectedProduct.Category?.name}</p>
                    <p><strong>Thương hiệu:</strong> {selectedProduct.Brand?.name}</p>
                    <p><strong>Xuất xứ:</strong> {selectedProduct.origin}</p>
                    <p><strong>Chất liệu:</strong> {selectedProduct.material}</p>
                    <p><strong>Trạng thái:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedProduct.status)}`}>
                        {selectedProduct.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Giá cả</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Giá gốc:</strong> {formatPrice(selectedProduct.original_price)}₫</p>
                    {selectedProduct.sale_price && (
                      <p><strong>Giá sale:</strong> {formatPrice(selectedProduct.sale_price)}₫</p>
                    )}
                    <p><strong>Lượt xem:</strong> {selectedProduct.view_count}</p>
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Mô tả</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Mô tả ngắn:</strong> {selectedProduct.short_description}</p>
                  <p><strong>Mô tả chi tiết:</strong> {selectedProduct.long_description}</p>
                </div>
              </div>

              {/* Colors */}
              {selectedProduct.ProductColors?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Màu sắc</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProduct.ProductColors.map((productColor, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="text-center">
                          {productColor.image && (
                            <img
                              src={productColor.image}
                              alt={productColor.Color?.name}
                              className="w-full h-20 object-cover rounded mb-2"
                            />
                          )}
                          <p className="text-sm font-medium">{productColor.Color?.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {selectedProduct.ProductSizes?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Kích thước và giá</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá gốc</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá sale</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedProduct.ProductSizes.map((productSize, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {productSize.Size?.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {formatPrice(productSize.original_price)}₫
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {productSize.sale_price ? `${formatPrice(productSize.sale_price)}₫` : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {productSize.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Xác nhận xóa sản phẩm
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa sản phẩm{' '}
                <span className="font-semibold text-gray-900">
                  "{deletingProduct?.name}"
                </span>
                ? Hành động này không thể hoàn tác.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;