const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Код маршрута обязателен'],
    unique: true,
    maxlength: [20, 'Код должен быть не более 20 символов'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Название маршрута обязательно'],
    maxlength: [200, 'Название должно быть не более 200 символов'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  durationDays: {
    type: Number,
    required: [true, 'Длительность обязательна'],
    min: [1, 'Длительность должна быть не менее 1 дня'],
    default: 1
  },
  price: {
    type: Number,
    required: [true, 'Цена обязательна'],
    min: [0, 'Цена не может быть отрицательной'],
    default: 0
  },
  imageUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'ID страны обязателен']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

routeSchema.index({ code: 1 });
routeSchema.index({ countryId: 1 });
routeSchema.index({ isActive: 1 });

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;