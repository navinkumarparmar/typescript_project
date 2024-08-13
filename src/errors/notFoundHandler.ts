import { Request, Response, NextFunction } from 'express';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
  
    message: "Resource not found"
  });
};

export default notFoundHandler;
