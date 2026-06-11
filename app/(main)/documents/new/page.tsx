"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DocumentUpload } from "@/components/features/documents/DocumentUpload";
import type { DocumentUploadResponse } from "@/types/document";

export default function NewDocumentPage() {
  const router = useRouter();

  function handleSuccess(res: DocumentUploadResponse) {
    router.push(`/documents/${res.document.id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/documents")} className="-ml-2 mb-2">
          <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
          Back to documents
        </Button>
        <p className="text-sm font-medium text-primary">Upload document</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Add a document</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload a PDF, DOCX, PPTX, or TXT file. Text will be extracted automatically.
        </p>
      </div>

      <div className="max-w-xl">
        <DocumentUpload onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
