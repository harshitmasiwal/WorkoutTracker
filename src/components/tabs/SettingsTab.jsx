import { useState, useMemo } from "react";
import { Download, Upload, Calculator, User, Heart, Github, Linkedin, Instagram } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export function SettingsTab({
  userName,
  onUserNameChange,
  completedExercises,
  workoutData,
  onImportData,
}) {
  const [bmiWeight, setBmiWeight] = useState("");
  const [bmiHeight, setBmiHeight] = useState("");
  const [bmiResult, setBmiResult] = useState(null);
  const [importError, setImportError] = useState("");

  const calculateBMI = () => {
    const weight = parseFloat(bmiWeight);
    const height = parseFloat(bmiHeight);

    if (weight <= 0 || height <= 0) {
      alert("Please enter valid weight and height");
      return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    setBmiResult({
      value: bmi.toFixed(1),
      category: getBMICategory(bmi),
    });
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const getBMIColor = (category) => {
    switch (category) {
      case "Underweight":
        return "text-blue-600 dark:text-blue-400";
      case "Normal weight":
        return "text-green-600 dark:text-green-400";
      case "Overweight":
        return "text-yellow-600 dark:text-yellow-400";
      case "Obese":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  const exportData = () => {
    const dataToExport = {
      userName,
      exportDate: new Date().toISOString(),
      completedExercises,
      summary: generateSummary(),
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workout-journey-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateSummary = () => {
    let totalExercisesLogged = 0;
    let totalSets = 0;
    let completedDays = 0;

    Object.values(completedExercises).forEach((dayData) => {
      Object.values(dayData).forEach((exerciseLogs) => {
        if (Array.isArray(exerciseLogs)) {
          totalExercisesLogged += exerciseLogs.length;
          totalSets += exerciseLogs.length;
        }
      });
    });

    completedDays = Object.keys(completedExercises).length;

    return {
      totalDaysTracked: completedDays,
      totalSetsCompleted: totalSets,
    };
  };

  const summary = useMemo(() => generateSummary(), [completedExercises]);

  const handleImportData = (event) => {
    setImportError("");
    const file = event.target.files?.[0];
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);
        
        if (!data.completedExercises) {
          setImportError("Invalid file format. Please export from this app.");
          return;
        }

        // Validate structure
        if (typeof data.completedExercises !== "object") {
          setImportError("Invalid data structure in file.");
          return;
        }

        // Call the import callback with the data
        onImportData(data);
        setImportError("");
        alert("Data imported successfully! Your profile has been synced.");
      } catch (error) {
        setImportError("Failed to parse file. Make sure it's a valid JSON file exported from this app.");
        console.error("Import error:", error);
      }
    };

    reader.readAsText(file);
    // Reset input for same file re-import
    event.target.value = "";
  };

  return (
    <section className="space-y-4">
      {/* User Name Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Your Name
            </label>
            <Input
              type="text"
              value={userName}
              onChange={(e) => onUserNameChange(e.target.value)}
              placeholder="Enter your name"
              className="border-slate-300 dark:border-slate-700"
            />
          </div>
          {userName && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Welcome, <span className="font-semibold text-slate-900 dark:text-white">{userName}</span>! 💪
            </p>
          )}
        </CardContent>
      </Card>

      {/* Import/Export Data Section */}
      <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm dark:from-slate-800 dark:to-slate-900">
        <CardHeader>
          <CardTitle>Sync Your Data</CardTitle>
          <CardDescription className="dark:text-slate-300">
            Export or import your workout journey across devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Export Button */}
            <Button
              onClick={exportData}
              className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>

            {/* Import Button */}
            <label className="w-full">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              <div className="cursor-pointer">
                <Button
                  type="button"
                  className="w-full gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                  onClick={(e) => {
                    e.currentTarget.closest("label")?.querySelector("input")?.click();
                  }}
                >
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
              </div>
            </label>
          </div>
          
          {importError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-sm text-red-700 dark:text-red-300">{importError}</p>
            </div>
          )}

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Export your data to backup or sync across devices. Import previously exported JSON files to restore your progress.
          </p>
        </CardContent>
      </Card>

      {/* BMI Calculator Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            BMI Calculator
          </CardTitle>
          <CardDescription className="dark:text-slate-300">
            Calculate your Body Mass Index
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Weight (kg)
              </label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={bmiWeight}
                onChange={(e) => setBmiWeight(e.target.value)}
                placeholder="e.g., 70"
                className="border-slate-300 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Height (cm)
              </label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={bmiHeight}
                onChange={(e) => setBmiHeight(e.target.value)}
                placeholder="e.g., 175"
                className="border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <Button
            onClick={calculateBMI}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
          >
            Calculate BMI
          </Button>

          {bmiResult && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">Your BMI</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {bmiResult.value}
                </p>
                <p className={`text-sm font-semibold ${getBMIColor(bmiResult.category)}`}>
                  {bmiResult.category}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Journey Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Fitness Journey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-cyan-200 bg-cyan-50/70 p-3 dark:border-cyan-800 dark:bg-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400">Days Tracked</p>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {summary.totalDaysTracked}
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-800 dark:bg-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400">Sets Completed</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {summary.totalSetsCompleted}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buy Me A Coffee Section */}
      <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm dark:from-slate-800 dark:to-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Support the Creator
          </CardTitle>
          <CardDescription className="dark:text-slate-300">
            Love this app? Buy me a coffee ☕
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-white p-4 dark:border-amber-900 dark:bg-slate-700">
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">UPI ID</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value="7827902652@upi"
                readOnly
                className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText("7827902652@upi");
                  alert("UPI copied to clipboard!");
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              >
                Copy
              </Button>
            </div>
          </div>

          <Button
            onClick={() => window.open("upi://pay?pa=7827902652@upi&pn=Harshit%20Masiwal")}
            className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500 py-6 text-white hover:from-orange-600 hover:to-red-600"
          >
            <Heart className="h-4 w-4" />
            Send via UPI
          </Button>
        </CardContent>
      </Card>

      {/* Creator & Social Links Section */}
      <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm dark:from-slate-800 dark:to-slate-900">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Created by</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900 dark:text-white">Harshit Masiwal</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Full-Stack Developer</p>
          </div>

          <div className="flex gap-3 justify-center">
            <a
              href="https://github.com/harshitmasiwal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/harshit-masiwal/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/harshit.masiwal/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-colors"
              title="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <p className="text-center text-xs text-slate-600 dark:text-slate-400">
            Made with 💪 for fitness enthusiasts
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
