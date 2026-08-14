import { supabase } from '@/lib/supabase';

export type AdminStats = {
  universityCount: number;
  programCount: number;
  scholarshipCount: number;
  pendingVerificationCount: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const [universities, programs, scholarships, pending] = await Promise.all([
    supabase.from('universities').select('*', { count: 'exact', head: true }),
    supabase.from('programs').select('*', { count: 'exact', head: true }),
    supabase.from('scholarships').select('*', { count: 'exact', head: true }),
    supabase
      .from('data_sources')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'pending'),
  ]);

  if (universities.error) throw universities.error;
  if (programs.error) throw programs.error;
  if (scholarships.error) throw scholarships.error;
  if (pending.error) throw pending.error;

  return {
    universityCount: universities.count ?? 0,
    programCount: programs.count ?? 0,
    scholarshipCount: scholarships.count ?? 0,
    pendingVerificationCount: pending.count ?? 0,
  };
}

export type ActivityItem = {
  id: string;
  label: string;
  timestamp: string;
};

export async function listRecentActivity(limit: number = 5): Promise<ActivityItem[]> {
  const [universities, programs, scholarships] = await Promise.all([
    supabase.from('universities').select('id, name, updated_at').order('updated_at', { ascending: false }).limit(5),
    supabase.from('programs').select('id, name, updated_at').order('updated_at', { ascending: false }).limit(5),
    supabase.from('scholarships').select('id, name, updated_at').order('updated_at', { ascending: false }).limit(5),
  ]);

  if (universities.error) throw universities.error;
  if (programs.error) throw programs.error;
  if (scholarships.error) throw scholarships.error;

  const items: ActivityItem[] = [
    ...(universities.data ?? []).map((row) => ({
      id: `university-${row.id}`,
      label: `${row.name} updated`,
      timestamp: row.updated_at,
    })),
    ...(programs.data ?? []).map((row) => ({
      id: `program-${row.id}`,
      label: `${row.name} updated`,
      timestamp: row.updated_at,
    })),
    ...(scholarships.data ?? []).map((row) => ({
      id: `scholarship-${row.id}`,
      label: `${row.name} updated`,
      timestamp: row.updated_at,
    })),
  ];

  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return items.slice(0, limit);
}
