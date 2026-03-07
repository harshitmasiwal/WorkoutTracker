import { useEffect } from "react";
import { Moon, RotateCcw, Sparkles, Sun } from "lucide-react";
import workoutData from "../data.json";
import { BottomNav } from "./components/BottomNav";
import { DsaTrackerTab } from "./components/tabs/DsaTrackerTab";
import { TodayTab } from "./components/tabs/TodayTab";
import { WeekTab } from "./components/tabs/WeekTab";
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
  const [dsaProgress, setDsaProgress] = useLocalStorage("dsaProgress", {});
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const dateKey = getLocalDateKey();
  const weekday = getCurrentWeekday();
  const todayWorkout = workoutData.find((day) => day.dayOfWeek === weekday) ?? null;
  const completedForDate = completedExercises[dateKey] || {};
  const solvedProblems = dsaProgress[dateKey] || [];
  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", isDark ? "#020617" : "#0f172a");
    }
  }, [isDark]);

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

  const addSolvedProblem = (problemName) => {
    setDsaProgress((previous) => {
      const currentList = previous[dateKey] || [];
      return {
        ...previous,
        [dateKey]: [...currentList, problemName],
      };
    });
  };

  const removeSolvedProblem = (problemIndex) => {
    setDsaProgress((previous) => {
      const currentList = previous[dateKey] || [];
      return {
        ...previous,
        [dateKey]: currentList.filter((_, index) => index !== problemIndex),
      };
    });
  };

  const clearTodayProblems = () => {
    setDsaProgress((previous) => {
      return {
        ...previous,
        [dateKey]: [],
      };
    });
  };

  const resetAppData = () => {
    const shouldReset = window.confirm(
      "Reset all saved workout and DSA progress? This action cannot be undone."
    );
    if (!shouldReset) {
      return;
    }

    setCompletedExercises({});
    setDsaProgress({});
    setActiveTab("today");

    try {
      window.localStorage.removeItem("completedExercises");
      window.localStorage.removeItem("dsaProgress");
      window.localStorage.removeItem("activeTab");
    } catch (error) {
      console.error("Failed to reset app data:", error);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <div className="relative mx-auto min-h-screen max-w-md border-x border-slate-300/80 bg-white pb-24 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/95 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/95">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Track Better
              </p>
              <h1 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Workout + DSA Tracker</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">{getReadableDate()}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full border-red-200 bg-white/90 text-red-600 hover:bg-red-50 dark:border-red-900/70 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/40"
                onClick={resetAppData}
                aria-label="Reset app data"
                title="Reset saved progress"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full border-slate-300/80 bg-white/90 dark:border-slate-700 dark:bg-slate-900"
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
            />
          )}

          {activeTab === "week" && (
            <WeekTab workoutData={workoutData} completedExercises={completedExercises} />
          )}

          {activeTab === "dsa" && (
            <DsaTrackerTab
              solvedProblems={solvedProblems}
              onAddProblem={addSolvedProblem}
              onRemoveProblem={removeSolvedProblem}
              onClearToday={clearTodayProblems}
            />
          )}
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
