// Cinematic Mission Outcome Evaluation Sequence (Project Orbital)
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEngine';
import { Award, CheckCircle2, AlertTriangle, RotateCcw, Home, Sparkles, DollarSign, Gauge, ShieldCheck } from 'lucide-react';

export default function MissionOutcomeCinematic({
  activePlanet,
  stats,
  missionOutcome, // { success: boolean, reason: string, score: number, discoveries: string[] }
  onRetry,
  onReturnToMenu
}) {
  const isSuccess = missionOutcome?.success !== false;

  useEffect(() => {
    if (isSuccess) {
      sound.playFanfare();
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#10b981', '#fbbf24', '#f8fafc']
        });
      } catch (e) {}
    } else {
      sound.playWarning();
    }
  }, [isSuccess]);

  // Performance letter grade
  let grade = 'A+';
  let gradeColor = 'text-emerald-400';
  const score = missionOutcome?.score || 1200;

  if (!isSuccess) {
    grade = 'F';
    gradeColor = 'text-rose-500';
  } else if (score >= 1400) {
    grade = 'A+';
    gradeColor = 'text-emerald-400';
  } else if (score >= 1000) {
    grade = 'A';
    gradeColor = 'text-emerald-300';
  } else if (score >= 700) {
    grade = 'B';
    gradeColor = 'text-sky-300';
  } else {
    grade = 'C';
    gradeColor = 'text-amber-400';
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-space-950 font-sans select-none flex items-center justify-center p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-slate-900/60 to-black pointer-events-none" />

      {/* Outcome Debrief Card */}
      <div className={`hud-panel p-6 sm:p-8 rounded-3xl max-w-xl w-full border text-center space-y-5 relative hud-bracket z-20 shadow-[0_0_60px_rgba(0,0,0,0.8)] ${
        isSuccess ? 'border-emerald-500/50' : 'border-rose-500/60'
      }`}>
        {/* Top Outcome Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border font-mono text-xs font-bold uppercase tracking-wider mx-auto">
          {isSuccess ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">MISSION SUCCESS // NASA VERIFIED</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400">MISSION ABORTED // CRITICAL FAILURE</span>
            </>
          )}
        </div>

        {/* Hero Grade */}
        <div>
          <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
            AEROSPACE PERFORMANCE GRADE
          </div>
          <div className={`font-orbitron font-black text-8xl md:text-9xl ${gradeColor} my-1 drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]`}>
            {grade}
          </div>
          <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-white">
            {isSuccess ? `${activePlanet?.name || 'DESTINATION'} CAMPAIGN ACCOMPLISHED` : 'MISSION TRAJECTORY LOST'}
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
            {missionOutcome?.reason || (isSuccess
              ? 'All primary scientific objectives fulfilled. Telemetry downlink stream confirmed.'
              : 'Spacecraft was unable to sustain orbit or power requirements at destination.')}
          </p>
        </div>

        {/* Visual Metric Gauges */}
        <div className="grid grid-cols-3 gap-2.5 bg-slate-950/70 p-3.5 rounded-xl border border-sky-500/20 font-mono text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">TOTAL SCORE</span>
            <span className="font-orbitron font-bold text-amber-400 text-sm">{score} PTS</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">REMAINING FUNDS</span>
            <span className="font-orbitron font-bold text-emerald-400 text-sm">${stats?.remainingBudget || 120}M</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">RELIABILITY</span>
            <span className="font-orbitron font-bold text-sky-300 text-sm">{stats?.reliabilityScore || 95}%</span>
          </div>
        </div>

        {/* Discovered Samples / Scientific Targets */}
        {missionOutcome?.discoveries && missionOutcome.discoveries.length > 0 && (
          <div className="text-left bg-slate-950/60 p-3 rounded-xl border border-emerald-500/20 space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold block">
              SCIENTIFIC DATASETS ARCHIVED:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missionOutcome.discoveries.map((disc, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{disc}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onReturnToMenu();
            }}
            className="hud-panel flex-1 py-3 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2 border border-sky-500/20"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRetry();
            }}
            className="btn-aerospace flex-1 py-3 rounded-xl text-xs font-orbitron flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.4)]"
          >
            <RotateCcw className="w-4 h-4 text-sky-300" />
            <span>{isSuccess ? 'DESIGN NEW MISSION' : 'RETRY MISSION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

