"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extensions";
import { TextStyle, Color, FontSize } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import EIcon, { type EIconName } from "@/components/admin/editor-icons";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

const btnBase =
  "h-8 flex items-center gap-1.5 px-2 rounded-md text-[13px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap";
const btnIdle =
  "text-[var(--color-muted)] hover:bg-[var(--color-panel-hi)] hover:text-[var(--color-ink)]";
const btnActive = "bg-[var(--color-gold)] text-[#0a0d11]";

function IconBtn({
  icon,
  label,
  onClick,
  active,
  disabled,
  title,
}: {
  icon: EIconName;
  label?: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`${btnBase} ${active ? btnActive : btnIdle}`}
    >
      <EIcon name={icon} />
      {label && <span>{label}</span>}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-[var(--rule-dim)] mx-1 shrink-0" />;
}

function Dropdown({
  trigger,
  title,
  width = "w-44",
  children,
}: {
  trigger: React.ReactNode;
  title: string;
  width?: string;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        title={title}
        aria-label={title}
        onClick={() => setOpen((o) => !o)}
        className={`${btnBase} ${open ? "bg-[var(--color-panel-hi)] text-[var(--color-ink)]" : btnIdle}`}
      >
        {trigger}
        <EIcon name="chevron" size={12} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={`absolute left-0 top-full mt-1.5 z-50 ${width} rounded-lg border border-[var(--rule-dim)] bg-[var(--color-panel)] p-1.5 shadow-2xl shadow-black/50`}
          >
            {children(() => setOpen(false))}
          </div>
        </>
      )}
    </div>
  );
}

const HEADINGS = [
  { label: "Normal metin", level: 0 },
  { label: "Başlık 1", level: 1 },
  { label: "Başlık 2", level: 2 },
  { label: "Başlık 3", level: 3 },
  { label: "Başlık 4", level: 4 },
] as const;

const TEXT_COLORS = [
  { name: "Altın", value: "#D4AF37" },
  { name: "Beyaz", value: "#F5F5F5" },
  { name: "Gri", value: "#B8B8B8" },
  { name: "Kırmızı", value: "#ef4444" },
  { name: "Turuncu", value: "#f59e0b" },
  { name: "Yeşil", value: "#22c55e" },
  { name: "Mavi", value: "#3b82f6" },
  { name: "Mor", value: "#a855f7" },
];

const HIGHLIGHTS = [
  { name: "Altın", value: "rgba(212,175,55,0.35)" },
  { name: "Sarı", value: "rgba(234,179,8,0.35)" },
  { name: "Yeşil", value: "rgba(34,197,94,0.30)" },
  { name: "Mavi", value: "rgba(59,130,246,0.30)" },
  { name: "Pembe", value: "rgba(236,72,153,0.30)" },
];

