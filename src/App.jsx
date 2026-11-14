// Project Orbital — 3D Space Mission Strategy & Flight Simulator
import React, { useState, useEffect } from 'react';
import { MISSIONS } from './data/missions';
import { COMPONENTS } from './data/components';
import { LAUNCH_VEHICLES } from './data/launchVehicles';
import { calculateSpacecraftStats } from './utils/simulationPhysics';
import { sound } from './utils/soundEngine';

// Screens & 3D Interactive Environments
import MainMenu from './components/ui/MainMenu';
import PlanetSelectScene, { PLANETS_CATALOG } from './components/strategy/PlanetSelectScene';
import SpacecraftCustomizer3D from './components/strategy/SpacecraftCustomizer3D';
import LaunchScene from './components/3d/LaunchScene';
import MissionOutcomeCinematic from './components/strategy/MissionOutcomeCinematic';

// Action Gameplay Levels
import SpaceFlightGame from './components/gameplay/SpaceFlightGame';
import AsteroidFieldGame from './components/gameplay/AsteroidFieldGame';
import PlanetaryLandingGame from './components/gameplay/PlanetaryLandingGame';
import MarsRoverGame from './components/gameplay/MarsRoverGame';

// Educational & Credits Modals
import InstructionsModal from './components/modals/InstructionsModal';
import LearnMoreModal from './components/modals/LearnMoreModal';
import TutorialOverlay from './components/modals/TutorialOverlay';
import CreditsModal from './components/modals/CreditsModal';

const STORAGE_KEY = 'orbital_game_save_v3';

