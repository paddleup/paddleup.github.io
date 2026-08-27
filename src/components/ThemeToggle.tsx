import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const label =
    theme === "light"
      ? "Light mode"
      : theme === "dark"
      ? "Dark mode"
      : "System theme";

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="cursor-pointer rounded-lg p-2 text-white/70 transition-colors
                 hover:bg-white/10 hover:text-white"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
