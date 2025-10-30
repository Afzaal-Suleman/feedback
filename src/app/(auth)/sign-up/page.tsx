"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { signUpSchema } from "@/schemas/signUpSchema"
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

export default function page() {
    const [username, setUername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debouncedUsername = useDebounceCallback(setUername, 300)
    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        const checkUsername = async () => {
            // Only check when username length is within valid range
            if (username) {
                setIsCheckingUsername(true)
                // setUsernameMessage("")

                try {
                    const response = await fetch(`/api/check-username-unique?username=${username}`)
                    const data = await response.json()

                    if (data.isUnique) {
                        setUsernameMessage(data.message || "Username is available")
                    } else {
                        setUsernameMessage(data.message)
                    }
                } catch (error) {
                    console.error("Error checking username:", error)
                    setUsernameMessage("Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            } else {
                // Clear message if username too short
                setUsernameMessage("")
            }
        }

        checkUsername()
    }, [username])


    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            const data = await response.json()
            if (response.ok) {
                toast.success(data.message)
                router.replace(`/verify/${username}`)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Error signing up:", error)
            toast.error("Error signing up")
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 text-center">
                    Create an Account
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }: any) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 dark:text-slate-300">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debouncedUsername(e.target.value)
                                            }}
                                            className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:ring-slate-500"
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    <FormDescription className={`text-sm' ${usernameMessage === "Username is available" ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {!isCheckingUsername && usernameMessage && (<span>{usernameMessage}</span>)}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 dark:text-slate-300">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="you@example.com"
                                            type="email"
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
                            {isSubmitting ? "Creating..." : "Sign Up"}
                        </Button>
                        <p className="text-sm text-gray-600 mt-4 text-center">
                            Already have an account?{" "}
                            <Link
                                href="/sign-in"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    )
}