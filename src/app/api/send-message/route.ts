// import getServerSession from "next-auth";
import UserModel from "@/model/User.model"
import connectDB from "@/lib/dbConnect"
import { NextResponse } from "next/server"
import { User } from "next-auth"
import { Message } from "@/model/User.model";

export async function POST(request: Request) {
    await connectDB()
    const { username, content } = await request.json();
    if (!username || !content) {
        return NextResponse.json(
            { success: false, message: "Username and content are required" },
            { status: 400 }
        )
    }
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }
        if (!user.isAcceptingMessage) {
            return NextResponse.json(
                { success: false, message: "User is not accepting messages" },
                { status: 403 }
            )
        }
        const newMessage = { content, createdAt: new Date() };
        user.Message.push(newMessage as Message);
        await user.save();
        return NextResponse.json(
            { success: true, message: "Message sent successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.error("Error in send-message route:", error)
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}
