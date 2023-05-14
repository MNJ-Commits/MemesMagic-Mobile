import {useMutation, UseMutationOptions} from '@tanstack/react-query';


const usePostAppleOneTimeRequest = async (params: any)=>{
        
    console.log('apple OneTime params: ',params.access_token);

    const headers= { 
        "Accept": 'application/json', 
        'Content-Type': 'application/json',
        "X-ACCESS-TOKEN": `${params.access_token}`,
    }

    const body = {
        "failure_url": "memeswork://SubcriptionScreen",
        "success_url": "memeswork://SubcriptionScreen?paymentType=oneTime"
    }

    try {
        const response = await fetch('http://18.143.157.105:3000/payment/one-time', 
            {
                method: 'POST',
                body:JSON.stringify(body),
                headers: headers
            })   
        const data = await response?.json()        
        console.log('data: ',response);
        
        return data?.data
    }
    catch (err:any) {
        throw new Error(err.response?.data?.message);
    }
}

export function usePostAppleOneTime(
  options?: UseMutationOptions<any, Error, string, any>,
) {
  return useMutation(usePostAppleOneTimeRequest, options);
}
