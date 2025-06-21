const { Cart, CartDetail, Product, Color, Size, ProductSize, Category, Brand, ProductColor } = require('../models');
const { Op } = require('sequelize');

const cartController = {
  // Lấy chi tiết giỏ hàng của người dùng
  async getCart(req, res) {
    try {
      const userId = req.user.id;

      // Tìm giỏ hàng của user
      let cart = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartDetail,
            as: 'CartDetails',
            include: [
              {
                model: Product,
                as: 'Product',
                include: [
                  { 
                    model: Category, 
                    as: 'Category' 
                  },
                  { 
                    model: Brand, 
                    as: 'Brand' 
                  },
                  {
                    model: ProductColor,
                    as: 'ProductColors',
                  }
                ]
              },
              { 
                model: Color, 
                as: 'Color' 
              },
              { 
                model: Size, 
                as: 'Size' 
              }
            ]
          }
        ]
      });

      // Nếu chưa có giỏ hàng, tạo mới
      if (!cart) {
        cart = await Cart.create({
          user_id: userId,
          total_amount: 0
        });
        cart.CartDetails = [];
      }

      res.json({
        success: true,
        cart: {
          id: cart.id,
          user_id: cart.user_id,
          total_amount: parseFloat(cart.total_amount),
          items: cart.CartDetails || [],
          created_at: cart.created_at,
          updated_at: cart.updated_at
        }
      });
    } catch (error) {
      console.error('Error getting cart:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi lấy giỏ hàng',
        error: error.message
      });
    }
  },

  // Thêm sản phẩm vào giỏ hàng
  async addItemToCart(req, res) {
    try {
      const userId = req.user.id;
      const { product_id, color_id, size_id, quantity } = req.body;

      // Validate input
      if (!product_id || !quantity) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin sản phẩm hoặc số lượng'
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng phải lớn hơn 0'
        });
      }

      // Kiểm tra sản phẩm tồn tại
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại'
        });
      }

      // Lấy thông tin giá và số lượng tồn kho từ ProductSize
      let unit_price = product.sale_price || product.original_price;
      let availableQuantity = null;

      if (size_id) {
        const productSize = await ProductSize.findOne({
          where: {
            product_id,
            size_id
          }
        });

        if (!productSize) {
          return res.status(404).json({
            success: false,
            message: 'Kích thước sản phẩm không tồn tại'
          });
        }

        // Ưu tiên giá từ ProductSize
        unit_price = productSize.sale_price || productSize.original_price;
        availableQuantity = productSize.quantity;

        if (availableQuantity < quantity) {
          return res.status(400).json({
            success: false,
            message: `Chỉ còn ${availableQuantity} sản phẩm trong kho`
          });
        }
      }

      // Tìm hoặc tạo giỏ hàng
      let cart = await Cart.findOne({
        where: { user_id: userId }
      });

      if (!cart) {
        cart = await Cart.create({
          user_id: userId,
          total_amount: 0
        });
      }

      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const whereCondition = {
        cart_id: cart.id,
        product_id
      };

      if (color_id) whereCondition.color_id = color_id;
      if (size_id) whereCondition.size_id = size_id;

      let cartDetail = await CartDetail.findOne({
        where: whereCondition
      });

      if (cartDetail) {
        // Cập nhật số lượng nếu sản phẩm đã có
        const newQuantity = cartDetail.quantity + quantity;
        
        if (availableQuantity !== null && availableQuantity < newQuantity) {
          return res.status(400).json({
            success: false,
            message: `Chỉ còn ${availableQuantity} sản phẩm trong kho`
          });
        }

        cartDetail.quantity = newQuantity;
        cartDetail.unit_price = unit_price; // Cập nhật giá mới nhất
        cartDetail.total_price = newQuantity * unit_price;
        await cartDetail.save();
      } else {
        // Thêm mới sản phẩm vào giỏ
        cartDetail = await CartDetail.create({
          cart_id: cart.id,
          product_id,
          color_id: color_id || null,
          size_id: size_id || null,
          quantity,
          unit_price,
          total_price: quantity * unit_price
        });
      }

      // Cập nhật tổng tiền giỏ hàng
      const cartTotal = await CartDetail.sum('total_price', {
        where: { cart_id: cart.id }
      });

      cart.total_amount = cartTotal || 0;
      await cart.save();

      // Lấy thông tin chi tiết sản phẩm vừa thêm
      const updatedCartDetail = await CartDetail.findByPk(cartDetail.id, {
        include: [
          {
            model: Product,
            as: 'Product',
            include: [
              { model: Category, as: 'Category' },
              { model: Brand, as: 'Brand' }
            ]
          },
          { model: Color, as: 'Color' },
          { model: Size, as: 'Size' }
        ]
      });

      res.json({
        success: true,
        message: 'Đã thêm sản phẩm vào giỏ hàng',
        cartDetail: updatedCartDetail,
        cart_total: parseFloat(cart.total_amount)
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng',
        error: error.message
      });
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ
  async updateCartItemQuantity(req, res) {
    try {
      const userId = req.user.id;
      const cartDetailId = req.params.id;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng phải lớn hơn 0'
        });
      }

      // Tìm cart detail
      const cartDetail = await CartDetail.findOne({
        where: { id: cartDetailId },
        include: [
          {
            model: Cart,
            as: 'Cart',
            where: { user_id: userId }
          }
        ]
      });

      if (!cartDetail) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại trong giỏ hàng'
        });
      }

      // Kiểm tra số lượng tồn kho nếu có size
      if (cartDetail.size_id) {
        const productSize = await ProductSize.findOne({
          where: {
            product_id: cartDetail.product_id,
            size_id: cartDetail.size_id
          }
        });

        if (!productSize || productSize.quantity < quantity) {
          return res.status(400).json({
            success: false,
            message: `Chỉ còn ${productSize?.quantity || 0} sản phẩm trong kho`
          });
        }
      }

      // Cập nhật số lượng
      cartDetail.quantity = quantity;
      cartDetail.total_price = quantity * cartDetail.unit_price;
      await cartDetail.save();

      // Cập nhật tổng tiền giỏ hàng
      const cartTotal = await CartDetail.sum('total_price', {
        where: { cart_id: cartDetail.cart_id }
      });

      await Cart.update(
        { total_amount: cartTotal || 0 },
        { where: { id: cartDetail.cart_id } }
      );

      res.json({
        success: true,
        message: 'Đã cập nhật số lượng sản phẩm',
        cartDetail,
        cart_total: parseFloat(cartTotal || 0)
      });
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật số lượng',
        error: error.message
      });
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  async removeCartItem(req, res) {
    try {
      const userId = req.user.id;
      const cartDetailId = req.params.id;

      // Tìm cart detail
      const cartDetail = await CartDetail.findOne({
        where: { id: cartDetailId },
        include: [
          {
            model: Cart,
            as: 'Cart',
            where: { user_id: userId }
          }
        ]
      });

      if (!cartDetail) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại trong giỏ hàng'
        });
      }

      const cartId = cartDetail.cart_id;

      // Xóa sản phẩm
      await cartDetail.destroy();

      // Cập nhật tổng tiền giỏ hàng
      const cartTotal = await CartDetail.sum('total_price', {
        where: { cart_id: cartId }
      });

      await Cart.update(
        { total_amount: cartTotal || 0 },
        { where: { id: cartId } }
      );

      res.json({
        success: true,
        message: 'Đã xóa sản phẩm khỏi giỏ hàng',
        cart_total: parseFloat(cartTotal || 0)
      });
    } catch (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi xóa sản phẩm',
        error: error.message
      });
    }
  },

  // Xóa toàn bộ giỏ hàng
  async clearCart(req, res) {
    try {
      const userId = req.user.id;

      const cart = await Cart.findOne({
        where: { user_id: userId }
      });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Giỏ hàng không tồn tại'
        });
      }

      // Xóa tất cả cart details
      await CartDetail.destroy({
        where: { cart_id: cart.id }
      });

      // Cập nhật tổng tiền về 0
      cart.total_amount = 0;
      await cart.save();

      res.json({
        success: true,
        message: 'Đã xóa toàn bộ giỏ hàng'
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi xóa giỏ hàng',
        error: error.message
      });
    }
  }
};

module.exports = cartController;