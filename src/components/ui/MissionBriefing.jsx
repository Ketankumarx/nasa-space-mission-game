// Screen C: Mission Briefing for Project Orbital
import React from 'react';
import { sound } from '../../utils/soundEngine';
import { ArrowLeft, ArrowRight, Target, DollarSign, Gauge, Sun, Wifi, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function MissionBriefing({
  mission,
  onStartDesigning,
  onBackToMissions
}) {
  if (!mission) return null;

  return (
    <div className="relative min-h-screen bg-space-950 text-white p-4 sm:p-6 md:p-8 flex flex-col justify-between select-none aerospace-grid-bg">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b border-sky-500/20 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onBackToMissions();
            }}
            className="hud-panel p-2.5 rounded-lg border border-sky-500/30 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>CHANGE MISSION</span>
          </button>

          <div>
            <div className="font-mono text-xs text-sky-400 uppercase tracking-widest flex items-center gap-2">
              <span>NASA FLIGHT READINESS DOSSIER // TOP SECRET</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white">
              MISSION BRIEFING: {mission.title}
            </h1>
          </div>
        </div>

        <div className="hidden lg:block font-mono text-xs text-right">
          <div className="text-slate-400">OPERATION CODENAME</div>
          <div className="font-orbitron text-sky-300 font-bold tracking-wider">{mission.codename}</div>
        </div>
      </header>

      {/* Main Dossier Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto">
        {/* Left Column: Mission Overview & Constraints (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mission Executive Summary */}
          <div className="hud-panel p-6 rounded-xl border border-sky-500/30">
            <h2 className="font-orbitron font-bold text-lg text-sky-300 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-400" />
              <span>MISSION OVERVIEW & FLIGHT PROFILE</span>
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed mb-4">
              {mission.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-sky-500/20 font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">DESTINATION</span>
                <span className="text-sky-300 font-semibold">{mission.target}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">DISTANCE</span>
                <span className="text-white font-semibold">{(mission.targetDistanceKm).toLocaleString()} km</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">COMM LATENCY</span>
                <span className="text-amber-300 font-semibold">~{mission.communicationDelaySec} sec</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SOLAR FLUX</span>
                <span className="text-yellow-400 font-semibold">{Math.round(mission.solarFluxFactor * 100)}% of Earth</span>
              </div>
            </div>
          </div>

          {/* Scientific Objectives Breakdown */}
          <div className="hud-panel p-6 rounded-xl border border-sky-500/30">
            <h2 className="font-orbitron font-bold text-lg text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>SCIENTIFIC OBJECTIVES & DELIVERABLES</span>
            </h2>

            {/* Primary */}
            <div className="mb-4">
              <div className="font-mono text-xs text-sky-400 uppercase tracking-wider mb-2 font-bold flex items-center justify-between">
                <span>PRIMARY OBJECTIVES (CRITICAL SUCCESS)</span>
                <span className="text-emerald-400 font-mono text-[11px]">+70% WEIGHT</span>
              </div>
              <div className="space-y-2.5">
                {mission.objectives.primary.map(obj => (
                  <div key={obj.id} className="bg-slate-950/70 p-3 rounded-lg border border-sky-500/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-sm text-slate-100">{obj.text}</span>
                    </div>
                    {obj.requiredInstrument && (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30 whitespace-nowrap">
                        REQ: {obj.requiredInstrument.toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary */}
            <div>
              <div className="font-mono text-xs text-amber-400 uppercase tracking-wider mb-2 font-bold flex items-center justify-between">
                <span>SECONDARY OBJECTIVES (SCIENCE BONUS)</span>
                <span className="text-amber-400 font-mono text-[11px]">+30% BONUS</span>
              </div>
              <div className="space-y-2.5">
                {mission.objectives.secondary.map(obj => (
                  <div key={obj.id} className="bg-slate-950/70 p-3 rounded-lg border border-amber-500/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="text-sm text-slate-200">{obj.text}</span>
                    </div>
                    {obj.requiredInstrument && (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                        REQ: {obj.requiredInstrument.toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Engineering Constraints & Readiness Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Engineering Envelope */}
          <div className="hud-panel p-6 rounded-xl border border-sky-500/30">
            <h2 className="font-orbitron font-bold text-lg text-amber-400 mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-400" />
              <span>SPACECRAFT DESIGN CONSTRAINTS</span>
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/70 border border-sky-500/20">
                <span className="text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> TOTAL ALLOCATED BUDGET
                </span>
                <span className="font-orbitron text-sm font-bold text-emerald-400">
                  ${mission.budget}M USD
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/70 border border-sky-500/20">
                <span className="text-slate-400 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5 text-sky-400" /> REQUIRED MANEUVER DELTA-V
                </span>
                <span className="font-orbitron text-sm font-bold text-sky-300">
                  {mission.requiredDeltaV} m/s
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/70 border border-sky-500/20">
                <span className="text-slate-400 flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-yellow-400" /> SOLAR IRRADIANCE FACTOR
                </span>
                <span className="font-orbitron text-sm font-bold text-yellow-300">
                  {mission.solarFluxFactor} AU Factor
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/70 border border-sky-500/20">
                <span className="text-slate-400 flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5 text-sky-400" /> MINIMUM COMM DISTANCE
                </span>
                <span className="font-orbitron text-sm font-bold text-white">
                  {(mission.targetDistanceKm / 1e6).toFixed(1)}M km
                </span>
              </div>
            </div>
          </div>

          {/* Environmental Hazards */}
          <div className="hud-panel p-6 rounded-xl border border-sky-500/30">
            <h2 className="font-orbitron font-bold text-base text-rose-400 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>FLIGHT HAZARD ADVISORY</span>
            </h2>
            <ul className="space-y-2 text-xs text-slate-300">
              {mission.technicalChallenges.map((ch, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-rose-500/20">
                  <span className="text-rose-400 font-bold">!</span>
                  <span>{ch}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="mt-8 pt-4 border-t border-sky-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400">
          STATUS: <span className="text-emerald-400 font-bold">MISSION CONSTRAINTS VALIDATED</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onStartDesigning();
          }}
          className="btn-aerospace py-3.5 px-8 rounded-lg text-sm sm:text-base flex items-center gap-3 ml-auto shadow-[0_0_25px_rgba(56,189,248,0.4)]"
        >
          <span>START DESIGNING SPACECRAFT</span>
          <ArrowRight className="w-5 h-5 text-sky-300" />
        </button>
      </footer>
    </div>
  );
}

