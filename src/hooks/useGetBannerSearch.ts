import {QueryKey, UseQueryOptions, useQuery} from '@tanstack/react-query';

const useGetBannerSearchRequest = async <T>(
  query: string,
  page: number,
  limit: number,
) => {
  let URI: string = `http://18.143.157.105:3000/giphy/search?q=${query}&n=${limit}&p=${page}`;

  const response = await fetch(URI, {
    method: 'GET',
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
  });
  const data = await response?.json();
  return data?.data;
};

export function useGetBannerSearch<T>(
  query: string,
  page: number,
  limit: number,
  options: UseQueryOptions<T, Error, T>,
) {
  return useQuery(
    [`giphy/search`] as QueryKey,
    () => useGetBannerSearchRequest<T>(query, page, limit),
    options,
  );
}
