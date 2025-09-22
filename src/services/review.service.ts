import createError from "http-errors";
import Review from "../models/Review.model";
import Product from "../models/Product.model";
import Customer from "../models/Customer.model";

// Lấy tất cả review
const findAll = async () => {
  return await Review.find()
    .populate("customer", "username full_name avatar")
    .populate("book", "product_name slug");
};

// Lấy review theo id
const findById = async (id: string) => {
  const review = await Review.findById(id)
    .populate("customer", "username full_name avatar")
    .populate("book", "product_name slug");

  if (!review) {
    throw createError(404, "Review not found");
  }
  return review;
};

// Tạo review mới
const create = async (payload: any) => {
  // Kiểm tra customer tồn tại
  const customer = await Customer.findById(payload.customer);
  if (!customer) {
    throw createError(404, "Customer not found");
  }

  // Kiểm tra product tồn tại
  const product = await Product.findById(payload.book);
  if (!product) {
    throw createError(404, "Product not found");
  }

  const newReview = new Review({
    customer: payload.customer,
    book: payload.book,
    rating: payload.rating,
    comment: payload.comment,
  });

  await newReview.save();

  // Cập nhật lại ratingsQuantity và ratingsAverage trong Product
  const stats = await Review.aggregate([
    { $match: { book: product._id } },
    {
      $group: {
        _id: "$book",
        avgRating: { $avg: "$rating" },
        nRating: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    product.ratingsAverage = stats[0].avgRating;
    product.ratingsQuantity = stats[0].nRating;
  } else {
    product.ratingsAverage = 0;
    product.ratingsQuantity = 0;
  }
  await product.save();

  return newReview;
};

// Cập nhật review
const updateById = async (id: string, payload: any) => {
  const review = await findById(id);
  Object.assign(review, payload);
  await review.save();
  return review;
};

// Xóa review
const deleteById = async (id: string) => {
  const review = await findById(id);
  await Review.findByIdAndDelete(review._id);

  // Sau khi xóa thì cập nhật lại product rating
  const product = await Product.findById(review.book);
  if (product) {
    const stats = await Review.aggregate([
      { $match: { book: product._id } },
      {
        $group: {
          _id: "$book",
          avgRating: { $avg: "$rating" },
          nRating: { $sum: 1 },
        },
      },
    ]);
    if (stats.length > 0) {
      product.ratingsAverage = stats[0].avgRating;
      product.ratingsQuantity = stats[0].nRating;
    } else {
      product.ratingsAverage = 0;
      product.ratingsQuantity = 0;
    }
    await product.save();
  }

  return review;
};

export default {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
