import {useMutation, UseMutationOptions} from '@tanstack/react-query';


const usePostAppleSubcribeRequest = async (params: any)=>{
    
    console.log('apple Subcription params: ',params.access_token);

    const headers= { 
        "Accept": 'application/json', 
        'Content-Type': 'application/json',
        "X-ACCESS-TOKEN": `${params.access_token}`,
    }

    const body = {
        "failure_url": "memeswork://SubscriptionScreen",
        "success_url": "memeswork://SubscriptionScreen?paymentType=subcribed"
    }

    try {
        const response = await fetch('http://18.143.157.105:3000/payment/subscribe', 
            {
                method: 'POST',
                body:JSON.stringify(body),
                headers: headers
            })    
            
        const data = await response?.json()        
        return data?.data
    }
    catch (err:any) {
        throw new Error(err.response?.data?.message);
    }
}

export function usePostAppleSubcribe(
  options?: UseMutationOptions<any, Error, string, any>,
) {
  return useMutation(usePostAppleSubcribeRequest, options);
}
