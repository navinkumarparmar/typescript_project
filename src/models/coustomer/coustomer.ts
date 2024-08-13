import mongoose from 'mongoose';

interface CoustomerDocument extends mongoose.Document {
  UserID: {
    _id: mongoose.Types.ObjectId;
    name: string;
    gender: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  },
  ProductID: {
    _id: mongoose.Types.ObjectId;
    name: string;
    price: number;
    image: string;
    ShopID: {
      _id: mongoose.Types.ObjectId; 
      name: string;
    },
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  },
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}



const CoustomerSchema = new mongoose.Schema<CoustomerDocument>({
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ProductID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  }, { timestamps: true });
  
  const CoustomerModel = mongoose.model<CoustomerDocument>('Coustomer', CoustomerSchema);
  
  export default CoustomerModel;
  