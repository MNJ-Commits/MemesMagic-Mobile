import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

const useGetBannerSearchRequest = async<T>(query: string, page: number)=>{

  let URI: string = `http://18.143.157.105:3000/giphy/search?q=${query}&n=40&p=${page}`
  console.log("URI: ", URI);
  
  try {
    const response = await fetch(URI, 
      {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      }
    )        
    const data = await response?.json()  
    console.log("data?.data: ", data?.data); 
    
    return data?.data
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}


export function useGetBannerSearch<T>( 
  query: string,
  page: number,
  options: UseQueryOptions<T, Error, T>,
) {
  return useQuery(
    [`giphy/search`] as QueryKey, 
    () => useGetBannerSearchRequest<T>(query, page), 
    options)
}
