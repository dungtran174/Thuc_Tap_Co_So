const db = require('../models');
const Category = db.Category;

// Public endpoints
exports.getAllCategories = async (req, res) => {
  try {
    // Nếu là admin (có token), trả về tất cả categories
    // Nếu là public, chỉ trả về active categories
    let whereCondition = {};
    
    // Kiểm tra có token admin không
    if (req.user && req.user.role && req.user.role.includes('admin')) {
      console.log('Admin fetching all categories (including inactive)');
      // Admin xem tất cả
    } else {
      console.log('Public fetching active categories only');
      whereCondition = { status: 'active' };
    }
      const categories = await Category.findAll({ 
      where: whereCondition,
      order: [['created_at', 'DESC']]
    });
    
    console.log(`Found ${categories.length} categories`);
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching category', error: error.message });
  }
};

// Admin endpoints
exports.getAllAdmin = async (req, res) => {
  try {
    console.log('Admin fetching all categories (including inactive)');    const categories = await Category.findAll({
      order: [['created_at', 'DESC']]
    });
    console.log(`Found ${categories.length} categories for admin`);
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error in getAllAdmin:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories for admin', error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    console.log('Admin creating category:', req.body);
    const { name, description, status = 'active' } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const category = await Category.create({ 
      name: name.trim(), 
      description: description ? description.trim() : '', 
      status 
    });
    console.log('Category created successfully:', category.id);
    res.json({ success: true, category });
  } catch (error) {
    console.error('Error in createAdmin:', error);
    res.status(500).json({ success: false, message: 'Error creating category', error: error.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    console.log('Admin updating category:', req.params.id, req.body);
    const { name, description, status } = req.body;
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      console.log('Category not found:', req.params.id);
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    
    Object.assign(category, { 
      name: name.trim(), 
      description: description ? description.trim() : category.description, 
      status: status || category.status 
    });
    await category.save();
    console.log('Category updated successfully:', category.id);
    res.json({ success: true, category });
  } catch (error) {
    console.error('Error in updateAdmin:', error);
    res.status(500).json({ success: false, message: 'Error updating category', error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    console.log('Admin deleting category:', req.params.id);
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      console.log('Category not found for deletion:', req.params.id);
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    await category.destroy();
    console.log('Category deleted successfully:', req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAdmin:', error);
    res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
  }
};

// Legacy endpoints (keeping for backward compatibility)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating category', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    
    Object.assign(category, { name, description, status });
    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    
    await category.destroy();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
  }
};