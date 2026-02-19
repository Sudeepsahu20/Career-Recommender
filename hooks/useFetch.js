import React, { useState } from 'react'
import { toast } from 'sonner';


const useFetch = (cb) => {
    const [data,setData]=useState(undefined);
    const [isLoading,setIsLoading]=useState(false);
    const [error,setError]=useState(null);

    
    const fun=async(...args)=>{
        setIsLoading(true);
        setError(null);
       try {
         const response= await cb(...args);
        setData(response);
        setError(null);
        return response;
       } catch (error) {
          setError(error);
          toast.error(error.message);
       }finally{
        setIsLoading(false);
       }
    }

  return {data,isLoading,fun,setData,error}
}

export default useFetch