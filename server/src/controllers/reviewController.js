const db = require('../models');
const { Review, User, Product } = db;

exports.getReviewsByProductId = async (req, res) => {
  try {
    const { product_id } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { count, rows } = await Review.findAndCountAll({
      where: { product_id },
      include: [{
        model: User,
        attributes: ['id', 'username', 'first_name', 'last_name', 'avatar']
      }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    // Calculate average rating
    const allReviews = await Review.findAll({
      where: { product_id },
      attributes: ['rating']
    });

    const averageRating = allReviews.length > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
      : 0;

    // Rating distribution
    const ratingDistribution = {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length
    };

    res.json({
      success: true,
      reviews: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      },
      statistics: {
        totalReviews: allReviews.length,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { product_id, rating, title, comment } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!product_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, rating, and comment are required'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: {
        user_id,
        product_id
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create review
    const review = await Review.create({
      user_id,
      product_id,
      rating,
      title: title || null,
      comment
    });

    // Fetch the created review with user info
    const createdReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'first_name', 'last_name', 'avatar']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: createdReview
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const user_id = req.user.id;

    // Find review
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Update review
    await review.update({
      rating: rating || review.rating,
      title: title !== undefined ? title : review.title,
      comment: comment || review.comment
    });

    // Fetch updated review with user info
    const updatedReview = await Review.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'first_name', 'last_name', 'avatar']
      }]
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Find review
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is admin
    const user = await User.findByPk(user_id, {
      include: [{
        model: db.Role,
        through: { attributes: [] }
      }]
    });

    const isAdmin = user.Roles?.some(role => role.name === 'admin');
    
    if (review.user_id !== user_id && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    // Delete review
    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'first_name', 'last_name', 'avatar']
        },
        {
          model: Product,
          attributes: ['id', 'name', 'image_url']
        }
      ]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message
    });
  }
};