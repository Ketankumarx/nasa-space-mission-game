// 3D Spacecraft Customizer with Drag-and-Drop Instruments & Live Visual Gauges
import React, { useState } from 'react';
import SpacecraftViewer from '../3d/SpacecraftViewer';
import { COMPONENTS } from '../../data/components';
import { sound } from '../../utils/soundEngine';
import {
  Camera,
  Waves,
  Radio,
  ShieldAlert,
  Flame,
  Zap,
  Battery,
  Shield,
  Compass,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Weight,
  Gauge,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCw
} from 'lucide-react';

const INSTRUMENT_TILES = [
  { id: 'inst_camera', name: 'OPTICAL CAMERA', category: 'instruments', icon: Camera, cost: 45, mass: 55, power: -75, highlight: 'Visual Imaging' },
  { id: 'inst_spectrometer', name: 'IR SPECTROMETER', category: 'instruments', icon: Waves, cost: 55, mass: 70, power: -90, highlight: 'Mineral & Gas Scan' },
  { id: 'inst_radar', name: 'GROUND RADAR', category: 'instruments', icon: Radio, cost: 50, mass: 85, power: -120, highlight: 'Subsurface Ice' },
  { id: 'inst_radiation', name: 'PARTICLE SENSOR', category: 'instruments', icon: ShieldAlert, cost: 30, mass: 35, power: -40, highlight: 'Radiation Field' },
  { id: 'prop_electric', name: 'XENON ION ENGINE', category: 'propulsion', icon: Zap, cost: 75, mass: 220, power: -650, highlight: 'Isp 2800s // High Eff' },
  { id: 'prop_chemical', name: 'CHEMICAL ENGINE', category: 'propulsion', icon: Flame, cost: 45, mass: 420, power: -35, highlight: 'High Thrust // Isp 325s' },
  { id: 'pwr_advanced_solar', name: 'GAAS ULTRA ARRAYS', category: 'power', icon: Zap, cost: 65, mass: 140, power: 1850, highlight: '+1850W // Deep Space' },
  { id: 'pwr_standard_solar', name: 'SILICON SOLAR WINGS', category: 'power', icon: Zap, cost: 25, mass: 85, power: 800, highlight: '+800W // Standard' },
  { id: 'stor_battery_advanced', name: 'SOLID-STATE BATTERY', category: 'storage', icon: Battery, cost: 35, mass: 110, power: 0, highlight: '3.5 kWh Energy Buffer' },
  { id: 'prot_radiation', name: 'RADIATION SHIELDING', category: 'protection', icon: Shield, cost: 40, mass: 140, power: 0, highlight: 'Heavy Composite Armor' }
];

