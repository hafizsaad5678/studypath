import { supabase } from '@/lib/supabase';
import type { Application, ApplicationStatus, ApplicationWithProgram } from '@/types/database';

export async function listApplications(userId: string): Promise<ApplicationWithProgram[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*, program:programs(*, university:universities(*, country:countries(*)))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createApplication(userId: string, programId: string): Promise<Application> {
  const { data, error } = await supabase
    .from('applications')
    .insert({ user_id: userId, program_id: programId, status: 'draft' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<Application> {
  const updates: Partial<Application> = { status };
  if (status === 'submitted') {
    updates.applied_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', applicationId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
