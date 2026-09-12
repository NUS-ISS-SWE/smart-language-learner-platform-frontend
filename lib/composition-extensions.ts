import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";

/** Shared schema for writing and reading compositions. Register each mark once. */
export function compositionExtensions(readonly = false) {
  return [
    StarterKit.configure({ link: false, underline: false }),
    Underline,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Link.configure({ openOnClick: readonly }),
    Highlight,
  ];
}
