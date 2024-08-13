import mongoose from 'mongoose';
interface ProductReviewDocument extends mongoose.Document {
    productId: mongoose.Types.ObjectId;
    UserId:mongoose.Schema.Types.ObjectId,
    review: string;
    rating?: number;
}



interface ProductReviewDocument extends mongoose.Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  review: string;
  rating?: number;
}

const ProductReviewSchema = new mongoose.Schema<ProductReviewDocument>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: false,
  },
}, { timestamps: true });

const ProductReviewModel = mongoose.model<ProductReviewDocument>('ProductReview', ProductReviewSchema);

export default ProductReviewModel;
