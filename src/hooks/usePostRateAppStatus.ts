import {QueryKey, useQuery, UseQueryOptions} from '@tanstack/react-query';

const usePostRateAppStatusRequest = async <T>()=>{

    try {
        const response = await fetch('http://104.131.250.165:3015/all_app/api/list_app_setting',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body:  JSON.stringify({ "app_id": "com.MemesWork" })
            },
        )    
        const data = await response?.json()        
        // console.log("data?.data: ", data );
        
        return data?.data
    }
    catch (err:any) {
        throw new Error(err.response?.data?.message);
    }
}



export function usePostRateAppStatus<T>( 
    options: UseQueryOptions<T, Error, T>,
  ) {
    return useQuery(
      ['appRateStatus'] as QueryKey, 
      () => usePostRateAppStatusRequest<T>(), 
      options)
  }