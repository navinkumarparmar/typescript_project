import { NextFunction, Request, Response } from 'express';
 

import  State  from '../../models/state/state';



import mongoose from 'mongoose';
import moment from 'moment';



class StateController {
  public createState= async (req: Request, res: Response) => {

    try {
   
        const { name}  =  req.body;

    const isState = await State.find({name: name});

    if(isState){
        return res.status(400).json({
            message: "state is already exists"
        })
    }


    const state = new State({ name});
    await state.save();
    return res.status(200).json({
      timeStamp: moment().unix(),
      message: "State successfully created",
      state: state
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

public deleteState = async (req:Request, res:Response)=>{
      
        try {
        const id = req.params.id
    
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ msg: "Invalid ID format" });
          }


     const user = await State.deleteOne({_id:id})

  
     if (user.deletedCount === 0) {
        return res.status(404).json({
    
           msg: "State not found" });
      }

      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "successfully deleted State"
        
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

      const states = await State.find(condition, { name: 1 });


      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully retrieved data",
        states: states
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
        const state = await State.findById({_id:id});

        if(!state){
          return res.status(404).json({
            message:"State not found"
          })
        }
     
     
        return res.status(200).json({
          timeStamp: moment().unix(),
          message: "Successfully retrieved data",
          data: state
        })

       } catch (error:any) {
        
        console.log(error.message)
        return res.status(200).json({
          message: "something went wrong",
          error: error.message
        })
       }

  }
  public updateState = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updatebody = req.body;
 
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }

      const result = await State.updateOne({ _id: id }, updatebody);

      if (!result) {
        return res.status(404).json({ msg: "User not found" });
      }

      return res.status(200).json({
        timestamp: moment().unix(),
        message: "success",
        msg: "State updated successfully",
     
      });
    } catch (error: any) {
      res.status(500).json({
        message: "something went wrong",
        error: error.message
      });
    }
  };

}

export default new StateController();





