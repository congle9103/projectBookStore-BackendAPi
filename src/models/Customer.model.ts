import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
    full_name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'] // Regex validate email
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        match: [/^\d{10,15}$/, 'Số điện thoại không hợp lệ'] // chỉ cho phép 10-15 chữ số
    },
    address: {
        type: String,
        required: false,
        trim: true,
        maxLength: 255
    },
    date_of_birth: {
        type: Date,
        required: false
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'], // Giới tính chỉ được chọn 1 trong 3
        required: false
    },
    is_active: {
        type: Boolean,
        default: true // Mặc định khách hàng đang hoạt động
    }
}, {
    timestamps: true, // Tự động tạo createdAt, updatedAt
    versionKey: false
});

const Customer = model('Customer', customerSchema);
export default Customer;
