// Modern Video Game HUD Overlay for Spaceflight and Exploration
import React from 'react';
import { Shield, Fuel, Gauge, Compass, AlertTriangle, Play, RotateCcw, Home, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/soundEngine';

export default function GameHUD({
  health = 100,
  maxHealth = 100,
  fuel = 100,
  maxFuel = 100,
  boost = 100,
  speed = 0,
  objective = 'NAVIGATE TO DESTINATION',
  objectiveProgress = '',
  distance = 0,
  warning = null,
  isPaused = false,
  onTogglePause,
  onRestart,
  onReturnToMenu,
  onOpenInstructions,
  isGameOver = false,
  isVictory = false,
  onNextLevel,
  gameStats = null,
  isMuted = false,
  onToggleMute,
  controlsHint = '[W] THRUST  [S] REVERSE  [A/D] YAW  [SHIFT] BOOST  [SPACE] BRAKE'
}) {
  const healthPct = Math.max(0, Math.min(100, (health / maxHealth) * 100));
  const fuelPct = Math.max(0, Math.min(100, (fuel / maxFuel) * 100));

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 font-sans">
      {/* 1. TOP-LEFT: STATUS GAUGES (Hull, Fuel, Boost) */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-auto">
        {/* Hull Health */}
        <div className="bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-lg border border-sky-500/30 flex items-center gap-2.5 min-w-[200px]">
          <Shield className={`w-4 h-4 ${healthPct > 50 ? 'text-emerald-400' : healthPct > 25 ? 'text-amber-400' : 'text-rose-500 animate-pulse'}`} />
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400 font-bold">HULL INTEGRITY</span>
              <span className={healthPct > 50 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {Math.round(healthPct)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  healthPct > 50 ? 'bg-emerald-400' : healthPct > 25 ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{ width: `${healthPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Propellant / Battery */}
        <div className="bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-lg border border-sky-500/30 flex items-center gap-2.5 min-w-[200px]">
          <Fuel className={`w-4 h-4 ${fuelPct > 25 ? 'text-sky-400' : 'text-amber-400 animate-ping'}`} />
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400 font-bold">PROPELLANT RESERVE</span>
              <span className={fuelPct > 25 ? 'text-sky-300 font-bold' : 'text-amber-400 font-bold'}>
                {Math.round(fuelPct)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${fuelPct > 25 ? 'bg-sky-400' : 'bg-amber-400'}`}
                style={{ width: `${fuelPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Boost Energy Bar */}
        <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-500/20 flex items-center gap-2 min-w-[200px]">
          <span className="font-mono text-[9px] text-amber-300 font-bold">BOOST</span>
          <div className="flex-1 bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-100"
              style={{ width: `${boost}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. TOP-CENTER: OBJECTIVE PILL & WARNING */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 max-w-md w-full px-4">
        {/* Mission Objective */}
        <div className="bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-full border border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.25)] flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs text-sky-200 font-bold uppercase tracking-wider">
            {objective}
          </span>
          {objectiveProgress && (
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-900/60 text-sky-300 border border-sky-400/40 font-bold">
              {objectiveProgress}
            </span>
          )}
        </div>

        {/* Proximity / Collision Hazard Warning */}
        {warning && (
          <div className="bg-rose-950/90 border border-rose-500 px-4 py-1.5 rounded-md text-xs font-mono font-bold text-rose-200 flex items-center gap-2 animate-bounce shadow-[0_0_25px_rgba(239,68,68,0.5)]">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{warning}</span>
          </div>
        )}
      </div>

      {/* 3. TOP-RIGHT: SPEEDOMETER, DISTANCE & PAUSE BUTTON */}
      <div className="absolute top-4 right-4 flex items-center gap-3 pointer-events-auto">
        {/* Speedometer */}
        <div className="bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-sky-500/30 text-right">
          <div className="font-mono text-[9px] text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1">
            <Gauge className="w-3 h-3 text-sky-400" /> VELOCITY
          </div>
          <div className="font-orbitron font-bold text-lg text-emerald-400 leading-none mt-1">
            {Math.round(speed)} <span className="text-[10px] font-mono text-slate-400">M/S</span>
          </div>
        </div>

        {/* Waypoint Distance */}
        {distance > 0 && (
          <div className="bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-sky-500/30 text-right">
            <div className="font-mono text-[9px] text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1">
              <Compass className="w-3 h-3 text-amber-400" /> WAYPOINT
            </div>
            <div className="font-orbitron font-bold text-lg text-sky-300 leading-none mt-1">
              {Math.round(distance)} <span className="text-[10px] font-mono text-slate-400">M</span>
            </div>
          </div>
        )}

        {/* Instructions / Rules Button */}
        {onOpenInstructions && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenInstructions();
            }}
            className="bg-slate-950/80 px-2.5 py-2 rounded-lg border border-sky-500/30 text-xs font-mono font-bold text-sky-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
            title="Flight Rules & Controls"
          >
            <span>RULES</span>
          </button>
        )}

        {/* Audio Mute Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            if (onToggleMute) onToggleMute();
          }}
          className="bg-slate-950/80 p-2.5 rounded-lg border border-sky-500/30 text-slate-300 hover:text-white transition-colors"
          title="Toggle Audio"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
        </button>

        {/* Pause Button */}
        <button
          onClick={() => {
            sound.playClick();
            if (onTogglePause) onTogglePause();
          }}
          className="bg-slate-950/80 px-3 py-2 rounded-lg border border-sky-500/30 text-xs font-mono font-bold text-sky-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          ESC
        </button>
      </div>

      {/* 4. CENTER RETICLE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-6 h-6 border border-sky-400 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-sky-300 rounded-full" />
        </div>
      </div>

      {/* 5. BOTTOM-LEFT: COMPACT CONTROLS HINT */}
      <div className="absolute bottom-4 left-4 bg-slate-950/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-sky-500/20 text-[10px] font-mono text-slate-400 pointer-events-none">
        {controlsHint}
      </div>

      {/* 6. PAUSE MENU OVERLAY */}
      {isPaused && !isGameOver && !isVictory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
          <div className="hud-panel p-6 sm:p-8 rounded-2xl max-w-sm w-full border border-sky-500/40 text-center space-y-4 hud-bracket">
            <div className="font-mono text-xs text-sky-400 uppercase tracking-widest">
              SIMULATION PAUSED
            </div>
            <h3 className="font-orbitron font-bold text-2xl text-white">
              MISSION HOLD
            </h3>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onTogglePause();
                }}
                className="btn-aerospace w-full py-3 rounded-lg text-xs font-orbitron flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>RESUME FLIGHT</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onRestart();
                }}
                className="hud-panel w-full py-2.5 rounded-lg text-xs font-mono text-slate-200 hover:text-white border border-sky-500/30 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RESTART LEVEL</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onReturnToMenu();
                }}
                className="hud-panel w-full py-2.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white border border-sky-500/20 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>ABORT TO MAIN MENU</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. GAME OVER MODAL (Failed Mission) */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
          <div className="hud-panel p-6 sm:p-8 rounded-2xl max-w-md w-full border border-rose-500/60 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>

            <div className="font-mono text-xs text-rose-400 uppercase tracking-widest font-bold">
              CRITICAL HARDWARE FAILURE
            </div>
            <h3 className="font-orbitron font-extrabold text-2xl text-white">
              MISSION ABORTED
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {health <= 0
                ? 'Catastrophic hull breach sustained due to high-velocity impact with space debris.'
                : 'Spacecraft propellant tanks depleted. Orbit maintenance lost.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onRestart();
                }}
                className="btn-aerospace-danger flex-1 py-3 rounded-lg text-xs font-orbitron flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETRY FLIGHT</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onReturnToMenu();
                }}
                className="hud-panel flex-1 py-3 rounded-lg text-xs font-mono text-slate-300 hover:text-white border border-sky-500/20"
              >
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. LEVEL CLEAR / VICTORY MODAL */}
      {isVictory && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
          <div className="hud-panel p-6 sm:p-8 rounded-2xl max-w-md w-full border border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.3)] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold">
              PHASE OBJECTIVES COMPLETE
            </div>
            <h3 className="font-orbitron font-extrabold text-2xl text-white">
              VICTORY ACHIEVED!
            </h3>

            {gameStats && (
              <div className="bg-slate-950/80 p-3 rounded-lg border border-sky-500/20 grid grid-cols-2 gap-2 font-mono text-xs">
                {Object.entries(gameStats).map(([k, v]) => (
                  <div key={k} className="text-left">
                    <span className="text-slate-400 text-[10px] uppercase block">{k}:</span>
                    <span className="text-sky-300 font-bold">{v}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onNextLevel();
                }}
                className="btn-aerospace flex-1 py-3.5 rounded-lg text-xs font-orbitron flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>PROCEED TO NEXT PHASE ➔</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

