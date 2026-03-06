import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Dumbbell } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export function TodayTab({ workout, completedForDate, onCompleteSet }) {
  const [repInputs, setRepInputs] = useState({});

  const totalSets = useMemo(
    () => (workout ? workout.exercises.reduce((sum, exercise) => sum + exercise.sets, 0) : 0),
    [workout]
  );

  const completedSets = useMemo(() => {
    if (!workout) {
      return 0;
    }

    return workout.exercises.reduce((sum, exercise) => {
      const logs = completedForDate[exercise.id] || [];
      return sum + logs.length;
    }, 0);
  }, [completedForDate, workout]);

  if (!workout) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Workout Scheduled</CardTitle>
          <CardDescription className="dark:text-slate-300">There is no routine configured for today.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <Card className="border-0 bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-700 text-white shadow-[0_20px_40px_-20px_rgba(2,132,199,0.85)] dark:from-cyan-600 dark:via-sky-700 dark:to-indigo-800">
        <CardHeader>
          <CardDescription className="text-cyan-50/90">{workout.dayOfWeek}</CardDescription>
          <CardTitle className="text-xl">{workout.focus}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-cyan-50/90">
          Progress: {completedSets}/{totalSets} sets logged
        </CardContent>
      </Card>

      {workout.exercises.map((exercise) => {
        const logs = completedForDate[exercise.id] || [];
        const isFullyCompleted = logs.length >= exercise.sets;
        const inputValue = repInputs[exercise.id] || "";

        return (
          <Card key={exercise.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <span>{exercise.name}</span>
              </CardTitle>
              <CardDescription className="dark:text-slate-300">
                Target: {exercise.sets} sets - {exercise.targetReps}
              </CardDescription>
              <p className="text-sm text-slate-600 dark:text-slate-300">{exercise.notes}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={inputValue}
                  onChange={(event) =>
                    setRepInputs((prev) => ({
                      ...prev,
                      [exercise.id]: event.target.value,
                    }))
                  }
                  placeholder="Reps completed"
                />
                <Button
                  type="button"
                  disabled={isFullyCompleted || Number(inputValue) <= 0}
                  onClick={() => {
                    const reps = Number(inputValue);
                    if (reps > 0) {
                      onCompleteSet(exercise.id, reps);
                      setRepInputs((prev) => ({ ...prev, [exercise.id]: "" }));
                    }
                  }}
                >
                  Log Set
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm">
                {isFullyCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                )}
                <span className="text-slate-700 dark:text-slate-200">
                  Completed {logs.length} / {exercise.sets} sets
                </span>
              </div>

              {logs.length > 0 && (
                <ul className="space-y-1 rounded-xl border border-dashed border-cyan-200 bg-cyan-50/70 p-2 text-sm text-slate-700 dark:border-cyan-800 dark:bg-slate-800/60 dark:text-slate-200">
                  {logs.map((log, index) => (
                    <li key={`${exercise.id}-${index}`}>Set {index + 1}: {log.reps} reps</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
