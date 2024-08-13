import { NextFunction, Request, Response } from 'express';
import User from '../models/user'
import District from '../models/district/district';
import mongoose from 'mongoose';
import moment from 'moment';
// const transporter = require('../../src/transporter')
const jwt = require('jsonwebtoken');
import bcrypt from 'bcrypt';
import {sendEmail} from '../../src/transporter'
import { isEmail } from 'class-validator';
const jwtSecretKey = process.env.jwtSecretKey;

import admin from '../firebase/firebaseconfig'


class UserController {

  public createUser = async (req: Request, res: Response) => {
    try {
      const { name, email, gender, password, UserRole, DistrictID } = req.body;
  
      const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };
  
      const isEmail = await User.find({ email });
  
      if (isEmail.length !== 0) {
        return res.status(400).json({
          message: 'Duplicate email entry',
        });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const otp = generateOTP();
  
      const user = new User({ name, email, gender, password: hashedPassword, UserRole, DistrictID, otp, isVerified: false });
      await user.save();
  
      sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}`);
  
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: 'User successfully created, OTP sent to email please verify',
      });
    } catch (error: any) {
      console.log(error.message);
  
      return res.status(400).json({
        message: 'Something went wrong',
        error: error.message,
      });
    }
  };

//   public createUserWithPhone = async (req: Request, res: Response) => {
//     try {
//       const { phoneNumber, password } = req.body;
  
//       const generateOTP = () => {
//         return Math.floor(100000 + Math.random() * 900000).toString();
//       };

//       const isPhone = await User.find({ phoneNumber });
  
//       if (isPhone.length !== 0) {
//         return res.status(400).json({
//           message: 'Duplicate phone number entry',
//         });
//       }
  
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(password, saltRounds);
//       const otp = generateOTP();

//       const user = new User({ phoneNumber, password: hashedPassword, otp, isVerified: false });
//       await user.save();
      
//       // Send OTP to the phone number using Firebase
//       const message = {
//         body: `Your OTP code is ${otp}`,
//         from: 'YourAppName', // Set this to your app name or phone number
//         to: phoneNumber
//       };

//       await admin.messaging().send({
//         notification: message
//       });

//       return res.status(200).json({
//         timeStamp: moment().unix(),
//         message: 'User successfully created, OTP sent to phone please verify',
//       });
//     } catch (error: any) {
//       console.log(error.message);
  
//       return res.status(400).json({
//         message: 'Something went wrong',
//         error: error.message,
//       });
//     }
//   };
// }
  
public createUserWithPhone = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;

    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };


    const isPhone = await User.find({ phoneNumber });
    

    if (isPhone.length !== 0) {
      return res.status(400).json({
        message: 'Duplicate phone number entry',
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const otp = generateOTP();

    const user = new User({ phoneNumber, password: hashedPassword, otp, isVerified: false });
    await user.save();
    
    // Send OTP to the phone number using Firebase
    const message = {
      data: {
        otp: otp,
      },
      token: phoneNumber
    };

    await admin.messaging().send(message);

    return res.status(200).json({
      timeStamp: moment().unix(),
      message: 'User successfully created, OTP sent to phone please verify',
    });
  } catch (error: any) {
    console.log(error.message);

    return res.status(400).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

  public forgetPassword = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const {email}  = req.body
  
    
      const user = await User.findOne({email:email});   
      console.log(user)
  
      if (!user) {
        return res.status(404).json({ message: 'your email is not register' });
      }
  
      const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };
  
      const otp = generateOTP();
      console.log(otp)
  
      user.otp = otp;
      await user.save();

  
      const emailSubject = 'Your OTP Code';
      const emailText = `Your OTP code for resetting your password is ${otp}.`;
   
      sendEmail(user.email, emailSubject, emailText);
  
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: 'OTP sent to email',
      });
    } catch (error: any) {
      console.error(error.message);
  
      return res.status(500).json({
        message: 'Something went wrong',
        error: error.message,
      });
    }
  };
  

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
    
      const { email, otp, newPassword } = req.body;

      const user = await User.findOne({email:email});
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
      user.password = hashedPassword;
      user.otp = ''; 
      await user.save();
  
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: 'Password successfully reset',
      });
    } catch (error: any) {
      console.error(error.message);
  
      return res.status(500).json({
        message: 'Something went wrong',
        error: error.message,
      });
    }
  };


  public CreateNewPassword = async(req: Request, res: Response,next: NextFunction)=>{

      try {
       
           const id = req.body.id;

           const {OldPassword,newPassword,conformNewPassword} = req.body;

           
          if(newPassword!==conformNewPassword){
            return res.status(400).json({message:"New Password and conform New Password is not match"})

            }

           const user = await User.findById(id);
           if(!user){
            return res.status(404).json({message:'User not found'})
             
           }
           
           const isMatch = await bcrypt.compare(OldPassword, user.password);

          if(!isMatch){
            return res.status(400).json({message:'Old Password is incorrect'})

          }

          
         const saltRounds = 10;
         const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

          user.password = hashedPassword;
          await user.save();
  
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: 'Password successfully updated',
      });
      } catch (error:any) {

        console.error(error.message);
  
        return res.status(500).json({
          message: 'Something went wrong',
          error: error.message,
        
      })         

    }
  }


  public verifyEmail = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;


     if(!email ||!otp){
      return res.status(400).json({message:'Email and otp is required'})
     }
      const user = await User.findOne({ email });
      

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      if (user.otp !== otp) {
        return res.status(400).json({
          message: "Invalid OTP"
        });
      }

      user.isVerified = true;
      user.otp = ''; 
      await user.save();

      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          gender: user.gender,
          UserRole: user.UserRole,
          email: user.email,
        },
        jwtSecretKey,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Email verification successful",
        token: token,
        user: user
      });
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).json({
        message: "Something went wrong",
        error: error.message
      });
    }
  };

public deleteUser = async (req:Request, res:Response)=>{
      
        try {
        const id = req.params.id
    
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ msg: "Invalid ID format" });
          }


     const user = await User.deleteOne({_id:id})

  
     if (user.deletedCount === 0) {
        return res.status(404).json({
    
           msg: "User not found" });
      }

      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "successfully deleted user"
        
      })
  
        } catch (error:any) {
            
            console.log(error.message);
            return res.status(400).json({
                message: "something went wrong",
                error: error.message
            })
        }


}
  public list = async (req: Request, res: Response) => {
    try {
      const condition: { _id?: string } = {};
      if (req.params.id) {
        condition._id = req.params.id;
      }

      const users = await User.find(condition, { name: 1, email: 1,gender:1,UserRole:1,DistrictID:1 }).populate([
        {path: 'UserRole',select:'name'},
        {path: 'DistrictID',select: 'name'}
      ])


      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully retrieved data",
        users: users
      });
    } catch (error: any) {

      console.error(error.message);
      return res.status(400).json({
        timeStamp: moment().unix(),
        message: "Something went wrong",
        error: error.message
      });
    }
  }

  public listbyid = async (req: Request, res:Response,next: NextFunction)=>{

       try {
        
        let id = req.params.id
        const user = await User.findById({_id:id}).populate([
          {path: 'UserRole',select:'name'},
          {path: 'DistrictID',select: 'name'}
        ])
        console.log(user)

        if(!user){
          return res.status(404).json({
            message:"User not found"
          })
        }
     
     
        return res.status(200).json({
          timeStamp: moment().unix(),
          message: "Successfully retrieved data",
          data: user
        })

       } catch (error:any) {
        
        console.log(error.message)
        return res.status(200).json({
          message: "something went wrong",
          error: error.message
        })
       }

  }


  public updateUser = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updatebody = req.body;


      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }

      const result = await User.updateOne({ _id: id }, updatebody);

      if (!result) {
        return res.status(404).json({ msg: "User not found" });
      }

      return res.status(200).json({
        timestamp: moment().unix(),
        message: "success",
        msg: "User updated successfully",
     
      });
    } catch (error: any) {
      res.status(500).json({
        message: "something went wrong",
        error: error.message
      });
    }
  };

public listByStateId = async (req: Request, res: Response, next: NextFunction)=>{

  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid State ID format" });
    }

  
    const districts = await District.find({ StateID: id });
  

    if (districts.length === 0) {
      return res.status(404).json({ msg: "No districts found for this state" });
    }

    const districtIds = districts.map(district => district._id);

    const users = await User.find({ DistrictID: { $in: districtIds } }).select('name');

    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found for this state" });
    }

    return res.status(200).json({ 
      timestamp: moment().unix(),
      message: "success",
      users: users 
    });

  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }

}  

public UpdatePassword = async(req: Request, res: Response,next: NextFunction)=>{


try {
  const id = req.params.id
  const {password} = req.body
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
 
  const result = await User.updateOne({ _id: id },  { password: hashedPassword });

  if(result.modifiedCount === 0){
    return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({
      timestamp: moment().unix(),
      message:"update password"
      
    })
} catch (error:any) {
  console.log(error.message);
  return res.status(400).json({
    timeStamp: moment().unix(),
    message: "something went wrong"
  })
  
}


}


}

export default new UserController();



// import { Request, Response } from 'express';
// import User from '../models/user';

// class UserController {
//   public createUser = async (req: Request, res: Response) => {
//     try {
//       const { name, email } = req.body;
//       const user = new User({ name, email });
//       await user.save();
//       return res.status(201).json({
//         message: "User successfully created",
//         user: { name, email }
//       });
//     } catch (error:any) {
//       console.error('Error creating user:', error.message);
//       return res.status(400).json({
//         error: "Something went wrong"
//       });
//     }
//   };
// }

// export default new UserController();


