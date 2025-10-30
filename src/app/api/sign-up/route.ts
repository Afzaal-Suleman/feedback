import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
    try {
        await connectDB();
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        if (existingUserVerifiedByUsername) {
            return Response.json(
                { success: false, message: "User already exists" },
                { status: 409 }
            );
        }
        const existingUserVerifiedByEmail = await UserModel.findOne({ email });
        const verifyCode = await Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json(
                    { success: false, message: "Email already in use" },
                    { status: 409 }
                );
            } else {
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry time to 1 hour from now
                existingUserVerifiedByEmail.username = username;
                existingUserVerifiedByEmail.password = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.verifyCode = verifyCode
                existingUserVerifiedByEmail.verifyCodeExpiry = expiryDate;
                await existingUserVerifiedByEmail.save();
            }
        } else {
            const verifyCodeExpiry = new Date();
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1); // Set expiry time to 1 hour from now
            const newUser = new UserModel({ username, email, password: await bcrypt.hash(password, 10), verifyCodeExpiry, verifyCode, isVerified: false, isAcceptingMessage: true, Message: [] });
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(username, email, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                { success: false, message: emailResponse.message },
                { status: 500 }
            );
        }
        if (emailResponse.success) {
            return Response.json(
                { success: true, message: "Verification email sent successfully" },
                { status: 200 }
            );
        }
        return Response.json(
            { success: true, message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return Response.json(
            { success: false, message: "Failed to create user" },
            { status: 500 }
        );
    }
}