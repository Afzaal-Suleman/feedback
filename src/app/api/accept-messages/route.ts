// import { getServerSession } from "next-auth";
import UserModel from "@/model/User.model"
import { auth } from "@/auth"
import { getSession } from "@/lib/auths"
import connectDB from "@/lib/dbConnect"
import { NextResponse } from "next/server"
import { User } from "next-auth"
export async function POST(request: Request) {
    await connectDB()

    // const session = await getServerSession(auth) v4
    // const session = await auth()?.getSession(request);
    const session = await getSession();
    if (!session?.user?._id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!session) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }
    const user: User = session?.user as User
    if (!user || !user?._id) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }
    const userId = user?._id

    const foundUser = await UserModel.findById(userId)
    if (!foundUser) {
        return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
        )
    }
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true })
        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { success: true, message: "Settings updated successfully", isAcceptingMessage: updatedUser.isAcceptingMessage },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error in accept-messages route:", error)
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}


export async function GET(request: Request) {
    await connectDB()
    // const session = await getServerSession(auth)
    const session = await getSession();
    if (!session?.user?._id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!session) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }
    const user: User = session?.user as User
    if (!user || !user?._id) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }

    const userId = user?._id
    try {
        const existingUser = await UserModel.findById(userId)
        if (!existingUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { success: true, isAcceptingMessage: existingUser.isAcceptingMessage },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error in accept-messages GET route:", error)
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}

