"use client";

import { useRouter } from "next/navigation";
import { Loader2, TriangleAlert } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useDeleteAdminUser } from "@/lib/hooks/useAdmin";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import { useTranslation } from "@/lib/i18n/useTranslation";

type DeleteUserModalProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly userId: number;
  readonly username: string;
  readonly returnTo?: string;
};

export function DeleteUserModal({
  open,
  onClose,
  userId,
  username,
  returnTo = "/admin/users",
}: DeleteUserModalProps) {
  const { t } = useTranslation("visual");
  const mutation = useDeleteAdminUser();
  const router = useRouter();

  function handleDelete() {
    mutation.mutate(userId, {
      onSuccess: () => {
        onClose();
        router.push(returnTo);
      },
    });
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!mutation.isPending) onClose();
      }}
      title={t("deleteUser")}
    >
      <div className="space-y-4">
        {mutation.isError && (
          <ErrorState message={getApiErrorMessage(mutation.error)} />
        )}
        <div className="flex gap-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <TriangleAlert
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <p>{t("deleteUserWarning", { name: username })}</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("deleteUser")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
