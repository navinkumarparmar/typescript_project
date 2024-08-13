import mongoose from 'mongoose';
interface ProductDocument extends mongoose.Document {
  name: string;
  price: number;
  ShopID: mongoose.Types.ObjectId;
  image?: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}


const ProductSchema = new mongoose.Schema<ProductDocument>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  ShopID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
 
}, { timestamps: true });

const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema);

export default ProductModel;
