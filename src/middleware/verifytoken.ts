import {Request, Response,NextFunction } from "express";
import User from '../models/user'
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
import AuthenticationTokenMissingException from '../errors/AuthenticationTokenMissingException'
import WrongAuthenticationTokenException from '../errors/WrongAuthenticationTokenException'
dotenv.config();
const jwtSecretKey = process.env.jwtSecretKey

class verifytokenmiddlewere {

  public verifytoken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
     
      if (!token) {
        return res.status(401).send(new AuthenticationTokenMissingException())
      }

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {
        // Attach user ID to request body
        req.body.id = verified._id;
        next();
      } else {
        return res.status(401).json({ error: "Unauthorized access" });
      }
    } catch (error:any) {
   let message = error.message



      res.status(401).send(new WrongAuthenticationTokenException(message));
    }
  }


    public verifyrole = (requiredRoles: string[]) => {
        return async (req: Request, res: Response, next: NextFunction) => {
          try {
            let id = req.body.id;
      
            const user = await User.findById(id).populate('UserRole', 'name');
         
            if (!user) {
              return res.status(401).send({ error: "Unauthorized access" });
            }
      
            const userRole = user.UserRole.name;
        
            if (requiredRoles.includes(userRole)) {

              next();
            } else {
              res.status(403).send({ error: "Forbidden: You don't have enough permissions" });
            }
          } catch (error:any) {
            console.error(error.message);
            res.status(500).send({ error: "Internal server error" });
          }
        };
      }; 
     }



export default new verifytokenmiddlewere();


