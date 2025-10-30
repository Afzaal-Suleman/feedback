// import { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//     interface User extends DefaultUser {
//         _id?: string;
//         isVerified?: boolean;
//         isAcceptingMessage?: boolean;
//         username?: string;
//     }

//     interface Session {
//         user: {
//             _id?: string;
//             isVerified?: boolean;
//             isAcceptingMessage?: boolean;
//             username?: string;
//         } & DefaultSession["user"];
//     }
// }

// declare module "next-auth/jwt" {
//     interface JWT {
//         _id?: string;
//         isVerified?: boolean;
//         isAcceptingMessage?: boolean;
//         username?: string;
//     }
// }

// types/next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            username?: string;
        } & DefaultSession["user"];
    }

    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    }
}

declare module "@auth/core/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    }
}