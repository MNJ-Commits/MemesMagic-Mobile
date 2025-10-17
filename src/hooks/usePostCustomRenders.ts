import {useMutation, UseMutationOptions} from '@tanstack/react-query';

const usePostCustomRendersRequest = async (data: any) => {
  const {access_token, ...params} = data;

  const response = await fetch('http://18.143.157.105:3000/renderer/render', {
    method: 'POST',
    body: JSON.stringify({...params}),
    headers: access_token
      ? {
          'Content-Type': 'application/json',
          'X-ACCESS-TOKEN': `${access_token}`,
        }
      : {'Content-Type': 'application/json'},
  });
  const data = await response?.json();
  // console.log("data?.data: ", response.status );

  return data?.data;
};

export function usePostCustomRenders(
  options?: UseMutationOptions<any, Error, string, any>,
) {
  return useMutation(usePostCustomRendersRequest, options);
}
