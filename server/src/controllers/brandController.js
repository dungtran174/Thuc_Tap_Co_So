const db = require('../models');
const Brand = db.Brand;

exports.getAllBrands = async (req, res) => {
  try {
    // Nếu là admin (có token), trả về tất cả brands
    // Nếu là public, chỉ trả về active brands
    let whereCondition = {};
    
    // Kiểm tra có token admin không
    if (req.user && req.user.role && req.user.role.includes('admin')) {
      console.log('Admin fetching all brands (including inactive)');
      // Admin xem tất cả
    } else {
      console.log('Public fetching active brands only');
      whereCondition = { status: 'active' };
    }
    
    const brands = await Brand.findAll({ 
      where: whereCondition,
      order: [['created_at', 'DESC']]
    });
    
    console.log(`Found ${brands.length} brands`);
    res.json({ success: true, brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ success: false, message: 'Error fetching brands', error: error.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, brand });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching brand', error: error.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    console.log('Creating brand:', req.body);
    const { name, description, status = 'active' } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Brand name is required' });
    }
    
    const brand = await Brand.create({ 
      name: name.trim(), 
      description: description ? description.trim() : '', 
      status 
    });
    
    console.log('Brand created successfully:', brand.id);
    res.json({ success: true, brand });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({ success: false, message: 'Error creating brand', error: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    console.log('Updating brand:', req.params.id, req.body);
    const { name, description, status } = req.body;
    const brand = await Brand.findByPk(req.params.id);
    
    if (!brand) {
      console.log('Brand not found:', req.params.id);
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Brand name is required' });
    }
    
    Object.assign(brand, { 
      name: name.trim(), 
      description: description ? description.trim() : brand.description, 
      status: status || brand.status 
    });
    await brand.save();
    
    console.log('Brand updated successfully:', brand.id);
    res.json({ success: true, brand });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ success: false, message: 'Error updating brand', error: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    console.log('Deleting brand:', req.params.id);
    const brand = await Brand.findByPk(req.params.id);
    
    if (!brand) {
      console.log('Brand not found for deletion:', req.params.id);
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    
    await brand.destroy();
    console.log('Brand deleted successfully:', req.params.id);
    res.json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ success: false, message: 'Error deleting brand', error: error.message });
  }
};