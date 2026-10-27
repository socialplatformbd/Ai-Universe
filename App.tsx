import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { AITool, CategoryId, Language, Screen, Theme } from "./types";
import { CATEGORIES, TOOLS, filterTools } from "./tools";
import { t, categoryLabel } from "./translations";
import { ToolLogo } from "./ToolLogo";
import { WebBrowser } from "./WebBrowser";
import {
  IconDownload,
  IconHeart,
  IconHome,
  IconInfo,
  IconMoon,
  IconSearch,
  IconSettings,
  IconShield,
  IconSpark,
  IconStar,
  IconSun,
  IconWifiOff,
  IconX,
  IconCheck,
} from "./Icons";
import { cn } from "./cn";
const appIcon = `${import.meta.env.BASE_URL}icon-192.png`;

const FAV_KEY = "aiuniverse.favorites";
const LANG_KEY = "aiuniverse.language";
const THEME_KEY = "aiuniverse.theme";
const INSTALL_KEY = "aiuniverse.installDismissed";

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function readLang(): Language {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v === "bn" || v === "en") return v;
  } catch {
    /* ignore */
  }
  const nav = navigator.language?.toLowerCase() ?? "";
  return nav.startsWith("bn") ? "bn" : "en";
}

function readTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return "dark";
}

