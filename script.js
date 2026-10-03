/**
 * Gavinder Singh - Interactive 3D Neural Network Motion Frames & Canvas
 * Features:
 * - Frame scrubbing via Mouse Scroll, Wheel & Keyboard (Arrows, Space)
 * - 3D Perspective Projection Engine (pure HTML5 Canvas, 60 FPS)
 * - Dynamic Telemetry HUD & Stage Annotations
 * - Interactive Terminal Simulator
 * - Web Audio API Synthesizer Feedback
 */

(function () {
  'use strict';

  // --- DOM Elements ---
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  const progressBar = document.getElementById('progressBar');
  const hudPhase = document.getElementById('hudPhase');
  const hudProgress = document.getElementById('hudProgress');
  const hudEpoch = document.getElementById('hudEpoch');
  const hudLoss = document.getElementById('hudLoss');
  const hudAcc = document.getElementById('hudAcc');
  const annotTag = document.getElementById('annotTag');
  const annotTitle = document.getElementById('annotTitle');
  const annotDesc = document.getElementById('annotDesc');
  const frameAnnotation = document.getElementById('frameAnnotation');
  const cursorGlow = document.getElementById('cursorGlow');
  const scroller = document.getElementById('scroller');
  const stageAnnouncer = document.getElementById('stageAnnouncer');
  let lastAnnouncedStageIdx = -1;

  // --- Dimensions & Canvas Sizing ---
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    renderOnce();
  });

  // Prevent browser from restoring scroll to middle on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // --- Reduced Motion Preference Detection ---
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;

  // --- Motion Frames Timeline State ---
  let targetProgress = 0.0;
  let currentProgress = 0.0;
  let autoPlay = false;
  let rotX = 0.15;
  let rotY = 0.0;
  let targetRotX = 0.15;
  let targetRotY = 0.0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let mouseCanvasX = null;
  let mouseCanvasY = null;

  // --- Stages Meta Data ---
  const STAGES = [
    {
      phase: '1 / 4 [RAW UNIVERSE]',
      tag: 'STAGE 01 · THE RAW UNIVERSE',
      title: 'Scattered Data & Noise',
      desc: 'Millions of raw words, sounds, and pixels floating in space — waiting to be given meaning.'
    },
    {
      phase: '2 / 4 [ATTENTION]',
      tag: 'STAGE 02 · MAKING CONNECTIONS',
      title: 'Connecting the Dots',
      desc: 'Like constellations forming in the night sky, attention layers discover hidden relationships between every piece of data.'
    },
    {
      phase: '3 / 4 [GRAVITATIONAL PULL]',
      tag: 'STAGE 03 · THE GRAVITATIONAL PULL',
      title: 'Collapsing the Noise',
      desc: 'Errors fade away. Random noise disappears. The system continuously refines itself until only pure logic remains.'
    },
    {
      phase: '4 / 4 [CONVERGENCE]',
      tag: 'STAGE 04 · SINGULARITY CONVERGENCE',
      title: 'The Intelligence Core',
      desc: 'A universe of chaotic data condensed into a single neural brain — ready to think, speak, and solve real human problems.'
    }
  ];

  // --- 3D Neural Nodes & Layers Model Generation (Curved Bio-Cortex Manifold) ---
  const NUM_INPUT_NODES = 42;
  const NUM_HIDDEN_1 = 34;
  const NUM_HIDDEN_2 = 28;
  const NUM_OUTPUT = 18;
  
  const nodes = [];
  const connections = [];

  function createLayer(count, zPos, spreadX, spreadY, layerType) {
    const layerNodes = [];
    for (let i = 0; i < count; i++) {
      const normIdx = count > 1 ? (i / (count - 1)) - 0.5 : 0; // -0.5 to +0.5
      const arcAngle = normIdx * Math.PI * 0.72; // Cranial arc curve
      const archRadius = 240 - Math.abs(normIdx) * 55;

      // Realistic curved cortex position
      const baseX = Math.sin(arcAngle) * archRadius + (Math.random() - 0.5) * 35;
      const baseY = (normIdx * spreadY) + (Math.random() - 0.5) * 30;
      const baseZ = zPos + Math.cos(arcAngle) * 95 + (Math.random() - 0.5) * 30;

      // Converged core position (for stage 4)
      const ringAngle = (i / count) * Math.PI * 2;
      const coreRadius = 85 + (i % 4) * 28;

      const node = {
        baseX,
        baseY,
        baseZ,
        // Disperse position (for stage 1)
        scatterX: (Math.random() - 0.5) * 1250,
        scatterY: (Math.random() - 0.5) * 900,
        scatterZ: (Math.random() - 0.5) * 850,
        // Converged core position
        coreX: Math.cos(ringAngle) * coreRadius,
        coreY: Math.sin(ringAngle) * coreRadius,
        coreZ: ((i % 5) - 2) * 45,
        layer: layerType,
        pulseOffset: Math.random() * Math.PI * 2,
        flash: 0.0, // Bioluminescent action potential flash
        color: layerType === 0 ? '#38bdf8' : layerType === 1 ? '#818cf8' : layerType === 2 ? '#c084fc' : '#34d399'
      };
      nodes.push(node);
      layerNodes.push(node);
    }
    return layerNodes;
  }

  const l1 = createLayer(NUM_INPUT_NODES, -280, 420, 320, 0);
  const l2 = createLayer(NUM_HIDDEN_1, -90, 360, 270, 1);
  const l3 = createLayer(NUM_HIDDEN_2, 90, 300, 220, 2);
  const l4 = createLayer(NUM_OUTPUT, 270, 200, 170, 3);

  // Connect adjacent layers with curved bezier synapses
  function buildSynapses(sourceLayer, targetLayer, density = 0.24) {
    sourceLayer.forEach(src => {
      targetLayer.forEach(tgt => {
        if (Math.random() < density) {
          connections.push({
            src,
            tgt,
            weight: 0.4 + Math.random() * 0.6,
            pulseSpeed: 1.2 + Math.random() * 2.2,
            curveBend: (Math.random() - 0.5) * 45,
            packetT: Math.random()
          });
        }
      });
    });
  }

  buildSynapses(l1, l2, 0.22);
  buildSynapses(l2, l3, 0.24);
  buildSynapses(l3, l4, 0.32);

  // --- 3D Realistic Cosmic Galaxy (4 Spiral Arms, Volumetric Nebula Gas, Stellar Bulge) ---
  const isMobileTier = window.innerWidth < 768 || (typeof navigator !== 'undefined' && typeof navigator.deviceMemory === 'number' && navigator.deviceMemory < 4);
  const NUM_GALAXY_STARS = isMobileTier ? 180 : 450;
  const galaxyStars = [];
  const NUM_NEBULA_CLOUDS = isMobileTier ? 8 : 18;
  const nebulaClouds = [];

  // 1. Generate Volumetric Cosmic Gas & Dust Clouds
  for (let i = 0; i < NUM_NEBULA_CLOUDS; i++) {
    const armIdx = i % 4;
    const armOffset = armIdx * (Math.PI / 2);
    const radius = 120 + Math.random() * 520;
    const theta = armOffset + radius * 0.003 + (Math.random() - 0.5) * 0.6;
    const phi = (Math.random() - 0.5) * 0.22;

    const x = Math.cos(theta) * Math.cos(phi) * radius;
    const y = Math.sin(phi) * radius * 0.6;
    const z = Math.sin(theta) * Math.cos(phi) * radius;

    const gasColors = [
      { core: 'rgba(56, 189, 248, 0.18)', mid: 'rgba(99, 102, 241, 0.08)', outer: 'transparent' }, // Cyan-Indigo Gas
      { core: 'rgba(217, 70, 239, 0.16)', mid: 'rgba(168, 85, 247, 0.07)', outer: 'transparent' }, // Magenta-Purple H-II
      { core: 'rgba(251, 191, 36, 0.14)', mid: 'rgba(244, 63, 94, 0.06)', outer: 'transparent' }   // Golden-Amber Dust
    ];

    nebulaClouds.push({
      baseX: x,
      baseY: y,
      baseZ: z,
      baseRadius: radius,
      baseTheta: theta,
      basePhi: phi,
      size: 130 + Math.random() * 190,
      orbitSpeed: 0.0002 + Math.random() * 0.0004,
      colors: gasColors[i % gasColors.length]
    });
  }

  // 2. Generate Logarithmic Spiral Stars & Ambient Galaxy
  for (let i = 0; i < NUM_GALAXY_STARS; i++) {
    const isHalo = Math.random() < 0.25;
    let radius, theta, phi, color, glow, baseAlpha, size, hasFlare;

    if (isHalo) {
      // Outer spherical 3D Halo
      radius = 320 + Math.random() * 850;
      theta = Math.random() * Math.PI * 2;
      phi = (Math.random() - 0.5) * Math.PI;
      color = '#ffffff';
      glow = 'rgba(255, 255, 255, 0.35)';
      baseAlpha = 0.5 + Math.random() * 0.4;
      size = 1.0 + Math.random() * 1.4;
      hasFlare = Math.random() < 0.10;
    } else {
      // 4-Arm Logarithmic Spiral Density (Orbiting around the neural cortex)
      const armIdx = i % 4;
      const armOffset = armIdx * (Math.PI / 2);
      radius = 180 + Math.pow(Math.random(), 1.2) * 780;
      theta = armOffset + (radius * 0.0035) + (Math.random() - 0.5) * 0.35;
      phi = (Math.random() - 0.5) * 0.28;

      const roll = Math.random();
      if (roll < 0.45) {
        color = '#00f0ff'; // Hot young cyan stars
        glow = 'rgba(0, 240, 255, 0.45)';
      } else if (roll < 0.75) {
        color = '#f472b6'; // Neon pink/magenta
        glow = 'rgba(244, 114, 182, 0.45)';
      } else if (roll < 0.90) {
        color = '#fbbf24'; // Warm gold
        glow = 'rgba(251, 191, 36, 0.45)';
      } else {
        color = '#ffffff'; // Diamond white
        glow = 'rgba(255, 255, 255, 0.5)';
      }

      baseAlpha = 0.65 + Math.random() * 0.35;
      size = 1.2 + Math.random() * 1.8;
      hasFlare = Math.random() < 0.15;
    }

    const x = Math.cos(theta) * Math.cos(phi) * radius;
    const y = Math.sin(phi) * radius;
    const z = Math.sin(theta) * Math.cos(phi) * radius;

    galaxyStars.push({
      baseRadius: radius,
      baseTheta: theta,
      basePhi: phi,
      baseX: x,
      baseY: y,
      baseZ: z,
      size,
      color,
      glow,
      twinkleSpeed: 1.5 + Math.random() * 3.5,
      twinkleOffset: Math.random() * Math.PI * 2,
      baseAlpha,
      orbitSpeed: 0.0003 + (1 / (radius + 80)) * 0.08, // Differential galactic rotation
      hasFlare
    });
  }

  // --- Controls: Scroll, Wheel & Keyboard Handling ---
  
  // Track scroll position of scroller container
  function updateScrollProgress() {
    const rect = scroller.getBoundingClientRect();
    const totalHeight = scroller.offsetHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalHeight));
    targetProgress = progress;
  }

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    if (!shouldAnimate()) {
      renderOnce();
    }
  }, { passive: true });

  // --- Viewport Scoped Key Handling (1-4 only when sticky viewport has focus) ---
  const stickyViewport = document.querySelector('.sticky-viewport');
  if (stickyViewport) {
    stickyViewport.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const stageIndex = parseInt(e.key, 10) - 1; // 0, 1, 2, 3
        const targetFraction = stageIndex / 3; // 0.0, 0.333, 0.667, 1.0
        const totalHeight = scroller.offsetHeight - window.innerHeight;
        const newScrollTop = scroller.offsetTop + targetFraction * totalHeight;
        window.scrollTo({ top: newScrollTop, behavior: 'smooth' });
      }
    });
  }

  // --- Pause / Play Motion Control ---
  const canvasPauseBtn = document.getElementById('canvasPauseBtn');
  const canvasPauseIcon = document.getElementById('canvasPauseIcon');
  const canvasPauseLabel = document.getElementById('canvasPauseLabel');
  let isUserPaused = false;

  function toggleUserPause() {
    isUserPaused = !isUserPaused;
    autoPlay = false; // stop auto-drive on manual toggle
    if (canvasPauseBtn) {
      canvasPauseBtn.setAttribute('aria-label', isUserPaused ? 'Resume neural animation' : 'Pause neural animation');
      if (canvasPauseIcon) canvasPauseIcon.className = isUserPaused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
      if (canvasPauseLabel) canvasPauseLabel.textContent = isUserPaused ? 'Play Motion' : 'Pause Motion';
    }
    if (isUserPaused) {
      stopIdleLoop();
      renderOnce();
    } else if (shouldAnimate()) {
      startIdleLoop();
    }
  }

  if (canvasPauseBtn) {
    canvasPauseBtn.addEventListener('click', toggleUserPause);
  }

  // Mouse drag for 3D Camera Orbit & Hover Physics
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseCanvasX = e.clientX - rect.left;
    mouseCanvasY = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseCanvasX = null;
    mouseCanvasY = null;
  });

  window.addEventListener('mousemove', (e) => {
    // Update custom cursor
    if (cursorGlow) {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }

    if (isDragging) {
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      targetRotY += deltaX * 0.006;
      targetRotX += deltaY * 0.006;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      if (!shouldAnimate()) {
        renderOnce();
      }
    } else {
      // Direct, buttery-smooth 3D parallax tilt following cursor
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = normX * 0.65;
      targetRotX = -normY * 0.35 + 0.15;
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // --- 3D Projection Helpers ---
  const focalLength = 650;

  function project(x, y, z) {
    // 3D rotation
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    // Rotate Y
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;

    // Rotate X
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const scale = focalLength / (focalLength + z2 + 400);
    const projX = x1 * scale + width / 2;
    const projY = y2 * scale + height / 2;

    return { x: projX, y: projY, scale, z: z2 };
  }

  // --- Render Architecture & Gating ---
  let isHeroInViewport = true;
  let animId = null;

  function shouldAnimate() {
    if (document.hidden) return false;
    if (!isHeroInViewport) return false;
    if (isUserPaused) return false;
    if (prefersReducedMotion) return false;
    return true;
  }

  function startIdleLoop() {
    if (!animId && shouldAnimate()) {
      animId = requestAnimationFrame(render);
    }
  }

  function stopIdleLoop() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  // Telemetry Cache to prevent DOM thrashing
  let lastHudProgress = '';
  let lastHudEpoch = '';
  let lastHudLoss = '';
  let lastHudAcc = '';
  let lastHudPhase = '';
  let lastAnnotTag = '';
  let lastAnnotTitle = '';
  let lastAnnotDesc = '';

  let time = 0;

  function drawFrame() {
    // Update Progress Bar & HUD (only mutate DOM when string changes)
    const progPercent = (currentProgress * 100).toFixed(1);
    const progStr = `${progPercent}%`;
    if (lastHudProgress !== progStr) {
      progressBar.style.width = progStr;
      hudProgress.textContent = progStr;
      lastHudProgress = progStr;
    }

    const epochNum = Math.min(100, Math.floor(currentProgress * 99) + 1);
    const epochStr = `${epochNum < 10 ? '0' + epochNum : epochNum} / 100`;
    if (lastHudEpoch !== epochStr) {
      hudEpoch.textContent = epochStr;
      lastHudEpoch = epochStr;
    }

    const lossVal = (2.418 * Math.exp(-currentProgress * 4.2) + 0.012).toFixed(3);
    if (lastHudLoss !== lossVal) {
      hudLoss.textContent = lossVal;
      lastHudLoss = lossVal;
    }

    const accVal = `${(41.2 + currentProgress * 58.2).toFixed(1)}%`;
    if (lastHudAcc !== accVal) {
      hudAcc.textContent = accVal;
      lastHudAcc = accVal;
    }

    // Active Stage Index
    const stageIdx = Math.min(3, Math.floor(currentProgress * 4));
    const stage = STAGES[stageIdx];
    if (lastHudPhase !== stage.phase) {
      hudPhase.textContent = stage.phase;
      lastHudPhase = stage.phase;
    }
    if (lastAnnotTag !== stage.tag) {
      annotTag.textContent = stage.tag;
      lastAnnotTag = stage.tag;
    }
    if (lastAnnotTitle !== stage.title) {
      annotTitle.textContent = stage.title;
      lastAnnotTitle = stage.title;
    }
    if (lastAnnotDesc !== stage.desc) {
      annotDesc.textContent = stage.desc;
      lastAnnotDesc = stage.desc;
    }

    if (stageIdx !== lastAnnouncedStageIdx) {
      lastAnnouncedStageIdx = stageIdx;
      if (stageAnnouncer) {
        stageAnnouncer.textContent = `${stage.tag} — ${stage.title}`;
      }
    }

    // Stage 4 Convergence State Moment (Progress >= 0.95)
    const isConverged = currentProgress >= 0.95;
    if (stickyViewport) {
      if (isConverged && !stickyViewport.classList.contains('is-converged')) {
        stickyViewport.classList.add('is-converged');
      } else if (!isConverged && stickyViewport.classList.contains('is-converged')) {
        stickyViewport.classList.remove('is-converged');
      }
    }

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    const p = currentProgress;

    // --- 1. RENDER VOLUMETRIC COSMIC NEBULA & GAS CLOUDS ---
    nebulaClouds.forEach((cloud) => {
      let currentTheta = cloud.baseTheta + time * cloud.orbitSpeed;
      let curX = Math.cos(currentTheta) * Math.cos(cloud.basePhi) * cloud.baseRadius;
      let curY = cloud.baseY + Math.sin(time * 0.4 + cloud.baseRadius) * 15;
      let curZ = Math.sin(currentTheta) * Math.cos(cloud.basePhi) * cloud.baseRadius;

      if (p > 0.65) {
        const cFactor = Math.min(1, (p - 0.65) / 0.35);
        curX *= (1 - cFactor * 0.7);
        curY *= (1 - cFactor * 0.7);
        curZ *= (1 - cFactor * 0.7);
      }

      const proj = project(curX, curY, curZ);
      if (proj.scale <= 0) return;

      const cloudRadius = cloud.size * proj.scale;
      const gasGrad = ctx.createRadialGradient(
        proj.x, proj.y, 0,
        proj.x, proj.y, cloudRadius
      );
      gasGrad.addColorStop(0, cloud.colors.core);
      gasGrad.addColorStop(0.55, cloud.colors.mid);
      gasGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = gasGrad;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, cloudRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- 2. RENDER 3D COSMIC GALAXY (SPIRAL ARMS + STELLAR BULGE + COLLAPSE) ---
    const isCollapsing = p > 0.65;
    const collapseT = isCollapsing ? Math.min(1, (p - 0.65) / 0.35) : 0;
    const gravityPull = Math.pow(collapseT, 2.2);

    galaxyStars.forEach((star) => {
      let currentTheta = star.baseTheta + time * star.orbitSpeed;
      let currentRadius = star.baseRadius;

      let curX = Math.cos(currentTheta) * Math.cos(star.basePhi) * currentRadius;
      let curY = star.baseY;
      let curZ = Math.sin(currentTheta) * Math.cos(star.basePhi) * currentRadius;

      if (isCollapsing) {
        currentRadius = star.baseRadius * (1 - gravityPull * 0.88);
        currentTheta += gravityPull * 10.0;

        curX = Math.cos(currentTheta) * Math.cos(star.basePhi) * currentRadius;
        curY = Math.sin(star.basePhi) * currentRadius * (1 - gravityPull * 0.7);
        curZ = Math.sin(currentTheta) * Math.cos(star.basePhi) * currentRadius;
      }

      const proj = project(curX, curY, curZ);
      if (proj.scale <= 0) return;

      const twinkle = (Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.22 + 0.78) * star.baseAlpha;
      const finalAlpha = Math.min(1, twinkle + gravityPull * 0.3);
      const starRadius = Math.max(1.0, star.size * proj.scale * (1 + gravityPull * 0.6));

      // Soft glow aura
      ctx.fillStyle = star.glow;
      ctx.globalAlpha = finalAlpha * 0.4;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, starRadius * 3.6, 0, Math.PI * 2);
      ctx.fill();

      // Brilliant Star Core
      ctx.fillStyle = star.color;
      ctx.globalAlpha = finalAlpha;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, starRadius, 0, Math.PI * 2);
      ctx.fill();

      // 4-point sparkle cross flare
      if (star.hasFlare && starRadius > 1.1) {
        const flareLen = starRadius * 4.5;
        ctx.strokeStyle = star.color;
        ctx.globalAlpha = finalAlpha * 0.6;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(proj.x - flareLen, proj.y);
        ctx.lineTo(proj.x + flareLen, proj.y);
        ctx.moveTo(proj.x, proj.y - flareLen);
        ctx.lineTo(proj.x, proj.y + flareLen);
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 1.0;

    // --- 3. CENTRAL HOLOGRAPHIC LATENT ATTENTION CORE ---
    // Compute center projection ONCE for both holographic core & singularity rendering
    const centerProj = project(0, 0, 0);

    if (p > 0.68 && centerProj.scale > 0) {
      const ringAlpha = (p - 0.68) / 0.32;
      ctx.save();
      ctx.translate(centerProj.x, centerProj.y);
      ctx.rotate(time * 0.8);
      ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha * 0.45})`;
      ctx.lineWidth = 1.2 * centerProj.scale;
      ctx.beginPath();
      ctx.ellipse(0, 0, 50 * centerProj.scale, 20 * centerProj.scale, Math.PI / 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // --- 4. COMPUTE NODE 3D COORDINATES & DYNAMIC 4-STAGE TRANSFORMATION ---
    const projectedNodes = nodes.map((node) => {
      let curX, curY, curZ;

      if (p < 0.25) {
        // Stage 1 (0 -> 0.25): Ingestion (Scatter Pointcloud -> Structured Curved Cortex)
        const t = p / 0.25;
        const ease = t * t * (3 - 2 * t); // Smooth Hermite interpolation
        curX = node.scatterX + (node.baseX - node.scatterX) * ease;
        curY = node.scatterY + (node.baseY - node.scatterY) * ease;
        curZ = node.scatterZ + (node.baseZ - node.scatterZ) * ease;
      } else if (p < 0.50) {
        // Stage 2 (0.25 -> 0.50): Attention Matrix Projection (Expand & Multi-Head 3D Layer Separation)
        const t = (p - 0.25) / 0.25;
        const expandX = 1 + Math.sin(t * Math.PI) * 0.22;
        const expandY = 1 + Math.sin(t * Math.PI) * 0.16;
        const wobble = Math.sin(time * 3 + node.pulseOffset) * (6 + t * 6);
        curX = node.baseX * expandX + wobble;
        curY = node.baseY * expandY + Math.cos(time * 2.5 + node.pulseOffset) * 4;
        curZ = node.baseZ + Math.sin(t * Math.PI) * 40;
      } else if (p < 0.75) {
        // Stage 3 (0.50 -> 0.75): Backpropagation Optimization (Gradient Pulse Wave & Inward Compression)
        const t = (p - 0.50) / 0.25;
        const compressX = 1 - t * 0.24;
        const compressY = 1 - t * 0.14;
        const backpropWave = Math.sin(time * 3.5 - node.baseZ * 0.012 + t * Math.PI * 2) * (8 + (1 - t) * 6);
        curX = node.baseX * compressX + backpropWave;
        curY = node.baseY * compressY + Math.cos(time * 2.8 + node.pulseOffset) * 4;
        curZ = node.baseZ * (1 - t * 0.18);
      } else {
        // Stage 4 (0.75 -> 1.00): Gravitational Singularity (Converge into Singular Intelligence Core)
        const t = (p - 0.75) / 0.25;
        const smoothT = Math.pow(t, 1.3);
        const startX = node.baseX * 0.76;
        const startY = node.baseY * 0.86;
        const startZ = node.baseZ * 0.82;
        curX = startX + (node.coreX - startX) * smoothT;
        curY = startY + (node.coreY - startY) * smoothT;
        curZ = startZ + (node.coreZ - startZ) * smoothT;
      }

      const proj = project(curX, curY, curZ);

      // Interactive Cursor Magnetic Excitation
      if (mouseCanvasX !== null && mouseCanvasY !== null && proj.scale > 0) {
        const dx = mouseCanvasX - proj.x;
        const dy = mouseCanvasY - proj.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180 && dist > 1) {
          const pull = (1 - dist / 180) * 32 * proj.scale;
          proj.x += (dx / dist) * pull;
          proj.y += (dy / dist) * pull;
        }
      }

      return { proj, node, z: proj.z };
    });

    // Sort nodes back-to-front for realistic Depth of Field
    projectedNodes.sort((a, b) => b.z - a.z);

    // --- 5. RENDER CURVED BEZIER SYNAPSES & SIGNAL PACKETS ---
    connections.forEach((conn) => {
      const srcNode = projectedNodes.find(n => n.node === conn.src);
      const tgtNode = projectedNodes.find(n => n.node === conn.tgt);

      if (srcNode && tgtNode && srcNode.proj.scale > 0 && tgtNode.proj.scale > 0) {
        const pulse = (Math.sin(time * conn.pulseSpeed + conn.weight * 10) + 1) * 0.5;
        const alpha = Math.min(0.75, (0.10 + pulse * 0.35) * Math.min(1, p * 1.5));

        // Bezier control point with dynamic organic curvature
        const avgScale = (srcNode.proj.scale + tgtNode.proj.scale) * 0.5;
        const ctrlX = (srcNode.proj.x + tgtNode.proj.x) * 0.5 + conn.curveBend * avgScale;
        const ctrlY = (srcNode.proj.y + tgtNode.proj.y) * 0.5 - Math.abs(conn.curveBend) * 0.5 * avgScale;

        ctx.strokeStyle = p > 0.5 && p < 0.8 ? `rgba(244, 63, 94, ${alpha * 1.2})` : `rgba(129, 140, 248, ${alpha})`;
        ctx.lineWidth = Math.max(0.6, (0.8 + conn.weight * 1.4) * avgScale);
        ctx.beginPath();
        ctx.moveTo(srcNode.proj.x, srcNode.proj.y);
        ctx.quadraticCurveTo(ctrlX, ctrlY, tgtNode.proj.x, tgtNode.proj.y);
        ctx.stroke();

        // Animated Synaptic Signal Packet along Bezier Curve
        if (p > 0.18) {
          conn.packetT = (conn.packetT + 0.016 * conn.pulseSpeed * 0.6) % 1;
          const t = conn.packetT;

          // Quadratic Bezier Formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
          const px = Math.pow(1 - t, 2) * srcNode.proj.x + 2 * (1 - t) * t * ctrlX + Math.pow(t, 2) * tgtNode.proj.x;
          const py = Math.pow(1 - t, 2) * srcNode.proj.y + 2 * (1 - t) * t * ctrlY + Math.pow(t, 2) * tgtNode.proj.y;

          // Glowing Signal Packet
          const packetRadius = Math.max(1.8, 3.0 * avgScale);
          ctx.fillStyle = p > 0.5 ? '#fb7185' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(px, py, packetRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // --- 6. RENDER ARTIFICIAL NEURONS (CLEAN CRISP NEON GLOW) ---
    projectedNodes.forEach(({ proj, node }) => {
      if (proj.scale <= 0) return;

      const baseRadius = (3.5 + Math.sin(time * 2 + node.pulseOffset) * 1.4) * proj.scale;
      const nodeRadius = Math.max(1.5, baseRadius);

      // Clean Colored Neon Glow (Crisp, No White Mist)
      const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, nodeRadius * 3.5);
      grad.addColorStop(0, node.color);
      grad.addColorStop(0.4, 'rgba(99, 102, 241, 0.25)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, nodeRadius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Crisp White Neuron Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- 7. STAGE 4: GRAVITATIONAL SINGULARITY & ACCRETION DISK ---
    if (p > 0.68) {
      const ringAlpha = (p - 0.68) / 0.32;
      if (centerProj.scale > 0) {
        // Event Horizon Singularity Glow
        const haloRadius = Math.max(35, 210 * centerProj.scale * ringAlpha);
        const singGlow = ctx.createRadialGradient(
          centerProj.x, centerProj.y, 4,
          centerProj.x, centerProj.y, haloRadius
        );
        singGlow.addColorStop(0, `rgba(6, 182, 212, ${ringAlpha * 0.65})`);
        singGlow.addColorStop(0.3, `rgba(99, 102, 241, ${ringAlpha * 0.40})`);
        singGlow.addColorStop(0.7, `rgba(168, 85, 247, ${ringAlpha * 0.20})`);
        singGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = singGlow;
        ctx.beginPath();
        ctx.arc(centerProj.x, centerProj.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // 3D Relativistic Accretion Swirl Rings
        ctx.save();
        ctx.translate(centerProj.x, centerProj.y);
        ctx.rotate(time * 0.65 + rotY * 0.5);

        ctx.strokeStyle = `rgba(6, 182, 212, ${ringAlpha * 0.65})`;
        ctx.lineWidth = 2.5 * centerProj.scale;
        ctx.beginPath();
        ctx.ellipse(0, 0, 250 * centerProj.scale, 85 * centerProj.scale, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(168, 85, 247, ${ringAlpha * 0.55})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 290 * centerProj.scale, 100 * centerProj.scale, -Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(251, 191, 36, ${ringAlpha * 0.45})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 330 * centerProj.scale, 115 * centerProj.scale, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }
    }
  }

  function renderOnce() {
    if (!shouldAnimate()) {
      currentProgress = targetProgress;
      rotY = targetRotY;
      rotX = targetRotX;
    }
    drawFrame();
  }

  function render() {
    if (!shouldAnimate()) {
      animId = null;
      return;
    }

    time += 0.016;

    if (autoPlay) {
      targetProgress = (targetProgress + 0.002) % 1;
    }

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      currentProgress = targetProgress;
      rotY = targetRotY;
      rotX = targetRotX;
    } else {
      currentProgress += (targetProgress - currentProgress) * 0.12;
      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;
      rotY += Math.sin(time * 0.35) * 0.0012;
      rotX += Math.cos(time * 0.28) * 0.0006;
    }

    drawFrame();

    animId = requestAnimationFrame(render);
  }

  // --- Toast Notification System ---
  const toastEl = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');
  let toastTimer = null;

  function showToast(message, isSuccess = true) {
    if (!toastEl) return;
    if (toastMsg) toastMsg.textContent = message;
    if (toastIcon) {
      toastIcon.className = isSuccess ? 'fa-solid fa-circle-check toast-icon' : 'fa-solid fa-circle-info toast-icon';
      toastIcon.style.color = isSuccess ? 'var(--green)' : 'var(--cyan)';
    }
    toastEl.classList.add('active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('active');
    }, 3800);
  }

  // Quick Copy Email
  const quickCopyEmail = document.getElementById('quickCopyEmail');
  if (quickCopyEmail) {
    quickCopyEmail.addEventListener('click', () => {
      const email = quickCopyEmail.getAttribute('data-email') || 'gavindersingh164@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard (gavindersingh164@gmail.com)', true);
      }).catch(() => {
        showToast('Direct contact: gavindersingh164@gmail.com', false);
      });
    });
  }

  // Interactive Contact Form Handling via Web3Forms
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '<span>Send Message</span>';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          const nameVal = document.getElementById('contactName')?.value || 'Friend';
          showToast(`Thank you, ${nameVal}! Message sent directly to Gavinder's inbox.`, true);
          contactForm.reset();
        } else {
          showToast(result.message || 'Something went wrong. Direct inbox: gavindersingh164@gmail.com', false);
        }
      } catch (err) {
        showToast('Direct email: gavindersingh164@gmail.com', false);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }
      }
    });
  }

  // Number Counter Animations on Scroll
  const statNumbers = document.querySelectorAll('.stat-number');
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          const match = text.match(/^(\d+)(\+?)$/);
          if (match) {
            const targetNum = parseInt(match[1], 10);
            const suffix = match[2] || '';
            let current = 0;
            const step = Math.max(1, Math.floor(targetNum / 20));
            const timer = setInterval(() => {
              current += step;
              if (current >= targetNum) {
                el.textContent = `${targetNum}${suffix}`;
                clearInterval(timer);
              } else {
                el.textContent = `${current}${suffix}`;
              }
            }, 30);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(num => observer.observe(num));
  }

  // Interactive 3D Card Hover Tilt for Project Cards & Glass Cards
  const tiltCards = document.querySelectorAll('.project-card, .funfact-card, .timeline-content');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (prefersReducedMotion) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -4;
      const rotY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  motionQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      autoPlay = false;
      tiltCards.forEach(card => { card.style.transform = ''; });
    }
  });

  // --- Viewport & Visibility Observers ---
  if ('IntersectionObserver' in window && scroller) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasInViewport = isHeroInViewport;
        isHeroInViewport = entry.isIntersecting;
        if (isHeroInViewport) {
          renderOnce();
          if (!wasInViewport && shouldAnimate()) {
            startIdleLoop();
          }
        } else {
          stopIdleLoop();
        }
      });
    }, { threshold: 0 });
    heroObserver.observe(scroller);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isHeroInViewport) {
      renderOnce();
      if (shouldAnimate()) {
        startIdleLoop();
      }
    } else {
      stopIdleLoop();
    }
  });

  // Start Rendering
  updateScrollProgress();
  renderOnce();
  if (shouldAnimate()) {
    startIdleLoop();
  }

  /* -----------------------------------------------------------------------
     THEME TOGGLE — Light / Dark mode with localStorage persistence
  ----------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const themeLabel  = document.getElementById('themeLabel');

  function applyTheme(isLight) {
    if (isLight) {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.style.colorScheme = 'light';
      if (document.body) {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      }
      if (themeIcon)  themeIcon.className  = 'fa-solid fa-moon';
      if (themeLabel) themeLabel.textContent = 'DARK';
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
      document.documentElement.style.colorScheme = 'dark';
      if (document.body) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
      }
      if (themeIcon)  themeIcon.className  = 'fa-solid fa-sun';
      if (themeLabel) themeLabel.textContent = 'LIGHT';
    }
    renderOnce();
  }

  // Restore saved preference with try/catch and fallback to prefers-color-scheme
  try {
    const savedTheme = localStorage.getItem('gs-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isLight = savedTheme ? (savedTheme === 'light') : !prefersDark;
    applyTheme(isLight);
  } catch (e) {
    applyTheme(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nowLight = !document.documentElement.classList.contains('light-mode');
      applyTheme(nowLight);
      try {
        localStorage.setItem('gs-theme', nowLight ? 'light' : 'dark');
      } catch (e) {}
    });
  }

  /* -----------------------------------------------------------------------
     MOBILE NAVIGATION DRAWER
  ----------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuIcon = document.getElementById('mobileMenuIcon');
  const navLinks = document.getElementById('navLinks');

  function closeMobileMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('mobile-open');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.focus();
    }
    if (mobileMenuIcon) {
      mobileMenuIcon.className = 'fa-solid fa-bars';
    }
  }

  function toggleMobileMenu() {
    if (!navLinks) return;
    const isOpen = navLinks.classList.contains('mobile-open');
    if (isOpen) {
      navLinks.classList.remove('mobile-open');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
      if (mobileMenuIcon) mobileMenuIcon.className = 'fa-solid fa-bars';
    } else {
      navLinks.classList.add('mobile-open');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
      if (mobileMenuIcon) mobileMenuIcon.className = 'fa-solid fa-xmark';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Keyboard navigation: Escape key closes menu and returns focus to toggle button
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('mobile-open')) {
      closeMobileMenu();
    }
  });

  // Close menu when any nav link is clicked
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('mobile-open')) {
          navLinks.classList.remove('mobile-open');
          if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
          if (mobileMenuIcon) mobileMenuIcon.className = 'fa-solid fa-bars';
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     LANGUAGE TOGGLE — English / French bio swap
  ----------------------------------------------------------------------- */
  const btnEn = document.getElementById('btnLangEn');
  const btnFr = document.getElementById('btnLangFr');
  const bioEn = document.getElementById('bioEn');
  const bioFr = document.getElementById('bioFr');

  function showBio(lang) {
    if (!bioEn || !bioFr) return;
    if (lang === 'fr') {
      bioEn.style.display = 'none';
      bioFr.style.display = '';
      if (btnEn) btnEn.classList.remove('active');
      if (btnFr) btnFr.classList.add('active');
    } else {
      bioFr.style.display = 'none';
      bioEn.style.display = '';
      if (btnFr) btnFr.classList.remove('active');
      if (btnEn) btnEn.classList.add('active');
    }
  }

  if (btnEn) btnEn.addEventListener('click', () => showBio('en'));
  if (btnFr) btnFr.addEventListener('click', () => showBio('fr'));
  // Set initial state
  showBio('en');

})();

