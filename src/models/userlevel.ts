import mongoose from 'mongoose';

  
interface userLevelDocument extends mongoose.Document {

    name: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;


}



const UserSchemaLevel = new mongoose.Schema <userLevelDocument>({
  name: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const UserLevelModel = mongoose.model<userLevelDocument>('UserLevel', UserSchemaLevel);

export default UserLevelModel;
