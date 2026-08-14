import { supabase } from '@/lib/supabase';
import type { University, UniversityWithCountry } from '@/types/database';

export async function listUniversities(params?: {
  countryId?: string;
  search?: string;
}): Promise<UniversityWithCountry[]> {
  let query = supabase.from('universities').select('*, country:countries(*)').order('name');
  if (params?.search) {
    query = query.ilike('name', `%${params.search}%`);
  }
  if (params?.countryId) {
    query = query.eq('country_id', params.countryId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as UniversityWithCountry[]) ?? [];
}

export async function getUniversityBySlug(slug: string): Promise<UniversityWithCountry | null> {
  const { data, error } = await supabase
    .from('universities')
    .select('*, country:countries(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as UniversityWithCountry | null;
}

export async function getUniversityById(id: string): Promise<UniversityWithCountry | null> {
  const { data, error } = await supabase
    .from('universities')
    .select('*, country:countries(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as UniversityWithCountry | null;
}

export async function listUniversitiesByCountry(countryId: string): Promise<University[]> {
  const { data, error } = await supabase
    .from('universities')
    .select('*')
    .eq('country_id', countryId)
    .order('name');
  if (error) throw error;
  return data ?? [];
}
