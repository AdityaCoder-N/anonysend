import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function GET(req:Request){

    const getRandomContext = () => {
        const contexts = [
          "for a school event",
          "during a long trip",
          "at a family gathering",
          "in a professional setting",
          "among friends at a party",
          "at college",
          "in a party",
          "at the cinema"
        ];
        return contexts[Math.floor(Math.random() * contexts.length)];
      };

    const prompt = `Create a list of three open-ended engaging questions formatted as a single string. Each question should be separated by '||' and each question should be random every time. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. Consider different contexts or scenarios each time you generate these questions. Context: ${getRandomContext()}`;

    try {

        const google = createGoogleGenerativeAI({
            apiKey:process.env.GEMINI_API_KEY || ""
        })
        const { text } = await generateText({
            model: google('models/gemini-pro'),
            prompt: prompt,
        });

        return Response.json({message:"AI Response generated Successfully",success:true,text:text},{status:200});
    
    } catch (error) {
        console.error("Error Generating AI Responses",error);
        return NextResponse.json({success:false,message:"Error Generating AI Responses"},{status:500});
    }
    
}