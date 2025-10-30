// auth.ts (root or src directory)
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Identifier", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<any> {
                await connectDB();
                const identifier = credentials?.identifier as string;
                const password = credentials?.password as string;
                console.log("Attempting to authenticate user with identifier:", identifier);

                try {
                    const trimmedIdentifier = identifier?.trim();
                    if (!trimmedIdentifier) {
                        throw new Error("Identifier is required");
                    }

                    const user = await UserModel.findOne({
                        $or: [
                            { email: trimmedIdentifier }, // email exact match
                            { username: { $regex: `^${trimmedIdentifier}$`, $options: "i" } }, // username case-insensitive
                        ],
                        isVerified: true, // apply verified filter
                    });

                    if (!user) throw new Error("User not found");

                    const isValidPassword = await bcrypt.compare(password, user.password);
                    if (!isValidPassword) throw new Error("Invalid password");
                    // Return user object to be stored in JWT
                    return {
                        id: user?._id,
                        email: user?.email,
                        username: user?.username,
                        isVerified: user?.isVerified,
                        isAcceptingMessage: user?.isAcceptingMessage,
                    };
                } catch (error: any) {
                    console.error("Authentication error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user.id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
                session.user.username = token.username as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
    },
    secret: process.env.NEXTAUTH_SECRET,
});