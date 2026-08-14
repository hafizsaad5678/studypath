import { useQuery } from '@tanstack/react-query';

import {
  getProgramById,
  listPrograms,
  listProgramsByIds,
  listProgramsByUniversity,
} from '@/services/programs';
import type { DegreeLevel } from '@/types/database';

export function usePrograms(params?: {
  search?: string;
  degreeLevel?: DegreeLevel;
  countryId?: string;
  universityId?: string;
}) {
  return useQuery({
    queryKey: [
      'programs',
      params?.search ?? '',
      params?.degreeLevel ?? null,
      params?.countryId ?? null,
      params?.universityId ?? null,
    ],
    queryFn: () => listPrograms(params),
  });
}

export function useProgram(id: string) {
  return useQuery({
    queryKey: ['program', id],
    queryFn: () => getProgramById(id),
    enabled: !!id,
  });
}

export function useProgramsByUniversity(universityId: string) {
  return useQuery({
    queryKey: ['programs-by-university', universityId],
    queryFn: () => listProgramsByUniversity(universityId),
    enabled: !!universityId,
  });
}

export function useProgramsByIds(ids: string[]) {
  return useQuery({
    queryKey: ['programs-by-ids', ids.slice().sort().join(',')],
    queryFn: () => listProgramsByIds(ids),
    enabled: ids.length > 0,
  });
}
