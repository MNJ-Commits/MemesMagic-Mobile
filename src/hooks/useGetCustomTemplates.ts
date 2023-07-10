import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { loadAppleAccessTokenFromStorage } from "../store/asyncStorage"

const useGetCustomTemplatesRequest = async<T>(tag: string, page:number, limit: number)=>{
  
  let URI: string = `http://18.143.157.105:3000/assets/templates?p=${page}&l=${limit}`
    // page==1 ? URI += `&l=${limit}` : ''
    tag ? URI += `&tag=${tag}` : ''

  const access_token = await loadAppleAccessTokenFromStorage().catch((error:any)=>{
    console.log('loadAppleAccessTokenFromStorage Error: ', error);
  })
  // console.log("access_token: ", access_token);
  

  const headers:any  = access_token ? { 'Content-Type': 'application/json', "X-ACCESS-TOKEN": `${access_token}` }
                       : {  'Content-Type': 'application/json' }
  console.log("URI: ",URI);
  
  try {
    const response = await fetch(URI, 
      {
        method: 'GET',
        headers: headers
      }
    )    
    const data = await response?.json()   
    // console.log("data?.data: ", data?.data);
         
    return data?.data
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}


export function useGetCustomTemplates<T>( 
  tag: string,
  page: number,
  limit: number,
  options: UseQueryOptions<T, Error, T>,
) {
  return useQuery(
    ['assets/templates'] as QueryKey, 
    () => useGetCustomTemplatesRequest<T>(tag, page, limit), 
    options)
}
