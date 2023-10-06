import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { loadAppleAccessTokenFromStorage } from "../store/asyncStorage";

function shuffleArray(array: any[]) {
  let len = array.length,
      currentIndex;
  for (currentIndex = len - 1; currentIndex > 0; currentIndex--) {
      let randIndex = Math.floor(Math.random() * (currentIndex + 1) );
      var temp = array[currentIndex];
      array[currentIndex] = array[randIndex];
      array[randIndex] = temp;
  }
  return array
}

const useGetCustomTemplatesRequest = async<T>(tag: string, page:number, limit: number, access_token: string)=>{
  
  let URI: string = `http://18.143.157.105:3000/assets/templates?p=${page}&l=${limit}`
    tag ? URI += `&tag=${tag}` : ''

    const appleAccessToken = await loadAppleAccessTokenFromStorage().catch((error:any)=>{
      console.log('loadAppleAccessTokenFromStorage Error: ', error);
    })
  // console.log("access_token: ", access_token);
  
  console.log("URI: ",URI);
  const token =  appleAccessToken?.access_token || access_token
  try {
    const response = await fetch(URI, 
      {
        method: 'GET',
        headers: token ? { 'Content-Type': 'application/json', "X-ACCESS-TOKEN": `${token}` } : {  'Content-Type': 'application/json' }
      }
    )    
    const data = await response?.json()   
    // console.log("data?.data: ", data?.data);
        
    if(tag==="Random"){
      return shuffleArray(data?.data)      
    }else{
      return data?.data
    }
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}


export function useGetCustomTemplates<T>( 
  tag: string,
  page: number,
  limit: number,
  accessToken: string,
  options: UseQueryOptions<T, Error, T>,
) {
  return useQuery(
    ['assets/templates'] as QueryKey, 
    () => useGetCustomTemplatesRequest<T>(tag, page, limit, accessToken), 
    options)
}
