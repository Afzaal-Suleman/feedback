"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, LogIn, Link as LinkIcon, MessageSquare, Eye, ShieldOff } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to FeedbackApp Dashboard</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            FeedbackApp helps you collect honest feedback from users or teammates through your personalized feedback link.
            Manage your messages and control your feedback settings all in one place.
          </p>
        </div>

        {/* Step Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <UserPlus className="w-10 h-10 text-blue-600 mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">1. Sign Up</h2>
              <p className="text-gray-600 text-sm mt-2">
                Create your account to start using FeedbackApp and access your admin dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <LogIn className="w-10 h-10 text-green-600 mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">2. Sign In</h2>
              <p className="text-gray-600 text-sm mt-2">
                Log in securely to view and manage all feedback related to your account.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <LinkIcon className="w-10 h-10 text-purple-600 mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">3. Generate Feedback URL</h2>
              <p className="text-gray-600 text-sm mt-2">
                Get your unique feedback link like:
                <span className="block bg-gray-100 rounded-md text-xs mt-2 p-1">
                  http://localhost:3001/u/yourusername
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <MessageSquare className="w-10 h-10 text-orange-500 mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">4. Receive Feedback</h2>
              <p className="text-gray-600 text-sm mt-2">
                Anyone can send you messages anonymously through your shared link.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Eye className="w-10 h-10 text-teal-600 mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">5. View Messages</h2>
              <p className="text-gray-600 text-sm mt-2">
                Visit your dashboard anytime to read and manage received messages.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <ShieldOff className="w-10 h-10 text-red-600 mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">6. Stop Feedback</h2>
              <p className="text-gray-600 text-sm mt-2">
                You can disable feedback collection from your settings whenever you want.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Section */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Why Use FeedbackApp?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            FeedbackApp provides a simple and secure way to gather honest feedback from anyone.  
            You stay in control — receive, read, or stop feedback anytime, all within a clean and intuitive interface.
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pt-10">
          © {new Date().getFullYear()} FeedbackApp — Admin Dashboard
        </footer>
      </div>
    </div>
  );
}