const FONT_SIZES = [
  { label: "Varsayılan", value: "" },
  { label: "Küçük", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Orta", value: "19px" },
  { label: "Büyük", value: "24px" },
  { label: "Çok büyük", value: "30px" },
];

function currentHeadingLabel(editor: Editor): string {
  for (const h of HEADINGS) {
    if (h.level > 0 && editor.isActive("heading", { level: h.level }))
      return h.label;
  }
  return "Normal metin";
}

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
    const url = prompt("Bağlantı adresi (URL):", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-[var(--rule-dim)] bg-[var(--color-panel)]/95 backdrop-blur-md rounded-t-lg">
      {/* Blok tipi */}
      <Dropdown
        title="Paragraf / başlık stili"
        width="w-48"
        trigger={<span className="px-0.5">{currentHeadingLabel(editor)}</span>}
      >
        {(close) => (
          <div className="flex flex-col">
            <p className="px-2.5 pt-1 pb-1.5 text-[11px] text-[var(--color-muted-dim)]">
              Metnin türü
            </p>
            {HEADINGS.map((h) => {
              const active =
                h.level === 0
                  ? editor.isActive("paragraph")
                  : editor.isActive("heading", { level: h.level });
              return (
                <button
                  key={h.level}
                  type="button"
                  onClick={() => {
                    if (h.level === 0)
                      editor.chain().focus().setParagraph().run();
                    else
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: h.level as 1 | 2 | 3 | 4 })
                        .run();
                    close();
                  }}
                  className={`text-left px-2.5 py-1.5 rounded-md transition-colors ${
                    active
                      ? "text-[var(--color-gold)]"
                      : "text-[var(--color-body)] hover:bg-[var(--color-panel-hi)]"
                  } ${h.level === 1 ? "text-xl font-semibold" : ""} ${
                    h.level === 2 ? "text-lg font-semibold" : ""
                  } ${h.level === 3 ? "text-base font-medium" : ""} ${
                    h.level === 4 ? "text-sm font-medium" : ""
                  }`}
                  style={{ fontFamily: h.level > 0 ? "var(--font-display)" : undefined }}
                >
                  {h.label}
                </button>
              );
            })}
          </div>
        )}
      </Dropdown>

      <Divider />

      {/* Karakter biçimi */}
      <IconBtn icon="bold" label="Kalın" title="Kalın (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
      <IconBtn icon="italic" label="İtalik" title="İtalik (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <IconBtn icon="underline" label="Altı çizili" title="Altı çizili (Ctrl+U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
      <IconBtn icon="strike" label="Üstü çizili" title="Üstü çizili" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} />
      <IconBtn icon="code" label="Kod" title="Satır içi kod" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} />

      <Divider />

      {/* Renk / Vurgu / Boyut */}
      <Dropdown
        title="Yazı rengi"
        width="w-44"
        trigger={
          <span className="flex items-center gap-1.5">
            <EIcon name="textColor" />
            Renk
          </span>
        }
      >
        {(close) => (
          <div>
            <p className="px-1 pb-1.5 text-[11px] text-[var(--color-muted-dim)]">Yazı rengi</p>
            <div className="grid grid-cols-4 gap-1.5 p-1">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.name}
                  onClick={() => {
                    editor.chain().focus().setColor(c.value).run();
                    close();
                  }}
                  className="w-7 h-7 rounded-md border border-[var(--rule-dim)] transition-transform hover:scale-110"
                  style={{ background: c.value }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                close();
              }}
              className="w-full text-left text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] px-2 py-1.5 mt-1"
            >
              Rengi kaldır
            </button>
          </div>
        )}
      </Dropdown>

      <Dropdown
        title="Vurgu (arka plan rengi)"
        width="w-44"
        trigger={
          <span className="flex items-center gap-1.5">
            <EIcon name="highlight" />
            Vurgu
          </span>
        }
      >
        {(close) => (
          <div>
            <p className="px-1 pb-1.5 text-[11px] text-[var(--color-muted-dim)]">Arka plan vurgusu</p>
            <div className="grid grid-cols-5 gap-1.5 p-1">
              {HIGHLIGHTS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.name}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color: c.value }).run();
                    close();
                  }}
                  className="w-7 h-7 rounded-md border border-[var(--rule-dim)] transition-transform hover:scale-110"
                  style={{ background: c.value }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                close();
              }}
              className="w-full text-left text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] px-2 py-1.5 mt-1"
            >
              Vurguyu kaldır
            </button>
          </div>
        )}
      </Dropdown>

      <Dropdown title="Yazı boyutu" width="w-40" trigger={<span className="text-xs px-0.5">Boyut</span>}>
        {(close) => (
          <div className="flex flex-col">
            {FONT_SIZES.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  if (f.value) editor.chain().focus().setFontSize(f.value).run();
                  else editor.chain().focus().unsetFontSize().run();
                  close();
                }}
                className="text-left px-2.5 py-1.5 rounded-md text-[var(--color-body)] hover:bg-[var(--color-panel-hi)] transition-colors"
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </Dropdown>

      <Divider />

      {/* Hizalama */}
      <IconBtn icon="alignLeft" label="Sol" title="Sola hizala" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
      <IconBtn icon="alignCenter" label="Orta" title="Ortala" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
      <IconBtn icon="alignRight" label="Sağ" title="Sağa hizala" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} />
      <IconBtn icon="alignJustify" label="Yasla" title="İki yana yasla" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} />

      <Divider />

      {/* Bloklar */}
      <IconBtn icon="bulletList" label="Madde" title="Madde listesi" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <IconBtn icon="orderedList" label="Sıralı" title="Numaralı liste" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      <IconBtn icon="quote" label="Alıntı" title="Alıntı" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
      <IconBtn icon="codeBlock" label="Kod bloğu" title="Kod bloğu" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
      <IconBtn icon="rule" label="Çizgi" title="Yatay ayraç çizgisi" onClick={() => editor.chain().focus().setHorizontalRule().run()} />

      <Divider />

      {/* Alt / üst simge */}
      <IconBtn icon="subscript" label="Alt simge" title="Alt simge (x₂)" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()} />
      <IconBtn icon="superscript" label="Üst simge" title="Üst simge (x²)" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()} />

      <Divider />

      {/* Görsel / Link */}
      <IconBtn icon="image" label="Görsel" title="Görsel ekle" onClick={addImage} />
      <IconBtn icon="link" label="Bağlantı" title="Bağlantı (link) ekle / düzenle" active={editor.isActive("link")} onClick={setLink} />

      <Divider />

      {/* Geri / İleri / Temizle */}
      <IconBtn icon="undo" label="Geri al" title="Geri al" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} />
      <IconBtn icon="redo" label="İleri al" title="İleri al" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} />
      <IconBtn icon="eraser" label="Biçimi temizle" title="Biçimlendirmeyi temizle" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} />
    </div>
  );
}

