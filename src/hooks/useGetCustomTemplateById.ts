import {UseMutationOptions, useMutation} from '@tanstack/react-query';
import {loadAppleAccessTokenFromStorage} from '../store/asyncStorage';

const useGetCustomTemplateByIdRequest = async <T>(params: string) => {
  const appleAccessToken = await loadAppleAccessTokenFromStorage().catch(
    (error: any) => {
      console.log('loadAppleAccessTokenFromStorage Error: ', error);
    },
  );

  const headers: any = appleAccessToken?.access_token
    ? {'Content-Type': 'application/json', 'X-ACCESS-TOKEN': `${access_token}`}
    : {'Content-Type': 'application/json'};
  try {
    const response = await fetch(
      `http://18.143.157.105:3000/assets/templates/${params.uid}`,
      {
        method: 'GET',
        headers: headers,
      },
    );
    const data = await response?.json();
    return data?.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export function useGetCustomTemplateById(
  options?: UseMutationOptions<any, Error, string, any>,
) {
  return useMutation(useGetCustomTemplateByIdRequest, options);
}
