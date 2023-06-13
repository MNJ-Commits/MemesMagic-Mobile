import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

const useGetBannerSearchRequest = async<T>(query: string)=>{

  console.log("query: ", query);
  
  try {
    const response = await fetch(`http://18.143.157.105:3000/giphy/search?q=${query}&n=10`, 
      {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      }
    )        
    console.log("response: ", response); 
    const data = await response?.json()  
    
    console.log(data?.data);
    return data?.data
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}


export function useGetBannerSearch<T>( 
  query: string,
  options: UseQueryOptions<T, Error, T>,
) {
  return useQuery(
    ['giphy/list'] as QueryKey, 
    () => useGetBannerSearchRequest<T>(query), 
    options)
}
