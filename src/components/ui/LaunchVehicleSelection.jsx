// Screen F: Launch Vehicle Selection for Project Orbital
import React from 'react';
import { LAUNCH_VEHICLES } from '../../data/launchVehicles';
import { sound } from '../../utils/soundEngine';
import { ArrowLeft, ArrowRight, Rocket, DollarSign, Weight, ShieldCheck, Check, AlertCircle, Sparkles } from 'lucide-react';

export default function LaunchVehicleSelection({
  stats,
  activeMission,
  selectedVehicleId,
  onSelectVehicle,
  onProceedToLaunch,
  onBackToDesigner
}) {
  const currentVehicle = LAUNCH_VEHICLES.find(v => v.id === selectedVehicleId) || LAUNCH_VEHICLES[0];

  return (
    <div className="min-h-screen bg-space-950 text-white p-4 sm:p-6 md:p-8 flex flex-col justify-between select-none aerospace-grid-bg">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b border-sky-500/20 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onBackToDesigner();
            }}
            className="hud-panel p-2.5 rounded-lg border border-sky-500/30 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>MODIFY DESIGN</span>
          </button>
          <div>
            <div className="font-mono text-xs text-sky-400 uppercase tracking-widest flex items-center gap-2">
              <span>KENNEDY SPACE CENTER // LAUNCH INTEGRATION COMPLEX</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white">
              SELECT LAUNCH VEHICLE
            </h1>
          </div>
        </div>

        {/* Spacecraft Payload Stats Summary */}
        <div className="hidden md:flex items-center gap-3 font-mono text-xs">
          <div className="telemetry-badge border-sky-500/40 text-sky-300">
            <span>PAYLOAD WET MASS:</span>
            <span className="font-bold text-white">{stats.wetMass.toLocaleString()} kg</span>
          </div>
          <div className="telemetry-badge border-emerald-500/40 text-emerald-300">
            <span>MISSION BUDGET:</span>
            <span className="font-bold">${activeMission?.budget || 500}M</span>
          </div>
        </div>
      </header>

      {/* Launch Vehicles Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-auto">
        {LAUNCH_VEHICLES.map((vehicle) => {
          const isSelected = selectedVehicleId === vehicle.id;
          const isOverweight = stats.wetMass > vehicle.payloadCapacityKg;
          const totalCostWithRocket = stats.spacecraftCost + vehicle.cost;
          const isOverBudget = totalCostWithRocket > (activeMission?.budget || 500);
          const hasBlocker = isOverweight || isOverBudget;

          return (
            <div
              key={vehicle.id}
              onClick={() => {
                sound.playToggle(true);
                onSelectVehicle(vehicle.id);
              }}
              className={`hud-panel rounded-xl p-6 cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                isSelected
                  ? 'hud-panel-glow border-sky-400 ring-2 ring-sky-400/50 scale-[1.02] shadow-[0_0_30px_rgba(56,189,248,0.25)]'
                  : 'hover:border-sky-500/50 opacity-90 hover:opacity-100'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300 uppercase tracking-wider font-semibold">
                    {vehicle.realWorldInspiration}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{vehicle.reliability}% REL</span>
                  </div>
                </div>

                <h2 className="font-orbitron font-bold text-2xl text-white mb-2">
                  {vehicle.name}
                </h2>
                <div className="font-mono text-xs text-sky-300 mb-4">
                  PERFORMANCE: <span className="text-amber-300 font-bold">{vehicle.performanceRating}</span>
                </div>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  {vehicle.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5 font-mono text-xs">
                  <div className="bg-slate-950/70 p-3 rounded border border-sky-500/20">
                    <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" /> LAUNCH COST
                    </span>
                    <span className="font-orbitron text-lg font-bold text-emerald-400">
                      ${vehicle.cost}M USD
                    </span>
                  </div>

                  <div className={`p-3 rounded border bg-slate-950/70 ${isOverweight ? 'border-rose-500/60' : 'border-sky-500/20'}`}>
                    <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                      <Weight className="w-3 h-3 text-sky-400" /> MAX PAYLOAD CAPACITY
                    </span>
                    <span className={`font-orbitron text-lg font-bold ${isOverweight ? 'text-rose-400' : 'text-sky-300'}`}>
                      {vehicle.payloadCapacityKg.toLocaleString()} kg
                    </span>
                  </div>
                </div>

                {/* Payload Compatibility Indicator */}
                <div className="mb-4">
                  <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
                    PAYLOAD MASS MARGIN:
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOverweight ? 'bg-rose-500' : 'bg-emerald-400'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(0, (stats.wetMass / vehicle.payloadCapacityKg) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-slate-400">Payload: {stats.wetMass}kg</span>
                    <span className={isOverweight ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {isOverweight ? `EXCEEDED BY ${stats.wetMass - vehicle.payloadCapacityKg} kg` : `+${vehicle.payloadCapacityKg - stats.wetMass} kg MARGIN`}
                    </span>
                  </div>
                </div>

                {/* Status Advisories */}
                {hasBlocker && (
                  <div className="bg-rose-950/60 border border-rose-500/60 p-2.5 rounded text-xs text-rose-300 space-y-1 mb-4">
                    {isOverweight && (
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Payload exceeds maximum vehicle capacity!</span>
                      </div>
                    )}
                    {isOverBudget && (
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Total cost exceeds mission budget by ${totalCostWithRocket - (activeMission?.budget || 500)}M!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selection Button */}
              <div className="pt-4 border-t border-sky-500/20 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">
                  {vehicle.stages}-STAGE ROCKET // {vehicle.fuelType}
                </span>

                <div
                  className={`px-3 py-1.5 rounded text-xs font-orbitron font-semibold uppercase tracking-wider ${
                    isSelected ? 'bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isSelected ? 'SELECTED VEHICLE' : 'SELECT'}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Footer Navigation */}
      <footer className="mt-8 pt-4 border-t border-sky-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400">
          SELECTED BOOSTER: <span className="text-sky-300 font-bold">{currentVehicle.name}</span>
          <span className="text-slate-600 mx-2">|</span>
          COMBINED COST: <span className="text-emerald-400 font-bold">${stats.spacecraftCost + currentVehicle.cost}M USD</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onProceedToLaunch();
          }}
          disabled={stats.wetMass > currentVehicle.payloadCapacityKg || (stats.spacecraftCost + currentVehicle.cost) > (activeMission?.budget || 500)}
          className="btn-aerospace py-3.5 px-8 rounded-lg text-sm sm:text-base flex items-center gap-3 ml-auto shadow-[0_0_25px_rgba(56,189,248,0.4)]"
        >
          <Rocket className="w-4 h-4 text-sky-300" />
          <span>PROCEED TO LAUNCHPAD (T-10)</span>
          <ArrowRight className="w-4 h-4 text-sky-300" />
        </button>
      </footer>
    </div>
  );
}

