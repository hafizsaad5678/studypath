import { supabase } from '@/lib/supabase';
import type { DegreeLevel, Program, ProgramWithUniversity } from '@/types/database';

const PROGRAM_WITH_UNIVERSITY_SELECT = '*, university:universities(*, country:countries(*))';

export async function listPrograms(params?: {
  search?: string;
  degreeLevel?: DegreeLevel;
  countryId?: string;
  universityId?: string;
}): Promise<ProgramWithUniversity[]> {
  let query = supabase.from('programs').select(PROGRAM_WITH_UNIVERSITY_SELECT).order('name');
  if (params?.search) {
    query = query.ilike('name', `%${params.search}%`);
  }
  if (params?.degreeLevel) {
    query = query.eq('degree_level', params.degreeLevel);
  }
  if (params?.universityId) {
    query = query.eq('university_id', params.universityId);
  }
  const { data, error } = await query;
  if (error) throw error;
  let results = (data as unknown as ProgramWithUniversity[]) ?? [];
  if (params?.countryId) {
    results = results.filter((p) => p.university?.country_id === params.countryId);
  }
  return results;
}

export async function getProgramById(id: string): Promise<ProgramWithUniversity | null> {
  const { data, error } = await supabase
    .from('programs')
    .select(PROGRAM_WITH_UNIVERSITY_SELECT)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ProgramWithUniversity | null;
}

export async function listProgramsByUniversity(universityId: string): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('university_id', universityId)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function listProgramsByIds(ids: string[]): Promise<ProgramWithUniversity[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from('programs')
    .select(PROGRAM_WITH_UNIVERSITY_SELECT)
    .in('id', ids);
  if (error) throw error;
  return (data as unknown as ProgramWithUniversity[]) ?? [];
}
