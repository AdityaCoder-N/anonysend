import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(req:Request, {params}:{params:{messageId:string}}){

    const messageId = params.messageId;

    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session?.user){
        return Response.json({success:false,message:"Not Authenticated"},{status:401});
    }

    try {
        const updatedResult =  await UserModel.updateOne({_id: user._id},{
            $pull:{messages: { _id: messageId }}
        })
        if(updatedResult.modifiedCount==0){
            return Response.json({success:false,message:"Message Not Found or Already Deleted"},{status:401});
        }
        return Response.json({success:true,message:"Message Successfully Deleted"},{status:200});
    } catch (error) {
        console.error("Error in Deleting Message",error);
        return Response.json({success:false,message:"Error in Deleting Message"},{status:500});
    }
}