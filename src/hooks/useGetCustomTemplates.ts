import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

const useGetCustomTemplatesRequest = async<T>(tag:string)=>{
  
let URI: string = 'http://18.143.157.105:3000/assets/templates'
tag ? URI += `?tag=${tag}` : ''

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


export function useGetCustomTemplates<T>( 
  tag: string,
  options: UseQueryOptions<T, Error, T>,
) {
  return useQuery(
    ['assets/templates'] as QueryKey, 
    () => useGetCustomTemplatesRequest<T>(tag), 
    options)
}
