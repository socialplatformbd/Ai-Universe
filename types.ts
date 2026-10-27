export type Language = "en" | "bn";
export type Theme = "dark" | "light";
export type Screen = "home" | "favorites" | "settings" | "about" | "privacy";

export type CategoryId =
  | "all"
  | "chat"
  | "research"
  | "image"
  | "design"
  | "video"
  | "writing"
  | "translation"
  | "coding"
  | "audio";

export interface AITool {
  id: string;
  name: string;
  url: string;
  category: Exclude<CategoryId, "all">;
  description: string;
  descriptionBn: string;
  featured: boolean;
  color: string;
  color2: string;
  initials: string;
  symbol: string;
}
