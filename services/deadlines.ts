import { supabase } from '@/lib/supabase';
import type { DeadlineType, DeadlineWithRelations } from '@/types/database';

export async function listUpcomingDeadlines(
  paramsOrLimit?: number | { limit?: number; deadlineType?: DeadlineType }
): Promise<DeadlineWithRelations[]> {
  const limit = typeof paramsOrLimit === 'number' ? paramsOrLimit : paramsOrLimit?.limit;
  const deadlineType = typeof paramsOrLimit === 'object' ? paramsOrLimit?.deadlineType : undefined;

  let query = supabase
    .from('deadlines')
    .select('*, university:universities(*), program:programs(*), scholarship:scholarships(*)')
    .gte('deadline_date', new Date().toISOString().slice(0, 10))
    .order('deadline_date', { ascending: true });

  if (deadlineType) {
    query = query.eq('deadline_type', deadlineType);
  }
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}


