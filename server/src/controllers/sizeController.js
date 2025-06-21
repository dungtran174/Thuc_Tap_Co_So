const db = require('../models');
const Size = db.Size;

exports.getAllSizes = async (req, res) => {
  const sizes = await Size.findAll();
  res.json({ success: true, sizes });
};