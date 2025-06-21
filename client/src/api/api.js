import axios from 'axios';

// Khởi tạo axios instance
const api = axios.create({
  baseURL: '/api', // Sử dụng với proxy từ vite.config.js
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - Tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý response và error
api.interceptors.response.use(
  (response) => {
    return response.data; // Trả về data trực tiếp
  },
  (error) => {
    console.error('Response error:', error);
    
    // Xử lý lỗi 401 - Token hết hạn
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ========================= AUTH API =========================
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token })
};

// ========================= USER API =========================
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/change-password', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/user/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (address) => api.post('/user/addresses', address),
  updateAddress: (id, address) => api.put(`/user/addresses/${id}`, address),
  deleteAddress: (id) => api.delete(`/user/addresses/${id}`)
};

// ========================= ADDRESS API =========================

export const addressAPI = {
  getAll: () => api.get('/addresses'),
  create: (addressData) => api.post('/addresses', addressData),
  update: (id, addressData) => api.put(`/addresses/${id}`, addressData),
  delete: (id) => api.delete(`/addresses/${id}`)
};

// ========================= PRODUCT API =========================
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get(`/products?search=${encodeURIComponent(query)}`),
  getBestSelling: (limit = 8) => api.get('/products', { 
    params: { limit, sortBy: 'view_count', order: 'DESC' } 
  }),
  getNewest: (limit = 8) => api.get('/products', { 
    params: { limit, sortBy: 'created_at', order: 'DESC' } 
  }),
  getFeatured: (limit = 4) => api.get('/products', { 
    params: { limit } 
  }),
  getByCategory: (categoryId, params = {}) => api.get('/products', { 
    params: { ...params, category_id: categoryId } 
  }),
  getByBrand: (brandId, params = {}) => api.get('/products', { 
    params: { ...params, brand_id: brandId } 
  })
};

// ========================= CATEGORY API =========================
export const categoryAPI = {
  // Public endpoints
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getWithProducts: (id) => api.get(`/categories/${id}/products`),
  
  // Admin endpoints (đơn giản hóa để khớp với routes)
  getAllAdmin: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

// ========================= BRAND API =========================
export const brandAPI = {
  getAll: () => api.get('/brands'),
  getById: (id) => api.get(`/brands/${id}`),
  create: (data) => api.post('/brands', data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`)
};

// ========================= COLOR API =========================
export const colorAPI = {
  getAll: () => api.get('/colors'),
  getById: (id) => api.get(`/colors/${id}`)
};

// ========================= SIZE API =========================
export const sizeAPI = {
  getAll: () => api.get('/sizes'),
  getById: (id) => api.get(`/sizes/${id}`)
};

// ========================= CART API =========================
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  updateQuantity: (id, quantity) => api.put(`/cart/update-quantity/${id}`, { quantity }), // Sửa endpoint
  remove: (id) => api.delete(`/cart/remove/${id}`), // Sửa endpoint
  clear: () => api.delete('/cart/clear'),
  getCount: () => api.get('/cart/count')
};

// ========================= ORDER API =========================
export const orderAPI2 = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  update: (id, data) => api.put(`/orders/${id}`, data),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  getHistory: (params) => api.get('/orders/history', { params })
};

export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: (params) => api.get('/orders/me', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`)
};

// ========================= REVIEW API =========================
export const reviewAPI = {
  getByProductId: (productId, params = {}) => 
    api.get(`/reviews?product_id=${productId}`, { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`)
};

// ========================= VOUCHER API =========================
export const voucherAPI2 = {
  getAll: () => api.get('/vouchers'),
  getById: (id) => api.get(`/vouchers/${id}`),
  apply: (code) => api.post('/vouchers/apply', { code }),
  getAvailable: () => api.get('/vouchers/available')
};

export const voucherAPI = {
  apply: (data) => api.post('/vouchers/apply', data),
  getAvailable: (subtotal) => api.get(`/vouchers/available?subtotal=${subtotal}`)
};

// ========================= PAYMENT API =========================
export const paymentAPI = {
  getMethods: () => api.get('/payment/methods'),
  createPayment: (data) => api.post('/payment/create', data),
  verifyPayment: (data) => api.post('/payment/verify', data)
};

export const paymentMethodAPI = {
  getAll: () => api.get('/payment-methods')
};


// ========================= SHIPPING API =========================

export const shipmentAPI = {
  getAll: () => api.get('/shipments')
};

// ========================= ADMIN API (nếu cần) =========================
export const adminAPI = {
  // Dashboard
  getDashboardStats: (params = {}) => {
    return api.get('/admin/dashboard/stats', { params });
  },
  // User Management
  getColors: () => api.get('/api/admin/colors'),
  getSizes: () => api.get('/api/admin/sizes'),
  
  getAllUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),

  // Voucher Management
  getAllVouchers: (params) => api.get('/admin/vouchers', { params }),
  createVoucher: (data) => api.post('/admin/vouchers', data),
  updateVoucher: (id, data) => api.put(`/admin/vouchers/${id}`, data),
  deleteVoucher: (id) => api.delete(`/admin/vouchers/${id}`),
  getUserStats: () => {
    return api.get('/admin/users/stats');
  },
  // Dashboard
  getDashboardStats: (params = {}) => {
    return api.get('/admin/dashboard/stats', { params });
  },

  // Order Management
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  getOrderDetails: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  updatePaymentStatus: (id, data) => api.put(`/admin/orders/${id}/payment-status`, data),

  // Shipment Management
  getAllShipments: (params) => api.get('/admin/shipments', { params }),
  createShipment: (data) => api.post('/admin/shipments', data),
  updateShipment: (id, data) => api.put(`/admin/shipments/${id}`, data),
  deleteShipment: (id) => api.delete(`/admin/shipments/${id}`),

  // Product management
  getAllProducts: (params = {}) => {
    return api.get('/admin/products', { params });
  },
  getProductDetails: (id) => {
    return api.get(`/admin/products/${id}`);
  },
  createProduct: (data) => {
    return api.post('/admin/products', data);
  }, 
  updateProduct: (id, data) => {
    return api.put(`/admin/products/${id}`, data);
  },
  deleteProduct: (id) => {
    return api.delete(`/admin/products/${id}`);
  },  uploadImage: (formData) => {
    return api.post('/products/admin/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });  },getCategories: () => {
    return api.get('/categories');
  },
  getBrands: () => {
    return api.get('/brands');
  },
  getColors: () => {
    return api.get('/colors');
  },
  getSizes: () => {
    return api.get('/sizes');
  },
};


// ========================= UTILITY FUNCTIONS =========================
export const apiUtils = {
  // Upload file helper
  uploadFile: (file, folder = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Search suggestions
  getSearchSuggestions: (query) => api.get(`/search/suggestions?q=${encodeURIComponent(query)}`),
  
  // Get app config
  getConfig: () => api.get('/config'),
  
  // Contact form
  sendContact: (data) => api.post('/contact', data)
};

export default api;