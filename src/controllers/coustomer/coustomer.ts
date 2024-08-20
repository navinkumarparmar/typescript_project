import { NextFunction, Request, Response } from 'express';
import Coustomer from '../../models/coustomer/coustomer'
import Product from '../../models/product/product'
import mongoose from 'mongoose';
import moment from 'moment';
import ProductReview from '../../models/product/productreview';
import User from '../../models/user'
import { sendEmail } from '../../../src/transporter';
// const sendEmail = require('../../../src/transporter');





class CoustomerController {
  public createCoustomer = async (req: Request, res: Response) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
      const { ProductID, quantity } = req.body;
      const UserID = req.body.id;
  
      if (!mongoose.Types.ObjectId.isValid(ProductID)) {
        // await session.abortTransaction();
        // session.endSession();
        return res.status(400).json({ msg: "Invalid ID format" });
      }
  
      const product = await Product.findById(ProductID)
      // .session(session);
      console.log(product)
  
      if (!product) {
        // await session.abortTransaction();
        // session.endSession();
        return res.status(400).json({
          message: "Product not available",
        });
      }
  
      if (product.quantity < quantity) {
        // await session.abortTransaction();
        // session.endSession();
        return res.status(400).json({
          message: "Not enough stock available",
        });
      }
  
      const totalPrice = product.price * quantity;
     console.log("product.quantity first",product.quantity)
      let x = product.quantity -= quantity;
      console.log("product.quantity second",product.quantity)
      await product.save()

      // ({ session });
  
      const coustomer = new Coustomer({ UserID, ProductID, quantity, totalPrice });
      await coustomer.save();
      // ({ session });
  
      const user = await User.findById(UserID)
      // .session(session);
      if (user) {
        const emailSubject = 'Order Confirmation';
        const emailText = `Dear ${user.name},\n\nThank you for your order of ${quantity} ${product.name}(s). Your total price is ${totalPrice}.\n\nBest regards,\nYour Company`;
  
        // sendEmail(user.email, emailSubject, emailText)
      }
  
    //  await session.commitTransaction();
    //   session.endSession();
  
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Customer successfully ordered item(s)",
        coustomer: coustomer,
      });
    } catch (error: any) {
      // await session.abortTransaction();
      // session.endSession();
      console.error(error.message);
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  };

    public cancelOrder = async (req: Request, res: Response) => {
      // const session = await mongoose.startSession();
      // session.startTransaction();
      try {
        const orderId = req.params.id
 
    
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
          // await session.abortTransaction();
          // session.endSession();
          return res.status(400).json({ msg: "Invalid order ID format" });
        }
    
        const customerOrder = await Coustomer.findById(orderId).populate('ProductID UserID')
        // .session(session);

        if (!customerOrder) { 
          // await session.abortTransaction();
          // session.endSession();
          return res.status(404).json({ message: "Order not found" });
        }
    
        const product = await Product.findById(customerOrder.ProductID)
        // .session(session);
       
    
        if (!product) {
          // await session.abortTransaction();
          // session.endSession();
          return res.status(400).json({ message: "Product not available" });
        }

        product.quantity += customerOrder.quantity;
        await product.save()
        // ({ session });
    

        const user = await User.findById(customerOrder.UserID);
        if (user) {
          const emailSubject = 'Order Cancellation';
          const emailText = `Dear ${user.name},\n\nYour order for ${customerOrder.quantity} ${product.name}(s) has been successfully cancelled. The total price of ${customerOrder.totalPrice} will be refunded to you.\n\nBest regards,\nShop Cart`;
    
          sendEmail(user.email, emailSubject, emailText);
        }
        // await session.commitTransaction();
        // session.endSession();
        await Coustomer.findByIdAndDelete(orderId);

    
        return res.status(200).json({
          timeStamp: moment().unix(),
          message: "Order successfully cancelled",
        });
      } catch (error: any) {
      //   await session.abortTransaction();
      // session.endSession();
        console.error(error.message);
        return res.status(500).json({
          message: "Something went wrong",
          error: error.message,
        });
      }
    };


public deleteCoustomer = async (req:Request, res:Response)=>{
      
        try {
        const id = req.params.id
    
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ msg: "Invalid ID format" });
          }


     const coustomer = await Coustomer.deleteOne({UserID:id})

  
     if (coustomer.deletedCount === 0) {
        return res.status(404).json({
    
           msg: "Coustomer not found" });
      }

      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "successfully deleted Coustomer"
        
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
       const id = req.body.id
    //    const user = await User.findById(id).populate({
    //     path: 'DistrictID',
    //     select: 'name'
    //  })
     

      const condition: { _id?: string } = {};

     
      if (req.params.id) {
        condition._id = req.params.id;
      }

      const customers = await Coustomer.find(condition).populate([
        {path: 'UserID',select:'name'},
        {path: 'ProductID',select: 'name'},

      ])


      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully retrieved data",
        buyProductCount: customers.length,
        customers: customers
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


  public listbyid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }
  
      const isbuyer = await Coustomer.findOne({ UserID: id });
    
  
      if (!isbuyer) {
        return res.status(404).json({
          message: "This customer has not bought any product"
        });
      }
  
      const customers = await Coustomer.find({ UserID: id }).populate([
        { path: 'UserID', select: 'name gender email UserRoll DistrictID' },
        { 
          path: 'ProductID', 
          select: 'name price image', 
          populate: { path: 'ShopID', select: 'name' } 
        }
      ]);
  