export default function MakaleEditoru({ content, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      // StarterKit v3 link+underline'ı zaten içerir; aşağıda özel yapılandırma
      // ile tekrar eklediğimiz için buradakileri kapatıp çift kayıt uyarısını önlüyoruz.
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: false,
        underline: false,
      }),
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
      CharacterCount,
      Placeholder.configure({
        placeholder: "Makale içeriğinizi buraya yazın…",
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[460px] px-6 md:px-10 py-6 focus:outline-none prose-headings:font-[var(--font-display)] prose-a:text-[var(--color-gold)]",
      },
    },
  });

  if (!editor) return null;

  const words = editor.storage.characterCount.words();
  const chars = editor.storage.characterCount.characters();

  return (
    <div className="bg-[var(--color-panel)] border border-[var(--rule-dim)] rounded-lg">
      <Toolbar editor={editor} />

      <BubbleMenu
        editor={editor}
        options={{ placement: "top" }}
        shouldShow={({ editor, state }) =>
          editor.isEditable &&
          !state.selection.empty &&
          !editor.isActive("image") &&
          !editor.isActive("codeBlock")
        }
      >
        <div className="flex items-center gap-0.5 rounded-lg border border-[var(--rule-dim)] bg-[var(--color-bg-alt)] p-1 shadow-2xl shadow-black/60">
          <IconBtn icon="bold" label="Kalın" title="Kalın" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
          <IconBtn icon="italic" label="İtalik" title="İtalik" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <IconBtn icon="underline" label="Altı çizili" title="Altı çizili" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
          <IconBtn icon="highlight" label="Vurgu" title="Vurgula" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight({ color: "rgba(212,175,55,0.35)" }).run()} />
          <IconBtn icon="link" label="Bağlantı" title="Bağlantı" active={editor.isActive("link")} onClick={() => { const u = prompt("Bağlantı adresi (URL):", "https://"); if (u) editor.chain().focus().extendMarkRange("link").setLink({ href: u }).run(); }} />
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />

      <div className="flex justify-end gap-3 px-4 py-2 border-t border-[var(--rule-dim)] text-[11px] text-[var(--color-muted-dim)]">
        <span>{words} kelime</span>
        <span>·</span>
        <span>{chars} karakter</span>
      </div>
    </div>
  );
}
