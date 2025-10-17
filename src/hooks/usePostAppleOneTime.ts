import {useMutation, UseMutationOptions} from '@tanstack/react-query';

const usePostAppleOneTimeRequest = async (params: any) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-ACCESS-TOKEN': `${params.access_token}`,
  };

  const body = {
    failure_url: 'memeswork://SubscriptionScreen',
    success_url: 'memeswork://SubscriptionScreen?paymentType=oneTime',
  };

  const response = await fetch('http://18.143.157.105:3000/payment/one-time', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: headers,
  });
  const data = await response?.json();
  return data?.data;
};

export function usePostAppleOneTime(
  options?: UseMutationOptions<any, Error, string, any>,
) {
  return useMutation(usePostAppleOneTimeRequest, options);
}
