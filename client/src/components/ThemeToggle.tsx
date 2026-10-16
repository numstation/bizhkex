import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, type ThemePreference } from "@/contexts/ThemeContext";

export default function ThemeToggle({ theme: surface = "dark" }: { theme?: "light" | "dark" }) {
  const { preference, setPreference } = useTheme();
  const isDarkSurface = surface === "dark";

  const options: { value: ThemePreference; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "auto", icon: Monitor, label: "Auto" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <div
      className={`flex items-center gap-0.5 rounded-lg p-0.5 ${
        isDarkSurface
          ? "bg-white/[0.04] border border-white/[0.08]"
          : "bg-gray-100 border border-gray-200"
      }`}
      title="Theme"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          onClick={() => setPreference(value)}
          className={`p-1.5 rounded-md transition-colors ${
            preference === value
              ? "bg-emerald-600 text-white"
              : isDarkSurface
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
