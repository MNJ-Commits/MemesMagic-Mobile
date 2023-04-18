import {useMutation, UseMutationOptions} from '@tanstack/react-query';


const usePostCustomRendersRequest = async (text: any)=>{
        
    try {
        const response = await fetch('http://18.143.157.105:3000/renderer/render', 
            {
                method: 'POST',
                body: JSON.stringify({ "text": text.text, "uids": [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11" ] }),
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
