import {useMutation, UseMutationOptions} from '@tanstack/react-query';


const usePostAppleAccessTokenRequest = async (params: any)=>{
        
    console.log('apple AccessToken params: ',params);
    try {
        const response = await fetch('http://18.143.157.105:3000/auth/sso/apple', 
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

export function usePostAppleAccessToken(
  options?: UseMutationOptions<any, Error, string, any>,
) {
  return useMutation(usePostAppleAccessTokenRequest, options);
}
