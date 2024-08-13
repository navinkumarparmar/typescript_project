import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validationMiddleware = (type: any) => {

  return (req: Request, res: Response, next: NextFunction) => {
 
    const obj = plainToClass(type, req.body);

   
 
    validate(obj).then((validationErrors: ValidationError[]) => {
        console.log(">>>",validationErrors)
      if (validationErrors.length > 0) {
        const errors: string[] = [];
    
         
        
        validationErrors.forEach((error: ValidationError) => {
          if (error.constraints) {
            
            Object.values(error.constraints).forEach((message: string) => {
          
               errors.push(message);
            });
          }
        });

        return res.status(400).json({ message: "Validation error", errors });
      } else {
        req.body = obj;
      
        next();
      }
    });
  };
};
