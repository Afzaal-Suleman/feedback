"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User.model";
import { toast } from "sonner";

export function MessageCard({
  message,
  onMessageDelete,
}: {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}) {
    
  const handleDeleteMessage = async () => {
    try {
      const response = await fetch(`/api/delete-message/${message._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Message deleted successfully");
        onMessageDelete(message._id as string);
      } else {
        toast.error(data.message || "Failed to delete message");
      }
    } catch (error) {
      toast.error("Error deleting message");
      console.error(error);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border border-gray-200 rounded-xl">
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-base font-semibold text-gray-800">
          {message.content}
        </CardTitle>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-red-500"
          onClick={handleDeleteMessage}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-500">
          Received on:{" "}
          <span className="font-medium text-gray-700">
            {new Date(message.createdAt).toLocaleString()}
          </span>
        </p>
      </CardContent>

      <CardFooter className="text-sm text-gray-400">
        {/* Message ID: {message?._id} */}
      </CardFooter>
    </Card>
  );
}
