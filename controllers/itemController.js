const Item = require('./../models/itemModel');
const User = require('./../models/userModel'); // We need this to update the user's wallet

// 1. Get All Items (The Shop Catalog)
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find();

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: { items }
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

// 2. Create Item (Admin only - to stock the shelves)
exports.createItem = async (req, res, next) => {
  try {
    const newItem = await Item.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { item: newItem }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// 3. BUY ITEM (The Transaction Logic) 💰
exports.buyItem = async (req, res, next) => {
  try {
    const itemToBuy = await Item.findById(req.params.itemId);
    if (!itemToBuy) return res.status(404).json({ message: 'Item not found' });

    const user = await User.findById(req.user.id);

    // 🚨 SAFETY CHECK 1: If backpack is missing, give them one.
    if (!user.inventory) {
      user.inventory = [];
    }

    // 🚨 SAFETY CHECK 2: If gems are missing/undefined, default to 0
    if (user.gems === undefined) {
      user.gems = 0; 
    }

    // Check Balance
    if (user.gems < itemToBuy.price) {
      return res.status(400).json({ status: 'fail', message: 'Not enough gems!' });
    }

    // The Transaction
    user.gems -= itemToBuy.price;
    user.inventory.push(itemToBuy._id); // <--- This is where it was crashing

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        gems: user.gems,
        inventory: user.inventory
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};