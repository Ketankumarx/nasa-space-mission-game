// Modern Rules & Flight Directive Modal for Project Orbital
import React from 'react';
import { sound } from '../../utils/soundEngine';
import { X, Play, Compass, Cpu, Rocket, ShieldAlert, Award, Grid, CheckCircle2 } from 'lucide-react';

export default function InstructionsModal({ isOpen, onClose, onStartMission }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-sans">
      <div className="hud-panel w-full max-w-2xl rounded-2xl border border-sky-500/50 p-6 sm:p-8 shadow-[0_0_60px_rgba(56,189,248,0.3)] relative hud-bracket flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-sky-500/25">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-500/20 border border-sky-400 text-sky-400">
              <Rocket className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest font-bold">
                NASA FLIGHT DIRECTIVE // MISSION INSTRUCTIONS
              </div>
              <h2 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white">
                HOW TO PLAY ORBITAL
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Compact Visual Rules / Stages */}
        <div className="space-y-3 mb-6">
          {/* Rule 1: Destination & Spacecraft Design */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-sky-500/20 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 flex-shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-orbitron text-xs font-bold text-sky-200">
                1. SELECT DESTINATION & CONFIGURE CRAFT
              </div>
              <div className="text-xs text-slate-300 font-sans mt-0.5">
                Pick your target world (Moon, Mars, Europa, Asteroid). Drag scientific instruments onto your 3D spacecraft. Keep mass, power, and budget within green safety limits.
              </div>
            </div>
          </div>

          {/* Rule 2: Launch & Third-Person Flight */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-sky-500/20 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0 mt-0.5">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <div className="font-orbitron text-xs font-bold text-emerald-300">
                2. LAUNCH & 3D SPACE FLIGHT
              </div>
              <div className="text-xs text-slate-300 font-sans mt-0.5">
                Experience a cinematic multi-stage liftoff. Fly your spacecraft in third-person: <span className="font-mono text-emerald-300 font-bold">[W]</span> Thrust, <span className="font-mono text-emerald-300 font-bold">[A/D]</span> Bank/Turn, <span className="font-mono text-emerald-300 font-bold">[Shift]</span> Boost, <span className="font-mono text-emerald-300 font-bold">[Space]</span> Brake.
              </div>
            </div>
          </div>

          {/* Rule 3: Asteroids & Precision Landing */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-sky-500/20 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="font-orbitron text-xs font-bold text-amber-300">
                3. ASTEROID EVASION & PLANETARY LANDING
              </div>
              <div className="text-xs text-slate-300 font-sans mt-0.5">
                Dodge tumbling asteroid swarms and collect energy crystals. Control descent speed under gravity to land gently <span className="font-mono text-amber-300 font-bold">(&lt; 6.0 m/s)</span> inside the crater target pad.
              </div>
            </div>
          </div>

          {/* Rule 4: Surface Rover Exploration */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-sky-500/20 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 flex-shrink-0 mt-0.5">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <div className="font-orbitron text-xs font-bold text-purple-300">
                4. MARS ROVER EXPLORATION
              </div>
              <div className="text-xs text-slate-300 font-sans mt-0.5">
                Drive the 6-wheel rover across red Martian dunes. Press <span className="font-mono text-purple-300 font-bold">[E]</span> to drill 4 geological sample cores and secure an exemplary NASA A+ rating!
              </div>
            </div>
          </div>
        </div>

        {/* Quick Controls Cheat-Sheet */}
        <div className="bg-sky-950/50 p-2.5 rounded-xl border border-sky-500/30 mb-6 flex flex-wrap items-center justify-between text-[11px] font-mono text-sky-200">
          <span>FLIGHT: [W/S] SPEED | [A/D] YAW | [SHIFT] BOOST | [SPACE] BRAKE</span>
          <span>ROVER: [WASD] DRIVE | [E] DRILL</span>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-sky-500/20">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            DISMISS
          </button>

          <button
            onClick={() => {
              sound.playClick();
              if (onStartMission) onStartMission();
              onClose();
            }}
            className="btn-aerospace py-3 px-8 rounded-xl text-xs sm:text-sm font-orbitron flex items-center gap-2.5 shadow-[0_0_25px_rgba(56,189,248,0.4)]"
          >
            <Play className="w-4 h-4 text-sky-300 fill-current" />
            <span>START MISSION</span>
          </button>
        </div>
      </div>
    </div>
  );
}

