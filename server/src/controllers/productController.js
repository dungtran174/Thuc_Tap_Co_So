const { Product, Category, Brand, ProductColor, ProductSize, Color, Size } = require('../models');
const { Op } = require('sequelize');
const cloudinary = require('../config/cloudinary.config');

const productController = {
  // Admin: Get all products
  async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 10, search = '', category_id = '', brand_id = '', status = '' } = req.query;
      const offset = (page - 1) * limit;

      const whereConditions = {};
      
      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { short_description: { [Op.like]: `%${search}%` } }
        ];
      }

      if (category_id) {
        whereConditions.category_id = category_id;
      }

      if (brand_id) {
        whereConditions.brand_id = brand_id;
      }

      if (status) {
        whereConditions.status = status;
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Category,
            attributes: ['id', 'name']
          },
          {
            model: Brand,
            attributes: ['id', 'name']
          },
          {
            model: ProductColor,
            as: 'ProductColors',
            include: [{
              model: Color,
              attributes: ['id', 'name', 'hex_code']
            }]
          },
          {
            model: ProductSize,
            as: 'ProductSizes',
            include: [{
              model: Size,
              attributes: ['id', 'name']
            }]
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
      });

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      };

      res.json({
        success: true,
        products,
        pagination
      });

    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách sản phẩm',
        error: error.message
      });
    }
  },

  // Admin: Get product details
  async getProductDetails(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: [
          {
            model: Category,
            attributes: ['id', 'name', 'description']
          },
          {
            model: Brand,
            attributes: ['id', 'name', 'description']
          },
          {
            model: ProductColor,
            as: 'ProductColors',
            include: [{
              model: Color,
              attributes: ['id', 'name', 'hex_code']
            }]
          },
          {
            model: ProductSize,
            as: 'ProductSizes',
            include: [{
              model: Size,
              attributes: ['id', 'name', 'description']
            }]
          }
        ]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }

      res.json({
        success: true,
        product
      });

    } catch (error) {
      console.error('Error getting product details:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy chi tiết sản phẩm',
        error: error.message
      });
    }
  },

  // Admin: Create product
  async createProduct(req, res) {
    try {
      const {
        name,
        short_description,
        long_description,
        category_id,
        brand_id,
        origin,
        material,
        original_price,
        sale_price,
        status,
        product_colors,
        product_sizes
      } = req.body;

      // Create product
      const product = await Product.create({
        name,
        short_description,
        long_description,
        category_id,
        brand_id: brand_id || null,
        origin,
        material,
        original_price,
        sale_price: sale_price || null,
        status
      });

      // Create product colors
      if (product_colors && product_colors.length > 0) {
        const productColorData = product_colors.map(pc => ({
          product_id: product.id,
          color_id: pc.color_id,
          image: pc.image || null
        }));
        await ProductColor.bulkCreate(productColorData);
      }

      // Create product sizes
      if (product_sizes && product_sizes.length > 0) {
        const productSizeData = product_sizes.map(ps => ({
          product_id: product.id,
          size_id: ps.size_id,
          original_price: ps.original_price,
          sale_price: ps.sale_price || null,
          quantity: ps.quantity || 0
        }));
        await ProductSize.bulkCreate(productSizeData);
      }

      res.status(201).json({
        success: true,
        message: 'Tạo sản phẩm thành công',
        product
      });

    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo sản phẩm',
        error: error.message
      });
    }
  },

  // Admin: Update product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        short_description,
        long_description,
        category_id,
        brand_id,
        origin,
        material,
        original_price,
        sale_price,
        status,
        product_colors,
        product_sizes
      } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }

      // Update product
      await product.update({
        name,
        short_description,
        long_description,
        category_id,
        brand_id: brand_id || null,
        origin,
        material,
        original_price,
        sale_price: sale_price || null,
        status
      });

      // Update product colors
      if (product_colors) {
        await ProductColor.destroy({ where: { product_id: id } });
        if (product_colors.length > 0) {
          const productColorData = product_colors.map(pc => ({
            product_id: id,
            color_id: pc.color_id,
            image: pc.image || null
          }));
          await ProductColor.bulkCreate(productColorData);
        }
      }

      // Update product sizes
      if (product_sizes) {
        await ProductSize.destroy({ where: { product_id: id } });
        if (product_sizes.length > 0) {
          const productSizeData = product_sizes.map(ps => ({
            product_id: id,
            size_id: ps.size_id,
            original_price: ps.original_price,
            sale_price: ps.sale_price || null,
            quantity: ps.quantity || 0
          }));
          await ProductSize.bulkCreate(productSizeData);
        }
      }

      res.json({
        success: true,
        message: 'Cập nhật sản phẩm thành công'
      });

    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật sản phẩm',
        error: error.message
      });
    }
  },

  // Admin: Delete product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }

      await product.destroy();

      res.json({
        success: true,
        message: 'Xóa sản phẩm thành công'
      });

    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa sản phẩm',
        error: error.message
      });
    }
  },

  // Upload image
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Không có file được tải lên'
        });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'product_colors',
        resource_type: 'image'
      });

      res.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tải ảnh lên',
        error: error.message
      });
    }
  },

  // Get categories
  async getCategories(req, res) {
    try {
      const categories = await Category.findAll({
        where: { status: 'active' },
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        categories
      });
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách danh mục',
        error: error.message
      });
    }
  },

  // Get brands
  async getBrands(req, res) {
    try {
      const brands = await Brand.findAll({
        where: { status: 'active' },
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        brands
      });
    } catch (error) {
      console.error('Error getting brands:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách thương hiệu',
        error: error.message
      });
    }
  },

  // Get colors
  async getColors(req, res) {
    try {
      const colors = await Color.findAll({
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        colors
      });
    } catch (error) {
      console.error('Error getting colors:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách màu sắc',
        error: error.message
      });
    }
  },

  // Get sizes
  async getSizes(req, res) {
    try {
      const sizes = await Size.findAll({
        order: [['name', 'ASC']]
      });      res.json({
        success: true,
        sizes
      });
    } catch (error) {
      console.error('Error getting sizes:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách kích thước',
        error: error.message
      });
    }
  },
  // Public: Get products (for frontend)
  async getProducts(req, res) {
    try {
      const { 
        page = 1, 
        limit = 12, 
        search = '', 
        category = '', 
        brand = '', 
        material = '', 
        origin = '', 
        sortBy = 'created_at', 
        order = 'DESC' 
      } = req.query;
      
      const offset = (page - 1) * limit;

      const whereConditions = { status: 'active' };
      
      // Search filter
      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { short_description: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      // Category filter
      if (category) {
        whereConditions.category_id = category;
      }

      // Brand filter
      if (brand) {
        whereConditions.brand_id = brand;
      }

      // Material filter
      if (material) {
        whereConditions.material = { [Op.like]: `%${material}%` };
      }

      // Origin filter
      if (origin) {
        whereConditions.origin = { [Op.like]: `%${origin}%` };
      }

      // Determine sort order
      let orderArray = [['created_at', 'DESC']]; // default
      
      if (sortBy) {
        const validSortFields = ['created_at', 'name', 'original_price', 'sale_price', 'view_count'];
        const validOrders = ['ASC', 'DESC'];
        
        if (validSortFields.includes(sortBy) && validOrders.includes(order.toUpperCase())) {
          orderArray = [[sortBy, order.toUpperCase()]];
        }
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Category,
            attributes: ['id', 'name']
          },
          {
            model: Brand,
            attributes: ['id', 'name']
          },
          {
            model: ProductColor,
            as: 'ProductColors',
            include: [{
              model: Color,
              attributes: ['id', 'name', 'hex_code']
            }]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: orderArray,
        distinct: true
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        rows: products, // Change from 'products' to 'rows' to match frontend expectation
        count: count,   // Add count field
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      });

    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách sản phẩm',
        error: error.message
      });
    }
  },

  // Public: Get best selling products
  async getBestSellingProducts(req, res) {
    try {
      const { limit = 8 } = req.query;

      const products = await Product.findAll({
        where: { status: 'active' },
        include: [
          {
            model: Category,
            attributes: ['id', 'name']
          },
          {
            model: Brand,
            attributes: ['id', 'name']
          },
          {
            model: ProductColor,
            as: 'ProductColors',
            include: [{
              model: Color,
              attributes: ['id', 'name', 'hex_code']
            }]
          }
        ],
        limit: parseInt(limit),
        order: [['view_count', 'DESC']]
      });

      res.json({
        success: true,
        products
      });

    } catch (error) {
      console.error('Error getting best selling products:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy sản phẩm bán chạy',
        error: error.message
      });
    }
  },

  // Public: Get newest products
  async getNewestProducts(req, res) {
    try {
      const { limit = 8 } = req.query;

      const products = await Product.findAll({
        where: { status: 'active' },
        include: [
          {
            model: Category,
            attributes: ['id', 'name']
          },
          {
            model: Brand,
            attributes: ['id', 'name']
          },
          {
            model: ProductColor,
            as: 'ProductColors',
            include: [{
              model: Color,
              attributes: ['id', 'name', 'hex_code']
            }]
          }
        ],
        limit: parseInt(limit),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        products
      });

    } catch (error) {
      console.error('Error getting newest products:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy sản phẩm mới',
        error: error.message
      });
    }
  },

  // Public: Get featured products
  async getFeaturedProducts(req, res) {
    try {
      const { limit = 8 } = req.query;

      const products = await Product.findAll({
        where: { 
          status: 'active',
          sale_price: { [Op.not]: null }
        },
        include: [
          {
            model: Category,
            attributes: ['id', 'name']
          },
          {
            model: Brand,
            attributes: ['id', 'name']
          },
          {
            model: ProductColor,
            as: 'ProductColors',
            include: [{
              model: Color,
              attributes: ['id', 'name', 'hex_code']
            }]
          }
        ],
        limit: parseInt(limit),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        products
      });    } catch (error) {
      console.error('Error getting featured products:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy sản phẩm nổi bật',
        error: error.message
      });
    }
  },

  // Public: Get single product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findOne({
        where: { 
          id,
          status: 'active' 
        },
        include: [
          {
            model: Category,
            attributes: ['id', 'name', 'description']
          },
          {
            model: Brand,
            attributes: ['id', 'name', 'description']
          },
          {
            model: ProductColor,
            as: 'ProductColors',
            include: [{
              model: Color,
              attributes: ['id', 'name', 'hex_code']
            }]
          },
          {
            model: ProductSize,
            as: 'ProductSizes',
            include: [{
              model: Size,
              attributes: ['id', 'name']
            }]
          }
        ]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }

      // Tăng view count
      await product.increment('view_count');

      res.json({
        success: true,
        product
      });

    } catch (error) {
      console.error('Error getting product by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin sản phẩm',
        error: error.message
      });
    }
  }
};

module.exports = productController;