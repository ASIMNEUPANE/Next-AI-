import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }
  //this will convet the string to mongoose ObjectID
  //generally it is fine when use in the findById and other might throw issue usign aggregation pipeline
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      //unwind will open the array
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
      {
        $project: {
          _id: 0,
          messages: 1,
        },
      },
    ]);
    console.log(user, "finalUser");
    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 401 },
      );
    }
    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 },
    );
  } catch (error) {
    console.log("An unexpected error occured", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
