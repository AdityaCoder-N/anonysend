import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req:Request){
    await dbConnect();

    try {
        const {username,code} = await req.json();

        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({success:false, message:"User not found"},{status:400});
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true;
            await user.save();

            return Response.json({success:true, message:"User Verfied Successfully"},{status:200});
        }
        else if(!isCodeNotExpired){
            return Response.json({success:false, message:"Verification Code has expired, Please Sign Up again to get a new code."},{status:400});
        }
        else{
            return Response.json({success:false, message:"Incorrect Verification Code."},{status:400});
        }

    } catch (error) {
        console.error("Error Verifying Username with code",error);
        return Response.json({success:false, message:"Error Verifying Username"},{status:500});
    }

}