console.log("customers list ",customers)
      if (!customers || customers.length === 0) {
        return res.status(404).json({
          message: "This customer has not bought any product"
        });
      }
  
      const userName = customers[0].UserID.name;
  
      const products = customers.map(customer => ({
        orderid : customer._id,
        name: customer.ProductID.name,
        price: customer.ProductID.price,
        image: customer.ProductID.image,
        shopName: customer.ProductID.ShopID.name,
        quantity: customer.quantity,
        totalPrice: customer.totalPrice
      }));
  
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully retrieved data",
        data: {
          name: userName,
          products
        }
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message
      });
    }
  }
  public updateCoustomer = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updatebody = req.body;


      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }

      const result = await Coustomer.updateOne({ UserID: id }, updatebody);

      if (!result) {
        return res.status(404).json({ msg: "coustomer not found" });
      }

      return res.status(200).json({
        timestamp: moment().unix(),
        message: "success",
        msg: "coustomer updated successfully",
     
      });
    } catch (error: any) {
      res.status(500).json({
        message: "something went wrong",
        error: error.message
      });
    }
  };
  
  public deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {productId } = req.body;
      const userID = req.body.id
     
      if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }

      const deletedOrder = await Coustomer.findOneAndDelete({ UserID: userID, ProductID: productId });
    
      if (!deletedOrder) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      return res.status(200).json({
        message: "Successfully deleted order"
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(400).json({
        message: "Something went wrong",
        error: error.message
      });
    }
  }


// public ReviewProduct = async(req: Request, res: Response, next: NextFunction)=>{

//   try {
     
//     const userid = req.body.id
//     const {ProductID,review} = req.body


//     const user = await Coustomer.find({UserID: userid});
// console.log("user",user)

// for(let ir of user){
//     if(ir.ProductID==ProductID){
//         const product = await Product.findById(ProductID)
//       if(product){
//       product.review = review

//       }
      
//     }else[
//         console.log("nothing")
//     ]
   
// }

//     if(!user){
//         return res.status(404).json({
//             message: "you have not any buy item"
//         })
//     }

    


//   } catch (error:any) {
// console.log(error.message)

//   }




// }


public ReviewProduct = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const userId = req.body.id;
    console.log(userId)
    const { productId, review ,rating} = req.body;
   
    const product = await Product.findById(productId);

    

    const customer = await Coustomer.findOne({ UserID: userId, ProductID: productId })

    if (!customer) {
      return res.status(404).json({
        message: "You have not purchased this product, cannot review.",
      });
    }
 
    const newReview = new ProductReview({
      productId,
      userId,
      review,
      rating,
    });

    await newReview.save();

    return res.status(200).json({
      statusCode: 200,
     message: "review added Succesfully",

    })

  } catch (error:any) {

    console.log(error.message)
    return res.status(400).json({
      message: "Something went wrong",
      error: error.message
    });
    
  }
   
};

public ReviewDelete = async(req:Request,res:Response,next:NextFunction)=>{

try {
 
    const userid = req.body.id
    const reviewId = req.params.id
    console.log(reviewId)

    const review = await ProductReview.findByIdAndDelete(reviewId);

   if(!review){
    return res.status(404).json({
      message: "Review not found",
      });
   }
   return res.status(200).json({
    statusCode:200,
    message: "Review deleted successfully",
   })


} catch (error:any) {

  console.log(error.message);
  return res.status(400).json({
    message: "Something went wrong",
    error: error.message
  });
  
}
}

public ReviewList  = async(req: Request,res: Response,next:NextFunction)=>{
  try {
    

    const reviewlist = await ProductReview.find({}).populate([
      {
      path: 'productId',
      select: 'name',
      populate : {path: 'ShopID',select:'name'}
       
      },
      {
        path: 'userId',
        select: 'name',
       
      }

    ])

    if(!reviewlist){
      return res.status(404).json({
        message: "Review not found",
        });
        }
    return res.status(200).json({
      statusCode:200,
      message: "Review list",
      reviewlist
      })

  } catch (error:any) {
    console.log(error.message);
    return res.status(400).json({
      message: "Something went wrong",
    })
    
  }
}


public Reviwlistbyid = async(req: Request, res: Response, next: NextFunction)=>{

  try {

    let id = req.params.id
    
       const review = await ProductReview.findById(id).populate([
        {path: 'userId',
        select: 'name'},
        {
          path: 'productId',
          select:'name'
        }
       ])
      return res.status(200).json({
        statusCode:200,
        message: "succesfully get review",
        review

      })

  } catch (error:any) {

    console.log(error)
    return res.status(400).json({
      message: "Something went wrong",
      error: error.message
    
    })
    
  }

}

}


export default new CoustomerController();





