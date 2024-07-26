import {useRef} from 'react'

export const useThrottle =(callback:Function,delay:number)=>{

    const lastExecuted = useRef(Date.now());

    return (...args:any[])=>{
        const now = Date.now();

        if(now - lastExecuted.current >= delay){
            lastExecuted.current = now;
            callback(...args);
        }
    };

}