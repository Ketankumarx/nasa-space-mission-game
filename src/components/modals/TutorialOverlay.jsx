// Interactive Step-by-Step Flight Directive Tutorial for Project Orbital
import React, { useState } from 'react';
import { sound } from '../../utils/soundEngine';
import { X, ArrowRight, ArrowLeft, Check, Compass, Cpu, Rocket, ShieldAlert, Award, Grid } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    step: 1,
    title: 'THIRD-PERSON SPACEFLIGHT',
    subtitle: 'Direct keyboard & mouse flight controls',
    icon: Rocket,
    content:
      'Control your spacecraft directly in full 3D: [W] fires forward thrust, [S] activates reverse braking, [A/D] yaws and banks the ship into turns, [Mouse] guides pitch and heading, [Shift] ignites high-speed afterburner boost, and [Space] acts as a vacuum retro-brake.',
    tip: 'Control: [W] Thrust | [S] Reverse | [A/D] Bank | [Shift] Boost | [Space] Brake | [Mouse] Pitch/Yaw'
  },
  {
    step: 2,
    title: 'ASTEROID FIELD EVASION',
    subtitle: 'Navigating through moving space debris',
    icon: ShieldAlert,
    content:
      'In the asteroid belt, steer through dense drifting boulders. Collect glowing golden Energy Cores to recharge fuel and boost your mission score. Avoid collisions—high-velocity impacts deplete hull integrity!',
    tip: 'Objective: Collect at least 4 energy cores and fly through the green extraction gate at the end of the belt.'
  },
  {
    step: 3,
    title: 'PLANETARY DESCENT LANDING',
    subtitle: 'Precision touchdown inside crater beacons',
    icon: Compass,
    content:
      'Pilot the lander through gravitational descent. Fire thrusters [W / Shift] to slow downward velocity, and use [A/D/S] to cancel lateral drift. You must touch down at under 6.0 m/s inside the green beacon landing pad.',
    tip: 'Warning: Coming down faster than 6.0 m/s or landing off the pad will cause fatal hull breach.'
  },
  {
    step: 4,
    title: 'MARS ROVER EXPLORATION',
    subtitle: 'Drive a 6-wheel rover & drill scientific cores',
    icon: Grid,
    content:
      'On the red Martian surface, drive your rover using [W/S] for throttle and [A/D] to steer. Drag the [Mouse] to inspect your surroundings. Locate 4 geological anomaly sites and press [E] to extend the robotic arm and drill samples.',
    tip: 'Controls: [W/S] Drive | [A/D] Steer | [Mouse Drag] Camera | [E] Deploy Drill when near glowing beacons.'
  },
  {
    step: 5,
    title: 'ENGINEERING CONNECTION',
    subtitle: 'How spacecraft design dictates handling',
    icon: Cpu,
    content:
      'Your design choices directly impact physics: heavier spacecraft have higher inertia and accelerate more slowly. Ion engines provide ultra-smooth high efficiency, while chemical engines provide explosive instant torque. Radiation shields protect avionics from space weather.',
    tip: 'Tip: Balancing mass, fuel capacity, and engine thrust is critical for passing all mission phases.'
  }
];

export default function TutorialOverlay({ isOpen, onClose }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = TUTORIAL_STEPS[currentStepIdx];
  const Icon = currentStep.icon;

  const handleNext = () => {
    sound.playClick();
    if (currentStepIdx < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-sans">
      <div className="hud-panel w-full max-w-2xl rounded-2xl border border-sky-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.25)] relative hud-bracket flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-sky-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-sky-500/20 border border-sky-400 text-sky-400">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest font-bold">
                  STEP {currentStep.step} OF {TUTORIAL_STEPS.length} // PILOT & CONTROLLER MANUAL
                </div>
                <h3 className="font-orbitron font-extrabold text-xl text-white">
                  {currentStep.title}
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

          {/* Subtitle */}
          <div className="text-xs font-mono text-sky-300 font-semibold mb-3">
            // {currentStep.subtitle.toUpperCase()}
          </div>

          {/* Content Description */}
          <p className="text-sm text-slate-200 leading-relaxed mb-5">
            {currentStep.content}
          </p>

          {/* Key Tip Box */}
          <div className="bg-sky-950/60 border border-sky-500/30 p-3.5 rounded-xl mb-6 font-mono text-xs text-sky-200 font-semibold">
            {currentStep.tip}
          </div>

          {/* Step Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {TUTORIAL_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIdx
                    ? 'w-8 bg-sky-400'
                    : idx < currentStepIdx
                    ? 'w-2 bg-emerald-400'
                    : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-sky-500/20">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            DISMISS
          </button>

          <div className="flex items-center gap-3">
            {currentStepIdx > 0 && (
              <button
                onClick={handlePrev}
                className="hud-panel px-4 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>PREVIOUS</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="btn-aerospace px-6 py-2 rounded-lg text-xs font-orbitron flex items-center gap-2"
            >
              <span>{currentStepIdx === TUTORIAL_STEPS.length - 1 ? 'READY TO FLY' : 'NEXT STEP'}</span>
              {currentStepIdx === TUTORIAL_STEPS.length - 1 ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
