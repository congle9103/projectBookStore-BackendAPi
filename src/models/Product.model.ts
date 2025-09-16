import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
        unique: true,
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category', 
        required: true
    },
    isNew: {
        type: Boolean,
        default: false
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    isFlashSale: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        required: true,
        maxLength: 255
    },
    thumbnails: {
        type: [String],
        required: false,
        trim: true, // Loại bỏ khoảng trắng thừa
        maxLength: 255 // Đặt độ dài tối đa cho thumbnail
    },
    supplier: { // Nhà cung cấp
        type: String,
        required: true,
        maxLength: 255
    },
    publisher: { // Nhà xuất bản
        type: String,
        required: true,
        maxLength: 255
    },
    authors: { // Tác giả (có thể nhiều, nên dùng mảng)
        type: [String],
        required: true
    },
    length: { // Độ dài (số trang)
        type: Number,
        required: false
    },
    price: { // Giá bán hiện tại
        type: Number,
        required: true
    },
    originalPrice: { // Giá gốc
        type: Number,
        required: false
    },
    discountPercent: { // % giảm
        type: Number,
        required: false
    },
    publicationYear: { // Năm XB
        type: Number,
        required: false
    },
    language: { // Ngôn ngữ
        type: String,
        required: false,
        maxLength: 100
    },
    weight: { // Trọng lượng (gr)
        type: Number,
        required: false
    },
    dimensions: { // Kích thước bao bì
        type: String,
        required: false,
        maxLength: 100
    },
    pages: { // Số trang
        type: Number,
        required: false
    },
    format: { // Hình thức (Bìa mềm, bìa cứng,…)
        type: String,
        required: false,
        maxLength: 100
    }
}, {
    timestamps: true, // Tự động thêm createdAt, updatedAt
    versionKey: false // Tắt __v
});

const Product = model('Product', productSchema);

export default Product;
