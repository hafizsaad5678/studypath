import { useQuery } from '@tanstack/react-query';

import {
  getUniversityById,
  getUniversityBySlug,
  listUniversities,
  listUniversitiesByCountry,
} from '@/services/universities';

export function useUniversities(params?: { countryId?: string; search?: string }) {
  return useQuery({
    queryKey: ['universities', params?.countryId ?? null, params?.search ?? ''],
    queryFn: () => listUniversities(params),
  });
}

export function useUniversity(slug: string) {
  return useQuery({
    queryKey: ['university', slug],
    queryFn: () => getUniversityBySlug(slug),
    enabled: !!slug,
  });
}

export function useUniversityById(id: string) {
  return useQuery({
    queryKey: ['university-by-id', id],
    queryFn: () => getUniversityById(id),
    enabled: !!id,
  });
}

export function useUniversitiesByCountry(countryId: string) {
  return useQuery({
    queryKey: ['universities-by-country', countryId],
    queryFn: () => listUniversitiesByCountry(countryId),
    enabled: !!countryId,
  });
}
