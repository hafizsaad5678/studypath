import { supabase } from '@/lib/supabase';
import type { SavedItem, SavedItemType } from '@/types/database';

export async function listSavedItems(userId: string): Promise<SavedItem[]> {
  const { data, error } = await supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function saveItem(userId: string, itemType: SavedItemType, itemId: string) {
  const { error } = await supabase
    .from('saved_items')
    .insert({ user_id: userId, item_type: itemType, item_id: itemId });
  if (error) throw error;
}

export async function unsaveItem(userId: string, itemType: SavedItemType, itemId: string) {
  const { error } = await supabase
    .from('saved_items')
    .delete()
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId);
  if (error) throw error;
}
