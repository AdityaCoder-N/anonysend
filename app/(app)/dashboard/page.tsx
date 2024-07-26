'use client'
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

const Page = () => {
  const [messages,setMessages] = useState<Message[]>([]);
  const [isLoading,setIsLoading] = useState(false);
  const [isSwitchLoading,setIsSwitchLoading] = useState(false);
  const [username,setUsername] = useState('');
  const {data:session} = useSession();

  const {toast} = useToast();

  const handleDeleteMessage = async(messageId:string)=>{
    setMessages(messages.filter((message:Message)=>message._id!==messageId));
  }

  const form = useForm({
    resolver:zodResolver(acceptMessageSchema),
    defaultValues:{
      acceptMessages:true
    }
  })

  const {register,watch,setValue} = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async ()=>{
    setIsSwitchLoading(true);

    try {
      const response = await axios.get('/api/accept-messages');
      setValue('acceptMessages',response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description:axiosError?.response?.data.message || "Failed to fetch message setting",
        variant:'destructive'
      })
    } finally{
      setIsSwitchLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[setValue])

  const fetchMessages = useCallback(async (refresh:boolean = false)=>{
    setIsLoading(true);
    setIsSwitchLoading(false);

    try {
      const response = await axios.get(`/api/get-messages`);
      setMessages(response?.data?.messages || []);
      if(refresh){
        toast({
          title:"Refreshed Messages",
          description:"Showing Latest Messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description:axiosError?.response?.data.message || "Failed to fetch messages",
        variant:'destructive'
      })
    } finally{
      setIsSwitchLoading(false);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[setIsLoading,setMessages]);

  useEffect(()=>{
    if(!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessage();

    const {username} = session?.user as User
    setUsername(username as string);

  },[session,setValue,fetchAcceptMessage,fetchMessages]);

  //handle switch change
  const handleSwitchChange = async()=>{
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`,{
        acceptMessages:!acceptMessages
      });
      setValue('acceptMessages',!acceptMessages);
      toast({
        title:response.data.message,
        variant:'default'
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description:axiosError?.response?.data.message || "Failed to fetch messages",
        variant:'destructive'
      })
    } finally{
      setIsSwitchLoading(false);
    }
  }

  
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard=()=>{
    navigator.clipboard.writeText(profileUrl);
    toast({
      title:"Url Copied!",
      description:"Profile Url has been copied to clipboard."
    })
  }

  if(!session || !session.user){
    return(
      <div className='text-center text-white font-semibold text-2xl min-h-[90vh] bg-gradient-to-r from-[#8234d5] to-[#4e0a97]'>
        Please Login to access this page.
      </div>
    )
  }

  return (
    <div className='mx-auto rounded min-h-screen w-full '>
      <h1 className='text-3xl font-bold mb-4 mt-4 text-white'>User Dashboard</h1>

      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2 font-sofia text-white'>Copy Your Unique Link</h2>{' '}
        <div className='flex items-center'>
          <input 
            type="text" 
            value={profileUrl}
            disabled
            className='input input-bordered w-full p-2 mr-2'
          />
          <Button onClick={copyToClipboard} className='bg-teal-600'>Copy</Button>
        </div>
      </div>

      <div className='mb-4 text-white flex items-center'>
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-2'>
          Accept Messages: {acceptMessages?'On':'Off'} 
        </span>
      </div>
      <Separator/>

      <div className='mt-4 flex items-center gap-4'>
        <h3 className='text-2xl font-bold font-sofia text-white'>Your Messages</h3>
        <Button 
          className=''
          variant='outline'
          onClick={(e)=>{
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading? (
            <Loader2 className='h-4 w-4 animate-spin'/>
          ):(
            <RefreshCcw className='h-4 w-4'/>
          )
          }
        </Button>
      </div>

      <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pb-6'>
        {
          messages.length>0 ? (
            messages.map((message,index)=>{
              return(
              <MessageCard
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />)
            })
          ) : (
            <p className='text-xl'>No Messages found yet...</p>
          )
        }
      </div>
    </div>
  )
}

export default Page