import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecretKey: string = process.env.jwtSecretKey || ''

class AuthController {
  
  public googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

  public googleCallback = (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate('google', { session: false }, (err, user, info) => {
   
      if (err || !user) {
      
        return res.status(401).json({
          message: 'this email is not connected with any user',
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
       
        },
        jwtSecretKey,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        timeStamp: moment().unix(),
        message: 'Successfully logged in with Google',
        token: token,
        user: user,
      });
    })(req, res, next);
  };
}

export default new AuthController();
