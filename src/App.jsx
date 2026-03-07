import { useEffect, useState } from "react";
import { Moon, RotateCcw, Download, Sun } from "lucide-react";
import workoutData from "../data.json";
import { BottomNav } from "./components/BottomNav";
import { TodayTab } from "./components/tabs/TodayTab";
import { WeekTab } from "./components/tabs/WeekTab";
import { SettingsTab } from "./components/tabs/SettingsTab";
import { FirstTimeGreetingModal } from "./components/FirstTimeGreetingModal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Button } from "./components/ui/button";

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentWeekday(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}

function getReadableDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage("activeTab", "today");
  const [completedExercises, setCompletedExercises] = useLocalStorage("completedExercises", {});
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [userName, setUserName] = useLocalStorage("userName", "");
  const [showGreetingModal, setShowGreetingModal] = useState(!userName);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  const dateKey = getLocalDateKey();
  const weekday = getCurrentWeekday();
  const todayWorkout = workoutData.find((day) => day.dayOfWeek === weekday) ?? null;
  const completedForDate = completedExercises[dateKey] || {};
  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", isDark ? "#020617" : "#0f172a");
    }

    // Update favicon based on theme
    const faviconLink = document.getElementById("favicon");
    if (faviconLink) {
      faviconLink.href = isDark ? "/icon-dark.svg" : "/icon-light.svg";
    }
  }, [isDark]);

  // PWA Install Prompt
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => console.error("SW registration failed:", err));
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const addCompletedSet = (exerciseId, reps) => {
    setCompletedExercises((previous) => {
      const dayLog = previous[dateKey] || {};
      const exerciseLog = dayLog[exerciseId] || [];

      return {
        ...previous,
        [dateKey]: {
          ...dayLog,
          [exerciseId]: [...exerciseLog, { reps, loggedAt: new Date().toISOString() }],
        },
      };
    });
  };

  
  const resetTodayData = () => {
    const shouldReset = window.confirm(
      "Reset today's workout progress? This action cannot be undone."
    );
    if (!shouldReset) {
      return;
    }

    setCompletedExercises((previous) => {
      const updated = { ...previous };
      delete updated[dateKey];
      return updated;
    });

    try {
      const stored = window.localStorage.getItem("completedExercises");
      if (stored) {
        const data = JSON.parse(stored);
        delete data[dateKey];
        window.localStorage.setItem("completedExercises", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Failed to reset today's data:", error);
    }
  };

  const resetAppData = () => {
    const shouldReset = window.confirm(
      "Hard reset will delete ALL workout progress, logs, and your name. This action cannot be undone. Are you sure?"
    );
    if (!shouldReset) {
      return;
    }

    // Clear all state
    setCompletedExercises({});
    setUserName("");
    setActiveTab("today");
    setShowGreetingModal(true);

    // Clear all localStorage
    try {
      window.localStorage.removeItem("completedExercises");
      window.localStorage.removeItem("activeTab");
      window.localStorage.removeItem("userName");
    } catch (error) {
      console.error("Failed to reset app data:", error);
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  const importData = (importedData) => {
    try {
      // Import completed exercises
      if (importedData.completedExercises && typeof importedData.completedExercises === "object") {
        setCompletedExercises(importedData.completedExercises);
      }

      // Import user name if available
      if (importedData.userName) {
        setUserName(importedData.userName);
      }
    } catch (error) {
      console.error("Error importing data:", error);
      alert("Error importing data. Please check the file and try again.");
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-zinc-100">
      <div className="relative mx-auto min-h-screen max-w-md border-x border-slate-300/80 bg-white pb-24 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/95 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950/95">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">
                <img src={isDark ? "/icon-dark.svg" : "/icon-light.svg"} alt="Track Better" className="h-3.5 w-3.5" />
                Track Better
              </p>
              <h1 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {userName ? `Welcome, ${userName}!` : "Workout + DSA Tracker"}
              </h1>
              <p className="text-sm text-slate-600 dark:text-zinc-300">{getReadableDate()}</p>
            </div>

            <div className="flex items-center gap-2">
              {showInstallButton && (
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="rounded-full border-cyan-200 bg-cyan-50/90 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 dark:hover:bg-cyan-900/50"
                  onClick={handleInstall}
                  aria-label="Install app"
                  title="Install app"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full border-slate-300/80 bg-white/90 dark:border-zinc-700 dark:bg-zinc-900"
                onClick={() => setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-slate-800" />}
              </Button>
            </div>
          </div>
        </header>

        <main className="space-y-4 px-4 py-4">
          {activeTab === "today" && (
            <TodayTab
              workout={todayWorkout}
              completedForDate={completedForDate}
              onCompleteSet={addCompletedSet}
              onResetToday={resetTodayData}
              userName={userName}
            />
          )}

          {activeTab === "week" && (
            <WeekTab workoutData={workoutData} completedExercises={completedExercises} />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              userName={userName}
              onUserNameChange={setUserName}
              completedExercises={completedExercises}
              workoutData={workoutData}
              onImportData={importData}
              onHardReset={resetAppData}
            />
          )}
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {showGreetingModal && (
        <FirstTimeGreetingModal
          onComplete={(name) => {
            setUserName(name);
            setShowGreetingModal(false);
          }}
        />
      )}
    </div>
  );
}
