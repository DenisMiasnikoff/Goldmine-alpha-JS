const User = require('./../models/userModel');

// HELPER: Filter out unwanted fields (like 'role' or 'password')
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// 1. Get Current User Data
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("inventory");

    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }
    // You might want to populate virtuals here later (like items)
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

// 2. Update User Details (Name, Email)
exports.updateMe = async (req, res, next) => {
  try {
    // A) Create error if user POSTs password data
    if (req.body.password || req.body.confirmpassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password updates. Please use /updateMyPassword.'
      });
    }

    // B) Filtered out unwanted field names that are not allowed to be updated
    // We only allow 'name' and 'email' for now. NOT 'role', 'gems', etc.
    const filteredBody = filterObj(req.body, 'username', 'email');

    // C) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// 3. Delete User (Soft Delete)
exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};