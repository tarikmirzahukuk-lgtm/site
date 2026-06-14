type IconName =
  | "shield"
  | "lightning"
  | "strategy"
  | "pillar"
  | "gavel"
  | "scale"
  | "doc"
  | "eye"
  | "user"
  | "handcuff"
  | "phone"
  | "mail"
  | "pin"
  | "whatsapp"
  | "chevron"
  | "plus"
  | "minus"
  | "menu"
  | "close"
  | "linkedin"
  | "twitter"
  | "website"
  | "link"
  | "check";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon({
  name,
  size = 24,
  color = "currentColor",
  className,
}: IconProps) {
  const sp = {
    fill: "none",
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const icons: Record<IconName, React.ReactNode> = {
    shield: (
      <>
        <path d="M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6l8-3z" {...sp} />
        <path d="M9 12l2 2 4-4" {...sp} />
      </>
    ),
    lightning: <path d="M13 3l-8 11h6l-1 7 8-11h-6l1-7z" {...sp} />,
    strategy: (
      <>
        <path d="M4 19V8m0 0l5 4 6-5 5 4" {...sp} />
        <circle cx="4" cy="6" r="1.6" {...sp} />
        <circle cx="9" cy="12" r="1.6" {...sp} />
        <circle cx="15" cy="7" r="1.6" {...sp} />
        <circle cx="20" cy="11" r="1.6" {...sp} />
      </>
    ),
    pillar: <path d="M5 21h14M7 21V8m4 13V8m4 13V8m4 13V8M4 8l8-5 8 5" {...sp} />,
    gavel: <path d="M14 4l6 6-4 4-6-6 4-4zM10 8l-6 6 4 4 6-6M3 21h12" {...sp} />,
    scale: <path d="M12 4v16M5 8h14M5 8l-2 6h4l-2-6zm14 0l-2 6h4l-2-6zM8 20h8" {...sp} />,
    doc: (
      <>
        <path d="M7 3h8l4 4v14H7V3z" {...sp} />
        <path d="M15 3v4h4M9 11h6M9 15h6M9 19h4" {...sp} />
      </>
    ),
    eye: (
      <>
        <ellipse cx="12" cy="12" rx="9" ry="6" {...sp} />
        <circle cx="12" cy="12" r="2.5" {...sp} />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="9" r="3.5" {...sp} />
        <path d="M5 21c0-4 3-7 7-7s7 3 7 7" {...sp} />
      </>
    ),
    handcuff: (
      <>
        <circle cx="7" cy="14" r="4" {...sp} />
        <circle cx="17" cy="14" r="4" {...sp} />
        <path d="M11 14h2M8 10l2-3M16 10l-2-3" {...sp} />
      </>
    ),
    phone: <path d="M5 4h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4c0 1-1 2-2 2C9 22 2 15 2 6c0-1 1-2 3-2z" {...sp} />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1.5" {...sp} />
        <path d="M3 7l9 6 9-6" {...sp} />
      </>
    ),
    pin: (
      <>
        <path d="M12 21c4-4 7-7 7-11a7 7 0 10-14 0c0 4 3 7 7 11z" {...sp} />
        <circle cx="12" cy="10" r="2.5" {...sp} />
      </>
    ),
    whatsapp: (
      <>
        <path d="M20 12a8 8 0 11-15-4 8 8 0 0114 0c0 1-.5 3-1 4l1 4-4-1c-1 .5-3 1-4 1" {...sp} />
        <path d="M9 9c0 4 2 6 6 6 0 0 1 0 1-1l-2-1-1 1c-1 0-2-1-2-2l1-1-1-2c-1 0-1 0-2 0z" {...sp} />
      </>
    ),
    chevron: <path d="M9 6l6 6-6 6" {...sp} />,
    plus: <path d="M12 5v14M5 12h14" {...sp} />,
    minus: <path d="M5 12h14" {...sp} />,
    menu: <path d="M3 6h18M3 12h18M3 18h18" {...sp} />,
    close: <path d="M6 6l12 12M6 18L18 6" {...sp} />,
    linkedin: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="1.5" {...sp} />
        <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4M11 10v7" {...sp} />
      </>
    ),
    twitter: <path d="M4 4l7 9m0 0l7 7m-7-7L4 20m7-7l7-9" {...sp} />,
    website: (
      <>
        <circle cx="12" cy="12" r="9" {...sp} />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" {...sp} />
      </>
    ),
    link: (
      <>
        <path d="M10 14a3.5 3.5 0 005 0l3-3a3.5 3.5 0 00-5-5l-1.5 1.5" {...sp} />
        <path d="M14 10a3.5 3.5 0 00-5 0l-3 3a3.5 3.5 0 005 5l1.5-1.5" {...sp} />
      </>
    ),
    check: <path d="M5 12l4 4 10-10" {...sp} />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ flex: "0 0 auto" }}
    >
      {icons[name]}
    </svg>
  );
}

export type { IconName };
