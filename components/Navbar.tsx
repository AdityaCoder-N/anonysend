'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import { User } from 'next-auth'

import { Button } from './ui/button'
import { HamIcon, List, LucideHam, X } from 'lucide-react'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
const Navbar = () => {

  const {data:session} = useSession();

  const user:User = session?.user as User;

  const [showMenu,setShowMenu] = useState(false);

  return (
    <nav className='h-[10vh] py-4 w-[90%]'>
        <div className='flex justify-between items-center text-white'>
            <a className='text-2xl font-bold font-grotesk' href="#">Anonysend</a>
            <div className='hidden md:flex justify-between gap-8 w-fit font-sofia text-lg'>
              <a href="">Home</a>
              <a href="">About</a>
              <a href="">Contact</a>
            </div>
            {
              session? (
                <>
                <Button className='hidden md:block w-full md:w-auto' onClick={()=>signOut()}>LogOut</Button>
                </>
              ) : (
                <Link href='/sign-in'>
                    <Button className='hidden md:block w-full md:w-auto border border-violet-700 text-white bg-transparent hover:border-teal-600'>Login Here</Button>
                </Link>
              )
            }

            <HamburgerMenuIcon className='md:hidden h-6 w-6' onClick={()=>setShowMenu(true)}/>
            
              <div onClick={(e)=>e.stopPropagation()} className={`fixed top-0 left-0 bg-gradient-to-r from-teal-500 to-teal-800 h-[100vh] ${showMenu?'w-3/4':'w-0'} z-50 transition-all`}>
                <div className={`${showMenu?'flex':'hidden'} flex-col items-center justify-center gap-8 font-sofia text-lg h-full`}>
                  <a href="">Home</a>
                  <a href="">About</a>
                  <a href="">Contact</a>
                  <X className='h-7 w-7 cursor-pointer' onClick={()=>setShowMenu(false)}/>
                </div>
              </div>
            
        </div>
    </nav>
  )
}

export default Navbar