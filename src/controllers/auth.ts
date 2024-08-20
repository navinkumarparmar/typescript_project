import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const moment = require('moment');
const bcrypt = require('bcrypt');
dotenv.config();

const jwtSecretKey = process.env.jwtSecretKey;
const transporter = require('../../src/transporter');

class AuthController {
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const user = await User.findOne({ email: email }).populate('UserRole','name');
      console.log("user",user)

      if (!user) {
        return res.status(401).json({
          message: "Username and password don't match",
        });
      }

      if (!user.isVerified) {
        const generateOTP = () => {
          return Math.floor(100000 + Math.random() * 900000).toString();
        };

        const otp = generateOTP();
        user.otp = otp;
        await user.save();

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Your OTP Code',
          text: `Your OTP code is ${otp}`
        };

        transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
            return res.status(500).json({
              message: "Failed to send OTP email",
              error: error.message
            });
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        return res.status(403).json({
          message: "Email not verified. OTP sent to email. Please verify.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Username and password don't match",
        });
      }

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
        message: "Successfully logged in",
        token: token,
        user: user,
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
}

export default new AuthController();




