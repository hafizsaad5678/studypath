import { supabase } from '@/lib/supabase';
import type { Country } from '@/types/database';

export async function listCountries(): Promise<Country[]> {
  const { data, error } = await supabase.from('countries').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
  const { data, error } = await supabase.from('countries').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
}
