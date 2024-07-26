'use client'

import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse'

import { Form, FormControl, FormField, FormDescription, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import {Input} from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import {Loader2} from 'lucide-react'

const Page = () => {
  const router= useRouter();
  const params = useParams<{username:string}>();
  const { toast }= useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver:zodResolver(verifySchema),
    defaultValues:{
        code:''
    }
  })

  const onsubmit = async(data:z.infer<typeof verifySchema>)=>{
    try {
        const response = await axios.post(`/api/verify-code`,{
            username:params.username,
            code:data.code
        })

        if(response.data?.success){
            toast({
                title:"Success",
                description:response.data?.message
            })
            router.replace('/sign-in');
        }
    } catch (error) {
        console.error("Error in verifying User",error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
            title:"Failed",
            description:axiosError?.response?.data?.message,
            variant:"destructive"
        })
    }
  }
  return (
    <div className='bg-gray-100 flex justify-center items-center min-h-screen w-full'>
        <div className='bg-white rounded-lg w-[90%] md:w-1/3 p-6 shadow-lg'>
            <div className='flex flex-col gap-1 mb-4'>
                <h2 className='text-3xl font-bold'>Verify Account</h2>
                <p className='text-sm text-slate-500'>Verify your account by submitting the OTP sent to your email.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
                    <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                            <Input placeholder="code" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default Page