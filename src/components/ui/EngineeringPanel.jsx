// Screen E: Engineering Management & Telemetry Resources for Project Orbital
import React from 'react';
import { DollarSign, Weight, Zap, Battery, Radio, Gauge, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export default function EngineeringPanel({ stats, activeMission }) {
  if (!stats) return null;

  const budgetPct = Math.min(100, Math.max(0, (stats.totalCost / (activeMission?.budget || 500)) * 100));
  const deltaVPct = Math.min(100, Math.max(0, (stats.deltaV / (stats.requiredDeltaV || 3900)) * 100));

  return (
    <div className="space-y-4">
      {/* 1. Core Resource Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Budget Status */}
        <div className={`p-3 rounded-lg border bg-slate-950/80 ${stats.remainingBudget < 0 ? 'border-rose-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-sky-500/30'}`}>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> BUDGET USAGE
            </span>
            <span className={stats.remainingBudget < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {budgetPct.toFixed(0)}%
            </span>
          </div>
          <div className="font-orbitron text-lg font-bold text-white mb-1.5">
            ${stats.totalCost}M <span className="text-xs text-slate-400 font-normal">/ ${activeMission?.budget || 500}M</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${stats.remainingBudget < 0 ? 'bg-rose-500' : 'bg-emerald-400'}`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            REMAINING: <span className={stats.remainingBudget < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              ${stats.remainingBudget}M
            </span>
          </div>
        </div>

        {/* Spacecraft Mass Breakdown */}
        <div className="p-3 rounded-lg border border-sky-500/30 bg-slate-950/80">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Weight className="w-3.5 h-3.5 text-sky-400" /> TOTAL WET MASS
            </span>
          </div>
          <div className="font-orbitron text-lg font-bold text-sky-300 mb-1.5">
            {stats.wetMass.toLocaleString()} <span className="text-xs text-slate-400 font-normal">KG</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex justify-between">
            <span>DRY: {stats.dryMass}kg</span>
            <span className="text-amber-400">FUEL: {stats.fuelMass}kg</span>
          </div>
        </div>

        {/* Delta-V Capability */}
        <div className={`p-3 rounded-lg border bg-slate-950/80 ${stats.deltaV < stats.requiredDeltaV ? 'border-amber-500/60' : 'border-sky-500/30'}`}>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-sky-400" /> DELTA-V (ΔV)
            </span>
            <span className={stats.deltaV >= stats.requiredDeltaV ? 'text-emerald-400' : 'text-amber-400'}>
              {deltaVPct.toFixed(0)}%
            </span>
          </div>
          <div className="font-orbitron text-lg font-bold text-white mb-1.5">
            {stats.deltaV} <span className="text-xs text-slate-400 font-normal">/ {stats.requiredDeltaV} m/s</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${stats.deltaV >= stats.requiredDeltaV ? 'bg-emerald-400' : 'bg-amber-400'}`}
              style={{ width: `${deltaVPct}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            STATUS: <span className={stats.deltaV >= stats.requiredDeltaV ? 'text-emerald-400' : 'text-amber-400'}>
              {stats.deltaV >= stats.requiredDeltaV ? 'ORBIT INSERTION READY' : 'DEFICIENT'}
            </span>
          </div>
        </div>

        {/* Power Balance at Target */}
        <div className={`p-3 rounded-lg border bg-slate-950/80 ${stats.netPowerAtTarget < 0 ? 'border-rose-500/60' : 'border-sky-500/30'}`}>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> NET POWER @ TARGET
            </span>
            <span className={stats.netPowerAtTarget >= 0 ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
              {stats.netPowerAtTarget >= 0 ? `+${stats.netPowerAtTarget}W` : `${stats.netPowerAtTarget}W`}
            </span>
          </div>
          <div className="font-orbitron text-lg font-bold text-white mb-1.5">
            {stats.totalPowerGenAtTarget}W <span className="text-xs text-slate-400 font-normal">GEN / {stats.totalPowerDraw}W CONSUME</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex justify-between">
            <span>EARTH: +{stats.netPowerAtEarth}W</span>
            <span className="text-sky-300">BATTERY: {stats.batteryStorageWh}Wh</span>
          </div>
        </div>
      </div>

      {/* 2. Secondary Subsystem Telemetry Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded bg-slate-950/60 border border-sky-500/20 flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-400" /> COMM RANGE
          </span>
          <span className={stats.hasSufficientCommRange ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
            {(stats.maxCommRangeKm / 1e6).toFixed(1)}M km
          </span>
        </div>

        <div className="p-2.5 rounded bg-slate-950/60 border border-sky-500/20 flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RELIABILITY
          </span>
          <span className="text-emerald-400 font-semibold">
            {stats.reliabilityScore}%
          </span>
        </div>

        <div className="p-2.5 rounded bg-slate-950/60 border border-sky-500/20 flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Battery className="w-3.5 h-3.5 text-cyan-400" /> ECLIPSE BUFFER
          </span>
          <span className="text-cyan-300 font-semibold">
            {stats.batteryStorageWh} Wh
          </span>
        </div>

        <div className="p-2.5 rounded bg-slate-950/60 border border-sky-500/20 flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> THERMAL SHIELD
          </span>
          <span className="text-amber-300 font-semibold">
            {stats.thermalRating}%
          </span>
        </div>
      </div>

      {/* 3. Real-Time Warnings and Blockers */}
      {(stats.blockers.length > 0 || stats.warnings.length > 0) && (
        <div className="space-y-2">
          {/* Critical Blockers */}
          {stats.blockers.map((blk, idx) => (
            <div key={idx} className="bg-rose-950/70 border border-rose-500/60 p-2.5 rounded-lg flex items-center gap-2.5 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="font-sans font-medium">{blk}</span>
            </div>
          ))}

          {/* Warnings */}
          {stats.warnings.map((wrn, idx) => (
            <div key={idx} className="bg-amber-950/60 border border-amber-500/50 p-2.5 rounded-lg flex items-center gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="font-sans font-medium">{wrn}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

