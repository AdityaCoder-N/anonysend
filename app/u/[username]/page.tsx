'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation';

import * as z from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '@/schemas/messageSchema';

import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Dices, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

import { useThrottle } from '@/hooks/useThrottle';

const Page = () => {

  const {toast} = useToast();
  const {username} = useParams();

  const [isSubmitting,setIsSubmitting] = useState(false);
  const [isFetchingMessageSuggestions,setIsFetchingMessageSuggestions] = useState(false);
  const [suggestedMessages,setSuggestedMessages] = useState([]);
  const [textAreaMessage,setTextAreaMessage] = useState('');


  const form = useForm({
    resolver:zodResolver(messageSchema),
    defaultValues:{
      content:'',
    }
  })
  const {setValue} = form;

  const sendMessage=async(data:z.infer<typeof messageSchema>)=>{
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message',{
        username,
        content:data.content
      });
      console.log(response);

      if(response.data.success){
        toast({
          title:"Message Sent",
          description:`Your message has been sent to @${username} successfully.`
        });
      }
    } catch (error) {
      console.log("Erros seding message to user",error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description:axiosError?.response?.data?.message || "Failed to send message.",
        variant:'destructive'
      })
    } finally{
      setIsSubmitting(false)
    }
  }

  const fetchMessageSuggestions = async()=>{
    setIsFetchingMessageSuggestions(true);
    try {
      const response = await axios.get('/api/suggest-messages');
      console.log(response);

      const texts = response.data?.text;
      const suggestions = texts.split('||');
      console.log(suggestions);
      setSuggestedMessages(suggestions);

    } catch (error) {
      console.log("Erros sending message to user",error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description:axiosError?.response?.data?.message || "Failed to fetch Suggestions.",
        variant:'destructive'
      })
    } finally{
      setIsFetchingMessageSuggestions(false);
    }
  }
  const throttledFetchMessageSuggestions = useThrottle(fetchMessageSuggestions, 2000); // 2000 milliseconds = 2 seconds


  const copyToTextArea = (message:string)=>{
    setValue('content',message);
    navigator.clipboard.writeText(message);
    toast({
      title:"Message Copied!",
      description:"Suggested Message has also been copied to clipboard."
    })
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded  bg-gray-100 min-h-screen w-full max-w-6xl'>
      <h1 className='text-3xl font-bold text-center mb-6'>Public Profile Link</h1>

      <div className=''>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(sendMessage)}>
            <FormField 
              name='content'
              control={form.control}
              render={({field})=>(
                <FormItem className='mt-3'>
                  <FormLabel id='content'>Send Anonymous messages to @{username}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your message here." 
                      id="content" 
                      className='border border-black rounded-lg'
                      {...field}
                    />
                  </FormControl>
                  {
                    form.formState.errors && (
                      <p className='text-red-500 mt-2'>{form.formState.errors?.content?.message}</p>
                    )
                  }
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting} className='mt-4 mx-auto'>
            {
                isSubmitting?(
                    <>
                    <Loader2 className='animate-spin h-4 w-4 mr-2'/> 
                    Please Wait
                    </>
                ): ('Send It')
            }   
            </Button>
          </form>
        </Form>
      </div>
      <Separator className='my-4 w-full'/>
      {/* <Button className='mb-2' onClick={fetchMessageSuggestions}>Suggest Messages</Button> */}
      <div className='mb-4 flex justify-between md:justify-start gap-4 items-center'>
        <h4 className='text-xl font-bold'>Click on any message below to select it</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Dices className='cursor-pointer h-6 w-6' onClick={throttledFetchMessageSuggestions}/>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get New Messages</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
      </div>
      <div className='flex flex-col gap-4'>
      {
        suggestedMessages.length>0 && (
          suggestedMessages.map((message,index)=>{
            return(
              <div onClick={()=>copyToTextArea(message)} key={index} className='px-2 py-3 border rounded-lg bg-gray-200 cursor-pointer'>
                {message}
              </div>
            )
          })
        )
      }
      </div>

    </div>
  )
}

export default Page