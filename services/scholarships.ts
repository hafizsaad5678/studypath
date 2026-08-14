import { supabase } from '@/lib/supabase';
import type { FundingType, ScholarshipWithRelations } from '@/types/database';

export async function listScholarships(params?: {
  search?: string;
  countryId?: string;
  fundingType?: FundingType;
}): Promise<ScholarshipWithRelations[]> {
  let query = supabase
    .from('scholarships')
    .select('*, country:countries(*), university:universities(*)')
    .order('deadline', { ascending: true, nullsFirst: false });

  if (params?.search) {
    query = query.ilike('name', `%${params.search}%`);
  }
  if (params?.countryId) {
    query = query.eq('country_id', params.countryId);
  }
  if (params?.fundingType) {
    query = query.eq('funding_type', params.fundingType);
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
