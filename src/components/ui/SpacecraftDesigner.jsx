// Screen D: Streamlined Spacecraft Customizer & Assembly Bay
import React, { useState } from 'react';
import { COMPONENT_CATEGORIES, COMPONENTS } from '../../data/components';
import SpacecraftViewer from '../3d/SpacecraftViewer';
import { sound } from '../../utils/soundEngine';
import { ArrowLeft, ArrowRight, Check, Plus, DollarSign, Weight, Zap, Gauge, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SpacecraftDesigner({
  activeMission,
  selectedComponentIds,
  onToggleComponent,
  stats,
  onProceedToLaunch,
  onBackToMenu,
  onOpenLearnMore
}) {
  const [activeCategory, setActiveCategory] = useState('propulsion');
  const currentCategoryComponents = COMPONENTS[activeCategory] || [];

  return (
    <div className="min-h-screen bg-space-950 text-white p-4 sm:p-6 flex flex-col justify-between select-none aerospace-grid-bg">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-3 mb-4 border-b border-sky-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToMenu();
            }}
            className="hud-panel p-2 rounded-lg border border-sky-500/30 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
          <div>
            <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>CAD INTEGRATION BAY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white">
              SPACECRAFT CUSTOMIZATION
            </h1>
          </div>
        </div>

        {/* Compact Quick Stats */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <div className="telemetry-badge border-emerald-500/40 text-emerald-300">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>BUDGET: ${stats.remainingBudget}M</span>
          </div>

          <div className="telemetry-badge border-sky-500/40 text-sky-300">
            <Weight className="w-3.5 h-3.5 text-sky-400" />
            <span>{stats.wetMass} KG</span>
          </div>

          <div className="telemetry-badge border-amber-500/40 text-amber-300">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.deltaV} M/S</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenLearnMore();
            }}
            className="hud-panel p-2 rounded-lg text-xs font-mono text-amber-300 border border-amber-500/30 hover:bg-slate-900 transition-colors"
            title="Open Engineering Principles"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Assembly Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto flex-1">
        {/* Left Column: Category Tabs & Hardware List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {/* Subsystem Category Pills */}
          <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-slate-950/80 border border-sky-500/30">
            {COMPONENT_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              const isInstalled = COMPONENTS[cat.id]?.some(c => selectedComponentIds.includes(c.id));

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`flex-1 min-w-[90px] py-1.5 px-2 rounded text-[10px] font-orbitron font-semibold tracking-wider transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isInstalled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Component Selection Cards */}
          <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
            {currentCategoryComponents.map(comp => {
              const isSelected = selectedComponentIds.includes(comp.id);
              const isInstrument = comp.category === 'instruments';

              return (
                <div
                  key={comp.id}
                  className={`hud-panel p-3.5 rounded-xl transition-all border ${
                    isSelected
                      ? 'border-sky-400 bg-slate-900/90 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : 'border-sky-500/20 hover:border-sky-500/40 opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3 className="font-orbitron font-bold text-sm text-white">
                        {comp.name}
                      </h3>
                      <div className="font-mono text-[10px] text-sky-400">
                        {comp.statsHighlight}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sound.playToggle(!isSelected);
                        onToggleComponent(comp, isInstrument);
                      }}
                      className={`px-3 py-1 rounded text-xs font-orbitron font-semibold tracking-wider flex items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 hover:bg-rose-500 hover:text-white'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-400/50 hover:bg-sky-500/40'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>EQUIPPED</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>INSTALL</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Quick Stat Tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-sky-500/20 font-mono text-[10px]">
                    <span className="text-emerald-400 font-bold">${comp.cost}M</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-sky-300 font-bold">{comp.mass} kg</span>
                    <span className="text-slate-600">|</span>
                    <span className={comp.powerGen > 0 ? 'text-yellow-400 font-bold' : 'text-slate-300 font-bold'}>
                      {comp.powerGen > 0 ? `+${comp.powerGen}W GEN` : `-${comp.powerDraw}W USE`}
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-emerald-400">{comp.reliability}% REL</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 3D CAD Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="h-[360px] sm:h-[400px] w-full">
            <SpacecraftViewer selectedComponentIds={selectedComponentIds} />
          </div>

          {/* Compact Engineering Telemetry Bar */}
          <div className="hud-panel p-3.5 rounded-xl border border-sky-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <div className="bg-slate-950/70 p-2 rounded border border-sky-500/20">
              <span className="text-slate-400 text-[10px] block">TOTAL MASS</span>
              <span className="font-orbitron font-bold text-sky-300 text-sm">
                {stats.wetMass} <span className="text-[10px] font-normal text-slate-400">KG</span>
              </span>
            </div>

            <div className="bg-slate-950/70 p-2 rounded border border-sky-500/20">
              <span className="text-slate-400 text-[10px] block">DELTA-V (ΔV)</span>
              <span className="font-orbitron font-bold text-emerald-400 text-sm">
                {stats.deltaV} <span className="text-[10px] font-normal text-slate-400">M/S</span>
              </span>
            </div>

            <div className="bg-slate-950/70 p-2 rounded border border-sky-500/20">
              <span className="text-slate-400 text-[10px] block">TARGET POWER</span>
              <span className={`font-orbitron font-bold text-sm ${stats.netPowerAtTarget >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stats.netPowerAtTarget >= 0 ? `+${stats.netPowerAtTarget}W` : `${stats.netPowerAtTarget}W`}
              </span>
            </div>

            <div className="bg-slate-950/70 p-2 rounded border border-sky-500/20">
              <span className="text-slate-400 text-[10px] block">RELIABILITY</span>
              <span className="font-orbitron font-bold text-sky-300 text-sm">
                {stats.reliabilityScore}%
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="mt-4 pt-3 border-t border-sky-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          {stats.blockers.length > 0 ? (
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{stats.blockers[0]}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>SPACECRAFT READY FOR FLIGHT OPERATIONS</span>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onProceedToLaunch();
          }}
          disabled={stats.blockers.length > 0}
          className="btn-aerospace py-3 px-8 rounded-lg text-xs sm:text-sm flex items-center gap-2.5 ml-auto shadow-[0_0_20px_rgba(56,189,248,0.35)]"
        >
          <span>LAUNCH INTO ORBIT</span>
          <ArrowRight className="w-4 h-4 text-sky-300" />
        </button>
      </footer>
    </div>
  );
}
