import { NextFunction, Request, Response } from 'express';
 

import  City  from '../../models/city/city';


import mongoose from 'mongoose';
import moment from 'moment';



class CityController {
  public createCity= async (req: Request, res: Response) => {

    try {
   
        const { name,DistrictID}  =  req.body;

        const checkname  = await City.find({name:name});

         if(checkname){
            return res.status(400).json({message:"City already exists" });
         }
      

      
    const city = new City({ name,DistrictID});
    await city.save();
    return res.status(200).json({
      timeStamp: moment().unix(),
      message: "city successfully created",
      city: city
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

public deleteCity= async (req:Request, res:Response)=>{
      
        try {
        const id = req.params.id
    
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ msg: "Invalid ID format" });
          }


     const city = await City.deleteOne({_id:id})

  
     if (city.deletedCount === 0) {
        return res.status(404).json({
    
           msg: "city not found" });
      }

      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "successfully deleted district"
        
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

      const city = await City.find(condition, { name: 1 ,DistrictID:1,createdAt:1,updatedAt:1});


      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully retrieved data",
        city: city
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
        const city = await City.findById({_id:id});

        if(!city){
          return res.status(404).json({
            message:"city not found"
          })
        }
     
     
        return res.status(200).json({
          timeStamp: moment().unix(),
          message: "Successfully retrieved data",
          data: city
        })

       } catch (error:any) {
        
        console.log(error.message)
        return res.status(200).json({
          message: "something went wrong",
          error: error.message
        })
       }

  }
  public updateCity = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updatebody = req.body;
 
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }

      const result = await City.updateOne({ _id: id }, updatebody);

      if (!result) {
        return res.status(404).json({ msg: "District not found" });
      }

      return res.status(200).json({
        timestamp: moment().unix(),
        message: "success",
        msg: "city updated successfully",
     
      });
    } catch (error: any) {
      res.status(500).json({
        message: "something went wrong",
        error: error.message
      });
    }
  };

}

export default new CityController();





