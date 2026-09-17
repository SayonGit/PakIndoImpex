"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { clsx } from "clsx";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={clsx(
        "flex size-8 items-center justify-center rounded-lg text-ink-600 transition-colors duration-150 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-30",
        active && "bg-primary-100 text-primary-800"
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-ink-100 bg-ink-50/60 p-1.5">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" aria-hidden />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" aria-hidden />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden />
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" aria-hidden />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" aria-hidden />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 4"
        active={editor.isActive("heading", { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading4 className="size-4" aria-hidden />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden />
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" aria-hidden />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" aria-hidden />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden />
      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        <LinkIcon className="size-4" aria-hidden />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden />
      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo className="size-4" aria-hidden />
      </ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo className="size-4" aria-hidden />
      </ToolbarButton>
    </div>
  );
}

/** Constrained to exactly the tags sanitizeArticleHtml() allows (see src/lib/sanitize.ts). */
export function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer nofollow" },
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose-article min-h-[320px] max-w-none px-4 py-3 focus:outline-none [&_a]:text-primary-700 [&_a]:underline [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink-950 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink-950 [&_h4]:mt-4 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-ink-950 [&_li]:ml-5 [&_ol_li]:list-decimal [&_p]:leading-relaxed [&_ul_li]:list-disc [&_ul]:space-y-1",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white transition-all duration-200 focus-within:border-primary-600 focus-within:ring-4 focus-within:ring-primary-100">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
