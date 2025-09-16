import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Tham chiếu đến model Product
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Giá tại thời điểm đặt hàng
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true,
    versionKey: false
});

const OrderItem = model('OrderItem', orderItemSchema);
export default OrderItem;
