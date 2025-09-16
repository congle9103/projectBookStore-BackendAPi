import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer', // Tham chiếu đến khách hàng
    required: true
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff', // Nhân viên xử lý đơn
    required: false
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment_method: {
    type: String,
    enum: [
      'cash_on_delivery',
      'zalopay',
      'vnpay',
      'shopeepay',
      'momo',
      'atm',
      'visa'
    ],
    required: true
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  shipping_address: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255
  },
  notes: {
    type: String,
    required: false,
    maxLength: 500
  }
}, {
  timestamps: true,
  versionKey: false
});

const Order = model('Order', orderSchema);
export default Order;
