// import { getServerSession } from "next-auth";
import UserModel from "@/model/User.model"
import { auth } from "@/auth"
import connectDB from "@/lib/dbConnect"
import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { User } from "next-auth"
import type { Session } from "next-auth";
import { getSession } from "@/lib/auths";
export async function GET(request: Request) {
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
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$Message" },
            { $sort: { "Message.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$Message" }
                }
            }
        ])
        if (!user || user.length === 0) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }
        console.log(user);
        
        return NextResponse.json(
            { success: true, messages: user[0].messages },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error in get-messages route:", error)
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }

}