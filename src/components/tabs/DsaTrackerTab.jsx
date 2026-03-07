import { useState } from "react";
import { Code2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export function DsaTrackerTab({ solvedProblems, onAddProblem, onRemoveProblem, onClearToday }) {
  const [problemName, setProblemName] = useState("");

  return (
    <section className="space-y-4">
      <Card className="border-0 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 text-white shadow-[0_20px_42px_-22px_rgba(6,182,212,0.85)] dark:from-emerald-600 dark:via-cyan-700 dark:to-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Code2 className="h-5 w-5" />
            DSA Tracker
          </CardTitle>
          <CardDescription className="text-cyan-50/90">
            Solved today: {solvedProblems.length}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log a Problem</CardTitle>
          <CardDescription className="dark:text-zinc-300">Add each LeetCode/DSA problem you solve today.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={problemName}
              onChange={(event) => setProblemName(event.target.value)}
              placeholder="e.g. 347. Top K Frequent Elements"
            />
            <Button
              type="button"
              onClick={() => {
                const trimmed = problemName.trim();
                if (!trimmed) {
                  return;
                }
                onAddProblem(trimmed);
                setProblemName("");
              }}
            >
              Add
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={solvedProblems.length === 0}
            onClick={onClearToday}
            className="w-full"
          >
            Clear Today
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Solved List</CardTitle>
        </CardHeader>
        <CardContent>
          {solvedProblems.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-zinc-300">No problems logged yet.</p>
          ) : (
            <ul className="space-y-2">
              {solvedProblems.map((problem, index) => (
                <li
                  key={`${problem}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-gradient-to-r from-white to-emerald-50/60 p-3 text-sm dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800/70"
                >
                  <span className="text-slate-800 dark:text-zinc-100">{problem}</span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveProblem(index)}
                    aria-label={`Remove ${problem}`}
                  >
                    <Trash2 className="h-4 w-4 text-slate-500 dark:text-zinc-300" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
