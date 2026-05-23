"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle, Color, FontSize } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-30 ${
        active
          ? "bg-[var(--color-gold)] text-[#0a0d11]"
          : "bg-transparent text-[var(--color-body)] hover:bg-[var(--color-panel-hi)] hover:text-[var(--color-ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px bg-[var(--rule-dim)] mx-1 self-stretch" />;
}

const FONT_SIZES = [
  { label: "Boyut", value: "" },
  { label: "Küçük (14)", value: "14px" },
  { label: "Normal (16)", value: "16px" },
  { label: "Orta (18)", value: "18px" },
  { label: "Büyük (24)", value: "24px" },
  { label: "Çok büyük (30)", value: "30px" },
];

function Toolbar({ editor }: { editor: Editor }) {
  const addImage = () => {
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

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = prompt("Link URL'si:", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[var(--rule-dim)]">
      {/* Geri / İleri */}
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Geri al">
        ↶
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="İleri al">
        ↷
      </ToolbarButton>
      <Divider />

      {/* Paragraf / Başlıklar */}
      <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Paragraf">
        P
      </ToolbarButton>
      {[1, 2, 3, 4].map((level) => (
        <ToolbarButton
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run()}
          active={editor.isActive("heading", { level })}
          title={`Başlık ${level}`}
        >
          H{level}
        </ToolbarButton>
      ))}
      <Divider />

      {/* Karakter biçimi */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Kalın">
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="İtalik">
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Altı çizili">
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Üstü çizili">
        <span className="line-through">S</span>
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Satır içi kod">
        {"</>"}
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} title="Alt simge">
        x₂
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} title="Üst simge">
        x²
      </ToolbarButton>
      <Divider />

      {/* Renk / Vurgu / Boyut */}
      <label className="flex items-center gap-1 text-xs text-[var(--color-muted)] cursor-pointer" title="Yazı rengi">
        <span>A</span>
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer"
        />
      </label>
      <ToolbarButton onClick={() => editor.chain().focus().unsetColor().run()} title="Rengi kaldır">
        A⨯
      </ToolbarButton>
      <label className="flex items-center gap-1 text-xs text-[var(--color-muted)] cursor-pointer" title="Vurgu rengi">
        <span>🖍</span>
        <input
          type="color"
          onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
          className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer"
        />
      </label>
      <select
        value=""
        onChange={(e) => {
          const v = e.target.value;
          if (v) editor.chain().focus().setFontSize(v).run();
          else editor.chain().focus().unsetFontSize().run();
        }}
        className="text-xs bg-[var(--color-panel-hi)] text-[var(--color-body)] border border-[var(--rule-dim)] rounded px-1 py-1 focus:outline-none"
        title="Yazı boyutu"
      >
        {FONT_SIZES.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
      <Divider />

      {/* Hizalama */}
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Sola hizala">
        Sol
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Ortala">
        Orta
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Sağa hizala">
        Sağ
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="İki yana yasla">
        Yasla
      </ToolbarButton>
      <Divider />

      {/* Bloklar */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Madde listesi">
        Liste
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numaralı liste">
        1.
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Alıntı">
        Alıntı
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Kod bloğu">
        Kod
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Yatay çizgi">
        —
      </ToolbarButton>
      <Divider />

      {/* Görsel / Link */}
      <ToolbarButton onClick={addImage} title="Görsel ekle">
        Görsel
      </ToolbarButton>
      <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Link ekle/düzenle">
        Link
      </ToolbarButton>
      <Divider />

      {/* Temizle */}
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        title="Biçimlendirmeyi temizle"
      >
        Temizle
      </ToolbarButton>
    </div>
  );
}

export default function MakaleEditoru({ content, onChange }: Props) {
  const editor = useEditor({
    // Next.js App Router SSR — hydration mismatch'i önler (TipTap v3 gereği)
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Image,
      LinkExtension.configure({ openOnClick: false }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Subscript,
      Superscript,
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

  return (
    <div className="bg-[var(--color-panel)] border border-[var(--rule-dim)] rounded-lg overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
