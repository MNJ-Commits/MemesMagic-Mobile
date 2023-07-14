import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

const useGetBannerTemplatesRequest = async<T>(page: number)=>{

  let URI: string = `http://18.143.157.105:3000/giphy/list?&n=40&p=${page}`
  console.log("URI: ", URI);
      
  try {
    const response = await fetch(URI, 
      {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      }
    )   
    const data = await response?.json()    
    return data?.data
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}


export function useGetBannerTemplates<T>( 
  page: number,
  options: UseQueryOptions<T, Error, T>,
) {
  return useQuery(
    ['giphy/list'] as QueryKey, 
    () => useGetBannerTemplatesRequest<T>(page), 
    options)
}
