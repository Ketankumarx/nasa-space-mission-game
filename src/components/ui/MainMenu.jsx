// Screen A: Main Menu with Quick Missions & Campaign Mode
import React, { useState } from 'react';
import EarthOrbitScene from '../3d/EarthOrbitScene';
import { sound } from '../../utils/soundEngine';
import { Rocket, Play, BookOpen, HelpCircle, Volume2, VolumeX, Sparkles, Compass, ShieldAlert, Award, Grid, ChevronRight, X } from 'lucide-react';

export default function MainMenu({
  onStartCampaign,
  onPlayLevel,
  onContinueMission,
  hasSavedGame,
  onOpenTutorial,
  onOpenLearnMore,
  onOpenCredits,
  isMuted,
  onToggleMute
}) {
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-space-950 font-sans select-none">
      {/* 3D Cinematic Earth and Orbiting Satellite */}
      <EarthOrbitScene interactive={true} />

      {/* Subtle CRT Scanline overlay */}
      <div className="crt-overlay absolute inset-0 pointer-events-none" />

      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <Rocket className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="font-orbitron font-extrabold text-sm tracking-widest text-sky-400 flex items-center gap-2">
              <span>NASA SPACE EXPLORATION DIVISION</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="font-mono text-[10px] text-slate-400 tracking-wider">
              ORBITAL FLIGHT SIMULATOR // VER 2.0 GAMEPLAY OVERHAUL
            </div>
          </div>
        </div>

        {/* Audio Mute & Volume */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="hud-panel p-2.5 rounded-lg border border-sky-500/30 text-sky-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Center Hero Content */}
      <main className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-950/70 border border-sky-400/40 text-sky-300 font-mono text-xs tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive 3D Spaceflight & Exploration</span>
        </div>

        {/* Game Title */}
        <h1 className="font-orbitron font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white drop-shadow-2xl text-glow-cyan leading-none">
          ORBITAL
        </h1>

        {/* Tagline */}
        <p className="font-chakra text-lg sm:text-xl md:text-2xl text-sky-200/90 tracking-[0.25em] uppercase font-semibold mt-2 mb-8 max-w-xl">
          Design. Launch. Explore. Discover.
        </p>

        {/* Primary Action Buttons */}
        <div className="pointer-events-auto flex flex-col gap-3 w-full max-w-xs sm:max-w-sm">
          {/* Start Campaign */}
          <button
            onClick={() => {
              sound.playClick();
              onStartCampaign();
            }}
            className="btn-aerospace py-3.5 px-6 rounded-lg text-sm sm:text-base flex items-center justify-center gap-3 group shadow-[0_0_25px_rgba(56,189,248,0.3)]"
          >
            <Play className="w-4 h-4 text-sky-300 group-hover:scale-110 transition-transform fill-current" />
            <span>START FULL MISSION CAMPAIGN</span>
          </button>

          {/* Quick Level Selector (Jump straight into gameplay!) */}
          <button
            onClick={() => {
              sound.playClick();
              setIsLevelSelectOpen(true);
            }}
            className="btn-aerospace-gold py-3 px-6 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
          >
            <Grid className="w-4 h-4 text-amber-300" />
            <span>INSTANT PLAY / LEVEL SELECT</span>
          </button>

          {/* Resume Saved Flight */}
          {hasSavedGame && (
            <button
              onClick={() => {
                sound.playClick();
                onContinueMission();
              }}
              className="hud-panel hover:bg-slate-900/90 text-sky-300 hover:text-white py-2.5 px-6 rounded-lg text-xs font-orbitron tracking-wider flex items-center justify-center gap-2 border border-sky-500/40"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>RESUME SAVED FLIGHT</span>
            </button>
          )}

          {/* Tutorial & Encyclopedia in a clean row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                sound.playClick();
                onOpenTutorial();
              }}
              className="hud-panel p-2.5 rounded-lg text-[11px] font-orbitron text-slate-300 hover:text-white border border-sky-500/20 flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>CONTROLS</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenLearnMore();
              }}
              className="hud-panel p-2.5 rounded-lg text-[11px] font-orbitron text-slate-300 hover:text-white border border-sky-500/20 flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>MANUAL</span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenCredits();
            }}
            className="text-slate-500 hover:text-sky-300 text-[11px] font-mono tracking-wider transition-colors pt-1"
          >
            // CREDITS & SIMULATION ARCHITECTURE
          </button>
        </div>
      </main>

      {/* Instant Level Select Modal */}
      {isLevelSelectOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="hud-panel p-6 sm:p-8 rounded-2xl max-w-lg w-full border border-sky-500/40 shadow-[0_0_50px_rgba(56,189,248,0.25)] space-y-4 relative hud-bracket">
            <div className="flex items-center justify-between pb-3 border-b border-sky-500/20">
              <div>
                <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest font-bold">
                  SIMULATION CHAMBER // DIRECT LEVEL ACCESS
                </div>
                <h3 className="font-orbitron font-extrabold text-xl text-white">
                  SELECT GAMEPLAY MISSION
                </h3>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsLevelSelectOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* 1. Third Person Space Flight */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsLevelSelectOpen(false);
                  onPlayLevel('SPACE_FLIGHT');
                }}
                className="w-full text-left p-3.5 rounded-xl border border-sky-500/30 hover:border-sky-400 hover:bg-slate-900/80 bg-slate-950/70 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-white group-hover:text-sky-300">
                      1. ORBITAL SPACEFLIGHT
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                      Third-person direct flight, boost, and navigation rings
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </button>

              {/* 2. Asteroid Field Navigation */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsLevelSelectOpen(false);
                  onPlayLevel('ASTEROID_HAZARD');
                }}
                className="w-full text-left p-3.5 rounded-xl border border-sky-500/30 hover:border-sky-400 hover:bg-slate-900/80 bg-slate-950/70 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-white group-hover:text-amber-300">
                      2. ASTEROID FIELD EVASION
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                      Dense asteroid hazard course & energy crystal collection
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>

              {/* 3. Planetary Landing Challenge */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsLevelSelectOpen(false);
                  onPlayLevel('PLANETARY_LANDING');
                }}
                className="w-full text-left p-3.5 rounded-xl border border-sky-500/30 hover:border-sky-400 hover:bg-slate-900/80 bg-slate-950/70 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-white group-hover:text-emerald-300">
                      3. PLANETARY DESCENT LANDING
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                      Control descent speed & land safely inside target beacon pad
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>

              {/* 4. Mars Rover Surface Exploration */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsLevelSelectOpen(false);
                  onPlayLevel('ROVER_EXPLORATION');
                }}
                className="w-full text-left p-3.5 rounded-xl border border-sky-500/30 hover:border-sky-400 hover:bg-slate-900/80 bg-slate-950/70 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-white group-hover:text-rose-300">
                      4. MARS ROVER EXPLORATION
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                      Drive 6-wheel rover on Mars terrain & drill scientific samples
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Ticker */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 p-4 hud-panel border-t border-sky-500/20 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pointer-events-none gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>REAL-TIME 3D ASTRODYNAMICS ENGINE: ACTIVE</span>
        </div>
        <div className="text-sky-400 font-semibold">
          CONTROLS: [W/S] THRUST  [A/D] YAW/STEER  [SHIFT] BOOST  [MOUSE] PITCH/CAM
        </div>
      </footer>
    </div>
  );
}
