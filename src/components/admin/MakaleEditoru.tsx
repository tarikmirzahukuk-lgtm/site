"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
        active
          ? "bg-[var(--color-gold)] text-[#0a0d11]"
          : "bg-[var(--color-panel-hi)] text-[var(--color-body)] hover:bg-[var(--color-panel-hi)] hover:text-[var(--color-ink)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function MakaleEditoru({ content, onChange }: Props) {
  const editor = useEditor({
    // Next.js App Router SSR — hydration mismatch'i önler (TipTap v3 gereği)
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image,
      LinkExtension.configure({ openOnClick: false }),
      Underline,
      Placeholder.configure({
        placeholder: "Makale içeriğinizi buraya yazın...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-invert max-w-none min-h-[400px] px-5 py-4 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) editor.chain().focus().setImage({ src: data.url }).run();
    };
    input.click();
  };

  const addLink = () => {
    const url = prompt("Link URL'si:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="bg-[var(--color-panel)] border border-[var(--rule-dim)] rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--rule-dim)]">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          U
        </ToolbarButton>
        <div className="w-px bg-[var(--rule-dim)] mx-1" />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarButton>
        <div className="w-px bg-[var(--rule-dim)] mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          Liste
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          1. Liste
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          Alıntı
        </ToolbarButton>
        <div className="w-px bg-[var(--rule-dim)] mx-1" />
        <ToolbarButton onClick={addImage}>Görsel</ToolbarButton>
        <ToolbarButton onClick={addLink} active={editor.isActive("link")}>
          Link
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
