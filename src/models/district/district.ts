import mongoose from 'mongoose';


interface DistrictDocument extends mongoose.Document {
  name: string;

  StateID: {
    _id: mongoose.Types.ObjectId;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}



const DistrictSchema = new mongoose.Schema<DistrictDocument>({
  name: {
    type: String,
    required: true,
    unique: true
  },

  StateID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true,
  },
}, { timestamps: true });

 
const DistrictModel = mongoose.model<DistrictDocument>('District', DistrictSchema);


export default DistrictModel;
