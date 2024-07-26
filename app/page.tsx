'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";

import sittingMan from '../assets/man-sitting.svg'
import planet from '../assets/planet.svg'
import manOnPhone from '../assets/man-on-phone.svg'
import manOnLaptop from '../assets/man-on-laptop.svg'

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className="w-[90%] min-h-[90vh] relative flex flex-col items-center">
      <div className="w-full mt-24 sm:mt-20 text-center text-white ">
        <h1 className="font-grotesk md:text-[80px] md:leading-[85px] font-bold">Welcome to</h1>
        <h1 className="font-grotesk  text-[40px] leading-[40px] md:text-[80px] md:leading-[85px]  text-3xl font-bold">Anonysend</h1>
      </div>
      <div className="text-center mt-4 text-white w-[90%] sm:w-2/3 ">
        <p className="text-lg font-sofia">Send Anonymous text messages to your friends! Let them know how you feel about them, Propose your crush, Rant about your boss , do whatever you feel like, anonymously.</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button 
            className="px-4 py-[6px] rounded-lg bg-teal-600 text-xs md:text-base"
            onClick={()=>router.replace('/sign-up')}
          >Sign Up here</Button>
          <Button 
            className="px-4 py-[6px] rounded-lg bg-transparent border border-teal-600 text-xs md:text-base"
            onClick={()=>router.replace('/u/aditya')}
          >Message Me</Button>
        </div>
      </div>
      <Image src={planet} alt="planet" className="w-[150px] sm:w-[200px] md:h-[250px] lg:h-[350px] md:w-fit absolute -left-4 sm:-left-8 -top-[20%] sm:-top-20 md:-top-8 planet "></Image>

      <Image src={manOnPhone} alt="manOnPhone" className="hidden sm:block absolute h-[250px] md:h-[300px] lg:h-[350px] w-fit  left-0 md:left-[2%] lg:left-20 bottom-0"></Image>

      <Image src={sittingMan} alt="sitting man" className="h-[220px] sm:h-[300px] md:h-[350px] lg:h-[450px] w-fit absolute right-[-40px] sm:right-[-50px] md:-right-20 bottom-0"></Image>
    
    </div>
  );
}
