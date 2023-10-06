import {useMutation, UseMutationOptions} from '@tanstack/react-query';
import { loadAppleAccessTokenFromStorage } from '../store/asyncStorage';


const usePostCustomRendersRequest = async (data: any)=>{
        

    // const access_token = await loadAppleAccessTokenFromStorage().catch((error:any)=>{
    //     console.log('loadAppleAccessTokenFromStorage Error: ', error);
    // })

    const {access_token , ...params} = data
    // console.log('params: ',params);
    // console.log('access_token: ',access_token);

    try {
        const response = await fetch('http://18.143.157.105:3000/renderer/render', 
            {
                method: 'POST',
                body: JSON.stringify({...params }),
                headers: access_token ? { 'Content-Type': 'application/json', "X-ACCESS-TOKEN": `${access_token}` } : {  'Content-Type': 'application/json' }
            })    
        const data = await response?.json()        
        // console.log("data?.data: ", response.status );
        
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
