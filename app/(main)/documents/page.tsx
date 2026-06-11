"use client";

import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DocumentCard } from "@/components/features/documents/DocumentCard";
import { useDocumentList } from "@/lib/hooks/useDocuments";
import { getApiErrorMessage } from "@/lib/api/client";

export default function DocumentsPage() {
  const { data, isLoading, isError, error } = useDocumentList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Document library</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Your documents</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload and manage your learning materials. Text is extracted automatically.
          </p>
        </div>
        <Button asChild>
          <Link href="/documents/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Upload document
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading documents" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          {getApiErrorMessage(error)}
        </div>
      ) : !data?.documents?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <p className="text-sm font-medium">No documents yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Upload a PDF, DOCX, or TXT file to get started.</p>
          <Button asChild className="mt-6">
            <Link href="/documents/new">Upload your first document</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
