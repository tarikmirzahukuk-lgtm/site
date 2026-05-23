// Makale editörü için sade, stroke tabanlı ikon seti (currentColor).
import React from "react";

export type EIconName =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "bulletList"
  | "orderedList"
  | "quote"
  | "codeBlock"
  | "alignLeft"
  | "alignCenter"
  | "alignRight"
  | "alignJustify"
  | "image"
  | "link"
  | "unlink"
  | "undo"
  | "redo"
  | "rule"
  | "eraser"
  | "subscript"
  | "superscript"
  | "chevron"
  | "textColor"
  | "highlight";

const sp = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const paths: Record<EIconName, React.ReactNode> = {
  bold: <path d="M7 5h6a3.5 3.5 0 010 7H7zM7 12h7a3.5 3.5 0 010 7H7z" {...sp} />,
  italic: <path d="M11 5h6M7 19h6M14 5l-4 14" {...sp} />,
  underline: (
    <>
      <path d="M7 5v6a5 5 0 0010 0V5" {...sp} />
      <path d="M5 21h14" {...sp} />
    </>
  ),
  strike: (
    <>
      <path d="M5 12h14" {...sp} />
      <path d="M8 7c0-1.5 1.8-3 4-3s4 1 4 2.5M8 16c0 1.7 1.8 3 4 3s4-1.2 4-3" {...sp} />
    </>
  ),
  code: <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" {...sp} />,
  bulletList: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" {...sp} />
      <circle cx="4.5" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  orderedList: (
    <>
      <path d="M10 6h10M10 12h10M10 18h10" {...sp} />
      <path d="M4 5l1-.5V8M3.5 16.5c0-.8 1.5-.8 1.5 0 0 .6-1.5 1.2-1.5 1.9H5" {...sp} />
    </>
  ),
  quote: (
    <path
      d="M8 7c-2 0-3 1.5-3 3.5S6 14 7.5 14c0 1.5-1 2.5-2.5 3M17 7c-2 0-3 1.5-3 3.5s1 3.5 2.5 3.5c0 1.5-1 2.5-2.5 3"
      {...sp}
    />
  ),
  codeBlock: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" {...sp} />
      <path d="M9 9l-2 3 2 3M15 9l2 3-2 3" {...sp} />
    </>
  ),
  alignLeft: <path d="M4 6h16M4 12h10M4 18h13" {...sp} />,
  alignCenter: <path d="M4 6h16M7 12h10M5 18h14" {...sp} />,
  alignRight: <path d="M4 6h16M10 12h10M7 18h13" {...sp} />,
  alignJustify: <path d="M4 6h16M4 12h16M4 18h16" {...sp} />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" {...sp} />
      <circle cx="8.5" cy="9.5" r="1.6" {...sp} />
      <path d="M21 16l-5-5-7 7" {...sp} />
    </>
  ),
  link: (
    <path
      d="M10 13a4 4 0 005.66 0l2.5-2.5a4 4 0 00-5.66-5.66L11 6.3M14 11a4 4 0 00-5.66 0l-2.5 2.5a4 4 0 005.66 5.66L13 17.7"
      {...sp}
    />
  ),
  unlink: (
    <>
      <path d="M9 12l-1.5 1.5a3.5 3.5 0 005 5L14 17M15 12l1.5-1.5a3.5 3.5 0 00-5-5L10 7" {...sp} />
      <path d="M4 4l16 16" {...sp} />
    </>
  ),
  undo: <path d="M9 7L4 12l5 5M4 12h11a5 5 0 010 10h-1" {...sp} transform="translate(0 -2)" />,
  redo: <path d="M15 7l5 5-5 5M20 12H9a5 5 0 000 10h1" {...sp} transform="translate(0 -2)" />,
  rule: <path d="M4 12h16" {...sp} />,
  eraser: (
    <>
      <path d="M16 4l4 4-9 9H7l-3-3z" {...sp} />
      <path d="M9 19h11" {...sp} />
    </>
  ),
  subscript: (
    <>
      <path d="M5 6l7 9M12 6l-7 9" {...sp} />
      <path d="M17 19c0-1.2 2.5-1.4 2.5.2 0 1-2.5 1.6-2.5 2.8H20" {...sp} />
    </>
  ),
  superscript: (
    <>
      <path d="M5 9l7 9M12 9l-7 9" {...sp} />
      <path d="M17 5c0-1.2 2.5-1.4 2.5.2 0 1-2.5 1.6-2.5 2.8H20" {...sp} />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" {...sp} />,
  textColor: (
    <>
      <path d="M6 16l4-10 4 10M7.2 13h5.6" {...sp} />
      <path d="M5 20h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),
  highlight: (
    <>
      <path d="M5 16l8-8 3 3-8 8H5z" {...sp} />
      <path d="M13 6l3-3 3 3-3 3" {...sp} />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),
};

export default function EIcon({
  name,
  size = 16,
}: {
  name: EIconName;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
