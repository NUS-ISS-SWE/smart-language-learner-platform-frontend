"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { compositionExtensions } from "@/lib/composition-extensions";
import { compositionContent } from "@/lib/composition-content";

export function CompositionReader({ content }: { content: string }) {
  const editor = useEditor({
    extensions: compositionExtensions(true),
    content: compositionContent(content),
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "tiptap-editor break-words text-lg leading-[30px]" },
    },
  });
  useEffect(() => {
    editor?.commands.setContent(compositionContent(content), {
      emitUpdate: false,
    });
  }, [editor, content]);
  return <EditorContent editor={editor} />;
}
