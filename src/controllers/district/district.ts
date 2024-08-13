import { NextFunction, Request, Response } from 'express';
import  District  from '../../models/district/district';
import mongoose from 'mongoose';
import moment from 'moment';



class DistrictController {
  public createDistrict= async (req: Request, res: Response) => {

    try {
   
        const { name,StateID}  =  req.body;

     const districtname = await District.find({name:name});
      
     if(districtname){
        return res.status(400).json({message:"District already exists"});
     }
      
      
    const district = new District({ name,StateID});
    await district.save();
    return res.status(200).json({
      timeStamp: moment().unix(),
      message: "District successfully created",
      district: district
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

public deleteDistrict= async (req:Request, res:Response)=>{
      
        try {
        const id = req.params.id
    
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ msg: "Invalid ID format" });
          }


     const district = await District.deleteOne({_id:id})

  
     if (district.deletedCount === 0) {
        return res.status(404).json({
    
           msg: "district not found" });
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

      const district = await District.find(condition, { name: 1 ,StateID:1});


      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully retrieved data",
        district: district
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
        const district = await District.findById({_id:id});

        if(!district){
          return res.status(404).json({
            message:"district not found"
          })
        }
     
     
        return res.status(200).json({
          timeStamp: moment().unix(),
          message: "Successfully retrieved data",
          data: district
        })

       } catch (error:any) {
        
        console.log(error.message)
        return res.status(200).json({
          message: "something went wrong",
          error: error.message
        })
       }

  }
  public updateDistrict = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updatebody = req.body;
 
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }

      const result = await District.updateOne({ _id: id }, updatebody);

      if (!result) {
        return res.status(404).json({ msg: "District not found" });
      }

      return res.status(200).json({
        timestamp: moment().unix(),
        message: "success",
        msg: "District updated successfully",
     
      });
    } catch (error: any) {
      res.status(500).json({
        message: "something went wrong",
        error: error.message
      });
    }
  };

}

export default new DistrictController();