export default function SpacecraftCustomizer3D({
  activePlanet,
  selectedComponentIds,
  onToggleComponent,
  stats,
  onProceedToLaunch,
  onBackToPlanetSelect
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDropHovered, setIsDropHovered] = useState(false);

  // Drag and Drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDropHovered(true);
  };

  const handleDragLeave = () => {
    setIsDropHovered(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDropHovered(false);
    const compId = e.dataTransfer.getData('text/plain');
    const comp = INSTRUMENT_TILES.find(t => t.id === compId);
    if (comp) {
      sound.playToggle(true);
      onToggleComponent(comp, comp.category === 'instruments' || comp.category === 'protection');
    }
  };

  // Calculations for Visual Meters
  const budgetLimit = activePlanet?.budget || 600;
  const budgetRatio = Math.min(100, Math.max(0, (stats.totalCost / budgetLimit) * 100));
  const isOverBudget = stats.totalCost > budgetLimit;

  const maxPayload = 9500; // kg
  const massRatio = Math.min(100, Math.max(0, (stats.wetMass / maxPayload) * 100));
  const isOverMass = stats.wetMass > maxPayload;

  const isPowerDeficit = stats.netPowerAtTarget < 0;
  const hasPropulsion = stats.components.some(c => c.category === 'propulsion');
  const hasPower = stats.totalPowerGenAtEarth > 0;

  const canLaunch = !isOverBudget && !isOverMass && !isPowerDeficit && hasPropulsion && hasPower;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-space-950 font-sans select-none flex flex-col justify-between">
      {/* 3D Drop Target Viewport */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full h-full absolute inset-0 transition-all ${
          isDropHovered ? 'ring-4 ring-sky-400 ring-inset bg-sky-950/20' : ''
        }`}
      >
        <SpacecraftViewer selectedComponentIds={selectedComponentIds} />
      </div>

      {/* Top Header */}
      <header className="relative z-20 p-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => {
              sound.playClick();
              onBackToPlanetSelect();
            }}
            className="hud-panel p-2.5 rounded-lg border border-sky-500/30 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>CHANGE TARGET</span>
          </button>
          <div>
            <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>ORBITAL ASSEMBLY DOCK // MISSION: {activePlanet?.name || 'MARS'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <h1 className="font-orbitron font-extrabold text-xl text-white">
              CUSTOMIZE SCIENTIFIC SPACECRAFT
            </h1>
          </div>
        </div>

        {/* Drop Target Hint */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-sky-400/40 font-mono text-xs text-sky-300">
          <RotateCw className="w-3.5 h-3.5 animate-spin" />
          <span>DRAG INSTRUMENTS DIRECTLY ONTO CRAFT OR CLICK BELOW</span>
        </div>
      </header>

      {/* Floating Visual Engineering Gauges (Top-Right HUD Overlay) */}
      <div className="absolute top-20 right-6 z-20 pointer-events-none flex flex-col gap-2.5 w-64">
        {/* 1. Budget Arc Gauge */}
        <div className={`hud-panel p-3 rounded-xl border ${isOverBudget ? 'border-rose-500 bg-rose-950/40' : 'border-sky-500/30'}`}>
          <div className="flex justify-between items-center text-[10px] font-mono mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> MISSION BUDGET
            </span>
            <span className={isOverBudget ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              ${stats.totalCost}M / ${budgetLimit}M
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-400'}`}
              style={{ width: `${budgetRatio}%` }}
            />
          </div>
        </div>

        {/* 2. Mass Arc Gauge */}
        <div className={`hud-panel p-3 rounded-xl border ${isOverMass ? 'border-rose-500 bg-rose-950/40' : 'border-sky-500/30'}`}>
          <div className="flex justify-between items-center text-[10px] font-mono mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Weight className="w-3.5 h-3.5 text-sky-400" /> CRAFT WET MASS
            </span>
            <span className={isOverMass ? 'text-rose-400 font-bold' : 'text-sky-300 font-bold'}>
              {stats.wetMass} KG / {maxPayload} KG
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isOverMass ? 'bg-rose-500' : 'bg-sky-400'}`}
              style={{ width: `${massRatio}%` }}
            />
          </div>
        </div>

        {/* 3. Power Balance at Destination Gauge */}
        <div className={`hud-panel p-3 rounded-xl border ${isPowerDeficit ? 'border-rose-500 bg-rose-950/40' : 'border-sky-500/30'}`}>
          <div className="flex justify-between items-center text-[10px] font-mono mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> POWER @ {activePlanet?.name?.split(' ')[0] || 'TARGET'}
            </span>
            <span className={isPowerDeficit ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {stats.netPowerAtTarget >= 0 ? `+${stats.netPowerAtTarget}W` : `${stats.netPowerAtTarget}W`}
            </span>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-slate-400">
            <span>GEN: {stats.totalPowerGenAtTarget}W</span>
            <span>DRAW: {stats.totalPowerDraw}W</span>
          </div>
        </div>

        {/* 4. Delta-V Propulsion Metric */}
        <div className="hud-panel p-3 rounded-xl border border-sky-500/30">
          <div className="flex justify-between items-center text-[10px] font-mono mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-sky-400" /> DELTA-V (ΔV)
            </span>
            <span className="text-emerald-400 font-bold">{stats.deltaV} M/S</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (stats.deltaV / 5000) * 100)}%` }}
            />
          </div>
        </div>

        {/* Constraint Warning Banner */}
        {!canLaunch && (
          <div className="bg-rose-950/90 border border-rose-500 p-2.5 rounded-xl text-xs font-mono text-rose-200 flex items-center gap-2 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="text-[11px] leading-tight">
              {isOverBudget
                ? 'OVER BUDGET // REDUCE HARDWARE'
                : isPowerDeficit
                ? 'POWER DEFICIT // ADD GAAS SOLAR OR BATTERY'
                : !hasPropulsion
                ? 'MISSING ENGINE // INSTALL PROPULSION'
                : 'OVERWEIGHT // PAYLOAD CAPACITY EXCEEDED'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Visual Instrument Drag-and-Drop Dock */}
      <div className="relative z-20 p-5 pointer-events-auto max-w-6xl mx-auto w-full">
        <div className="hud-panel p-4 rounded-2xl border border-sky-500/40 shadow-[0_0_30px_rgba(56,189,248,0.25)] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-sky-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>MODULAR INSTRUMENT SUITE (DRAG OR CLICK TO EQUIP)</span>
            </span>
            <span className="text-slate-400 text-[11px]">
              {selectedComponentIds.length} MODULES INSTALLED
            </span>
          </div>

          {/* Draggable Instrument Tiles Scroll */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {INSTRUMENT_TILES.map((tile) => {
              const isEquipped = selectedComponentIds.includes(tile.id);
              const Icon = tile.icon;

              return (
                <div
                  key={tile.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tile)}
                  onClick={() => {
                    sound.playToggle(!isEquipped);
                    onToggleComponent(tile, tile.category === 'instruments' || tile.category === 'protection');
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-between text-center group ${
                    isEquipped
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'border-sky-500/25 bg-slate-950/80 hover:border-sky-400 hover:scale-105'
                  }`}
                  title={`${tile.name} (${tile.highlight})`}
                >
                  <div className={`p-2 rounded-lg mb-1.5 transition-colors ${
                    isEquipped ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400 group-hover:text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="font-orbitron font-bold text-[9px] text-white leading-tight truncate w-full">
                    {tile.name}
                  </div>

                  <div className="font-mono text-[8px] text-slate-400 mt-1">
                    ${tile.cost}M | {tile.mass}kg
                  </div>

                  <div className={`w-full mt-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                    isEquipped ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isEquipped ? 'EQUIPPED' : 'INSTALL'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Launch Controls Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-sky-500/20">
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ORBITAL FLIGHT COMPUTER: READY</span>
            </div>

            <button
              onClick={() => {
                if (canLaunch) {
                  sound.playClick();
                  onProceedToLaunch();
                } else {
                  sound.playWarning();
                }
              }}
              disabled={!canLaunch}
              className={`py-3 px-8 rounded-xl text-xs sm:text-sm font-orbitron font-bold flex items-center gap-3 transition-all ${
                canLaunch
                  ? 'btn-aerospace shadow-[0_0_30px_rgba(56,189,248,0.5)]'
                  : 'bg-slate-900 border border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              {canLaunch ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AUTHORIZE & LAUNCH MISSION ➔</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>LAUNCH LOCKED // CONSTRAINTS EXCEEDED</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

