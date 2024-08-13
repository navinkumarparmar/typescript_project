import mongoose from 'mongoose';


interface ShopDocument extends mongoose.Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}



const ShopSchema = new mongoose.Schema<ShopDocument>({
  name: {
    type: String,
    required: true,
  },

}, { timestamps: true });

 
const ShopModel = mongoose.model<ShopDocument>('Shop', ShopSchema);


export default ShopModel;