export default function App() {
  // Screen State
  const [screen, setScreen] = useState('MAIN_MENU');
  // Screens: MAIN_MENU, PLANET_SELECT, SPACECRAFT_DESIGN, CINEMATIC_LAUNCH, SPACE_FLIGHT, ASTEROID_HAZARD, PLANETARY_LANDING, ROVER_EXPLORATION, MISSION_OUTCOME

  // Active Mission & Target Planet
  const [selectedPlanetId, setSelectedPlanetId] = useState('mars');
  const activePlanet = PLANETS_CATALOG.find(p => p.id === selectedPlanetId) || PLANETS_CATALOG[1];
  const activeMission = MISSIONS.find(m => m.id === selectedPlanetId) || MISSIONS[1];

  // Spacecraft Hardware Modules
  const [selectedComponentIds, setSelectedComponentIds] = useState([
    'prop_chemical',
    'pwr_advanced_solar',
    'stor_battery_advanced',
    'comm_highgain',
    'inst_camera',
    'inst_spectrometer',
    'inst_radar',
    'inst_radiation',
    'prot_radiation',
    'nav_star_tracker'
  ]);

  const selectedVehicle = LAUNCH_VEHICLES[1]; // Titan-Heavy class

  // Campaign State
  const [campaignScore, setCampaignScore] = useState(0);
  const [discoveredSamples, setDiscoveredSamples] = useState([]);
  const [missionOutcome, setMissionOutcome] = useState(null);

  // Audio & Modals
  const [isMuted, setIsMuted] = useState(sound.muted);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // Live Engineering Calculations
  const stats = calculateSpacecraftStats(selectedComponentIds, COMPONENTS, activeMission, selectedVehicle);

  // Load Saved Game
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHasSavedGame(true);
    } catch (e) {}
  }, []);

  // Auto-Save Game State
  useEffect(() => {
    if (screen !== 'MAIN_MENU' && screen !== 'PLANET_SELECT') {
      try {
        const payload = {
          screen,
          selectedPlanetId,
          selectedComponentIds,
          campaignScore,
          discoveredSamples,
          timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setHasSavedGame(true);
      } catch (e) {}
    }
  }, [screen, selectedPlanetId, selectedComponentIds, campaignScore, discoveredSamples]);

  // Restore Saved Mission
  const handleContinueMission = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.selectedPlanetId) setSelectedPlanetId(data.selectedPlanetId);
        if (data.selectedComponentIds) setSelectedComponentIds(data.selectedComponentIds);
        if (data.campaignScore) setCampaignScore(data.campaignScore);
        if (data.discoveredSamples) setDiscoveredSamples(data.discoveredSamples);
        setScreen(data.screen || 'SPACECRAFT_DESIGN');
      }
    } catch (e) {
      setScreen('SPACECRAFT_DESIGN');
    }
  };

  // Start Campaign
  const handleStartCampaign = () => {
    setSelectedPlanetId('mars');
    setCampaignScore(0);
    setDiscoveredSamples([]);
    setMissionOutcome(null);
    setIsInstructionsOpen(true);
  };

  // Jump to specific gameplay stage
  const handlePlayLevel = (levelScreen) => {
    sound.playClick();
    setScreen(levelScreen);
  };

  // Toggle Component from Dock or Drag & Drop
  const handleToggleComponent = (comp, isMultiSelect = false) => {
    const isInstalled = selectedComponentIds.includes(comp.id);
    if (isInstalled) {
      setSelectedComponentIds(prev => prev.filter(id => id !== comp.id));
    } else {
      if (!isMultiSelect) {
        const categoryComps = COMPONENTS[comp.category] || [];
        const existingCatIds = categoryComps.map(c => c.id);
        setSelectedComponentIds(prev => [
          ...prev.filter(id => !existingCatIds.includes(id)),
          comp.id
        ]);
      } else {
        setSelectedComponentIds(prev => [...prev, comp.id]);
      }
    }
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="w-full min-h-screen bg-space-950 text-slate-100 overflow-x-hidden font-sans">
      {/* 1. SCREEN A: CINEMATIC MAIN MENU */}
      {screen === 'MAIN_MENU' && (
        <MainMenu
          onStartCampaign={handleStartCampaign}
          onPlayLevel={handlePlayLevel}
          onContinueMission={handleContinueMission}
          hasSavedGame={hasSavedGame}
          onOpenTutorial={() => setIsInstructionsOpen(true)}
          onOpenLearnMore={() => setIsLearnMoreOpen(true)}
          onOpenCredits={() => setIsCreditsOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 2. 3D DESTINATION PLANET SELECTOR */}
      {screen === 'PLANET_SELECT' && (
        <PlanetSelectScene
          selectedPlanetId={selectedPlanetId}
          onSelectPlanet={setSelectedPlanetId}
          onConfirmDestination={(planet) => {
            setSelectedPlanetId(planet.id);
            setScreen('SPACECRAFT_DESIGN');
          }}
          onBackToMenu={() => setScreen('MAIN_MENU')}
        />
      )}

      {/* 3. 3D SPACECRAFT CUSTOMIZER (DRAG-AND-DROP INSTRUMENTS & LIVE METERS) */}
      {screen === 'SPACECRAFT_DESIGN' && (
        <SpacecraftCustomizer3D
          activePlanet={activePlanet}
          selectedComponentIds={selectedComponentIds}
          onToggleComponent={handleToggleComponent}
          stats={stats}
          onProceedToLaunch={() => setScreen('CINEMATIC_LAUNCH')}
          onBackToPlanetSelect={() => setScreen('PLANET_SELECT')}
        />
      )}

      {/* 4. CINEMATIC 3D LAUNCH */}
      {screen === 'CINEMATIC_LAUNCH' && (
        <LaunchScene
          launchVehicle={selectedVehicle}
          onLaunchComplete={() => {
            setScreen('SPACE_FLIGHT');
          }}
        />
      )}

      {/* 5. PLAYABLE STAGE 1: 3D THIRD-PERSON SPACE FLIGHT */}
      {screen === 'SPACE_FLIGHT' && (
        <SpaceFlightGame
          stats={stats}
          activeMission={activeMission}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenInstructions={() => setIsInstructionsOpen(true)}
          onCompleteFlight={(results) => {
            setCampaignScore(prev => prev + 400);
            setScreen('ASTEROID_HAZARD');
          }}
          onReturnToMenu={() => setScreen('MAIN_MENU')}
        />
      )}

      {/* 6. PLAYABLE STAGE 2: 3D ASTEROID FIELD EVASION */}
      {screen === 'ASTEROID_HAZARD' && (
        <AsteroidFieldGame
          stats={stats}
          activeMission={activeMission}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenInstructions={() => setIsInstructionsOpen(true)}
          onCompleteLevel={(results) => {
            setCampaignScore(prev => prev + (results.score || 500));
            setScreen('PLANETARY_LANDING');
          }}
          onReturnToMenu={() => setScreen('MAIN_MENU')}
        />
      )}

      {/* 7. PLAYABLE STAGE 3: PLANETARY DESCENT LANDING */}
      {screen === 'PLANETARY_LANDING' && (
        <PlanetaryLandingGame
          stats={stats}
          activeMission={activeMission}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenInstructions={() => setIsInstructionsOpen(true)}
          onCompleteLanding={(results) => {
            setCampaignScore(prev => prev + 500);
            setScreen('ROVER_EXPLORATION');
          }}
          onReturnToMenu={() => setScreen('MAIN_MENU')}
        />
      )}

      {/* 8. PLAYABLE STAGE 4: 3D MARS ROVER EXPLORATION */}
      {screen === 'ROVER_EXPLORATION' && (
        <MarsRoverGame
          stats={stats}
          activeMission={activeMission}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenInstructions={() => setIsInstructionsOpen(true)}
          onCompleteRoverExp={(results) => {
            const samples = results.samples || [];
            setDiscoveredSamples(samples);
            setCampaignScore(prev => prev + 600);
            setMissionOutcome({
              success: true,
              score: campaignScore + 600,
              reason: `All 4 geological sample cores extracted from ${activePlanet?.name}. Orbit insertion and rover surface reconnaissance 100% verified.`,
              discoveries: samples.map(s => s.name)
            });
            setScreen('MISSION_OUTCOME');
          }}
          onReturnToMenu={() => setScreen('MAIN_MENU')}
        />
      )}

      {/* 9. CINEMATIC MISSION OUTCOME & PERFORMANCE EVALUATION */}
      {screen === 'MISSION_OUTCOME' && (
        <MissionOutcomeCinematic
          activePlanet={activePlanet}
          stats={stats}
          missionOutcome={missionOutcome}
          onRetry={() => setScreen('SPACECRAFT_DESIGN')}
          onReturnToMenu={() => setScreen('MAIN_MENU')}
        />
      )}

      {/* Flight Directives & Instructions Modal */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        onStartMission={() => {
          setIsInstructionsOpen(false);
          if (screen === 'MAIN_MENU') {
            setScreen('PLANET_SELECT');
          }
        }}
      />

      {/* Educational & Controls Modals */}
      <LearnMoreModal
        isOpen={isLearnMoreOpen}
        onClose={() => setIsLearnMoreOpen(false)}
      />

      <TutorialOverlay
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      <CreditsModal
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
      />
    </div>
  );
}
