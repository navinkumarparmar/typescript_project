import { NextFunction, Request, Response } from "express";
import UserLevel from "../models/userlevel";
import moment from "moment";
import mongoose from "mongoose";
class UserLevelController {
  public CreateUserLevel = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const user = new UserLevel({ name });
      await user.save();
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Userlevel successfully created",
        userlevel: user,
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(400).json({
        message: "something went wrong",
        error: error.message,
      });
    }
  };


  public deleteUser = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
      }
      const user = await UserLevel.deleteOne({ _id: id });
      if (user.deletedCount === 0) {
        return res.status(404).json({
          msg: "User not found",
        });
      }
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "successfully deleted userlevel",
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(400).json({
        message: "something went wrong",
        error: error.message,
      });
    }
  };


  public list = async (req: Request, res: Response) => {
    try {
      const condition: any = {};
      if (req.params.id) {
        condition["id"] = req.params.id;
      }
      const users = await UserLevel.find(condition, { name: 1 });
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully retrieved data",
        users: users,
      });
    } catch (error: any) {
      console.error(error.message);
      return res.status(400).json({
        timeStamp: moment().unix(),
        message: "Something went wrong",
        error: error.message,
      });
    }
  };


  public UpdateUserLevel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let id = req.params.id;
      let updatebody = req.body;
      let UpdatedData = await UserLevel.updateOne({ _id: id }, updatebody);
      return res.status(200).json({
        timeStamp: moment().unix(),
        message: "Successfully updated data",
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(400).json({
        message: "Something Went Wrong",
        error: error.message,
      });
    }
  };

}


export default new UserLevelController();
