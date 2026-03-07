import { useMemo, useState } from "react";
import { History, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

function getDateObject(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

function getDisplayDate(dateKey) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(getDateObject(dateKey));
}

function getWeekdayName(dateKey) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(getDateObject(dateKey));
}

function getNormalizedReps(logEntry) {
  if (typeof logEntry === "number") {
    return logEntry;
  }
  return Number(logEntry?.reps || 0);
}

function getDayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isWorkoutComplete(dayLog, workoutData, weekdayName) {
  if (!dayLog || Object.keys(dayLog).length === 0) return false;
  
  const dayConfig = workoutData.find((day) => day.dayOfWeek === weekdayName);
  if (!dayConfig) return false;

  const loggedExercises = Object.values(dayLog || {}).filter(
    (logs) => Array.isArray(logs) && logs.length > 0
  );

  if (loggedExercises.length === 0) return false;

  return loggedExercises.length === dayConfig.exercises.length;
}

export function WeekTab({ workoutData, completedExercises }) {
  const today = new Date();
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [displayYear, setDisplayYear] = useState(today.getFullYear());

  const exerciseLookup = useMemo(() => {
    const lookup = {};
    workoutData.forEach((day) => {
      day.exercises.forEach((exercise) => {
        lookup[exercise.id] = exercise;
      });
    });
    return lookup;
  }, [workoutData]);

  const historyEntries = useMemo(() => {
    return Object.entries(completedExercises || {})
      .filter(([, dayLog]) => dayLog && Object.keys(dayLog).length > 0)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
  }, [completedExercises]);

  const previousMonth = () => {
    setDisplayMonth((prev) => {
      if (prev === 0) {
        setDisplayYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const nextMonth = () => {
    setDisplayMonth((prev) => {
      if (prev === 11) {
        setDisplayYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(displayYear, displayMonth, 1);
    const lastDay = new Date(displayYear, displayMonth + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(displayYear, displayMonth, i));
    }

    return { 
      days, 
      monthYear: firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" }) 
    };
  }, [displayMonth, displayYear]);

  return (
    <section className="space-y-4">
      {/* Calendar Widget */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm dark:from-slate-800 dark:to-slate-900">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <Button
              onClick={previousMonth}
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-lg border-slate-300 dark:border-slate-700"
            >
              <ChevronLeft className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </Button>
            <CardTitle className="text-slate-900 dark:text-white flex-1 text-center">
              {calendarDays.monthYear}
            </CardTitle>
            <Button
              onClick={nextMonth}
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-lg border-slate-300 dark:border-slate-700"
            >
              <ChevronRight className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </Button>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Workout completion tracker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dateKey = getDayKey(date);
                const dayLog = completedExercises[dateKey];
                const weekdayName = getWeekdayName(dateKey);
                const isCompleted = isWorkoutComplete(dayLog, workoutData, weekdayName);

                return (
                  <div
                    key={dateKey}
                    className={`aspect-square rounded-lg p-1 ${
                      isCompleted
                        ? "bg-gradient-to-br from-emerald-400 to-green-500 shadow-md"
                        : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
                    } flex items-center justify-center`}
                  >
                    <div className="text-center w-full">
                      <p className={`text-xs font-semibold ${isCompleted ? "text-white" : "text-slate-900 dark:text-white"}`}>
                        {date.getDate()}
                      </p>
                      {isCompleted && <CheckCircle2 className="h-3 w-3 text-white mx-auto mt-0.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-gradient-to-br from-emerald-400 to-green-500"></div>
                <span className="text-slate-700 dark:text-slate-300">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-slate-300 bg-white dark:bg-slate-700 dark:border-slate-600"></div>
                <span className="text-slate-700 dark:text-slate-300">Incomplete</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm dark:from-slate-800 dark:to-slate-900">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">This Week's Schedule</CardTitle>
        </CardHeader>
      </Card>

      {workoutData.map((day) => (
        <Card key={day.id}>
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">{day.dayOfWeek}</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">{day.focus}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {day.exercises.map((exercise) => (
                <li
                  key={exercise.id}
                  className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-cyan-50/50 p-3 text-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800/60"
                >
                  <p className="font-medium text-slate-900 dark:text-slate-100">{exercise.name}</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {exercise.sets} sets - {exercise.targetReps}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      <Card className="border-0 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white shadow-[0_18px_40px_-20px_rgba(251,146,60,0.85)] dark:from-amber-500 dark:via-orange-600 dark:to-rose-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4 text-orange-50" />
            Workout History
          </CardTitle>
          <CardDescription className="text-orange-50/95">
            Past logs saved in localStorage. Most recent dates are shown first.
          </CardDescription>
        </CardHeader>
      </Card>

      {historyEntries.length === 0 ? (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">No past workout logs yet. Start logging sets in Today.</p>
          </CardContent>
        </Card>
      ) : (
        historyEntries.map(([dateKey, dayLog]) => {
          const weekdayName = getWeekdayName(dateKey);
          const dayConfig = workoutData.find((day) => day.dayOfWeek === weekdayName);
          const loggedExercises = Object.entries(dayLog || {}).filter(([, logs]) => Array.isArray(logs) && logs.length > 0);
          const totalSets = loggedExercises.reduce((sum, [, logs]) => sum + logs.length, 0);
          const totalReps = loggedExercises.reduce((sum, [, logs]) => {
            return (
              sum +
              logs.reduce((repSum, logEntry) => {
                return repSum + getNormalizedReps(logEntry);
              }, 0)
            );
          }, 0);

          return (
            <Card key={dateKey}>
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">{getDisplayDate(dateKey)}</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  {weekdayName}
                  {dayConfig ? ` - ${dayConfig.focus}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                  Logged sets: {totalSets} | Total reps: {totalReps}
                </p>

                <ul className="space-y-2">
                  {loggedExercises.map(([exerciseId, logs]) => {
                    const exerciseName = exerciseLookup[exerciseId]?.name || exerciseId;
                    const repsList = logs.map((logEntry) => getNormalizedReps(logEntry)).join(", ");

                    return (
                      <li
                        key={`${dateKey}-${exerciseId}`}
                        className="rounded-xl border border-slate-200 bg-slate-50/85 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/70"
                      >
                        <p className="font-medium text-slate-900 dark:text-slate-100">{exerciseName}</p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {logs.length} set(s) - Reps: {repsList}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          );
        })
      )}
    </section>
  );
}
