type Association = { compositionId: string | null; pending: boolean };
const inMemory = new Map<string, Association>();

/** Hints within this browser, never a durable server relationship or idempotency guarantee. */
export function readDocumentAssociation(id: string): Association {
  if (typeof window === "undefined")
    return { compositionId: null, pending: false };
  const memory = inMemory.get(id);
  if (memory) return memory;
  try {
    return {
      compositionId: localStorage.getItem(`sllp.doc.${id}.compositionId`),
      pending:
        localStorage.getItem(`sllp.doc.${id}.creationPending`) === "true",
    };
  } catch {
    return { compositionId: null, pending: false };
  }
}

export function saveDocumentAssociation(id: string, association: Association) {
  inMemory.set(id, association);
  try {
    if (association.compositionId) {
      localStorage.setItem(
        `sllp.doc.${id}.compositionId`,
        association.compositionId,
      );
      localStorage.setItem(`sllp.comp.${association.compositionId}.docId`, id);
    } else localStorage.removeItem(`sllp.doc.${id}.compositionId`);
    if (association.pending)
      localStorage.setItem(`sllp.doc.${id}.creationPending`, "true");
    else localStorage.removeItem(`sllp.doc.${id}.creationPending`);
  } catch {
    /* An acknowledged draft stays acknowledged even if storing its hint fails. */
  }
}
