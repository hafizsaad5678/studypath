import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { createApplication, listApplications, updateApplicationStatus } from '@/services/applications';
import type { ApplicationStatus } from '@/types/database';

export function useApplications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['applications', user?.id],
    queryFn: () => listApplications(user!.id),
    enabled: !!user,
  });
}

export function useCreateApplication() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId: string) => createApplication(user!.id, programId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications', user?.id] }),
  });
}

export function useUpdateApplicationStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { applicationId: string; status: ApplicationStatus }) =>
      updateApplicationStatus(vars.applicationId, vars.status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications', user?.id] }),
  });
}
