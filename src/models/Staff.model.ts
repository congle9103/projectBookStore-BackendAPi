import { Schema, model } from 'mongoose';

const staffSchema = new Schema({
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
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        match: [/^\d{10,15}$/, 'Số điện thoại không hợp lệ']
    },
    role: {
        type: String,
        enum: ['admin', 'dev'],
        default: 'dev'
    },
    salary: {
        type: Number,
        required: false,
        min: 0
    },
    hire_date: {
        type: Date,
        default: Date.now // Ngày tuyển dụng mặc định là ngày tạo
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Staff = model('Staff', staffSchema);
export default Staff;
