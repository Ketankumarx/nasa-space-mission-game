// Screen H & Screen I: 3D Space Journey & In-Flight Mission Events
import React, { useState, useEffect } from 'react';
import SpaceJourneyScene from '../3d/SpaceJourneyScene';
import { MISSION_EVENTS_POOL } from '../../data/missionEvents';
import { sound } from '../../utils/soundEngine';
import { Play, FastForward, CheckCircle2, AlertTriangle, Radio, Sun, Flame, Sparkles, Compass, ShieldAlert, Award } from 'lucide-react';

const FLIGHT_PHASES = [
  { id: 'tmi', name: 'TRANS-INJECTION BURN', progressPct: 15, desc: 'Primary burn boosting spacecraft out of Low Earth Orbit onto transfer ellipse.' },
  { id: 'midcourse', name: 'MIDCOURSE TRAJECTORY CORRECTION', progressPct: 40, desc: 'Trim vernier burn to eliminate navigation drift and align arrival vector.' },
  { id: 'deep_space', name: 'DEEP SPACE INTERPLANETARY CRUISE', progressPct: 70, desc: 'Extended coasting through interplanetary space. Space weather monitoring.' },
  { id: 'orbit_insertion', name: 'DESTINATION ORBIT INSERTION (LOI/MOI)', progressPct: 100, desc: 'Retrograde braking burn to capture into stable orbit around destination.' }
];

