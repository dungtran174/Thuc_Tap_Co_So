const db = require('../models');
const Color = db.Color;

exports.getAllColors = async (req, res) => {
  const colors = await Color.findAll();
  res.json({ success: true, colors });
};