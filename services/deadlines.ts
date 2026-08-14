import { supabase } from '@/lib/supabase';
import type { DeadlineWithRelations } from '@/types/database';

export async function listUpcomingDeadlines(limit?: number): Promise<DeadlineWithRelations[]> {
  let query = supabase
    .from('deadlines')
    .select('*, university:universities(*), program:programs(*), scholarship:scholarships(*)')
    .gte('deadline_date', new Date().toISOString().slice(0, 10))
    .order('deadline_date', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
