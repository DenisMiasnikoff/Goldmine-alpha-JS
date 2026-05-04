const express = require('express');
const itemController = require('./../controllers/itemController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/')
  .get(itemController.getAllItems) // Anyone can look at the shop
  .post(authController.protect, itemController.createItem); // Only logged in users (or admins) can create items

// The "Buy" Button
router.post('/buy/:itemId', authController.protect, itemController.buyItem);

module.exports = router;