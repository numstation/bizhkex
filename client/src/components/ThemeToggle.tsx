import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, type ThemePreference } from "@/contexts/ThemeContext";

export default function ThemeToggle({ theme: _surface = "dark" }: { theme?: "light" | "dark" }) {
  const { preference, setPreference } = useTheme();

  const options: { value: ThemePreference; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "auto", icon: Monitor, label: "Auto" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <div className="flex items-center gap-0.5" title="Theme">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          onClick={() => setPreference(value)}
          className={`p-1.5 transition-colors ${
            preference === value ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
