// Screen B: Mission Selection for Project Orbital
import React from 'react';
import { MISSIONS } from '../../data/missions';
import { sound } from '../../utils/soundEngine';
import { ArrowLeft, ArrowRight, DollarSign, Clock, ShieldAlert, Award, Compass, Sparkles } from 'lucide-react';

export default function MissionSelection({
  selectedMissionId,
  onSelectMission,
  onConfirmSelection,
  onBackToMenu
}) {
  return (
    <div className="relative min-h-screen bg-space-950 text-white p-4 sm:p-6 md:p-8 flex flex-col justify-between select-none aerospace-grid-bg">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 pb-4 border-b border-sky-500/20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onBackToMenu();
            }}
            className="hud-panel p-2.5 rounded-lg border border-sky-500/30 text-slate-300 hover:text-white hover:border-sky-400 transition-colors flex items-center gap-2 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">MAIN MENU</span>
          </button>
          <div>
            <div className="font-mono text-xs text-sky-400 uppercase tracking-widest">
              MISSION DIRECTIVE ARCHIVE // SELECT TARGET OBJECTIVE
            </div>
            <h1 className="font-orbitron font-bold text-2xl sm:text-3xl text-white">
              SELECT EXPLORATION TARGET
            </h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="telemetry-badge text-emerald-400 border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>3 MISSIONS AUTHORIZED</span>
          </div>
        </div>
      </header>

      {/* Mission Cards Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-auto">
        {MISSIONS.map((mission) => {
          const isSelected = selectedMissionId === mission.id;
          return (
            <div
              key={mission.id}
              onClick={() => {
                sound.playToggle(true);
                onSelectMission(mission.id);
              }}
              className={`hud-panel rounded-xl p-5 sm:p-6 cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                isSelected
                  ? 'hud-panel-glow border-sky-400 ring-2 ring-sky-400/50 scale-[1.02] shadow-[0_0_30px_rgba(56,189,248,0.25)]'
                  : 'hover:border-sky-500/50 hover:bg-slate-900/60 opacity-85 hover:opacity-100'
              }`}
            >
              {/* Mission Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300 uppercase tracking-wider font-semibold">
                    {mission.codename}
                  </span>
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                      mission.difficultyRating === 1
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/40'
                        : mission.difficultyRating === 2
                        ? 'text-amber-400 bg-amber-950/40 border border-amber-500/40'
                        : 'text-rose-400 bg-rose-950/40 border border-rose-500/40'
                    }`}
                  >
                    {mission.difficulty}
                  </span>
                </div>

                <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-white mb-2">
                  {mission.title}
                </h2>
                <div className="font-mono text-xs text-sky-300 mb-4 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  <span>TARGET: {mission.target}</span>
                </div>

                <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                  {mission.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-950/70 p-2.5 rounded border border-sky-500/20">
                    <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" /> BUDGET ALLOCATION
                    </span>
                    <span className="font-orbitron text-lg font-bold text-emerald-400">
                      ${mission.budget}M USD
                    </span>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded border border-sky-500/20">
                    <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-400" /> TRAVEL DURATION
                    </span>
                    <span className="font-orbitron text-lg font-bold text-sky-300">
                      {mission.travelDurationDays} {mission.travelDurationDays === 1 ? 'DAY' : 'DAYS'}
                    </span>
                  </div>
                </div>

                {/* Scientific Objectives Preview */}
                <div className="mb-4">
                  <div className="font-mono text-xs text-sky-400 uppercase tracking-wider mb-2 font-semibold">
                    PRIMARY SCIENTIFIC OBJECTIVES:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {mission.objectives.primary.map((obj) => (
                      <li key={obj.id} className="flex items-start gap-2">
                        <span className="text-sky-400 mt-0.5">◆</span>
                        <span>{obj.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Challenges */}
                <div className="mb-4">
                  <div className="font-mono text-[11px] text-amber-400 uppercase tracking-wider mb-1.5 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> TECHNICAL CHALLENGES:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {mission.technicalChallenges.map((ch, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">⚠</span>
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reward & Selection Indicator */}
              <div className="pt-4 border-t border-sky-500/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>+{mission.rewards.scientificPoints} SCIENCE PTS</span>
                </div>

                <div
                  className={`px-3 py-1 rounded text-xs font-orbitron font-semibold uppercase tracking-wider ${
                    isSelected ? 'bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isSelected ? 'SELECTED' : 'SELECT'}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Footer Navigation */}
      <footer className="mt-8 pt-4 border-t border-sky-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400">
          SELECTED DIRECTIVE: <span className="text-sky-300 font-bold uppercase">{selectedMissionId}</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onConfirmSelection();
          }}
          className="btn-aerospace py-3 px-8 rounded-lg text-sm flex items-center gap-3 ml-auto"
        >
          <span>COMMENCE MISSION BRIEFING</span>
          <ArrowRight className="w-4 h-4 text-sky-300" />
        </button>
      </footer>
    </div>
  );
}

