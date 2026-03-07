import React, { useState } from "react";
import { Trophy, Check, Calendar, Share2, X, Copy, Download, Twitter, Facebook } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Custom Barbell Logo Component for the Share Modal
import WorkoutLogo from "../../public/icon-dark.svg"

export function WorkoutSuccessPage({ userName, dayOfWeek, focus, totalSets, exercises = [], completedForDate = {} }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const modalDateStr = today.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();

  // Reverted to original working reps calculation
  let totalReps = 0;
  exercises.forEach((exercise) => {
    const logs = completedForDate[exercise.id] || [];
    logs.forEach((log) => {
      totalReps += typeof log === 'number' ? log : log.reps;
    });
  });

  const shareText = `I just tracked my ${focus} workout on Track Better. I did ${totalSets} sets ! 
  Click on the Link and track your own goals :\n\nhttps://track-better.vercel.app/`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://track-better.vercel.app/");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      
      const isDark = document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const bgColor = isDark ? '#0a0a0a' : '#ffffff';
      const textColor = isDark ? '#ffffff' : '#000000';
      const cardBg = isDark ? '#18181b' : '#f4f4f5';
      const cardBorder = isDark ? '#27272a' : '#e4e4e7';
      const mutedText = isDark ? '#a1a1aa' : '#52525b';
      const dividerBg = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

      let exercisesHTML = '';
      exercises.forEach((exercise) => {
        const logs = completedForDate[exercise.id] || [];
        let exerciseReps = 0;
        logs.forEach((log) => { 
          exerciseReps += typeof log === 'number' ? log : log.reps; 
        });
        
        exercisesHTML += `
          <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid ${dividerBg};">
            <p style="font-size: 16px; margin: 0 0 4px 0; font-weight: 600; color: ${textColor};">
              ${exercise.name}
            </p>
            <p style="font-size: 14px; margin: 0; color: ${mutedText};">
              ${logs.length} Sets | ${exerciseReps} Total Reps
            </p>
          </div>
        `;
      });
      
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.width = '800px';
      container.style.background = bgColor;
      container.style.padding = '60px';
      container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      container.style.color = textColor;
      
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 20px; margin-bottom: 20px;">
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="8" x2="3" y2="16"></line><line x1="7" y1="4" x2="7" y2="20"></line><path d="M7 12h3l2-4 2 8 2-4h3"></path><line x1="17" y1="4" x2="17" y2="20"></line><line x1="21" y1="8" x2="21" y2="16"></line>
             </svg>
          </div>
          <h1 style="font-size: 48px; font-weight: 700; margin: 0; letter-spacing: 1px; color: ${textColor};">AWESOME WORK!</h1>
          <p style="font-size: 24px; color: ${mutedText}; margin-top: 10px;">${userName}</p>
        </div>

        <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; padding: 40px; border-radius: 16px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px; color: ${mutedText}; font-size: 16px;">
            <div>📅 ${dateStr}</div>
            <div>☀️ ${dayOfWeek}</div>
          </div>
          <p style="font-size: 22px; font-weight: 600; text-align: center; margin: 0 0 40px 0;">${focus}</p>
          <div style="display: flex; justify-content: space-around; text-align: center;">
            <div>
              <p style="font-size: 14px; color: ${mutedText}; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Sets</p>
              <p style="font-size: 56px; font-weight: 800; margin: 0;">${totalSets}</p>
            </div>
            <div style="width: 1px; background: ${cardBorder};"></div>
            <div>
              <p style="font-size: 14px; color: ${mutedText}; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Total Reps</p>
              <p style="font-size: 56px; font-weight: 800; margin: 0;">${totalReps}</p>
            </div>
          </div>
        </div>

        <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; padding: 30px; border-radius: 16px;">
          <p style="text-align: center; margin: 0 0 20px 0; color: ${mutedText}; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Exercise Breakdown</p>
          ${exercisesHTML}
        </div>
        
        <div style="text-align: center; margin-top: 40px; color: ${mutedText}; font-size: 18px; font-family: monospace;">
          track-better.vercel.app
        </div>
      `;
      
      document.body.appendChild(container);
      
      const canvas = await html2canvas(container, {
        backgroundColor: bgColor,
        scale: 2,
        logging: false
      });
      
      document.body.removeChild(container);
      
      // Download logic
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `workout-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error generating image:', error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8 px-4 dark:bg-[#0a0a0a]">
      
      {/* Trophy Icon Animation (Restored) */}
      <div className="relative mb-2">
        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 blur-2xl opacity-50"></div>
        <div className="relative rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-6 shadow-xl">
          <Trophy className="h-16 w-16 text-white" />
        </div>
      </div>

      {/* Main Success Title */}
      <Card className="w-full max-w-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md dark:from-zinc-800 dark:to-zinc-900">
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
        <Card className="w-full max-w-2xl border-0 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-sm dark:from-zinc-800 dark:to-zinc-900">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-slate-700 dark:text-zinc-300">
              Great job, <span className="font-bold text-slate-900 dark:text-white">{userName}</span>! 💪
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="w-full max-w-2xl space-y-2">
        <Button
          onClick={() => setShowShareModal(true)}
          className="w-full gap-2 border-amber-200 bg-white text-slate-900 hover:bg-amber-50 dark:border-amber-900 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          variant="outline"
        >
          <Share2 className="h-4 w-4" />
          Share Achievement
        </Button>
      </div>

      {/* Share Modal Overlay */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">SHARE ACHIEVEMENT</h3>
              <button onClick={() => setShowShareModal(false)} className="text-zinc-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col items-center">
              
              {/* Preview Mini Card */}
              <div className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center mb-6">
                 {/* USING SVG IMPORT */}
                 <img src={WorkoutLogo} alt="Workout Logo" className="h-8 w-8 mb-4" />
                 <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{modalDateStr}</p>
                 <p className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">{userName}</p>
                 <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center mb-4">{focus}</p>
                 
                 <div className="flex gap-6 items-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSets}</p>
                      <p className="text-[10px] text-zinc-500 uppercase">Sets</p>
                    </div>
                    <div className="w-px h-8 bg-zinc-300 dark:bg-zinc-800"></div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalReps}</p>
                      <p className="text-[10px] text-zinc-500 uppercase">Reps</p>
                    </div>
                 </div>
              </div>

              {/* Link Copy Box */}
              <div className="w-full flex items-center gap-2 bg-slate-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 mb-6">
                <div className="px-3 text-sm text-zinc-600 dark:text-zinc-300 truncate flex-1 font-mono">
                  https://track-better.vercel.app/
                </div>
                <Button 
                  onClick={handleCopyLink}
                  className="bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-900 dark:text-white border border-zinc-200 dark:border-zinc-700 whitespace-nowrap shadow-sm"
                  size="sm"
                >
                  {isCopied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                  {isCopied ? "Copied!" : "Copy Link"}
                </Button>
              </div>

              {/* Action Bar (Social Buttons Centered) */}
              <div className="flex justify-center items-center gap-4 w-full pt-2">
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-12 w-12 bg-[#1a1a1a] hover:bg-[#25D366] rounded-full text-white transition-colors flex items-center justify-center"
                  title="Share to WhatsApp"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-12 w-12 bg-[#1a1a1a] hover:bg-[#1DA1F2] rounded-full text-white transition-colors flex items-center justify-center"
                  title="Share text to Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://track-better.vercel.app/`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-12 w-12 bg-[#1a1a1a] hover:bg-[#4267B2] rounded-full text-white transition-colors flex items-center justify-center"
                  title="Share link to Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
