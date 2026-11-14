// Real & simplified aerospace engineering equations for Project Orbital
import { BASE_BUS } from '../data/components.js';

export function calculateSpacecraftStats(selectedComponentIds, allComponents, activeMission, selectedLaunchVehicle) {
  // Flatten component catalog for easy lookup
  const compMap = new Map();
  Object.values(allComponents).flat().forEach(c => compMap.set(c.id, c));

  const components = selectedComponentIds.map(id => compMap.get(id)).filter(Boolean);

  // 1. Mass calculation
  const busDryMass = BASE_BUS.mass;
  const componentsDryMass = components.reduce((sum, c) => sum + (c.mass || 0), 0);
  const dryMass = busDryMass + componentsDryMass;

  // Propellant calculation from propulsion systems
  const propulsionComp = components.find(c => c.category === 'propulsion');
  const fuelMass = propulsionComp ? (propulsionComp.fuelCapacityKg || 0) : 0;
  const wetMass = dryMass + fuelMass;

  // 2. Cost calculation
  const busCost = BASE_BUS.cost;
  const componentsCost = components.reduce((sum, c) => sum + (c.cost || 0), 0);
  const spacecraftCost = busCost + componentsCost;
  const launchCost = selectedLaunchVehicle ? selectedLaunchVehicle.cost : 0;
  const totalCost = spacecraftCost + launchCost;

  const missionBudget = activeMission ? activeMission.budget : 500;
  const remainingBudget = missionBudget - totalCost;

  // 3. Delta-V (Rocket Equation)
  let deltaV = 0;
  if (propulsionComp && dryMass > 0 && wetMass > dryMass) {
    const g0 = 9.80665; // m/s^2
    const isp = propulsionComp.isp || 300;
    deltaV = Math.round(isp * g0 * Math.log(wetMass / dryMass));
    
    // Launch vehicle bonus insertion energy (e.g. Nova SuperHeavy)
    if (selectedLaunchVehicle && selectedLaunchVehicle.id === 'lv_superheavy') {
      deltaV += 400; // Boosted direct injection
    }
  }

  // 4. Power balance (Earth vs Target)
  const basePowerDraw = BASE_BUS.basePowerDraw;
  const componentsPowerDraw = components.reduce((sum, c) => sum + (c.powerDraw || 0), 0);
  const totalPowerDraw = basePowerDraw + componentsPowerDraw;

  const totalPowerGenAtEarth = components.reduce((sum, c) => sum + (c.powerGen || 0), 0);
  const fluxFactor = activeMission ? activeMission.solarFluxFactor : 1.0;
  const totalPowerGenAtTarget = Math.round(totalPowerGenAtEarth * fluxFactor);

  const netPowerAtEarth = totalPowerGenAtEarth - totalPowerDraw;
  const netPowerAtTarget = totalPowerGenAtTarget - totalPowerDraw;

  // Battery storage
  const batteryStorageWh = components.reduce((sum, c) => sum + (c.capacityWattHours || 0), 0);

  // 5. Communication Range
  const commComp = components.find(c => c.category === 'communication');
  const maxCommRangeKm = commComp ? commComp.maxRangeKm : 0;
  const targetDistanceKm = activeMission ? activeMission.targetDistanceKm : 384400;
  const hasSufficientCommRange = maxCommRangeKm >= targetDistanceKm;

  // 6. Thermal and Radiation Shielding
  const thermalRating = components.reduce((sum, c) => sum + (c.thermalShielding || 0), 0);
  const radiationRating = components.reduce((sum, c) => sum + (c.radiationShielding || 0), 0);

  // 7. System Reliability
  let reliabilityScore = BASE_BUS.baseReliability;
  if (components.length > 0) {
    const avgCompRel = components.reduce((sum, c) => sum + (c.reliability || 90), 0) / components.length;
    reliabilityScore = (reliabilityScore * 0.4) + (avgCompRel * 0.6);
  }
  // Shielding bonus
  if (thermalRating > 50) reliabilityScore += 2;
  if (radiationRating > 50) reliabilityScore += 2;
  reliabilityScore = Math.min(99, Math.round(reliabilityScore));

  // 8. Payload constraints vs Launch Vehicle
  const maxPayloadCapacity = selectedLaunchVehicle ? selectedLaunchVehicle.payloadCapacityKg : 0;
  const payloadMassMargin = selectedLaunchVehicle ? (maxPayloadCapacity - wetMass) : 0;
  const isPayloadCompatible = payloadMassMargin >= 0;

  // 9. Science potential from instruments
  const instruments = components.filter(c => c.category === 'instruments');
  const totalScienceValue = instruments.reduce((sum, c) => sum + (c.scienceValue || 0), 0);

  // 10. Warnings and Issues list
  const warnings = [];
  const blockers = [];

  // Required subsystems check
  if (!propulsionComp) {
    blockers.push('Missing Propulsion System: Spacecraft cannot maneuver or achieve orbit insertion.');
  }
  if (totalPowerGenAtEarth <= 0) {
    blockers.push('Missing Power Generation: Spacecraft will experience immediate electrical shutdown.');
  }
  if (batteryStorageWh <= 0) {
    warnings.push('No Battery Storage: Spacecraft operations will fail completely during eclipse periods.');
  }
  if (!commComp) {
    blockers.push('Missing Communication Antenna: Cannot receive commands or transmit scientific discoveries.');
  } else if (!hasSufficientCommRange) {
    warnings.push(`Weak Antenna Range: Antenna maximum range (${(maxCommRangeKm / 1e6).toFixed(1)}M km) is below destination distance (${(targetDistanceKm / 1e6).toFixed(1)}M km). Downlink will suffer severe data degradation.`);
  }

  const navComp = components.find(c => c.category === 'navigation');
  if (!navComp) {
    blockers.push('Missing Guidance / Navigation System: Autonomous attitude lock and trajectory tracking impossible.');
  }

  // Budget checks
  if (remainingBudget < 0) {
    blockers.push(`Budget Exceeded: Over mission budget by $${Math.abs(remainingBudget)}M USD.`);
  }

  // Mass vs Rocket check
  if (selectedLaunchVehicle && !isPayloadCompatible) {
    blockers.push(`Payload Overweight: Wet mass (${wetMass} kg) exceeds ${selectedLaunchVehicle.name} capacity (${maxPayloadCapacity} kg) by ${Math.abs(payloadMassMargin)} kg.`);
  }

  // Delta-V check
  const requiredDeltaV = activeMission ? activeMission.requiredDeltaV : 3900;
  if (deltaV < requiredDeltaV) {
    warnings.push(`Insufficient Delta-V: Current capability (${deltaV} m/s) is below required mission Delta-V (${requiredDeltaV} m/s). Risk of missing orbit capture.`);
  }

  // Power deficit check
  if (netPowerAtTarget < 0) {
    warnings.push(`Power Deficit at Destination: Power draw (${totalPowerDraw}W) exceeds solar generation (${totalPowerGenAtTarget}W at ${activeMission?.target || 'target'}). Batteries will deplete!`);
  }

  // Instrument check for primary objectives
  if (activeMission && activeMission.objectives) {
    activeMission.objectives.primary.forEach(obj => {
      if (obj.requiredInstrument) {
        const hasInst = components.some(c => c.shortKey === obj.requiredInstrument);
        if (!hasInst) {
          warnings.push(`Objective Risk: Missing required instrument for primary objective: "${obj.text}"`);
        }
      }
    });
  }

  return {
    dryMass,
    fuelMass,
    wetMass,
    spacecraftCost,
    launchCost,
    totalCost,
    remainingBudget,
    deltaV,
    requiredDeltaV,
    totalPowerDraw,
    totalPowerGenAtEarth,
    totalPowerGenAtTarget,
    netPowerAtEarth,
    netPowerAtTarget,
    batteryStorageWh,
    maxCommRangeKm,
    hasSufficientCommRange,
    thermalRating,
    radiationRating,
    reliabilityScore,
    maxPayloadCapacity,
    payloadMassMargin,
    isPayloadCompatible,
    totalScienceValue,
    warnings,
    blockers,
    canLaunch: blockers.length === 0 && selectedLaunchVehicle !== null,
    components
  };
}

