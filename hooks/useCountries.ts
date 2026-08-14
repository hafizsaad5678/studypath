import { useQuery } from '@tanstack/react-query';

import { getCountryBySlug, listCountries } from '@/services/countries';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: listCountries,
  });
}

export function useCountry(slug: string) {
  return useQuery({
    queryKey: ['country', slug],
    queryFn: () => getCountryBySlug(slug),
    enabled: !!slug,
  });
}
