import { CalendarDays, SunMedium, Settings } from "lucide-react";
import { cn } from "../lib/utils";

const tabs = [
  { id: "today", label: "Today", icon: SunMedium },
  { id: "week", label: "Week", icon: CalendarDays },
  { id: "settings", label: "Settings", icon: Settings },
];

export function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md border-x border-t border-slate-200/80 bg-white px-2 pt-2 dark:border-zinc-800 dark:bg-zinc-950">
      <ul className="grid grid-cols-3 gap-1 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        {tabs.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onTabChange(id)}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition-colors",
                activeTab === id
                  ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_10px_25px_-12px_rgba(14,165,233,0.9)]"
                  : "text-slate-600 hover:bg-slate-100/95 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
