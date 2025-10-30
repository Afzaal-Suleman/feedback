"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Message, User } from "@/model/User.model";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MessageCard } from "@/components/MessageCard";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  const { data: session, status } = useSession();
  const user = session?.user as User | undefined;

  const form = useForm({
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  // Fetch accept message setting
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await fetch("/api/accept-messages");
      const data = await res.json();

      if (data.success) {
        setValue("acceptMessages", data.isAcceptingMessage, {
          shouldDirty: true,
        });
      } else {
        toast.error(data.message || "Failed to fetch settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/get-messages");
      const data = await res.json();

      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message || "Failed to fetch messages");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data when session is ready
  useEffect(() => {
    if (status === "authenticated") {
      fetchMessages();
      fetchAcceptMessages();
    }
  }, [status, fetchMessages, fetchAcceptMessages]);

  // Handle switch toggle
  const handleSwitchChange = async () => {
    try {
      setIsSwitchLoading(true);
      const res = await fetch("/api/accept-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptMessages: !acceptMessages }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Settings updated successfully");
        setValue("acceptMessages", data.isAcceptingMessage, {
          shouldDirty: true,
        });
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating settings");
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // Set profile URL on client side
  useEffect(() => {
    if (typeof window !== "undefined" && user?.username) {
      setProfileUrl(`${window.location.origin}/u/${user.username}`);
    }
  }, [user?.username]);

  // Copy URL function
  const copyToClipboard = async () => {
    if (!profileUrl) return;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      toast.success("Profile URL copied!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy URL");
    }
  };

  // Delete message locally after API delete (optional future improvement)
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  };

  // Handle loading / auth state
  if (status === "loading") {
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;
  }

  if (!session) {
    return (
      <p className="text-center mt-20 text-red-500 font-medium">
        Please sign in to access your dashboard.
      </p>
    );
  }

  //Main dashboard
  return (
    <div className="p-6 space-y-6">
      {/* Accept Messages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Accept Messages</CardTitle>
          <Switch
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
        </CardHeader>
        {isSwitchLoading && (
          <CardDescription>Updating setting...</CardDescription>
        )}
      </Card>

      {/* Profile URL */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 break-all">{profileUrl}</p>
          <Button onClick={copyToClipboard} variant="outline">
            {isCopied ? "Copied!" : "Copy URL"}
          </Button>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-gray-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-500">No messages found.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg:any) => (
                <MessageCard
                  key={msg._id}
                  message={msg}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
