export type ThemeMode = "light" | "dark";

export interface UIContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchCategory: string;
  openSearch: (category?: string) => void;
  closeSearch: () => void;
  signInOpen: boolean;
  setSignInOpen: (open: boolean) => void;
  openSignIn: () => void;
  closeSignIn: () => void;
}

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}
