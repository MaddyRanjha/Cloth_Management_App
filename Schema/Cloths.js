const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const { date, boolean } = require('joi');

const clothSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  date: { type: String, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'users', required: true },
  sharedWith: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
});

const Cloth = mongoose.model('cloths', clothSchema);

module.exports = { Cloth };
