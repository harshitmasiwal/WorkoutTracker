import { Trophy, Check, Calendar, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function WorkoutSuccessPage({ userName, dayOfWeek, focus, totalSets }) {
  const shareAchievement = () => {
    const text = `🎉 I just completed my ${dayOfWeek} workout (${focus})! ${totalSets} sets done! #FitnessJourney #WorkoutTracker`;
    if (navigator.share) {
      navigator.share({
        title: "Workout Completed!",
        text: text,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert("Achievement copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      {/* Trophy Icon Animation */}
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 blur-2xl opacity-50"></div>
        <div className="relative rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-6 shadow-xl">
          <Trophy className="h-16 w-16 text-white" />
        </div>
      </div>

      {/* Success Message */}
      <Card className="w-full border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md dark:from-zinc-800 dark:to-zinc-900">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
            Awesome Work!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg font-semibold text-slate-700 dark:text-zinc-200">
            You completed all workouts for
          </p>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{dayOfWeek}</p>
            <p className="text-sm text-slate-600 dark:text-zinc-400">{focus}</p>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 dark:bg-zinc-800">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {totalSets} Sets Crushed
            </span>
          </div>
        </CardContent>
      </Card>

      {/* User Greeting */}
      {userName && (
        <Card className="w-full border-0 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-sm dark:from-zinc-800 dark:to-zinc-900">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-slate-700 dark:text-zinc-300">
              Great job, <span className="font-bold text-slate-900 dark:text-white">{userName}</span>! 💪
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Card */}
      <Card className="w-full border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-around text-center">
            <div className="space-y-1">
              <div className="flex justify-center text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                100%
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">Complete</p>
            </div>
            <div className="h-8 w-px bg-slate-300 dark:bg-zinc-700"></div>
            <div className="space-y-1">
              <Calendar className="mx-auto h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs text-slate-600 dark:text-zinc-400">Rest Day</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="w-full space-y-2">
        <Button
          onClick={shareAchievement}
          className="w-full gap-2 border-amber-200 bg-white text-slate-900 hover:bg-amber-50 dark:border-amber-900 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          variant="outline"
        >
          <Share2 className="h-4 w-4" />
          Share Achievement
        </Button>
      </div>

      {/* Motivational Quote */}
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
        <p className="text-sm italic text-slate-600 dark:text-zinc-400">
          "The only way to do great work is to love what you do."
        </p>
        <p className="mt-2 text-xs text-slate-500 dark:text-zinc-500">— Steve Jobs</p>
      </div>
    </div>
  );
}
