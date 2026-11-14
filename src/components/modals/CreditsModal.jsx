// Credits & Technical Architecture Modal for Project Orbital
import React from 'react';
import { sound } from '../../utils/soundEngine';
import { X, Award, Code, Globe, Cpu } from 'lucide-react';

export default function CreditsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-sans">
      <div className="hud-panel w-full max-w-xl rounded-2xl border border-sky-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.25)] relative hud-bracket">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-sky-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 border border-sky-400 text-sky-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest font-bold">
                PROJECT ORBITAL CREDITS & ATTRIBUTION
              </div>
              <h3 className="font-orbitron font-extrabold text-xl text-white">
                SIMULATION ARCHITECTURE
              </h3>
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

        {/* Content */}
        <div className="space-y-4 text-xs font-mono text-slate-300">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-sky-500/20 space-y-2">
            <div className="text-sky-300 font-bold font-orbitron text-sm">DEVELOPED FOR NASA SPACE APPS / HACKATHON</div>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              Project Orbital is an advanced educational 3D space mission simulator demonstrating real aerospace engineering trade-offs, orbital mechanics, power budgets, and scientific remote sensing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-sky-500/20">
              <div className="text-slate-400 text-[10px]">3D GRAPHICS ENGINE</div>
              <div className="text-white font-bold">Three.js WebGL (Procedural Textures & Shaders)</div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-sky-500/20">
              <div className="text-slate-400 text-[10px]">APPLICATION FRAMEWORK</div>
              <div className="text-white font-bold">React 18 & Vite</div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-sky-500/20">
              <div className="text-slate-400 text-[10px]">SOUND DESIGN</div>
              <div className="text-white font-bold">Web Audio API Synthesis Engine</div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-sky-500/20">
              <div className="text-slate-400 text-[10px]">AEROSPACE EQUATIONS</div>
              <div className="text-white font-bold">Tsiolkovsky, Hohmann, Inverse Square Law</div>
            </div>
          </div>

          <div className="pt-2 text-center text-slate-500 text-[11px]">
            &copy; 2026 Project Orbital. Designed for exploration and education.
          </div>
        </div>

        {/* Footer */}
        <div className="pt-5 mt-4 border-t border-sky-500/20 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="btn-aerospace px-6 py-2 rounded-lg text-xs"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

