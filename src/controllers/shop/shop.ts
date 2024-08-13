import { NextFunction, Request, Response } from 'express';
 

import  Shop from '../../models/shop/shop';



import mongoose from 'mongoose';
import moment from 'moment';



class ShopController {
  public createShop= async (req: Request, res: Response) => {

    try {
   
        const { name}  =  req.body;


        console.log("?????????>",req);
     
      
        const isShop = await Shop.findOne({ name: name });

        if (isShop) {
          return res.status(400).json({
            message: "Shop already exists",
          });
        }
      
   console.log(isShop)
    // if(!isShop){
    //     return res.status(400).json({
    //         message: "Shop is already exists"
    //     })
    // }


    const shop = new Shop({ name});
    await shop.save();
    return res.status(200).json({
      timeStamp: moment().unix(),
      message: "Shop successfully created",
      shop: shop
    });
  }
    catch (error:any) {
         
        console.log(error.message);
        
        return res.status(400).json({
            message: "something went wrong",
            error: error.message
            
        })
    }
    
}

public deleteShop = async (req:Request, res:Response)=>{
      
        try {
        const id = req.params.id
    
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ msg: "Invalid ID format" });
          }


     const shop = await Shop.deleteOne({_id:id})

  
     if (shop.deletedCount === 0) {
        return res.status(404).json({
    
           msg: "shop not found" });
      }

      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "successfully deleted shop"
        
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

      const shops = await Shop.find(condition, { name: 1 });


      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully retrieved data",
        shops: shops
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
        const shop = await Shop.findById({_id:id});

        if(!shop){
          return res.status(404).json({
            message:"Shop not found"
          })
        }
     
     
        return res.status(200).json({
          timeStamp: moment().unix(),
          message: "Successfully retrieved data",
          data: shop
        })

       } catch (error:any) {
        
        console.log(error.message)
        return res.status(200).json({
          message: "something went wrong",
          error: error.message
        })
       }

  }
  public updateShop = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updatebody = req.body;
 
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }

      const result = await Shop.updateOne({ _id: id }, updatebody);

      if (!result) {
        return res.status(404).json({ msg: "User not found" });
      }

      return res.status(200).json({
        timestamp: moment().unix(),
        message: "success",
        msg: "Shop updated successfully",
     
      });
    } catch (error: any) {
      res.status(500).json({
        message: "something went wrong",
        error: error.message
      });
    }
  };

}

export default new ShopController();





