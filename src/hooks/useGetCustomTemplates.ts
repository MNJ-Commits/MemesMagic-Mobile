import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

const useGetCustomTemplatesRequest = async<T>()=>{

  try {
    const response = await fetch('http://18.143.157.105:3000/assets/templates', 
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


export function useGetCustomTemplates<T>( 
  options: UseQueryOptions<T, Error, T>,
) {
  return useQuery(
    ['assets/templates'] as QueryKey, 
    () => useGetCustomTemplatesRequest<T>(), 
    options)
}
