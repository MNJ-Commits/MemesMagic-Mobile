import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { loadAppleAccessTokenFromStorage } from "../store/asyncStorage"

const useGetCustomTemplatesRequest = async<T>(tag: string)=>{
  
  let URI: string = 'http://18.143.157.105:3000/assets/templates'
      tag ? URI += `?tag=${tag}` : ''

  const access_token = await loadAppleAccessTokenFromStorage().catch((error:any)=>{
    console.log('loadAppleAccessTokenFromStorage Error: ', error);
  })
  // console.log("access_token: ", access_token);
  // console.log("URI: ", URI);
  

  const headers:any  = access_token ? { 'Content-Type': 'application/json', "X-ACCESS-TOKEN": `${access_token}` }
                       : {  'Content-Type': 'application/json' }

  try {
    const response = await fetch(URI, 
      {
        method: 'GET',
        headers: headers
      }
    )    
    const data = await response?.json()        
    return data?.data
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}


export function useGetCustomTemplates<T>( 
  tag: string,
  options: UseQueryOptions<T, Error, T>,
) {
  return useQuery(
    ['assets/templates'] as QueryKey, 
    () => useGetCustomTemplatesRequest<T>(tag), 
    options)
}