export default function SpaceJourney({
  activeMission,
  selectedComponentIds,
  stats,
  onJourneyComplete,
  onUpdateMissionState,
  missionLog,
  setMissionLog
}) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [cameraFocus, setCameraFocus] = useState('craft'); // 'craft' or 'system'
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventHistory, setEventHistory] = useState([]);
  const [isWarping, setIsWarping] = useState(false);
  const [accumulatedScience, setAccumulatedScience] = useState(0);

  // Dynamic telemetry state
  const [travelState, setTravelState] = useState({
    fuelRemainingKg: stats.fuelMass,
    powerDamagePct: 0,
    reliability: stats.reliabilityScore,
    daysElapsed: 0,
    distanceCoveredKm: 0
  });

  const currentPhase = FLIGHT_PHASES[currentPhaseIndex];
  const totalDays = activeMission?.travelDurationDays || 100;
  const progressPct = currentPhase ? currentPhase.progressPct : 100;

  // Trigger Mission Event on certain phases if not already triggered
  const checkForPhaseEvent = (phaseIdx) => {
    if (phaseIdx === 1 && !eventHistory.includes('comm_blackout')) {
      // Trigger comm blackout event
      const ev = MISSION_EVENTS_POOL.find(e => e.id === 'comm_blackout');
      if (ev) {
        sound.playWarning();
        setActiveEvent(ev);
      }
    } else if (phaseIdx === 2 && !eventHistory.includes('solar_flare')) {
      // Trigger solar flare event
      const ev = MISSION_EVENTS_POOL.find(e => e.id === 'solar_flare');
      if (ev) {
        sound.playWarning();
        setActiveEvent(ev);
      }
    } else if (phaseIdx === 3 && !eventHistory.includes('fuel_valve_anomaly')) {
      // Trigger fuel valve or asteroid flyby
      const ev = Math.random() > 0.5
        ? MISSION_EVENTS_POOL.find(e => e.id === 'fuel_valve_anomaly')
        : MISSION_EVENTS_POOL.find(e => e.id === 'asteroid_opportunity');
      if (ev) {
        sound.playWarning();
        setActiveEvent(ev);
      }
    }
  };

  const handleAdvancePhase = () => {
    if (isWarping || activeEvent) return;

    sound.playClick();
    setIsWarping(true);

    const nextIdx = currentPhaseIndex + 1;
    if (nextIdx < FLIGHT_PHASES.length) {
      setTimeout(() => {
        setCurrentPhaseIndex(nextIdx);
        setIsWarping(false);

        // Update days & distance
        const newDays = Math.round((FLIGHT_PHASES[nextIdx].progressPct / 100) * totalDays);
        const newDist = Math.round((FLIGHT_PHASES[nextIdx].progressPct / 100) * (activeMission?.targetDistanceKm || 384400));
        setTravelState(prev => ({
          ...prev,
          daysElapsed: newDays,
          distanceCoveredKm: newDist
        }));

        // Log phase transition
        setMissionLog(prev => [
          ...prev,
          `T+${newDays} Days: Reached ${FLIGHT_PHASES[nextIdx].name}. Trajectory nominal.`
        ]);

        checkForPhaseEvent(nextIdx);
      }, 1200);
    } else {
      // Finished journey! Arrived at destination orbit
      setTimeout(() => {
        setIsWarping(false);
        sound.playFanfare();
        setMissionLog(prev => [
          ...prev,
          `Mission Arrival: Successfully achieved orbit around ${activeMission?.target}!`
        ]);
        if (onJourneyComplete) {
          onJourneyComplete({
            ...travelState,
            accumulatedScience
          });
        }
      }, 1000);
    }
  };

  const handleEventChoice = (choice) => {
    sound.playToggle(true);
    const effects = choice.effects;

    // Apply effects
    setTravelState(prev => ({
      ...prev,
      fuelRemainingKg: Math.max(0, prev.fuelRemainingKg + (effects.fuelDelta || 0)),
      powerDamagePct: prev.powerDamagePct + (effects.powerDamagePct || 0),
      reliability: Math.max(50, Math.min(99, prev.reliability + (effects.reliabilityDelta || 0)))
    }));

    if (effects.sciencePoints) {
      setAccumulatedScience(prev => prev + effects.sciencePoints);
    }

    setEventHistory(prev => [...prev, activeEvent.id]);
    setMissionLog(prev => [
      ...prev,
      `Event Decision [${activeEvent.title}]: ${choice.label} -> ${effects.log}`
    ]);

    setActiveEvent(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-space-950 font-sans select-none">
      {/* 3D Interplanetary Solar System Transfer Scene */}
      <SpaceJourneyScene
        activeMission={activeMission}
        selectedComponentIds={selectedComponentIds}
        progressPct={progressPct}
        cameraFocus={cameraFocus}
      />

      {/* Top Mission Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="hud-panel p-3 rounded-lg flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest">
              INTERPLANETARY TRANSFER FLIGHT DIRECTIVE // {activeMission?.codename}
            </div>
            <div className="font-orbitron text-sm md:text-base font-bold text-white">
              {currentPhase ? currentPhase.name : 'ORBIT INSERTION'}
            </div>
          </div>
        </div>

        {/* Camera Perspective Toggle */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-lg border border-sky-500/30">
          <button
            onClick={() => {
              sound.playClick();
              setCameraFocus('craft');
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-colors ${
              cameraFocus === 'craft' ? 'bg-sky-500/40 text-sky-200 border border-sky-400/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            SPACECRAFT CAM
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setCameraFocus('system');
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-colors ${
              cameraFocus === 'system' ? 'bg-sky-500/40 text-sky-200 border border-sky-400/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            SOLAR SYSTEM MAP
          </button>
        </div>
      </div>

      {/* Flight Timeline Progress (Top-Center) */}
      <div className="absolute top-20 left-4 right-4 z-20 pointer-events-none max-w-4xl mx-auto">
        <div className="hud-panel p-3 rounded-xl border border-sky-500/30">
          <div className="flex justify-between items-center mb-2 font-mono text-xs">
            <span className="text-sky-300 font-semibold">EARTH DEPARTURE</span>
            <span className="text-slate-400">TRANSFER PROGRESS: {progressPct}%</span>
            <span className="text-amber-300 font-semibold">{activeMission?.target?.toUpperCase()} ARRIVAL</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3 relative">
            <div
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Timeline Phase Checkpoints */}
          <div className="grid grid-cols-4 gap-2 text-[10px] font-mono">
            {FLIGHT_PHASES.map((p, idx) => {
              const isPast = idx < currentPhaseIndex;
              const isCurrent = idx === currentPhaseIndex;

              return (
                <div
                  key={p.id}
                  className={`p-1.5 rounded text-center border ${
                    isCurrent
                      ? 'border-sky-400 bg-sky-950/60 text-sky-200 font-bold'
                      : isPast
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400'
                      : 'border-slate-800 bg-slate-950/40 text-slate-500'
                  }`}
                >
                  <div className="truncate">{p.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Dashboard: Telemetry & Time Advance Controls */}
      <div className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none">
        <div className="hud-panel p-4 rounded-xl border border-sky-500/30 flex flex-wrap items-center justify-between gap-4">
          {/* Telemetry Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            <div className="bg-slate-950/70 p-2.5 rounded border border-sky-500/20 font-mono">
              <span className="text-[10px] text-slate-400 block">MISSION CLOCK</span>
              <span className="text-white font-orbitron font-bold text-base">
                T+{travelState.daysElapsed} <span className="text-xs font-normal text-slate-400">DAYS</span>
              </span>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded border border-sky-500/20 font-mono">
              <span className="text-[10px] text-slate-400 block">DISTANCE TRAVERSED</span>
              <span className="text-sky-300 font-orbitron font-bold text-base">
                {(travelState.distanceCoveredKm / 1e6).toFixed(2)}M <span className="text-xs font-normal text-slate-400">KM</span>
              </span>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded border border-sky-500/20 font-mono">
              <span className="text-[10px] text-slate-400 block">REMAINING FUEL</span>
              <span className="text-amber-300 font-orbitron font-bold text-base">
                {travelState.fuelRemainingKg} <span className="text-xs font-normal text-slate-400">KG</span>
              </span>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded border border-sky-500/20 font-mono">
              <span className="text-[10px] text-slate-400 block">SCIENCE BONUS</span>
              <span className="text-emerald-400 font-orbitron font-bold text-base">
                +{accumulatedScience} <span className="text-xs font-normal text-slate-400">PTS</span>
              </span>
            </div>
          </div>

          {/* Time Advance Button */}
          <div className="pointer-events-auto">
            <button
              onClick={handleAdvancePhase}
              disabled={isWarping || activeEvent !== null}
              className="btn-aerospace py-3 px-6 rounded-lg text-xs sm:text-sm flex items-center gap-2.5 min-w-[200px] justify-center"
            >
              {isWarping ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                  <span>WARPING TRAJECTORY...</span>
                </>
              ) : currentPhaseIndex >= FLIGHT_PHASES.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>ENTER DESTINATION ORBIT ➔</span>
                </>
              ) : (
                <>
                  <FastForward className="w-4 h-4 text-sky-300" />
                  <span>ADVANCE FLIGHT PHASE ➔</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Screen I: Mission Event Decision Modal */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="hud-panel p-6 sm:p-8 rounded-2xl max-w-2xl w-full border border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative hud-bracket">
            {/* Alert Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-amber-400 tracking-widest uppercase font-bold">
                    IN-FLIGHT TELEMETRY ANOMALY // PRIORITY EVENT
                  </div>
                  <h3 className="font-orbitron font-extrabold text-xl text-white">
                    {activeEvent.title}
                  </h3>
                </div>
              </div>

              <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                SEVERITY: {activeEvent.severity}
              </span>
            </div>

            {/* Problem Description */}
            <p className="text-sm text-slate-200 mb-4 leading-relaxed">
              {activeEvent.description}
            </p>

            {/* Context Data */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-amber-500/20 mb-6 grid grid-cols-2 gap-2 text-xs font-mono">
              {Object.entries(activeEvent.contextData).map(([k, v]) => (
                <div key={k}>
                  <span className="text-slate-400 uppercase text-[10px] block">{k}:</span>
                  <span className="text-amber-300 font-semibold">{v}</span>
                </div>
              ))}
            </div>

            {/* Response Options */}
            <div className="space-y-3">
              <div className="font-mono text-xs text-sky-400 uppercase tracking-wider font-semibold">
                SELECT FLIGHT CONTROLLER DIRECTIVE:
              </div>

              {activeEvent.choices.map((choice) => {
                const isPossible = !choice.requiresCheck || choice.requiresCheck({ components: stats.components });

                return (
                  <button
                    key={choice.id}
                    disabled={!isPossible}
                    onClick={() => handleEventChoice(choice)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isPossible
                        ? 'border-sky-500/30 hover:border-sky-400 hover:bg-slate-900/80 bg-slate-950/70 group'
                        : 'border-slate-800 bg-slate-950/30 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-orbitron text-xs sm:text-sm font-bold text-white group-hover:text-sky-300">
                        {choice.label}
                      </span>
                      <span className="font-mono text-[11px] text-amber-400">
                        {choice.costDescription}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {choice.description}
                    </p>
                    {!isPossible && (
                      <span className="font-mono text-[10px] text-rose-400 block mt-1">
                        REQUIRES SPECIFIC COMPONENT HARDWARE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

