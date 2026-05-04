const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An item must have a name'],
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'An item must have a price']
  },
  description: {
    type: String,
    required: [true, 'An item must have a description']
  },
  image: {
    type: String,
    default: 'default-item.jpg' 
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;