// app/u/[username]/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  content: z.string().min(1, "Feedback cannot be empty"),
});

type FormData = z.infer<typeof schema>;

export default function FeedbackPage({ params }: { params: { username: string } }) {
  const { username } = params;
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          content: data.content,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Feedback sent!");
        reset();
      } else {
        toast.error(result.message || "Failed to send feedback");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Send Feedback to {username}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <textarea
              {...register("content")}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your feedback..."
              rows={4}
            ></textarea>
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
