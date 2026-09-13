import { supabase } from '@/lib/supabase';
import type { FundingType, ScholarshipWithRelations } from '@/types/database';

export async function listScholarships(params?: {
  search?: string;
  countryId?: string;
  fundingType?: FundingType;
  limit?: number;
}): Promise<ScholarshipWithRelations[]> {
  let query = supabase
    .from('scholarships')
    .select('*, country:countries(*), university:universities(*)')
    .order('deadline', { ascending: true, nullsFirst: false });

  const trimmedSearch = params?.search?.trim();
  if (trimmedSearch) {
    query = query.ilike('name', `%${trimmedSearch}%`);
  }
  if (params?.countryId) {
    query = query.eq('country_id', params.countryId);
  }
  if (params?.fundingType) {
    query = query.eq('funding_type', params.fundingType);
  }
  if (params?.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getScholarshipById(id: string): Promise<ScholarshipWithRelations | null> {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*, country:countries(*), university:universities(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
