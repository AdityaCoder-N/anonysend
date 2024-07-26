import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

import {Message} from "@/model/User"

export async function POST(req:Request){
    await dbConnect();
    const {username,content} = await req.json();

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({success:false,message:"User Not Found"},{status:404});
        }

        //is user accepting messages

        if(!user.isAcceptingMessage){
            return Response.json({success:false,message:"User is not accepting Messages"},{status:403});
        }

        const newMessage = {content, createdAt:new Date()}
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({success:true,message:"Message sent Successfully"},{status:200});
    
    } catch (error) {
        console.error("Error sending message",error);
        return Response.json({success:false,message:"Error sending message"},{status:500});
    }
}