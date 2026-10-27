import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(props: IconProps) {
  const { size = 22, ...rest } = props;
  return { width: size, height: size, viewBox: "0 0 24 24", fill: "none", ...rest };
}

export function IconSearch(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function IconX(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconHeart({ filled, ...p }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(p)} viewBox="0 0 24 24">
      <path
        d="M12 20s-7-4.4-9.3-8.2C1 9.2 2.2 6 5.5 6c2 0 3.3 1.2 4.1 2.3C10.4 7.2 11.7 6 13.7 6c3.3 0 4.5 3.2 2.8 5.8C19 15.6 12 20 12 20z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconHome(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
    </svg>
  );
}

export function IconStar(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.2 7.2 18.4l.9-5.4-3.9-3.8 5.4-.8L12 3.5z" />
    </svg>
  );
}

export function IconSettings(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconInfo(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5h.01" />
    </svg>
  );
}

export function IconArrowLeft(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function IconExternal(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 5h5v5M19 5l-9 9" />
      <path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" />
    </svg>
  );
}

export function IconRefresh(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12a8 8 0 1 1-2.3-5.7" />
      <path d="M20 5v5h-5" />
    </svg>
  );
}

export function IconShare(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 13.2l7.6 4.1M15.8 6.7L8.2 10.8" />
    </svg>
  );
}

export function IconWifiOff(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 8.5c3.5-3 7.7-4.5 12-4.2M6.5 12.2c2.2-1.6 4.7-2.4 7.3-2.3M10.5 16c1-.6 2.1-.9 3.2-.9" />
      <path d="M3 3l18 18" />
      <circle cx="12" cy="19.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSun(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

export function IconMoon(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M17 14.5A7 7 0 0 1 9.5 7 6.5 6.5 0 1 0 17 14.5z" />
    </svg>
  );
}

export function IconShield(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M12 3l8 3v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6l8-3z" />
    </svg>
  );
}

export function IconGlobe(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 3.8 6 3.8 9s-1.3 6-3.8 9c-2.5-3-3.8-6-3.8-9S9.5 6 12 3z" />
    </svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function IconSpark(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill="currentColor" />
    </svg>
  );
}

export function IconDownload(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v12M7 12l5 5 5-5M5 20h14" />
    </svg>
  );
}

export function IconChat(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4 3.5V16H7.5A2.5 2.5 0 0 1 5 13.5v-7z" />
    </svg>
  );
}

export function IconImage(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M4 16l4.5-4 4 3.5L16 12l4 4" />
    </svg>
  );
}

export function IconVideo(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="3.5" y="6" width="12" height="12" rx="2" />
      <path d="M15.5 10.5L20 8v8l-4.5-2.5v-3z" />
    </svg>
  );
}

export function IconCode(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8L4 12l4 4M16 8l4 4-4 4M13 6l-2 12" />
    </svg>
  );
}

export function IconMic(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="9" y="4" width="6" height="10" rx="3" />
      <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3" />
    </svg>
  );
}

export function IconPen(p: IconProps) {
  return (
    <svg {...base(p)} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M4 20l4.2-1.1L19 8.1 15.9 5 5.1 15.8 4 20z" />
    </svg>
  );
}

export function SymbolMark({ type, size = 18 }: { type: string; size?: number }) {
  const props = { size, className: "text-white" };
  switch (type) {
    case "search":
      return <IconSearch {...props} />;
    case "image":
      return <IconImage {...props} />;
    case "design":
      return <IconPen {...props} />;
    case "video":
      return <IconVideo {...props} />;
    case "write":
      return <IconPen {...props} />;
    case "translate":
      return <IconGlobe {...props} />;
    case "code":
      return <IconCode {...props} />;
    case "audio":
      return <IconMic {...props} />;
    default:
      return <IconChat {...props} />;
  }
}
