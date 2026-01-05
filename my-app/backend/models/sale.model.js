const mongoose = require('mongoose');
const validator = require('validator');

const saleSchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: [true, 'Цель поездки обязательна'],
    enum: {
      values: ['отдых', 'экскурсия', 'лечение', 'шоп-тур', 'обучение', 'деловая'],
      message: 'Недопустимая цель поездки'
    }
  },
  price: {
    type: Number,
    required: [true, 'Цена обязательна'],
    min: [0, 'Цена не может быть отрицательной'],
    default: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Количество обязательно'],
    min: [1, 'Количество должно быть не меньше 1'],
    default: 1
  },
  saleDate: {
    type: Date,
    required: [true, 'Дата продажи обязательна'],
    default: Date.now
  },
  customerName: {
    type: String,
    required: [true, 'Имя клиента обязательно'],
    maxlength: [200, 'Имя должно быть не более 200 символов'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Email клиента обязателен'],
    validate: {
      validator: validator.isEmail,
      message: 'Недопустимый email'
    },
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled', 'completed'],
      message: 'Недопустимый статус'
    },
    default: 'confirmed'
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: [true, 'ID маршрута обязателен']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

saleSchema.index({ saleDate: -1 });
saleSchema.index({ status: 1 });
saleSchema.index({ routeId: 1 });
saleSchema.index({ customerEmail: 1 });

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;