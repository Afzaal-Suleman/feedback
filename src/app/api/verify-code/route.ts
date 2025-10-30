import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
export async function POST(request: Request) {
    try {
        await connectDB();
        const { username, code } = await request.json();
        console.log("Verifying code for user:", username, "with code:", code);

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = user.verifyCodeExpiry ? new Date() > user.verifyCodeExpiry : true;
        if (!isCodeValid) {
            return Response.json(
                { success: false, message: "Invalid verification code" },
                { status: 400 }
            );
        }
        if (isCodeExpired) {
            return Response.json(
                { success: false, message: "Verification code has expired" },
                { status: 400 }
            );
        }

        if (isCodeValid && !isCodeExpired) {
            user.isVerified = true;
            user.verifyCode = "";
            user.verifyCodeExpiry = null
            await user.save();
        }
        return Response.json(
            { success: true, message: "Account verified successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error verifying code:", error);
        return Response.json(
            { success: false, message: "Failed to verify code" },
            { status: 500 }
        );
    }
}