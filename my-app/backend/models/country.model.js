const mongoose = require('mongoose');
const validator = require('validator');

const countrySchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Код страны обязателен'],
    unique: true,
    minlength: [2, 'Код должен быть не менее 2 символов'],
    maxlength: [10, 'Код должен быть не более 10 символов'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Название страны обязательно'],
    maxlength: [100, 'Название должно быть не более 100 символов'],
    trim: true
  },
  visaCost: {
    type: Number,
    required: [true, 'Стоимость визы обязательна'],
    min: [0, 'Стоимость визы не может быть отрицательной'],
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  flagImage: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v || v.trim() === '') return true;
        return validator.isURL(v);
      },
      message: 'Недопустимый URL для флага'
    },
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

countrySchema.index({ code: 1 });
countrySchema.index({ name: 1 });

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;