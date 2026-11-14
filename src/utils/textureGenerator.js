// Procedural Texture Generator for Three.js
// Generates high-res planetary, starfield, solar cell and foil textures dynamically
import * as THREE from 'three';

// 1. Procedural Earth Texture
export function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep Ocean Blue Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#0f316b');
  grad.addColorStop(0.5, '#0b2452');
  grad.addColorStop(1, '#081a3d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Continents (simplified landmass silhouettes)
  ctx.fillStyle = '#1e5f38';
  // North America & Eurasia land shapes
  ctx.beginPath();
  // Eurasia / Africa
  ctx.arc(600, 200, 140, 0, Math.PI * 2);
  ctx.arc(580, 290, 90, 0, Math.PI * 2); // Africa
  ctx.arc(750, 180, 110, 0, Math.PI * 2); // East Asia
  // Americas
  ctx.arc(260, 180, 100, 0, Math.PI * 2); // North America
  ctx.arc(320, 340, 80, 0, Math.PI * 2); // South America
  ctx.arc(820, 360, 60, 0, Math.PI * 2); // Australia
  ctx.fill();

  // Coastline highlights and desert regions
  ctx.fillStyle = '#b49f69';
  ctx.beginPath();
  ctx.arc(570, 250, 60, 0, Math.PI * 2); // Sahara
  ctx.arc(680, 210, 50, 0, Math.PI * 2); // Middle East
  ctx.fill();

  // Polar ice caps
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 35);
  ctx.fillRect(0, 480, 1024, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Procedural Cloud Texture
export function createCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  // Cloud bands
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = 80 + Math.random() * 350;
    const r = 25 + Math.random() * 60;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 3. Procedural Moon Texture
export function createMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Lunar Gray Base
  ctx.fillStyle = '#8c929d';
  ctx.fillRect(0, 0, 1024, 512);

  // Lunar Maria (Dark Basalt Plains)
  ctx.fillStyle = '#565c66';
  const maria = [
    { x: 300, y: 200, r: 120 },
    { x: 420, y: 180, r: 90 },
    { x: 250, y: 320, r: 80 },
    { x: 600, y: 220, r: 100 },
    { x: 480, y: 300, r: 70 }
  ];
  maria.forEach(m => {
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Impact Craters with Rays
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 3 + Math.random() * 15;

    // Crater rim highlight
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();

    // Crater pit shadow
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(x - 1, y, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 4. Procedural Mars Texture
export function createMarsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Martian Rust Orange Base
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#c2410c');
  grad.addColorStop(0.5, '#ea580c');
  grad.addColorStop(1, '#9a3412');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Dark Basalt Lowlands (Syrtis Major, Acidalia Planitia)
  ctx.fillStyle = '#7c2d12';
  for (let i = 0; i < 35; i++) {
    const x = Math.random() * 1024;
    const y = 100 + Math.random() * 320;
    const r = 30 + Math.random() * 90;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Valles Marineris canyon rift
  ctx.strokeStyle = '#431407';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(320, 260);
  ctx.bezierCurveTo(420, 275, 520, 255, 620, 270);
  ctx.stroke();

  // Olympus Mons & Tharsis Volcanoes
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(280, 220, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#431407';
  ctx.beginPath();
  ctx.arc(280, 220, 8, 0, Math.PI * 2); // caldera
  ctx.fill();

  // Polar Ice Caps (CO2 Dry Ice)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 30);
  ctx.fillRect(0, 485, 1024, 27);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 5. Procedural Asteroid Texture
export function createAsteroidTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#4b5563';
  ctx.fillRect(0, 0, 512, 256);

  // Dark carbonaceous / metallic regolith noise
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const shade = Math.floor(40 + Math.random() * 80);
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Boulders and craters
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = 2 + Math.random() * 12;
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 6. Solar Panel Grid Texture
export function createSolarPanelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Deep Navy Solar Cell
  ctx.fillStyle = '#0a1d37';
  ctx.fillRect(0, 0, 256, 256);

  // Solar cell grid lines
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  const cols = 8;
  const rows = 8;
  const cw = 256 / cols;
  const ch = 256 / rows;

  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cw, 0);
    ctx.lineTo(c * cw, 256);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * ch);
    ctx.lineTo(256, r * ch);
    ctx.stroke();
  }

  // Busbar conductors
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let c = 0; c < cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cw + cw / 2, 0);
    ctx.lineTo(c * cw + cw / 2, 256);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  return texture;
}

// 7. Gold Foil MLI Texture
export function createGoldFoilTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#d97706');
  grad.addColorStop(0.3, '#f59e0b');
  grad.addColorStop(0.5, '#fbbf24');
  grad.addColorStop(0.8, '#d97706');
  grad.addColorStop(1, '#92400e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Wrinkle bumps
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 256, Math.random() * 256);
    ctx.lineTo(Math.random() * 256, Math.random() * 256);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 8. Procedural Europa (Ice Moon) Texture
export function createEuropaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Pale icy crust
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#e2e8f0');
  grad.addColorStop(0.5, '#f8fafc');
  grad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Reddish-brown fracture bands (Lineae)
  ctx.strokeStyle = '#9a3412';
  ctx.lineWidth = 3;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 1024, Math.random() * 512);
    ctx.bezierCurveTo(
      Math.random() * 1024, Math.random() * 512,
      Math.random() * 1024, Math.random() * 512,
      Math.random() * 1024, Math.random() * 512
    );
    ctx.stroke();
  }

  // Thinner criss-cross fractures
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 1024, Math.random() * 512);
    ctx.lineTo(Math.random() * 1024, Math.random() * 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}


