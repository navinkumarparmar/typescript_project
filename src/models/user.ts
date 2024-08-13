import mongoose from 'mongoose';

 interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  gender: string;
  password: string;
  UserRole: {
    _id: mongoose.Types.ObjectId;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  },
  DistrictID: {
    type: mongoose.Schema.Types.ObjectId;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  },
  otp: string; 
  isVerified: boolean;   
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const UserSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  UserRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserLevel',
    required: true,
  },
  DistrictID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },
  otp: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
 
}, { timestamps: true });

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;
