"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import { useTranslation } from "@/lib/i18n/useTranslation";

type ChangeSelectFieldModalProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly label: string;
  readonly selectId: string;
  readonly options: string[];
  readonly currentValue: string;
  readonly onConfirm: (value: string) => void;
  readonly isPending: boolean;
  readonly error?: unknown;
};

// Outer wrapper — unmounts content when closed so useState gets fresh initial value on every open
export function ChangeSelectFieldModal(props: ChangeSelectFieldModalProps) {
  if (!props.open) return null;
  return <ChangeSelectFieldModalContent {...props} />;
}

function ChangeSelectFieldModalContent({
  onClose,
  title,
  label,
  selectId,
  options,
  currentValue,
  onConfirm,
  isPending,
  error,
}: ChangeSelectFieldModalProps) {
  const [selected, setSelected] = useState(currentValue);
  const { t } = useTranslation("visual");

  return (
    <Dialog
      open
      onClose={() => {
        if (!isPending) onClose();
      }}
      title={title}
    >
      <div className="space-y-4">
        {!!error && <ErrorState message={getApiErrorMessage(error)} />}
        <div className="space-y-2">
          <Label htmlFor={selectId}>{label}</Label>
          <Select
            id={selectId}
            disabled={isPending}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {t(
                  `${selectId.startsWith("role") ? "role" : "status"}_${opt}`,
                  { defaultValue: opt },
                )}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm(selected)}
            disabled={isPending || selected === currentValue}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("confirm")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
