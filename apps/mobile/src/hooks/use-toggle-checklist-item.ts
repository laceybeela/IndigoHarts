import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@indigo-harts/hooks';
import { toggleChecklistItem } from '@indigo-harts/services';

export function useToggleChecklistItem() {
  const { client, user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, completed }: { itemId: string; completed: boolean }) =>
      toggleChecklistItem(client, itemId, completed, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleaning-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });
}
