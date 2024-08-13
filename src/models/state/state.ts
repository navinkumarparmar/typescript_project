import mongoose from 'mongoose';


interface StateDocument extends mongoose.Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}



const StateSchema = new mongoose.Schema<StateDocument>({
  name: {
    type: String,
    required: true,
  }

}, { timestamps: true });

 
const StateModel = mongoose.model<StateDocument>('State', StateSchema);


export default StateModel;
