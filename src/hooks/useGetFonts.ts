import {QueryKey, UseQueryOptions, useQuery} from '@tanstack/react-query';

const useGetFontsRequest = async <T>() => {
  const response = await fetch('http://18.143.157.105:3000/assets/fonts', {
    method: 'GET',
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
  });

  const data = await response?.json();

  return data?.data;
};

export function useGetFonts<T>(options: UseQueryOptions<T, Error, T>) {
  return useQuery(
    ['assets/fonts'] as QueryKey,
    () => useGetFontsRequest<T>(),
    options,
  );
}
