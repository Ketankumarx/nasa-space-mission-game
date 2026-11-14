// Screen K: Mission Results & Performance Debrief (Project Orbital)
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEngine';
import { Award, CheckCircle2, AlertTriangle, Download, RotateCcw, Home, Sparkles, DollarSign, Gauge, ShieldCheck, FileText } from 'lucide-react';

export default function MissionResults({
  activeMission,
  stats,
  launchVehicle,
  travelResults,
  totalScienceEarned,
  missionLog,
  onRestartMission,
  onReturnToMainMenu
}) {
  // 1. Calculate Score & Performance Metrics
  const budgetRatio = Math.max(0, stats.remainingBudget / (activeMission?.budget || 500));
  const budgetEfficiencyScore = Math.min(100, Math.round(50 + budgetRatio * 50));

  const sciencePotential = (activeMission?.rewards?.scientificPoints || 500);
  const scienceScorePct = Math.min(100, Math.round((totalScienceEarned / sciencePotential) * 100));

  const engineeringReliabilityScore = stats.reliabilityScore;

  // Composite Success Percentage
  const successPercentage = Math.min(
    100,
    Math.round(
      scienceScorePct * 0.45 +
      budgetEfficiencyScore * 0.25 +
      engineeringReliabilityScore * 0.30
    )
  );

  // Letter Grade
  let finalGrade = 'F';
  let gradeColor = 'text-rose-500';
  let evaluationTitle = 'MISSION FAILED';

  if (successPercentage >= 92) {
    finalGrade = 'A+';
    gradeColor = 'text-emerald-400';
    evaluationTitle = 'EXEMPLARY NASA MISSION SUCCESS';
  } else if (successPercentage >= 84) {
    finalGrade = 'A';
    gradeColor = 'text-emerald-300';
    evaluationTitle = 'OUTSTANDING AEROSPACE ACCOMPLISHMENT';
  } else if (successPercentage >= 72) {
    finalGrade = 'B';
    gradeColor = 'text-sky-300';
    evaluationTitle = 'SUCCESSFUL SCIENTIFIC CAMPAIGN';
  } else if (successPercentage >= 60) {
    finalGrade = 'C';
    gradeColor = 'text-amber-400';
    evaluationTitle = 'MARGINAL SUCCESSFUL OBJECTIVES MET';
  } else {
    finalGrade = 'D';
    gradeColor = 'text-rose-400';
    evaluationTitle = 'CRITICAL LOSS OF MISSION EFFICIENCY';
  }

  // Trigger celebration confetti if high success
  useEffect(() => {
    if (successPercentage >= 70) {
      sound.playFanfare();
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#10b981', '#fbbf24', '#f8fafc']
        });
      } catch (e) {}
    }
  }, [successPercentage]);

  // Export Mission Report Text File
  const handleDownloadReport = () => {
    sound.playClick();
    const reportText = `
======================================================
PROJECT ORBITAL — OFFICIAL NASA MISSION DEBRIEF REPORT
======================================================
Mission: ${activeMission?.title} (${activeMission?.codename})
Target: ${activeMission?.target}
Date of Completion: ${new Date().toUTCString()}
Flight Controller: Mission Director

FINAL EVALUATION
----------------
Overall Success Rating: ${successPercentage}%
Final NASA Aerospace Grade: ${finalGrade}
Verdict: ${evaluationTitle}
Total Science Yield: ${totalScienceEarned} PTS

SPACECRAFT ARCHITECTURE & RESOURCE AUDIT
----------------------------------------
Spacecraft Wet Mass: ${stats.wetMass} kg (Dry: ${stats.dryMass} kg, Propellant: ${stats.fuelMass} kg)
Launch Vehicle: ${launchVehicle?.name} (${launchVehicle?.realWorldInspiration})
Total Mission Cost: $${stats.spacecraftCost + (launchVehicle?.cost || 0)}M USD
Remaining Budget: $${stats.remainingBudget}M USD (Efficiency: ${budgetEfficiencyScore}%)
Delta-V Capability: ${stats.deltaV} m/s (Requirement: ${stats.requiredDeltaV} m/s)
System Reliability: ${stats.reliabilityScore}%

FLIGHT RECORDER & TELEMETRY LOG
-------------------------------
${missionLog.map((log, idx) => `[00:${idx.toString().padStart(2, '0')}] ${log}`).join('\n')}

======================================================
NASA Space Mission Simulation Kernel — Project Orbital
======================================================
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ORBITAL_MISSION_REPORT_${activeMission?.id?.toUpperCase() || 'LOG'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-space-950 text-white p-4 sm:p-6 md:p-8 flex flex-col justify-between select-none aerospace-grid-bg">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-4 border-b border-sky-500/20 mb-6">
        <div>
          <div className="font-mono text-xs text-sky-400 uppercase tracking-widest flex items-center gap-2">
            <span>NASA FLIGHT PERFORMANCE AUDIT // MISSION COMPLETED</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white">
            MISSION EVALUATION: {activeMission?.title}
          </h1>
        </div>

        <button
          onClick={handleDownloadReport}
          className="hud-panel p-2.5 rounded-lg border border-sky-500/30 text-sky-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">EXPORT MISSION REPORT</span>
        </button>
      </header>

      {/* Main Results Dashboard */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto">
        {/* Left Column: Grade & Key Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hero Grade Card */}
          <div className="hud-panel p-6 rounded-2xl border border-sky-500/40 text-center relative overflow-hidden">
            <div className="font-mono text-xs text-sky-400 tracking-widest uppercase mb-1">
              FINAL AEROSPACE PERFORMANCE GRADE
            </div>

            {/* Letter Grade */}
            <div className={`font-orbitron font-black text-8xl md:text-9xl ${gradeColor} my-2 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]`}>
              {finalGrade}
            </div>

            <div className="font-orbitron text-base md:text-lg font-bold text-white mb-2">
              {evaluationTitle}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-sky-500/30 font-mono text-xs text-sky-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>COMPOSITE SUCCESS RATING: {successPercentage}%</span>
            </div>
          </div>

          {/* Metric Gauges */}
          <div className="hud-panel p-5 rounded-2xl border border-sky-500/30 space-y-3 font-mono text-xs">
            {/* Scientific Yield */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> SCIENTIFIC DISCOVERIES
                </span>
                <span className="text-amber-300 font-bold">{totalScienceEarned} PTS ({scienceScorePct}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${scienceScorePct}%` }} />
              </div>
            </div>

            {/* Budget Efficiency */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> FISCAL & BUDGET EFFICIENCY
                </span>
                <span className="text-emerald-400 font-bold">${stats.remainingBudget}M REMAINING</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${budgetEfficiencyScore}%` }} />
              </div>
            </div>

            {/* Spacecraft Reliability */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> HARDWARE RELIABILITY INDEX
                </span>
                <span className="text-sky-300 font-bold">{stats.reliabilityScore}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full transition-all duration-500" style={{ width: `${stats.reliabilityScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mission Log & Objective Review (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mission Objective Checklist Review */}
          <div className="hud-panel p-6 rounded-2xl border border-sky-500/30">
            <h3 className="font-orbitron font-bold text-base text-sky-300 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PRIMARY & SECONDARY OBJECTIVES AUDIT</span>
            </h3>

            <div className="space-y-2.5">
              {activeMission?.objectives?.primary.map(obj => (
                <div key={obj.id} className="bg-slate-950/70 p-3 rounded-lg border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-100">{obj.text}</span>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-bold whitespace-nowrap ml-2">
                    +{obj.reward} PTS
                  </span>
                </div>
              ))}

              {activeMission?.objectives?.secondary.map(obj => (
                <div key={obj.id} className="bg-slate-950/70 p-3 rounded-lg border border-sky-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-200">{obj.text}</span>
                  </div>
                  <span className="font-mono text-xs text-sky-300 font-bold whitespace-nowrap ml-2">
                    +{obj.reward} PTS
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Flight Log Review */}
          <div className="hud-panel p-6 rounded-2xl border border-sky-500/30">
            <h3 className="font-orbitron font-bold text-base text-amber-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>OFFICIAL FLIGHT RECORDER LOG</span>
            </h3>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 font-mono text-xs text-slate-300">
              {missionLog.map((log, idx) => (
                <div key={idx} className="bg-slate-950/60 p-2 rounded border border-sky-500/10 flex items-start gap-2">
                  <span className="text-sky-400 text-[10px] mt-0.5">[{idx + 1}]</span>
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="mt-8 pt-4 border-t border-sky-500/20 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => {
            sound.playClick();
            onReturnToMainMenu();
          }}
          className="hud-panel py-3 px-6 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>RETURN TO MAIN MENU</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onRestartMission();
          }}
          className="btn-aerospace py-3.5 px-8 rounded-lg text-sm flex items-center gap-3 ml-auto shadow-[0_0_20px_rgba(56,189,248,0.4)]"
        >
          <RotateCcw className="w-4 h-4 text-sky-300" />
          <span>DESIGN NEW SPACECRAFT / RETRY MISSION</span>
        </button>
      </footer>
    </div>
  );
}

