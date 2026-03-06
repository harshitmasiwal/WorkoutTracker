import { useMemo } from "react";
import { History } from "lucide-react";
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

export function WeekTab({ workoutData, completedExercises }) {
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

  return (
    <section className="space-y-4">
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
