import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { listSavedItems, saveItem, unsaveItem } from '@/services/saved-items';
import type { SavedItemType } from '@/types/database';

export function useSavedItems() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['saved-items', user?.id];

  const query = useQuery({
    queryKey,
    queryFn: () => listSavedItems(user!.id),
    enabled: !!user,
  });

  const isSaved = (itemType: SavedItemType, itemId: string) =>
    (query.data ?? []).some((s) => s.item_type === itemType && s.item_id === itemId);

  const save = useMutation({
    mutationFn: (vars: { itemType: SavedItemType; itemId: string }) =>
      saveItem(user!.id, vars.itemType, vars.itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const unsave = useMutation({
    mutationFn: (vars: { itemType: SavedItemType; itemId: string }) =>
      unsaveItem(user!.id, vars.itemType, vars.itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const toggle = (itemType: SavedItemType, itemId: string) => {
    if (!user) return;
    if (isSaved(itemType, itemId)) {
      unsave.mutate({ itemType, itemId });
    } else {
      save.mutate({ itemType, itemId });
    }
  };

  return { ...query, isSaved, toggle, saving: save.isPending || unsave.isPending };
}