export default function App() {
  const [language, setLanguageState] = useState<Language>(readLang);
  const [theme, setThemeState] = useState<Theme>(readTheme);
  const [favorites, setFavorites] = useState<string[]>(() => readList(FAV_KEY));
  const [screen, setScreen] = useState<Screen>("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");
  const [active, setActive] = useState<AITool | null>(null);
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine
  );
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.lang = language === "bn" ? "bn" : "en";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.style.colorScheme = theme;
  }, [language, theme]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      try {
        if (!localStorage.getItem(INSTALL_KEY)) setShowInstall(true);
      } catch {
        setShowInstall(true);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
  };

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
        try {
          localStorage.setItem(FAV_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    []
  );

  const filtered = useMemo(
    () => filterTools(TOOLS, query, category),
    [query, category]
  );
  const featured = useMemo(() => TOOLS.filter((x) => x.featured), []);
  const favoriteTools = useMemo(
    () => TOOLS.filter((x) => favorites.includes(x.id)),
    [favorites]
  );

  const openTool = (tool: AITool) => setActive(tool);

  async function installApp() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstall(false);
  }

  function dismissInstall() {
    setShowInstall(false);
    try {
      localStorage.setItem(INSTALL_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  const hideNav = Boolean(active);

  return (
    <div className="app-root relative min-h-dvh overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="noise" />
      </div>

      {!hideNav && (
        <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
          {!online && <OfflineBanner language={language} />}

          {screen === "home" && (
            <HomeScreen
              language={language}
              query={query}
              setQuery={setQuery}
              category={category}
              setCategory={setCategory}
              filtered={filtered}
              featured={featured}
              favorites={favorites}
              onToggleFavorite={(id) => {
                const adding = !favorites.includes(id);
                toggleFavorite(id);
                if (adding) showToast(t(language, "favoriteSaved"));
              }}
              onOpen={openTool}
              theme={theme}
              onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          )}

          {screen === "favorites" && (
            <FavoritesScreen
              language={language}
              tools={favoriteTools}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onOpen={openTool}
              onBrowse={() => setScreen("home")}
            />
          )}

          {screen === "settings" && (
            <SettingsScreen
              language={language}
              setLanguage={setLanguage}
              theme={theme}
              setTheme={setTheme}
              onAbout={() => setScreen("about")}
              onPrivacy={() => setScreen("privacy")}
              canInstall={Boolean(deferredPrompt)}
              onInstall={installApp}
            />
          )}

          {screen === "about" && (
            <AboutScreen language={language} onBack={() => setScreen("settings")} />
          )}

          {screen === "privacy" && (
            <PrivacyScreen language={language} onBack={() => setScreen("settings")} />
          )}

          {(screen === "home" || screen === "favorites" || screen === "settings") && (
            <BottomNav
              language={language}
              screen={screen}
              favoritesCount={favorites.length}
              onChange={setScreen}
            />
          )}
        </div>
      )}

      {showInstall && !hideNav && screen === "home" && (
        <InstallBanner
          language={language}
          onInstall={installApp}
          onDismiss={dismissInstall}
          canPrompt={Boolean(deferredPrompt)}
        />
      )}

      {active && (
        <WebBrowser
          tool={active}
          language={language}
          online={online}
          isFavorite={favorites.includes(active.id)}
          onToggleFavorite={() => toggleFavorite(active.id)}
          onClose={() => setActive(null)}
        />
      )}

      {toast && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function HomeScreen({
  language,
  query,
  setQuery,
  category,
  setCategory,
  filtered,
  featured,
  favorites,
  onToggleFavorite,
  onOpen,
  theme,
  onToggleTheme,
}: {
  language: Language;
  query: string;
  setQuery: (v: string) => void;
  category: CategoryId;
  setCategory: (c: CategoryId) => void;
  filtered: AITool[];
  featured: AITool[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpen: (t: AITool) => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const showPopular = !query && category === "all";

  return (
    <main className="flex-1 px-4 pb-28 pt-[max(12px,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-3">
        <img
          src={appIcon}
          alt=""
          className="h-11 w-11 rounded-2xl shadow-lg shadow-violet-500/30"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-extrabold tracking-tight text-[var(--text)]">
            {t(language, "appName")}
          </h1>
          <p className="text-xs text-[var(--muted)]">{t(language, "tagline")}</p>
        </div>
        <button
          type="button"
          aria-label={theme === "dark" ? t(language, "light") : t(language, "dark")}
          onClick={onToggleTheme}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--card)] text-[var(--text)] shadow-sm"
        >
          {theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
        </button>
      </header>

      <SearchBar language={language} query={query} setQuery={setQuery} />

      <div className="mt-4 -mx-4 overflow-x-auto px-4 scrollbar-none">
        <div className="flex w-max gap-2 pb-1">
          {(["all", ...CATEGORIES] as CategoryId[]).map((id) => {
            const activeChip = category === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition",
                  activeChip
                    ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-md shadow-violet-600/30"
                    : "bg-[var(--card)] text-[var(--muted)]"
                )}
              >
                {categoryLabel(language, id)}
              </button>
            );
          })}
        </div>
      </div>

      {showPopular && (
        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
                {t(language, "popular")}
              </h2>
              <p className="text-xs text-[var(--faint)]">{t(language, "popularHint")}</p>
            </div>
          </div>
          <div className="-mx-4 overflow-x-auto px-4 scrollbar-none">
            <div className="flex w-max gap-3">
              {featured.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onOpen(tool)}
                  className="flex w-[148px] flex-col items-start rounded-3xl bg-[var(--card)] p-3.5 text-left shadow-sm transition active:scale-[0.97]"
                >
                  <ToolLogo tool={tool} size={44} />
                  <span className="mt-3 line-clamp-1 text-sm font-bold text-[var(--text)]">
                    {tool.name}
                  </span>
                  <span className="mt-0.5 text-[11px] text-[var(--muted)]">
                    {categoryLabel(language, tool.category)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
            {query || category !== "all" ? t(language, "resultsFor") : t(language, "allTools")}
          </h2>
          <span className="text-xs font-medium text-[var(--faint)]">
            {t(language, "toolsCount", { n: filtered.length })}
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={t(language, "noResults")}
            hint={t(language, "noResultsHint")}
            action={t(language, "emptySearchAction")}
            onAction={() => {
              setQuery("");
              setCategory("all");
            }}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                language={language}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={() => onToggleFavorite(tool.id)}
                onOpen={() => onOpen(tool)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ToolCard({
  tool,
  language,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: {
  tool: AITool;
  language: Language;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}) {
  const desc = language === "bn" ? tool.descriptionBn : tool.description;
  return (
    <article className="relative flex flex-col rounded-3xl bg-[var(--card)] p-3.5 shadow-sm transition active:scale-[0.98]">
      <button
        type="button"
        aria-label={isFavorite ? t(language, "removeFavorite") : t(language, "addFavorite")}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={cn(
          "absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full",
          isFavorite ? "text-pink-500" : "text-[var(--faint)]"
        )}
      >
        <IconHeart filled={isFavorite} size={18} />
      </button>
      <button type="button" onClick={onOpen} className="flex flex-1 flex-col text-left">
        <ToolLogo tool={tool} size={46} />
        <h3 className="mt-3 line-clamp-1 pr-6 text-[13.5px] font-bold text-[var(--text)]">
          {tool.name}
        </h3>
        <p className="mt-0.5 text-[11px] font-medium text-[var(--accent)]">
          {categoryLabel(language, tool.category)}
        </p>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[var(--muted)]">{desc}</p>
      </button>
    </article>
  );
}

function SearchBar({
  language,
  query,
  setQuery,
}: {
  language: Language;
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">
        <IconSearch size={18} />
      </span>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(language, "searchPlaceholder")}
        aria-label={t(language, "searchPlaceholder")}
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-3.5 pl-11 pr-11 text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--faint)] focus:border-violet-500"
        enterKeyHint="search"
      />
      {query && (
        <button
          type="button"
          aria-label={t(language, "searchClear")}
          onClick={() => setQuery("")}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-[var(--muted)]"
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}

function FavoritesScreen({
  language,
  tools,
  favorites,
  onToggleFavorite,
  onOpen,
  onBrowse,
}: {
  language: Language;
  tools: AITool[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpen: (t: AITool) => void;
  onBrowse: () => void;
}) {
  return (
    <main className="flex-1 px-4 pb-28 pt-[max(16px,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-extrabold text-[var(--text)]">{t(language, "favorites")}</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {t(language, "toolsCount", { n: tools.length })}
      </p>
      {tools.length === 0 ? (
        <EmptyState
          title={t(language, "noFavorites")}
          hint={t(language, "noFavoritesHint")}
          action={t(language, "allTools")}
          onAction={onBrowse}
          icon="heart"
        />
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              language={language}
              isFavorite={favorites.includes(tool.id)}
              onToggleFavorite={() => onToggleFavorite(tool.id)}
              onOpen={() => onOpen(tool)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function SettingsScreen({
  language,
  setLanguage,
  theme,
  setTheme,
  onAbout,
  onPrivacy,
  canInstall,
  onInstall,
}: {
  language: Language;
  setLanguage: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  onAbout: () => void;
  onPrivacy: () => void;
  canInstall: boolean;
  onInstall: () => void;
}) {
  return (
    <main className="flex-1 px-4 pb-28 pt-[max(16px,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-extrabold text-[var(--text)]">{t(language, "settings")}</h1>

      <SectionLabel>{t(language, "language")}</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        <Choice
          active={language === "en"}
          label={t(language, "english")}
          onClick={() => setLanguage("en")}
        />
        <Choice
          active={language === "bn"}
          label={t(language, "bengali")}
          onClick={() => setLanguage("bn")}
        />
      </div>

      <SectionLabel>{t(language, "appearance")}</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        <Choice
          active={theme === "dark"}
          label={t(language, "dark")}
          icon={<IconMoon size={16} />}
          onClick={() => setTheme("dark")}
        />
        <Choice
          active={theme === "light"}
          label={t(language, "light")}
          icon={<IconSun size={16} />}
          onClick={() => setTheme("light")}
        />
      </div>

      {canInstall && (
        <>
          <SectionLabel>{t(language, "howToInstall")}</SectionLabel>
          <button
            type="button"
            onClick={onInstall}
            className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3.5 text-left font-semibold text-white"
          >
            <IconDownload size={18} />
            {t(language, "install")}
          </button>
        </>
      )}

      <SectionLabel>{t(language, "legal")}</SectionLabel>
      <div className="overflow-hidden rounded-2xl bg-[var(--card)]">
        <RowButton icon={<IconInfo size={18} />} label={t(language, "about")} onClick={onAbout} />
        <div className="mx-4 h-px bg-[var(--border)]" />
        <RowButton
          icon={<IconShield size={18} />}
          label={t(language, "privacy")}
          onClick={onPrivacy}
        />
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-[var(--faint)]">
        {t(language, "appName")} · {t(language, "version")} {t(language, "versionNumber")}
        <br />
        {t(language, "madeIndependent")}
      </p>
    </main>
  );
}

function AboutScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  return (
    <main className="flex-1 px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-semibold text-[var(--accent)]"
      >
        ← {t(language, "back")}
      </button>
      <div className="flex flex-col items-center text-center">
        <img src={appIcon} alt="" className="h-20 w-20 rounded-3xl shadow-xl" />
        <h1 className="mt-4 text-2xl font-extrabold text-[var(--text)]">
          {t(language, "aboutTitle")}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {t(language, "version")} {t(language, "versionNumber")}
        </p>
      </div>
      <p className="mt-6 text-[15px] leading-relaxed text-[var(--muted)]">
        {t(language, "aboutDesc")}
      </p>
      <div className="mt-5 rounded-2xl bg-[var(--card)] p-4">
        <h2 className="text-sm font-bold text-[var(--text)]">{t(language, "disclaimer")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {t(language, "disclaimerText")}
        </p>
      </div>
      <h2 className="mt-6 text-sm font-bold text-[var(--text)]">{t(language, "categories")}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {CATEGORIES.map((id) => (
          <span
            key={id}
            className="rounded-full bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]"
          >
            {categoryLabel(language, id)}
          </span>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-[var(--faint)]">
        {t(language, "notEndorsed")} · {t(language, "toolCountLabel")}
      </p>
    </main>
  );
}

function PrivacyScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  return (
    <main className="flex-1 px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-semibold text-[var(--accent)]"
      >
        ← {t(language, "back")}
      </button>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400">
          <IconShield size={22} />
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">{t(language, "privacyTitle")}</h1>
      </div>
      {[t(language, "privacyP1"), t(language, "privacyP2"), t(language, "privacyP3"), t(language, "privacyP4")].map(
        (p, i) => (
          <p key={i} className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
            {p}
          </p>
        )
      )}
      <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
        <li className="rounded-2xl bg-[var(--card)] px-4 py-3">{t(language, "savedLocally")}</li>
        <li className="rounded-2xl bg-[var(--card)] px-4 py-3">{t(language, "openHttpsOnly")}</li>
        <li className="rounded-2xl bg-[var(--card)] px-4 py-3">{t(language, "requiresInternet")}</li>
      </ul>
    </main>
  );
}

function BottomNav({
  language,
  screen,
  favoritesCount,
  onChange,
}: {
  language: Language;
  screen: Screen;
  favoritesCount: number;
  onChange: (s: Screen) => void;
}) {
  const items: { id: Screen; label: string; icon: ReactNode }[] = [
    { id: "home", label: t(language, "home"), icon: <IconHome size={22} /> },
    {
      id: "favorites",
      label: t(language, "favorites"),
      icon: (
        <span className="relative">
          <IconStar size={22} />
          {favoritesCount > 0 && (
            <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-bold text-white">
              {favoritesCount}
            </span>
          )}
        </span>
      ),
    },
    { id: "settings", label: t(language, "settings"), icon: <IconSettings size={22} /> },
  ];

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 border-t border-[var(--border)] bg-[var(--nav)]/90 pb-[max(8px,env(safe-area-inset-bottom))] pt-1 backdrop-blur-xl"
      aria-label="Main"
    >
      <div className="grid grid-cols-3">
        {items.map((item) => {
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold",
                active ? "text-violet-400" : "text-[var(--faint)]"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function EmptyState({
  title,
  hint,
  action,
  onAction,
  icon,
}: {
  title: string;
  hint: string;
  action: string;
  onAction: () => void;
  icon?: "heart";
}) {
  return (
    <div className="mt-10 flex flex-col items-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--card)] text-violet-400">
        {icon === "heart" ? <IconHeart size={28} /> : <IconSpark size={28} />}
      </div>
      <h3 className="mt-4 text-base font-bold text-[var(--text)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{hint}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-5 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white"
      >
        {action}
      </button>
    </div>
  );
}

function OfflineBanner({ language }: { language: Language }) {
  return (
    <div className="flex items-center gap-2 bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950">
      <IconWifiOff size={16} />
      <span className="flex-1">{t(language, "offline")}</span>
      <span className="text-xs font-medium opacity-80">{t(language, "offlineHint")}</span>
    </div>
  );
}

function InstallBanner({
  language,
  onInstall,
  onDismiss,
  canPrompt,
}: {
  language: Language;
  onInstall: () => void;
  onDismiss: () => void;
  canPrompt: boolean;
}) {
  return (
    <div className="fixed bottom-[88px] left-1/2 z-40 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl border border-violet-400/30 bg-[var(--surface)] p-4 shadow-2xl">
      <div className="flex items-start gap-3">
        <img src={appIcon} alt="" className="h-11 w-11 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[var(--text)]">{t(language, "installTitle")}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
            {canPrompt ? t(language, "installHint") : t(language, "howToInstallSteps")}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {canPrompt && (
          <button
            type="button"
            onClick={onInstall}
            className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-bold text-white"
          >
            {t(language, "install")}
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="flex-1 rounded-xl bg-[var(--chip)] py-2.5 text-sm font-semibold text-[var(--text)]"
        >
          {t(language, "dismiss")}
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 mt-7 text-xs font-bold uppercase tracking-wider text-[var(--faint)]">
      {children}
    </h2>
  );
}

function Choice({
  active,
  label,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold",
        active
          ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
          : "bg-[var(--card)] text-[var(--muted)]"
      )}
    >
      {icon}
      {label}
      {active && <IconCheck size={16} />}
    </button>
  );
}

function RowButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-semibold text-[var(--text)]"
    >
      <span className="text-violet-400">{icon}</span>
      <span className="flex-1">{label}</span>
      <span className="text-[var(--faint)]">›</span>
    </button>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
