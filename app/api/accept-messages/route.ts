import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session?.user){
        return Response.json({success:false,message:"Not Authenticated"},{status:401});
    }

    const userId = user._id;
    const {acceptMessages} = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage:acceptMessages
        },{new:true});

        if(!updatedUser){
            return Response.json({success:false,message:"No User Found"},{status:404});
        }
        return Response.json({success:true,message:"Message Acceptance status Updated Successfully"},{status:200});
    } catch (error) {
        console.error("Failed to Update user status : Accept Messages",error);
        return Response.json({success:false,message:"Failed to Update user status : Accept Messages"},{status:500});
    }
}

export async function GET(req:Request){
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const user:User = session?.user as User;

        if(!session || !session?.user){
            return Response.json({success:false,message:"Not Authenticated"},{status:401});
        }
        const userId = user._id;

        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({success:false,message:"No User Found"},{status:404});
        }

        return Response.json({success:true,message:"Message Acceptance status Updated Successfully",isAcceptingMessages:foundUser.isAcceptingMessage},{status:200});

    } catch (error) {
        console.error("Failed to Fetch user status : Accept Messages",error);
        return Response.json({success:false,message:"Failed to Fetch user status : Accept Messages"},{status:500});
    }
}