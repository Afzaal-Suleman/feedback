"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,

} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { signInSchema } from "@/schemas/signInschema"
export default function page() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })


    const onSubmit = async (values: z.infer<typeof signInSchema>) => {
        try {
            setIsSubmitting(true);

            const result = await signIn("credentials", {
                redirect: false, // Prevents NextAuth auto-navigation
                identifier: values.identifier,
                password: values.password,
            });
            console.log("Sign-in result:", result);

            // Corrected condition: Check if the sign-in was NOT OK
            if (!result?.url) {
                // Sign-in failed
                toast.error(result?.error || "Sign-in failed");
            } else if (result.url) {
                // Sign-in succeeded
                toast.success("Signed in successfully!");
                form.reset();
                router.push("/"); // redirect after success
            } else {
                // Catch any unexpected case
                toast.error("Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error("Sign-in error:", err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false); // Stop loading in all cases
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 text-center">
                    Create an Account
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 dark:text-slate-300">
                                        Email/Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=" email/username"
                                            // type="email"
                                            {...field}
                                            className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:ring-slate-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 dark:text-slate-300">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type="password"
                                            {...field}
                                            className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:ring-slate-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700"
                        >
                            {isSubmitting ? "..." : "Sign In"}
                        </Button>

                        <p className="text-sm text-gray-600 mt-4 text-center">
                            Don't have an account?{" "}
                            <Link
                                href="/sign-up"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    )
}