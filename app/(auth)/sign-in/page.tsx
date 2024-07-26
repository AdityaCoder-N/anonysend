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
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'

const Page = () => {

  
  const [isSubmitting,setIsSubmitting] = useState(false);

  const {toast} = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues: {
      email:'',
      password:''
    }
  })

  const onsubmit = async(data:z.infer<typeof signInSchema>)=>{
    setIsSubmitting(true);

    try {
      const {email,password} = data;
      const result = await signIn('credentials',{
        redirect:false,
        email:email,
        password:password
      })
      console.log(result);
  
      if(result?.error){
        toast({
          title:'Login Failed',
          description:"Incorrect Username or Password",
          variant:"destructive"
        })
      }
  
      if(result?.url){
        router.replace('/dashboard');
      }
    } catch (error) {
      console.log("Error logging in User",error);
      toast({
        title:'Login Failed',
        description:"Incorrect Username or Password",
        variant:"destructive"
      })
    } finally{
      setIsSubmitting(false);
    }
    
  }

  return (
    <div className='bg-gradient-to-r from-[#8234d5] to-[#4e0a97] flex justify-center items-center min-h-[90vh] w-full'>
        <div className='bg-white rounded-lg w-[90%] md:w-1/3 p-6 shadow-lg'>
            <div className='flex flex-col gap-1 mb-4'>
                <h2 className='text-3xl font-bold text-[#4e0a97]'>Sign In</h2>
                <p className='text-sm text-slate-500'>Welcome to Anonysend, share anonymous messages with your friends.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)}>
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-[#4e0a97]'>Email</FormLabel>
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
                            <FormLabel className='text-[#4e0a97]'>Password</FormLabel>
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
                    <Button type='submit' disabled={isSubmitting} className='mt-4 bg-[#4e0a97] w-full'>
                    {
                        isSubmitting?(
                            <>
                            <Loader2 className='animate-spin h-4 w-4 mr-2'/> 
                            Please Wait
                            </>
                        ): ('Sign In')
                    }   
                    </Button>
                </form>
            </Form>
            <div className='mt-4'>
                <p className='text-center text-[#4e0a97]'>
                    Not a member?{' '}
                    <Link href='/sign-up' className='text-teal-600 font-bold'>Sign Up here.</Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default Page