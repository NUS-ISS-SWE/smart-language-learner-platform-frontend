export const documentWorkflowEn = {
  selectFile: "Choose a document to upload",
  fileInput: "Document file",
  dropHint: "Drop a document here, or choose a file",
  supported: "PDF, DOCX, PPTX or TXT · Up to 25 MB",
  uploadFlow:
    "Your file uploads when selected. We’ll extract its text and create a composition for you to review.",
  unsupportedFile:
    "Choose a PDF, DOCX, PPTX or TXT file with a matching file type.",
  fileTooLarge: "This file is larger than 25 MB. Choose a smaller file.",
  emptyFile: "This file is empty. Choose a document containing text.",
  invalidFilename:
    "This filename contains unsupported characters. Rename the file and try again.",
  uploading: "Uploading document…",
  uploaded: "Upload complete",
  selected: "Selected file",
  removeFile: "Remove selected file",
  uncertainUpload:
    "The upload may have reached the server. Check your documents before uploading this file again.",
  checkDocuments: "Check documents in a new tab",
  checkedDocuments: "I checked my documents; retry upload",
  retryUpload: "Retry upload",
  writingFromDocument: "Write from this document",
  localAssociation:
    "Composition links are saved in this browser. They are not shared across devices.",
  checkingDraft: "Checking the saved composition link…",
  linkedLookupFailed:
    "The linked composition could not be checked. Retry the lookup before creating another copy.",
  retryLookup: "Retry composition lookup",
  openComposition: "Open composition",
  missingLinkedDraft:
    "The saved composition link is no longer available. You can create a new draft from the extracted text.",
  compositionTitle: "Composition title",
  creatingComposition: "Creating composition…",
  uncertainComposition:
    "A composition may already have been created. Check your library before trying again.",
  checkLibrary: "Check library in a new tab",
  checkedLibrary: "I checked my library; create a draft",
  retryComposition: "Retry composition creation",
  replaceMissingDraft: "Create a new composition",
  createComposition: "Create composition",
  waitingForText:
    "Composition creation becomes available when text extraction is ready.",
  loadingDocument: "Loading document…",
  retryDocument: "Retry document lookup",
  backToUsers: "Back to users",
  backToDocuments: "Back to documents",
  inspection: "Admin inspection · read only",
  downloadOriginal: "Download original",
  deleteDocument: "Delete document",
  documentFetchFailed:
    "The latest document details could not be loaded. The last loaded details are still shown.",
  extractionFetchFailed:
    "The text extraction status could not be loaded. Your document remains uploaded.",
  retryExtractionFetch: "Retry extraction status",
  extracting: "Extracting your document’s text",
  automaticEvaluation:
    "When extraction finishes, we’ll create a composition and open it for you. You can leave and return from your library.",
  returnLater:
    "You can leave and return from your document library while extraction continues.",
  extractionFailed:
    "Text extraction failed. You can keep or download the original, or upload another document.",
  uploadAnother: "Upload another document",
  extractedText: "Extracted text",
  loadingText: "Loading extracted text…",
  emptyText:
    "Extraction finished, but no usable text was found. Try another document or write directly.",
  noText: "No extracted text is available.",
  deleteTitle: "Delete this document?",
  deleteDescription:
    "The uploaded document will be removed. Existing compositions created from it remain in your library.",
  cancel: "Cancel",
  deleting: "Deleting…",
  status: {
    UPLOADED: "Uploaded",
    PROCESSING: "Extracting text",
    READY: "Text ready",
    FAILED: "Extraction failed",
  },
};
export const documentWorkflowZh: Record<
  Exclude<keyof typeof documentWorkflowEn, "status">,
  string
> & { status: Record<keyof typeof documentWorkflowEn.status, string> } = {
  selectFile: "选择要上传的文档",
  fileInput: "文档文件",
  dropHint: "将文档拖到这里，或选择文件",
  supported: "PDF、DOCX、PPTX 或 TXT · 最大 25 MB",
  uploadFlow:
    "选择文件后即开始上传。我们会提取正文，并为你创建一篇可供评估的作文。",
  unsupportedFile: "请选择类型匹配的 PDF、DOCX、PPTX 或 TXT 文件。",
  fileTooLarge: "文件超过 25 MB，请选择较小的文件。",
  emptyFile: "文件为空，请选择包含正文的文档。",
  invalidFilename: "文件名包含不支持的字符。请重命名后重试。",
  uploading: "正在上传文档…",
  uploaded: "上传完成",
  selected: "已选文件",
  removeFile: "移除所选文件",
  uncertainUpload:
    "上传可能已到达服务器。请先检查文档列表，再决定是否重新上传。",
  checkDocuments: "在新标签页查看文档",
  checkedDocuments: "已检查文档，重试上传",
  retryUpload: "重试上传",
  writingFromDocument: "使用此文档写作",
  localAssociation: "作文关联保存在当前浏览器中，不会跨设备同步。",
  checkingDraft: "正在检查已保存的作文关联…",
  linkedLookupFailed:
    "无法确认关联的作文。请先重试查询，再决定是否创建另一份副本。",
  retryLookup: "重试查询作文",
  openComposition: "打开作文",
  missingLinkedDraft:
    "已保存的作文关联不再可用。你可以根据提取的正文创建一篇新草稿。",
  compositionTitle: "作文标题",
  creatingComposition: "正在创建作文…",
  uncertainComposition: "作文可能已经创建。请先检查作品库，再决定是否重试。",
  checkLibrary: "在新标签页查看作品库",
  checkedLibrary: "已检查作品库，创建草稿",
  retryComposition: "重试创建作文",
  replaceMissingDraft: "创建新作文",
  createComposition: "创建作文",
  waitingForText: "正文提取完成后即可创建作文。",
  loadingDocument: "正在加载文档…",
  retryDocument: "重试查询文档",
  backToUsers: "返回用户列表",
  backToDocuments: "返回文档列表",
  inspection: "管理员查看 · 只读",
  downloadOriginal: "下载原始文件",
  deleteDocument: "删除文档",
  documentFetchFailed: "无法加载最新文档信息。仍显示上次加载的信息。",
  extractionFetchFailed: "无法加载正文提取状态。文档已上传，无需重新上传。",
  retryExtractionFetch: "重试查询提取状态",
  extracting: "正在提取文档正文",
  automaticEvaluation:
    "提取完成后，我们会创建并打开作文。你可以离开此页，稍后从作品库返回。",
  returnLater: "提取期间可以离开此页，稍后从文档列表返回。",
  extractionFailed:
    "正文提取失败。你可以保留或下载原始文件，也可以上传另一份文档。",
  uploadAnother: "上传另一份文档",
  extractedText: "提取的正文",
  loadingText: "正在加载正文…",
  emptyText: "提取已完成，但没有找到可用正文。请尝试其他文档或直接写作。",
  noText: "没有可用的提取正文。",
  deleteTitle: "删除此文档？",
  deleteDescription: "上传的文档将被删除。由它创建的作文仍保留在作品库中。",
  cancel: "取消",
  deleting: "正在删除…",
  status: {
    UPLOADED: "已上传",
    PROCESSING: "正在提取正文",
    READY: "正文已就绪",
    FAILED: "提取失败",
  },
};
