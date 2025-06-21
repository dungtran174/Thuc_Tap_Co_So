const db = require('../models');
const UserAddress = db.UserAddress;

exports.getUserAddresses = async (req, res) => {
  const addresses = await UserAddress.findAll({ 
    where: { 
      user_id: req.user.id 
    } 
  }); 
  res.json({ 
    success: true, 
    addresses 
  });
};

exports.addUserAddress = async (req, res) => {
  const { recipient_name, recipient_phone, address, is_default } = req.body;
  if (is_default) {
    await UserAddress.update({ 
      is_default: false 
    }, { 
      where: { user_id: req.user.id } 
    });
  }
  const addr = await UserAddress.create({
    user_id: req.user.id, 
    recipient_name, 
    recipient_phone, 
    address, 
    is_default: !!is_default
  });
  res.json({ 
    success: true, 
    address: addr 
  });
};

exports.updateUserAddress = async (req, res) => {
  const { id } = req.params;
  const { recipient_name, recipient_phone, address, is_default } = req.body;
  const addr = await UserAddress.findOne({ 
    where: { id, user_id: req.user.id } 
  });
  if (!addr) return res.status(404).json({ 
    success: false, 
    message: 'Address not found' 
  });
  if (is_default) {
    await UserAddress.update({ is_default: false }, 
      { where: { user_id: req.user.id } }
    );
  }
  Object.assign(addr, { 
    recipient_name, 
    recipient_phone, 
    address, 
    is_default: !!is_default 
  });
  await addr.save();
  res.json({ 
    success: true, 
    address: addr 
  });
};

exports.deleteUserAddress = async (req, res) => {
  const { id } = req.params;
  const addr = await UserAddress.findOne({ where: { id, user_id: req.user.id } });
  if (!addr) return res.status(404).json({ 
    success: false, 
    message: 'Address not found' 
  });
  await addr.destroy();
  res.json({ success: true });
};

exports.setDefaultUserAddress = async (req, res) => {
  const { id } = req.params;
  await UserAddress.update({ is_default: false }, { where: { user_id: req.user.id } });
  const addr = await UserAddress.findOne({ where: { id, user_id: req.user.id } });
  if (!addr) return res.status(404).json({ 
    success: false, 
    message: 'Address not found' 
  });
  addr.is_default = true;
  await addr.save();
  res.json({ 
    success: true, 
    address: addr 
  });
};