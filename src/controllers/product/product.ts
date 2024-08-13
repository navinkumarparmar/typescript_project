import { NextFunction, Request, Response } from 'express';
 

import  Product  from '../../models/product/product';
import upload from '../../middleware/fileupload';


import mongoose from 'mongoose';
import moment from 'moment';
import User from '../../models/user'
// import { sendEmail } from '../../transporter';
import ProductReview from '../../models/product/productreview';
import  Shop  from '../../models/shop/shop'
import { isNumber } from 'class-validator';


class ProductController {
    public createProduct = async (req: Request, res: Response) => {

        try {
          upload.single('image')(req, res, async function (err: any) {
            if (err) {
              return res.status(400).json({ message: err.message });
            }
    
            const { name, price, ShopID } = req.body;
            if (!mongoose.Types.ObjectId.isValid(ShopID)) {
              return res.status(400).json({ message: "Invalid ShopID format" });
            }
      

            const shop = await Shop.findById(ShopID);

            if (!shop) {
              return res.status(400).json({ message: "Shop not found" });
            }
            let image = '';
    
            if (req.file) {
              image = `http://localhost:8989/uploads/product_images/${req.file.filename}`;
            }
 
           
            let product = await Product.findOne({ name, ShopID });
    
            if (product) {
            
              product.quantity += 1;
              product.price = price; 
              product.image = image;  
            } else {
            
              product = new Product({ name, price, ShopID, image, quantity: 1 });
            }
    
            await product.save();

            const users = await User.find();

            const emailSubject = 'New Product Added';
            const emailText = `Dear User,\n\nA new product has been added: ${name} at price ${price}.\n\nCheck it out now!\n\nBest regards,\nYour Company`;
            
            // for (const user of users) {
            //   sendEmail(user.email, emailSubject, emailText);
            // }
      

            return res.status(200).json({
              timeStamp: moment().unix(),
              message: "Product successfully created or updated",
              product: product
            });
          });
        } catch (error: any) {
          console.log(error.message);
          return res.status(400).json({
            message: "Something went wrong",
            error: error.message
          });
        }
      };
    

public deleteProductOne = async (req:Request, res:Response)=>{
      
        try {

        const id = req.params.id
    
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ msg: "Invalid ID format" });
          }

         const product = await Product.findById(id)
         
        if(product){
          product.quantity -= 1
        }else{
          return res.status(400).json({ msg: "Product not found" });
        }
  
      await product?.save();

      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "successfully deleted one Product"
        
      })
  
        } catch (error:any) {
            
            console.log(error.message);
            return res.status(400).json({
                message: "something went wrong",
                error: error.message
            })
        }


}


public deleteProduct  = async(req: Request, res: Response, next: NextFunction)=>{


    try {
      
      let id = req.params.id

      const product = await Product.findByIdAndDelete(id);

      if(!product){
        return res.status(400).json({ msg: "Product not found" });
      }

      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "successfully deleted Product"
        
      })

    } catch (error:any) {
      console.log(error.message);
      return res.status(400).json({
          message: "something went wrong",
          error: error.message,
      })
      
    }

}
  public list = async (req: Request, res: Response) => {

    try {
      const products = await Product.aggregate([
        {
          $lookup: {
            from: 'productreviews',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },

        },
      ]);

  
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully retrieved data",
        count: products.length,
        product: products,

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
        const product = await Product.findById({_id:id});

        if(!product){
          return res.status(404).json({
            message:"Product not found"
          })
        }
     
     
        return res.status(200).json({
          timeStamp: moment().unix(),
          message: "Successfully retrieved data",
          data: product
        })

       } catch (error:any) {
        
        console.log(error.message)
        return res.status(200).json({
          message: "something went wrong",
          error: error.message
        })
       }

  }
  public updateProduct = async (req: Request, res: Response) => {
    try {
        upload.single('image')(req, res, async function (err: any) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            const id = req.params.id;
            const updateBody = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: "Invalid ID format" });
            }

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ msg: "Product not found" });
            }

            if (req.file) {
                updateBody.image = `http://localhost:8989/uploads/product_images/${req.file.filename}`;
            }

           let updatedpoduct =  await Product.updateOne({ _id: id }, updateBody);


            return res.status(200).json({
                timestamp: moment().unix(),
                message: "success",
                msg: "Product updated successfully",
                product: updatedpoduct
            });
        });
    } catch (error: any) {
        res.status(500).json({
            message: "something went wrong",
            error: error.message
        });
    }
};
  public searchAndFilter = async (req: Request, res: Response) => {
    try {

      const { name, price,minPrice, maxPrice, shopID, page = 1, size = 10 } = req.query;


  
      const condition: any = {};
      if (price) {
        condition.price = price;
      } else {
        if (minPrice) condition.price = { $gte: minPrice };
        if (maxPrice) condition.price = { ...condition.price, $lte: maxPrice };
           
      }
      if (name) condition.name = { $regex: name, $options: 'i'};
   
      if (shopID) condition.ShopID = shopID;

      
     
      let pageNumber = parseInt(page as string, 10);
      let pageSize = parseInt(size as string, 10);

       


      if(!isNumber(pageNumber) ||!isNumber(pageSize)  ){
        return res.status(400).json({
          message: "Invalid page size or page number",
        })
      }


    
      if (pageSize < 1) {
        pageSize = 1;
      } else if (pageSize > 10) {
        return res.status(400).json({ msg: "Size can't be greater than 10" });
      }
     

      const skip = (pageNumber - 1) * pageSize;
  
    
      const products = await Product.find(condition).skip(skip).limit(pageSize);

      if (products.length === 0) {
        return res.status(404).json({ msg: "No products found" });
      }

      
      const totalCount = await Product.countDocuments(condition);

  
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully retrieved data",
        products: products,
        pagination: {
          currentPage: pageNumber,
          pageSize: pageSize,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      });
    } catch (error: any) {
      console.error(error.message);
      return res.status(400).json({
        timeStamp: moment().unix(),
        message: "Something went wrong",
        error: error.message,
      });
    }
  
}
}

export default new ProductController();





