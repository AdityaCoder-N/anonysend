'use client'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'

import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { signupSchema } from '@/schemas/signUpSchema'

import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormDescription, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import {Input} from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import {Loader2} from 'lucide-react'

const Page = () => {

  const [username,setUsername] = useState('');
  const [usernameMessage,setUsernameMessage] = useState('');
  const [isCheckingUsername,setIsCheckingUsername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);

  const setDebouncedUsername = useDebounceCallback(setUsername, 300)

  const {toast} = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver:zodResolver(signupSchema),
    defaultValues: {
      username:'',
      email:'',
      password:''
    }
  })

  useEffect(()=>{
     const checkUsernameUnique = async() => {
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessage('');
      }
      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`);
        console.log(response.data);
        setUsernameMessage(response.data?.message);

      } catch (error) {
        console.error("Error in Checking username uniqueness",error);
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
            axiosError.response?.data?.message ?? "Error checking Username"
        );
      } finally{
        setIsCheckingUsername(false);

      }
     }
     checkUsernameUnique();
  },[username])

  const onsubmit = async(data:z.infer<typeof signupSchema>)=>{
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up',data);

      if(response.data.success){
        toast({
          title:'Success',
          description:response.data.message
        })
        router.replace(`/verify/${username}`);
      }
      else{
        toast({
          title:'Sign Up Failed',
          description:'Failed to sign up user, Please try again later.',
          variant:'destructive'
        })
      }
    } catch (error) {
      console.error("Error in submitting form",error);
    } finally{
      setIsSubmitting(false);
    }
  }

  return (
    <div className='bg-gray-100 flex justify-center items-center min-h-screen w-full'>
        <div className='bg-white rounded-lg w-[90%] md:w-1/3 p-6 shadow-lg'>
            <div className='flex flex-col gap-1 mb-4'>
                <h2 className='text-3xl font-bold'>Sign Up</h2>
                <p className='text-sm text-slate-500'>Welcome to Anonysend, share anonymous messages with your friends.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)}>
                <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Enter Username" 
                                    {...field} 
                                    onChange={(e)=>{
                                        field.onChange(e);
                                        setDebouncedUsername(e.target.value);
                                    }}
                                />
                            </FormControl>
                            {isCheckingUsername && <Loader2 className='h-4 w-4 animate-spin'/>}

                            <p className={`text-sm ${usernameMessage==="Username is available"?'text-green-500':'text-red-500'}`}>
                                {usernameMessage}
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className='mt-3'>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Enter Email" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className='mt-3'>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input 
                                    type='password'
                                    placeholder="Enter Password" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type='submit' disabled={isSubmitting} className='mt-4'>
                    {
                        isSubmitting?(
                            <>
                            <Loader2 className='animate-spin h-4 w-4 mr-2'/> 
                            Please Wait
                            </>
                        ): ('Sign Up')
                    }   
                    </Button>
                </form>
            </Form>
            <div className='mt-4'>
                <p className='text-center'>
                    Already a member?{' '}
                    <Link href='/sign-in' className='text-sky-500'>Sign In here.</Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default Page