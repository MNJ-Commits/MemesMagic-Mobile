import {QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions} from '@tanstack/react-query';
import { loadAppleAccessTokenFromStorage } from '../store/asyncStorage';

const usePostForceAppStatusRequest = async <T>()=>{

    try {
        const response = await fetch('http://104.131.250.165:3015/all_app/api/list_app_setting'+ new URLSearchParams({"app_id" : "com.MemeWork"}), 
            {
                method: 'POST',
                // body: new URLSearchParams({"app_id" : "com.MemeWork"}),
            },
        )    
        const data = await response?.json()        
        console.log("data?.data: ", response );
        
        return data?.data
    }
    catch (err:any) {
        throw new Error(err.response?.data?.message);
    }
}



export function usePostForceAppStatus<T>( 
    options: UseQueryOptions<T, Error, T>,
  ) {
    return useQuery(
      ['appRateStatus'] as QueryKey, 
      () => usePostForceAppStatusRequest<T>(), 
      options)
  }