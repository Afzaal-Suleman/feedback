// import { getServerSession } from "next-auth";
import UserModel from "@/model/User.model"
import { auth } from "@/auth"
import { getSession } from "@/lib/auths"
import connectDB from "@/lib/dbConnect"
import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { User } from "next-auth"
import type { Session } from "next-auth";
export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const { messageid } = params;
    await connectDB()
    // const session = await getServerSession(auth)
    const session = await getSession();
    if (!session?.user?._id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user: User = session?.user as User
    if (!user || !user?._id) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }
    const userId = new mongoose.Types.ObjectId(user?._id);
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }
        const updateResult = await UserModel.updateOne(
            { _id: userId },
            { $pull: { messages: { _id: messageid } } }
        );
        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Message not found or could not be deleted" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error in delete-messages route:", error)
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }

}