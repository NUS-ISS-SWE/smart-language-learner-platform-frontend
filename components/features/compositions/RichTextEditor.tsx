"use client";

import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import { compositionExtensions } from "@/lib/composition-extensions";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  readonly value: string;
  readonly disabled?: boolean;
  readonly onChange: (html: string) => void;
};

type ToolbarButtonProps = {
  readonly onClick: () => void;
  readonly isActive?: boolean;
  readonly disabled?: boolean;
  readonly "aria-label": string;
  readonly children: ReactNode;
};

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  "aria-label": ariaLabel,
  children,
}: ToolbarButtonProps) {
  const { t } = useTranslation("editor");
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={t(`format.${ariaLabel}`)}
      title={t(`format.${ariaLabel}`)}
      aria-pressed={isActive}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-muted lg:h-10 lg:w-10",
        isActive ? "bg-soft-teal text-secondary" : "text-muted-foreground",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />;
}

export function RichTextEditor({
  value,
  onChange,
  disabled = false,
}: RichTextEditorProps) {
  const { t } = useTranslation("editor");
  // Track the last HTML emitted by the editor to distinguish user edits from external updates
  const editorHtmlRef = useRef(value);

  const editor = useEditor({
    editable: !disabled,
    extensions: compositionExtensions(),
    content: value,
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML();
      editorHtmlRef.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-[400px] w-full break-words px-5 py-6 text-lg leading-[30px] focus:outline-none sm:min-h-[460px] sm:px-8 sm:py-8",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": t("content"),
      },
    },
    immediatelyRender: false,
  });
  // Cursor-only transactions must also refresh pressed states and undo/redo.
  useEditorState({
    editor,
    selector: ({ transactionNumber }) => transactionNumber,
  });

  // Sync content when changed from outside (initial load, AI generation)
  useEffect(() => {
    editor?.setEditable(!disabled, false);
  }, [editor, disabled]);
  useEffect(() => {
    if (editor)
      editor.setOptions({
        editorProps: {
          ...editor.options.editorProps,
          attributes: {
            ...editor.options.editorProps.attributes,
            "aria-label": t("content"),
          },
        },
      });
  }, [editor, t]);
  useEffect(() => {
    if (!editor || value === editorHtmlRef.current) return;
    editorHtmlRef.current = value;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-1 border-y bg-background/60 px-4 py-2 sm:px-7"
        role="group"
        aria-label={t("formatting")}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <details className="border-b bg-background/60">
        <summary className="min-h-11 cursor-pointer px-5 py-3 text-sm font-medium text-muted-foreground sm:px-8">
          {t("moreFormatting")}
        </summary>
        <div
          className="flex flex-wrap items-center gap-1 px-4 pb-3 sm:px-7"
          role="group"
          aria-label={t("moreFormatting")}
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            aria-label="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            aria-label="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            aria-label="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            aria-label="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            aria-label="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            aria-label="Bullet list"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            aria-label="Ordered list"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            aria-label="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            aria-label="Inline code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const prev = editor.getAttributes("link").href as
                | string
                | undefined;
              const url = window.prompt(t("linkPrompt"), prev ?? "https://");
              if (url === null) return;
              if (url === "") {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();
              } else {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url })
                  .run();
              }
            }}
            isActive={editor.isActive("link")}
            aria-label="Insert link"
          >
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
            aria-label="Clear formatting"
          >
            <RemoveFormatting className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            aria-label="Align left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            aria-label="Align center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            aria-label="Align right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </details>

      <EditorContent editor={editor} />
    </div>
  );
}
