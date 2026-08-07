"use client";

import { useRouter } from "next/navigation";
import { Loader2, TriangleAlert } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useDeleteAdminUser } from "@/lib/hooks/useAdmin";

type DeleteUserModalProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly userId: number;
  readonly username: string;
};

export function DeleteUserModal({ open, onClose, userId, username }: DeleteUserModalProps) {
  const mutation = useDeleteAdminUser();
  const router = useRouter();

  function handleDelete() {
    mutation.mutate(userId, {
      onSuccess: () => {
        onClose();
        router.push("/admin/users");
      },
    });
  }

  return (
    <Dialog open={open} onClose={onClose} title="Delete User">
      <div className="space-y-4">
        <div className="flex gap-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            <strong>{username}</strong> will be soft-deleted. They will no longer be able to log in and will
            not appear in user lists. This action cannot be undone from the UI.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
