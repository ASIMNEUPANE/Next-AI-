import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import useDelete from "@/hooks/useDelete";
import { useEffect } from "react";
import mongoose from "mongoose";
import dayjs from "dayjs";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const {
    data: DeleteData,
    deleteMutation,
    error,
    isError,
    isPending,
    isSuccess,
  } = useDelete("user");

  const handleDeleteConfirm = async () => {
    await deleteMutation({ urls: `delete-message/${message?._id}` });
    onMessageDelete(message?._id as string);
  };

  useEffect(() => {
    if (DeleteData?.success) {
      toast({
        title: "Success",
        description: DeleteData?.message,
      });
    } else if (error) {
      toast({
        title: "Signup failed",
        //@ts-ignore
        description: error?.response?.data?.message,
        variant: "destructive",
      });
      console.log("error in signup of user", error?.message);
    }
  }, [DeleteData, error]);
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export default MessageCard;
