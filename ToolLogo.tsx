import type { AITool } from "./types";
import { SymbolMark } from "./Icons";
import { cn } from "./cn";

export function ToolLogo({
  tool,
  size = 48,
  className,
}: {
  tool: AITool;
  size?: number;
  className?: string;
}) {
  const radius = size >= 64 ? 20 : size >= 48 ? 14 : 10;
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden shadow-lg",
        className
      )}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(145deg, ${tool.color} 0%, ${tool.color2} 100%)`,
        boxShadow: `0 8px 20px -8px ${tool.color}aa`,
      }}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute -right-3 -top-4 h-12 w-12 rounded-full opacity-40"
        style={{ background: "white" }}
      />
      <div
        className="pointer-events-none absolute -bottom-4 -left-3 h-10 w-10 rounded-full opacity-20"
        style={{ background: "black" }}
      />
      <span
        className="relative z-10 font-extrabold tracking-tight text-white"
        style={{ fontSize: size * 0.32, textShadow: "0 1px 2px rgba(0,0,0,.35)" }}
      >
        {tool.initials}
      </span>
      <span className="absolute bottom-1 right-1 opacity-70">
        <SymbolMark type={tool.symbol} size={Math.max(10, size * 0.22)} />
      </span>
    </div>
  );
}
