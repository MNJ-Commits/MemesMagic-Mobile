import { QueryKey, UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query"
import { loadAppleAccessTokenFromStorage } from "../store/asyncStorage"

const useGetCustomTemplateByIdRequest = async<T>(params:string)=>{

  console.log("params: ",params);
  
  const access_token = await loadAppleAccessTokenFromStorage().catch((error:any)=>{
    console.log('loadAppleAccessTokenFromStorage Error: ', error);
  })

  const headers:any  = access_token ? { 'Content-Type': 'application/json', "X-ACCESS-TOKEN": `${access_token}` }
                       : {  'Content-Type': 'application/json' }
  try {
    const response = await fetch( `http://18.143.157.105:3000/assets/templates/${params.uid}`, 
      {
        method: 'GET',
        headers: headers
      }
    )    
    const data = await response?.json()        
    return data?.data
  } catch (err: any) {

    console.log("err catch: ", err);
    throw new Error(err.response.data.message);
  }
}

export function useGetCustomTemplateById(
  options?: UseMutationOptions<any, Error, string, any>,
) {
  return useMutation(useGetCustomTemplateByIdRequest, options);
}