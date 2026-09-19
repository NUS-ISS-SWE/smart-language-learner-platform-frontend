export const DOCUMENT_MIME_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
} as const;
export const DOCUMENT_ACCEPT = Object.keys(DOCUMENT_MIME_TYPES)
  .map((extension) => `.${extension}`)
  .join(",");
export const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;

export class DocumentValidationError extends Error {
  constructor(
    public readonly key:
      | "unsupportedFile"
      | "fileTooLarge"
      | "emptyFile"
      | "invalidFilename",
  ) {
    super(key);
  }
}

/** Normalize only absent/generic browser MIME metadata; the server still validates the upload. */
export function prepareDocumentUpload(file: File): File {
  if (!file.size) throw new DocumentValidationError("emptyFile");
  if (file.size > MAX_DOCUMENT_BYTES)
    throw new DocumentValidationError("fileTooLarge");
  if (!file.name.trim() || /\.\.|[/\\\0\n\r]/.test(file.name))
    throw new DocumentValidationError("invalidFilename");
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase() as keyof typeof DOCUMENT_MIME_TYPES;
  const expected = DOCUMENT_MIME_TYPES[extension];
  if (
    !expected ||
    (file.type &&
      file.type !== "application/octet-stream" &&
      file.type !== expected)
  )
    throw new DocumentValidationError("unsupportedFile");
  return file.type === expected
    ? file
    : new File([file], file.name, {
        type: expected,
        lastModified: file.lastModified,
      });
}
