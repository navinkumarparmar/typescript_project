import mongoose from 'mongoose';


interface CityDocument extends mongoose.Document {
  name: string;

  DistrictID: {
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



const CitySchema = new mongoose.Schema<CityDocument>({
  name: {
    type: String,
    required: true,
    unique:true
  },

  DistrictID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },
}, { timestamps: true });

 
const CityModel = mongoose.model<CityDocument>('City', CitySchema);


export default CityModel;
