import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    // console.log(user);
    if(!session || !session?.user){
        return Response.json({success:false,message:"Not Authenticated"},{status:401});
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    console.log(userId)
    try {
        const returnedUser = await UserModel.aggregate([
            { $match: {_id:userId} },
            { $unwind: '$messages'},
            { $sort: {'messages.createdAt':-1}},
            { $group: {_id: '$_id', messages:{$push:'$messages'}}}
        ]);
        console.log(returnedUser);
        if(!returnedUser){
            return Response.json({success:false,message:"User Not Found"},{status:400});
        }
        if(returnedUser.length===0){
            return Response.json({success:true,message:"No Messages Found"},{status:200});
        }

        return Response.json({
            success:true,
            message:"Messages Fetched Successully",
            messages:returnedUser[0].messages
        },{status:200});
        
    } catch (error) {
        console.error("Failed to fetch user messages",error);
        return Response.json({success:false,message:"Failed to Fetch user messages"},{status:500});
    }
}