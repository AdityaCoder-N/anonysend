import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
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
  } from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Trash, Trash2, X } from 'lucide-react'
import { Message } from '@/model/User'
import { useToast } from './ui/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardProps = {
    message:Message,
    onMessageDelete:(messageId:string)=>void
}

const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {

  const {toast} = useToast();

  const handleDeleteConfirm = async()=>{
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message?._id}`);
    toast({
        title:response.data.message
    })
    onMessageDelete(message?._id as string);
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  
    const formattedDate = `${month} ${day}, ${year} ${hours}:${minutesStr} ${ampm}`;
    return formattedDate;
  }
  

  return (
    <Card  className='relative'>
        <CardHeader>
            <CardTitle className='md:text-2xl'>{message.content}</CardTitle>

            {/* Alert Dialog */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Trash className='w-6 h-6 absolute top-2 right-4 text-red-500 cursor-pointer'/>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardHeader>
        
        <CardFooter>
            <p className='text-sm'>{formatDate(message.createdAt.toString())}</p>
        </CardFooter>
    </Card>

  )
}

export default MessageCard