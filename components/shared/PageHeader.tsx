import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <h1 className="break-words text-[1.75rem] font-semibold leading-9 tracking-[-0.04em] text-primary sm:text-[2.125rem] sm:leading-10">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl break-words text-base leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      )}
    </div>
  );
}
