"use client"
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { verifySchema } from '@/schemas/verifySchema'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import * as z from "zod"
export default function page() {
    const router = useRouter()
    const { username } = useParams<{ username: string }>();
    //zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof verifySchema>) => {
        try {
            const response = await fetch('/api/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, code: values.code }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || "Verification successful!");

                router.push('/dashboard');
            } else {
                toast.error(data.message || "Verification failed. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying:", error);
            toast.error("Error verifying");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2 text-center">
                    Verify your Account
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300  text-center">
                    Please enter the verification code sent to your email.
                </p>
                <br />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">


                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className='mt-4'>
                                    <FormLabel className="text-slate-700 dark:text-slate-300">
                                        Verification Code
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your verification code"
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
                        >
                            Verify
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
