const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    default: "Earth"
  },
  orbit: {
    type: Number,
    default: 365
  },
  size: {
    type: Number,
    default: 12742
  }
})

const Planet = mongoose.model('Planet', planetSchema);

module.exports = Planet;
