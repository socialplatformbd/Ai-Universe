import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AITool, Language } from "./types";
import { t, categoryLabel } from "./translations";
import { isSafeHttpsUrl } from "./tools";
import { ToolLogo } from "./ToolLogo";
import {
  IconArrowLeft,
  IconExternal,
  IconHeart,
  IconRefresh,
  IconShare,
  IconX,
  IconWifiOff,
} from "./Icons";


interface Props {
  tool: AITool;
  language: Language;
  online: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

type Mode = "launch" | "embed" | "blocked";

export function WebBrowser({
  tool,
  language,
  online,
  isFavorite,
  onToggleFavorite,
  onClose,
}: Props) {
  const [mode, setMode] = useState<Mode>("launch");
  const [loading, setLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const timer = useRef<number | null>(null);

  const safe = isSafeHttpsUrl(tool.url);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function openExternal() {
    if (!safe) return;
    window.open(tool.url, "_blank", "noopener,noreferrer");
  }

  function startEmbed() {
    if (!online) return;
    setMode("embed");
    setLoading(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      setMode("blocked");
    }, 3500);
  }

  function handleIframeLoad() {
    if (timer.current) window.clearTimeout(timer.current);
    setLoading(false);
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: tool.name, url: tool.url, text: tool.description });
      } else {
        await navigator.clipboard.writeText(tool.url);
      }
    } catch {
      /* user cancelled */
    }
  }

  const desc = language === "bn" ? tool.descriptionBn : tool.description;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)]" role="dialog" aria-modal="true">
      <header className="flex items-center gap-1 border-b border-[var(--border)] bg-[var(--surface)] px-2 pt-[max(10px,env(safe-area-inset-top))] pb-2">
        <IconBtn label={t(language, "back")} onClick={onClose}>
          <IconArrowLeft />
        </IconBtn>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[var(--text)]">{tool.name}</p>
          <p className="truncate text-[11px] text-[var(--muted)]">
            {new URL(tool.url).hostname.replace("www.", "")}
          </p>
        </div>
        <IconBtn
          label={isFavorite ? t(language, "removeFavorite") : t(language, "addFavorite")}
          onClick={onToggleFavorite}
        >
          <IconHeart filled={isFavorite} className={isFavorite ? "text-pink-500" : ""} />
        </IconBtn>
        <IconBtn label={t(language, "share")} onClick={share}>
          <IconShare />
        </IconBtn>
        {mode === "embed" && (
          <IconBtn
            label={t(language, "refresh")}
            onClick={() => {
              setIframeKey((k) => k + 1);
              setLoading(true);
              setMode("embed");
              if (timer.current) window.clearTimeout(timer.current);
              timer.current = window.setTimeout(() => {
                setLoading(false);
                setMode("blocked");
              }, 3500);
            }}
          >
            <IconRefresh />
          </IconBtn>
        )}
        <IconBtn label={t(language, "openInBrowser")} onClick={openExternal}>
          <IconExternal />
        </IconBtn>
        <IconBtn label={t(language, "close")} onClick={onClose}>
          <IconX />
        </IconBtn>
      </header>

      {!online && (
        <div className="flex items-center gap-2 bg-amber-500/15 px-4 py-2 text-sm text-amber-200">
          <IconWifiOff size={16} />
          {t(language, "offlineServices")}
        </div>
      )}

      <div className="relative min-h-0 flex-1">
        {mode === "launch" && (
          <LaunchPanel
            tool={tool}
            language={language}
            desc={desc}
            online={online}
            safe={safe}
            onOpen={openExternal}
            onEmbed={startEmbed}
          />
        )}

        {mode === "embed" && safe && (
          <>
            <iframe
              key={iframeKey}
              title={tool.name}
              src={tool.url}
              className="h-full w-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleIframeLoad}
            />
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--bg)]/90">
                <Spinner color={tool.color} />
                <p className="text-sm text-[var(--muted)]">{t(language, "loading")}</p>
              </div>
            )}
          </>
        )}

        {mode === "blocked" && (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <ToolLogo tool={tool} size={72} />
            <h2 className="mt-5 text-lg font-bold text-[var(--text)]">
              {t(language, "webviewBlocked")}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              {t(language, "webviewBlockedHint")}
            </p>
            <button
              type="button"
              onClick={openExternal}
              className="mt-6 w-full max-w-xs rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.color2})` }}
            >
              {t(language, "openOfficial")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("embed");
                setLoading(true);
                setIframeKey((k) => k + 1);
                if (timer.current) window.clearTimeout(timer.current);
                timer.current = window.setTimeout(() => {
                  setLoading(false);
                  setMode("blocked");
                }, 5000);
              }}
              className="mt-3 text-sm font-semibold text-[var(--accent)]"
            >
              {t(language, "keepWaiting")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LaunchPanel({
  tool,
  language,
  desc,
  online,
  safe,
  onOpen,
  onEmbed,
}: {
  tool: AITool;
  language: Language;
  desc: string;
  online: boolean;
  safe: boolean;
  onOpen: () => void;
  onEmbed: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 pb-10 pt-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center text-center">
        <ToolLogo tool={tool} size={88} />
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[var(--text)]">
          {tool.name}
        </h1>
        <span className="mt-2 rounded-full bg-[var(--chip)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
          {categoryLabel(language, tool.category)}
        </span>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">{desc}</p>
        <p className="mt-3 text-xs text-[var(--faint)]">
          {new URL(tool.url).hostname} · {t(language, "officialSite")}
        </p>

        {!online && (
          <div className="mt-6 w-full rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {t(language, "offlineServices")}
          </div>
        )}

        <button
          type="button"
          disabled={!online || !safe}
          onClick={onOpen}
          className="mt-8 w-full rounded-2xl py-4 text-[15px] font-bold text-white shadow-xl transition active:scale-[0.98] disabled:opacity-40"
          style={{
            background: `linear-gradient(135deg, ${tool.color}, ${tool.color2})`,
            boxShadow: `0 12px 32px -10px ${tool.color}99`,
          }}
        >
          {t(language, "continueTo", { name: tool.name })}
        </button>

        <button
          type="button"
          disabled={!online || !safe}
          onClick={onEmbed}
          className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-3.5 text-sm font-semibold text-[var(--text)] transition active:scale-[0.98] disabled:opacity-40"
        >
          {t(language, "tryInApp")}
        </button>

        <p className="mt-5 max-w-sm text-[12px] leading-relaxed text-[var(--faint)]">
          {t(language, "ownedByProvider")} {t(language, "inAppNote")}
        </p>
      </div>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--text)] transition hover:bg-[var(--chip)] active:scale-95"
    >
      {children}
    </button>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <div
      className="h-10 w-10 animate-spin rounded-full border-[3px] border-[var(--border)]"
      style={{ borderTopColor: color }}
    />
  );
}
