import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function FirstTimeGreetingModal({ onComplete }) {
  const [name, setName] = useState("");
  const [step, setStep] = useState("greeting"); // 'greeting' or 'input'

  const handleStartClick = () => {
    setStep("input");
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && name.trim()) {
      handleNameSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        {step === "greeting" ? (
          <div className="space-y-6 p-8 text-center">
            <div className="inline-block rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome! 🎉
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Let's get you started with your fitness journey. First things first - what's your name?
              </p>
            </div>

            <Button
              onClick={handleStartClick}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-6 text-lg text-white hover:from-cyan-600 hover:to-blue-700"
            >
              Let's Begin
            </Button>
          </div>
        ) : (
          <div className="space-y-6 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                What's your name?
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                We'll remember it and greet you next time!
              </p>
            </div>

            <div className="space-y-3">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name"
                autoFocus
                className="border-slate-300 py-6 text-lg dark:border-slate-700"
              />

              <Button
                onClick={handleNameSubmit}
                disabled={!name.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-6 text-lg text-white hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50"
              >
                Continue
              </Button>
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              You can change this anytime in Settings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
