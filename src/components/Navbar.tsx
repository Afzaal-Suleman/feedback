"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Menu, X, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function Navbar() {
    const { data: session, status } = useSession();
    const user = session?.user as User | undefined;
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        toast.success("Signed out successfully!");
        router.push("/");
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            FeedBack
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <Link href="/dashboard" className="hover:text-blue-600">
                            Dashboard
                        </Link>
                        {status === "authenticated" ? (
                            <>
                                <span className="flex items-center gap-1">
                                    <UserIcon className="w-5 h-5" /> {user?.username}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                >
                                    <LogOut className="w-5 h-5" /> Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => signIn("credentials")}
                                className="flex items-center gap-1 text-green-600 hover:text-green-800"
                            >
                                <LogIn className="w-5 h-5" /> Sign In
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow-md">
                    <Link href="/" className="block hover:text-blue-600">
                        Home
                    </Link>
                    <Link href="/dashboard" className="block hover:text-blue-600">
                        Dashboard
                    </Link>
                    {status === "authenticated" ? (
                        <>
                            <span className="block flex items-center gap-1">
                                <UserIcon className="w-5 h-5" /> {user?.name}
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="block w-full text-left flex items-center gap-1 text-red-600 hover:text-red-800"
                            >
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => router.push("/sign-in")}
                            className="block w-full text-left flex items-center gap-1 text-green-600 hover:text-green-800"
                        >
                            <LogIn className="w-5 h-5" /> Sign In
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
