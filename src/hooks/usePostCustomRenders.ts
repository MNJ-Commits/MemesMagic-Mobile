import {useMutation, UseMutationOptions} from '@tanstack/react-query';


const usePostCustomRendersRequest = async (params: any)=>{
        
    console.log('params: ',params);
    try {
        const response = await fetch('http://18.143.157.105:3000/renderer/render', 
            {
                method: 'POST',
                body: JSON.stringify({...params }),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            })    
        const data = await response?.json()        
        return data?.data
    }
    catch (err:any) {
        throw new Error(err.response?.data?.message);
    }
}

export function usePostCustomRenders(
  options?: UseMutationOptions<any, Error, string, any>,
) {
  return useMutation(usePostCustomRendersRequest, options);
}
