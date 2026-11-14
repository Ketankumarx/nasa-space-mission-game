// Screen J: Scientific Operations at Destination (Project Orbital)
import React, { useState } from 'react';
import ScienceOperationsScene from '../3d/ScienceOperationsScene';
import { sound } from '../../utils/soundEngine';
import { Camera, Radio, Waves, ShieldAlert, Sparkles, Check, CheckCircle2, Lock, ArrowRight, Award } from 'lucide-react';

export default function ScientificOperations({
  activeMission,
  selectedComponentIds,
  stats,
  travelResults,
  onFinishScienceOps,
  missionLog,
  setMissionLog
}) {
  const [activeScanEffect, setActiveScanEffect] = useState(null);
  const [completedActivities, setCompletedActivities] = useState({});
  const [totalScienceEarned, setTotalScienceEarned] = useState(travelResults?.accumulatedScience || 0);

  // Check which instruments are equipped on spacecraft
  const hasCamera = selectedComponentIds.includes('inst_camera');
  const hasSpectrometer = selectedComponentIds.includes('inst_spectrometer');
  const hasRadar = selectedComponentIds.includes('inst_radar');
  const hasRadiation = selectedComponentIds.includes('inst_radiation');

  const activities = [
    {
      id: 'camera_survey',
      instrumentKey: 'camera',
      name: 'HIGH-RESOLUTION OPTICAL MAPPING',
      icon: Camera,
      equipped: hasCamera,
      rewardPoints: 120,
      description: 'Capture sub-meter stereoscopic photography of craters, valleys, and geological formations.',
      discoveryText: 'Detailed 4K terrain mosaic downlinked. Discovered volcanic lava tubes and stratified impact layers!'
    },
    {
      id: 'spectro_analysis',
      instrumentKey: 'spectrometer',
      name: 'INFRARED & UV SPECTRAL ANALYSIS',
      icon: Waves,
      equipped: hasSpectrometer,
      rewardPoints: 160,
      description: 'Measure absorption spectra to determine surface mineralogy, rare metals, and atmospheric trace gases.',
      discoveryText: 'Spectral peaks confirm high concentration of olivine, titanium-rich basalts, and volatile hydroxyl signatures!'
    },
    {
      id: 'radar_sounding',
      instrumentKey: 'radar',
      name: 'GROUND-PENETRATING RADAR SOUNDING',
      icon: Radio,
      equipped: hasRadar,
      rewardPoints: 150,
      description: 'Emit synthetic aperture radar pulses to penetrate regolith and detect subsurface aquifers and ice sheets.',
      discoveryText: 'Subsurface radar profile reveals clean dielectric boundary at 85m depth: Confirmed massive water-ice deposit!'
    },
    {
      id: 'radiation_field',
      instrumentKey: 'radiation',
      name: 'COSMIC RAY & SOLAR WIND FLUX MAPPING',
      icon: ShieldAlert,
      equipped: hasRadiation,
      rewardPoints: 110,
      description: 'Record galactic cosmic ray dosage and magnetospheric plasma interaction boundaries.',
      discoveryText: 'Telemetry recorded solar energetic proton flux: Generated first comprehensive radiation exposure map for future crewed landings!'
    }
  ];

  const handlePerformActivity = (act) => {
    if (!act.equipped || completedActivities[act.id]) return;

    sound.playScan();
    setActiveScanEffect(act.instrumentKey);

    // After short scan animation
    setTimeout(() => {
      setActiveScanEffect(null);
      setCompletedActivities(prev => ({
        ...prev,
        [act.id]: true
      }));
      setTotalScienceEarned(prev => prev + act.rewardPoints);

      setMissionLog(prev => [
        ...prev,
        `Scientific Milestone [${act.name}]: ${act.discoveryText}`
      ]);
    }, 1800);
  };

  const completedCount = Object.keys(completedActivities).length;
  const equippedCount = activities.filter(a => a.equipped).length;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-space-950 font-sans select-none">
      {/* 3D Orbiting Planet & Scanner Beam Scene */}
      <ScienceOperationsScene
        activeMission={activeMission}
        selectedComponentIds={selectedComponentIds}
        activeScanEffect={activeScanEffect}
      />

      {/* Top Header */}
      <header className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="hud-panel p-3 rounded-lg flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest">
              ORBITAL SCIENCE LABORATORY // {activeMission?.target?.toUpperCase()}
            </div>
            <div className="font-orbitron text-sm md:text-base font-bold text-white">
              PLANETARY RECONNAISSANCE & SENSING BAY
            </div>
          </div>
        </div>

        {/* Science Score Badge */}
        <div className="telemetry-badge bg-slate-950/80 border-amber-500/40 text-amber-300 font-mono text-sm px-4 py-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>TOTAL SCIENCE: {totalScienceEarned} PTS</span>
        </div>
      </header>

      {/* Main Science Instrument Operations Panel (Bottom Left & Center) */}
      <div className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none max-w-5xl mx-auto">
        <div className="hud-panel p-5 rounded-2xl border border-sky-500/40">
          <div className="flex items-center justify-between mb-4 font-mono text-xs">
            <span className="text-sky-300 font-semibold uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>DEPLOY ONBOARD SCIENTIFIC EXPERIMENTS ({completedCount}/{equippedCount} EXECUTED)</span>
            </span>
            <span className="text-slate-400">
              INSTRUMENTS COMPATIBILITY: {equippedCount} OF 4 INSTALLED
            </span>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 pointer-events-auto">
            {activities.map((act) => {
              const isDone = completedActivities[act.id];
              const Icon = act.icon;

              return (
                <div
                  key={act.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    !act.equipped
                      ? 'border-slate-800 bg-slate-950/40 opacity-40'
                      : isDone
                      ? 'border-emerald-500/50 bg-emerald-950/20'
                      : 'border-sky-500/30 bg-slate-950/80 hover:border-sky-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-[10px] text-amber-400 font-bold">
                        +{act.rewardPoints} PTS
                      </span>
                    </div>

                    <h4 className="font-orbitron font-bold text-xs text-white mb-1">
                      {act.name}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                      {isDone ? act.discoveryText : act.description}
                    </p>
                  </div>

                  <div>
                    {!act.equipped ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>HARDWARE NOT EQUIPPED</span>
                      </div>
                    ) : isDone ? (
                      <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>DATA DOWNLINKED</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePerformActivity(act)}
                        disabled={activeScanEffect !== null}
                        className="btn-aerospace w-full py-2 px-3 rounded text-[11px] font-orbitron flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-sky-300" />
                        <span>EXECUTE SCAN</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-sky-500/20 pointer-events-auto">
            <div className="text-xs font-mono text-slate-400">
              MISSION TELEMETRY: ALL OBSERVATIONAL PACKETS BUFFERED IN FLIGHT RECORDER
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onFinishScienceOps(totalScienceEarned);
              }}
              className="btn-aerospace py-3 px-8 rounded-lg text-xs sm:text-sm flex items-center gap-3 ml-auto shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            >
              <span>FINALIZE MISSION & DEBRIEF</span>
              <ArrowRight className="w-4 h-4 text-sky-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

