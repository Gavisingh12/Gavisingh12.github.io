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
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const scroller = document.getElementById('scroller');

  // --- Dimensions & Canvas Sizing ---
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Prevent browser from restoring scroll to middle on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

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
      phase: '1 / 4 [DATA INGESTION]',
      tag: 'PHASE 01 // RAW DATA INGESTION',
      title: 'High-Dimensional Feature Tokenization',
      desc: 'Raw multi-modal tokens are embedded into high-dimensional vector space. Scrub mouse or use keyboard arrows to initiate transformer layer compilation.'
    },
    {
      phase: '2 / 4 [ATTENTION LAYERS]',
      tag: 'PHASE 02 // MULTI-HEAD ATTENTION',
      title: 'Deep Transformer Matrix Projection',
      desc: 'Q, K, V self-attention matrices calculate token relationships across 32 attention heads with dynamic positional embeddings.'
    },
    {
      phase: '3 / 4 [BACKPROPAGATION]',
      tag: 'PHASE 03 // GRADIENT OPTIMIZATION',
      title: 'Loss Minimization & Weight Updates',
      desc: 'AdamW optimizer calculates stochastic gradients across billions of parameters. Cross-entropy loss drops rapidly toward convergence.'
    },
    {
      phase: '4 / 4 [SINGULARITY CORE]',
      tag: 'PHASE 04 // GRAVITATIONAL CONVERGENCE',
      title: 'Converged AI Singularity Engine',
      desc: 'Gravitational collapse complete: billions of latent parameters and stellar tokens coalesce into a singular crystalline intelligence core, benchmarked at 99.4% accuracy.'
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
  const NUM_GALAXY_STARS = 450;
  const galaxyStars = [];
  const NUM_NEBULA_CLOUDS = 18;
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

  // --- Web Audio Synthesizer: Cosmic "Om" Ambient Drone & Interactive Sonics ---
  let audioCtx = null;
  let isSoundEnabled = false;
  let omDrone = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Cosmic Om (136.1 Hz Cosmic Tuning + Sub-bass 68Hz + Theta Binaural Waves)
  function startCosmicOmDrone() {
    if (!audioCtx || omDrone) return;
    try {
      const masterOmGain = audioCtx.createGain();
      masterOmGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterOmGain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 3.0); // Gentle 3s swell
      masterOmGain.connect(audioCtx.destination);

      // 1. Fundamental Cosmic Om Frequency: 136.1 Hz
      const oscOm = audioCtx.createOscillator();
      oscOm.type = 'sine';
      oscOm.frequency.setValueAtTime(136.1, audioCtx.currentTime);

      // 2. Deep Sub-bass Resonance: 68.05 Hz
      const oscSub = audioCtx.createOscillator();
      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(68.05, audioCtx.currentTime);

      // 3. Higher Harmonic Overtone: 272.2 Hz
      const oscHarmonic = audioCtx.createOscillator();
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(272.2, audioCtx.currentTime);

      // 4. Low-Pass Resonant Filter (breathing space sweep)
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, audioCtx.currentTime);
      filter.Q.setValueAtTime(3.5, audioCtx.currentTime);

      // 5. LFO for breathing wave modulation (0.12 Hz slow cosmic breathing)
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(140, audioCtx.currentTime);
      lfo.connect(filter.frequency);
      lfo.start();

      // Connect oscillators
      const omSubGain = audioCtx.createGain();
      omSubGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
      oscSub.connect(omSubGain);

      const harmGain = audioCtx.createGain();
      harmGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      oscHarmonic.connect(harmGain);

      oscOm.connect(filter);
      omSubGain.connect(filter);
      harmGain.connect(filter);
      filter.connect(masterOmGain);

      oscOm.start();
      oscSub.start();
      oscHarmonic.start();

      omDrone = {
        masterOmGain,
        oscOm,
        oscSub,
        oscHarmonic,
        filter,
        lfo,
        stop() {
          try {
            masterOmGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.0);
            setTimeout(() => {
              oscOm.stop();
              oscSub.stop();
              oscHarmonic.stop();
              lfo.stop();
              omDrone = null;
            }, 1050);
          } catch (e) {}
        }
      };
    } catch (e) {
      console.warn('Om drone synth error:', e);
    }
  }

  function stopCosmicOmDrone() {
    if (omDrone) {
      omDrone.stop();
      omDrone = null;
    }
  }

  function playScrubTone(pitch) {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      // Harmonic scale based on 136.1 Hz Om fundamental
      const freq = 136.1 * (1 + pitch * 2.5);
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {}
  }

  soundToggle.addEventListener('click', () => {
    initAudio();
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
      soundIcon.className = 'fa-solid fa-volume-high';
      soundToggle.style.borderColor = 'var(--cyan)';
      soundToggle.style.color = 'var(--cyan)';
      startCosmicOmDrone();
    } else {
      soundIcon.className = 'fa-solid fa-volume-xmark';
      soundToggle.style.borderColor = '';
      soundToggle.style.color = '';
      stopCosmicOmDrone();
    }
  });

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

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // Direct mouse wheel scrubbing when hovering sticky canvas
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    autoPlay = false;
    const delta = (e.deltaY > 0 ? 1 : -1) * 0.04;
    targetProgress = Math.max(0, Math.min(1, targetProgress + delta));
    syncPageScroll();
    playScrubTone(targetProgress);
  }, { passive: false });

  // --- Cyberpunk Matrix Rain Stream ---
  const matrixCanvas = document.getElementById('matrixCanvas');
  const matrixToggle = document.getElementById('matrixToggle');
  let isMatrixActive = false;
  let matrixAnimId = null;

  function toggleMatrix() {
    isMatrixActive = !isMatrixActive;
    if (!matrixCanvas) return;
    const mCtx = matrixCanvas.getContext('2d');

    if (isMatrixActive) {
      matrixCanvas.classList.add('active');
      if (matrixToggle) {
        matrixToggle.style.borderColor = 'var(--green)';
        matrixToggle.style.color = 'var(--green)';
        matrixToggle.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
      }
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
      const characters = '010101010101ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ0123456789ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
      const fontSize = 14;
      const columns = Math.floor(matrixCanvas.width / fontSize);
      const drops = Array(columns).fill(1);

      function renderMatrix() {
        if (!isMatrixActive) return;
        mCtx.fillStyle = 'rgba(7, 9, 14, 0.08)';
        mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        mCtx.fillStyle = '#10b981';
        mCtx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = characters.charAt(Math.floor(Math.random() * characters.length));
          mCtx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        matrixAnimId = requestAnimationFrame(renderMatrix);
      }
      renderMatrix();
    } else {
      matrixCanvas.classList.remove('active');
      if (matrixToggle) {
        matrixToggle.style.borderColor = '';
        matrixToggle.style.color = '';
        matrixToggle.style.boxShadow = '';
      }
      if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
      mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    }
  }

  if (matrixToggle) {
    matrixToggle.addEventListener('click', toggleMatrix);
  }

  // Keyboard navigation & Power Shortcuts
  window.addEventListener('keydown', (e) => {
    // Avoid interfering if user is typing in terminal or input
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;

    if (e.key === 'ArrowDown' || e.key === 'KeyS' || e.key === 'PageDown') {
      e.preventDefault();
      targetProgress = Math.min(1, targetProgress + 0.05);
      syncPageScroll();
      playScrubTone(targetProgress);
    } else if (e.key === 'ArrowUp' || e.key === 'KeyW' || e.key === 'PageUp') {
      e.preventDefault();
      targetProgress = Math.max(0, targetProgress - 0.05);
      syncPageScroll();
      playScrubTone(targetProgress);
    } else if (e.key === 'ArrowRight' || e.key === 'KeyD') {
      rotY += 0.08;
    } else if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
      rotY -= 0.08;
    } else if (e.code === 'Space') {
      e.preventDefault();
      autoPlay = !autoPlay;
    } else if (e.key === 'm' || e.key === 'M') {
      toggleMatrix();
    } else if (e.key === '1') {
      targetProgress = 0.0;
      syncPageScroll();
      playScrubTone(0.0);
    } else if (e.key === '2') {
      targetProgress = 0.33;
      syncPageScroll();
      playScrubTone(0.33);
    } else if (e.key === '3') {
      targetProgress = 0.66;
      syncPageScroll();
      playScrubTone(0.66);
    } else if (e.key === '4') {
      targetProgress = 1.0;
      syncPageScroll();
      playScrubTone(1.0);
    } else if (e.key === 'l' || e.key === 'L') {
      document.getElementById('ai-lab')?.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 't' || e.key === 'T') {
      document.getElementById('terminal-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'p' || e.key === 'P') {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  function syncPageScroll() {
    const totalHeight = scroller.offsetHeight - window.innerHeight;
    const newScrollTop = scroller.offsetTop + targetProgress * totalHeight;
    window.scrollTo({ top: newScrollTop, behavior: 'smooth' });
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

  // --- Main Animation Loop (60 FPS) ---
  let time = 0;

  function render() {
    time += 0.016;

    // Smooth lerp of progress
    if (autoPlay) {
      targetProgress = (targetProgress + 0.002) % 1;
    }
    currentProgress += (targetProgress - currentProgress) * 0.12;

    // Update Progress Bar & HUD
    const progPercent = (currentProgress * 100).toFixed(1);
    progressBar.style.width = `${progPercent}%`;
    hudProgress.textContent = `${progPercent}%`;

    // Calculate dynamic telemetry
    const epochNum = Math.min(100, Math.floor(currentProgress * 99) + 1);
    hudEpoch.textContent = `${epochNum < 10 ? '0' + epochNum : epochNum} / 100`;

    const lossVal = (2.418 * Math.exp(-currentProgress * 4.2) + 0.012).toFixed(3);
    hudLoss.textContent = lossVal;

    const accVal = (41.2 + currentProgress * 58.2).toFixed(1);
    hudAcc.textContent = `${accVal}%`;

    // Active Stage Index
    const stageIdx = Math.min(3, Math.floor(currentProgress * 4));
    const stage = STAGES[stageIdx];
    hudPhase.textContent = stage.phase;
    annotTag.textContent = stage.tag;
    annotTitle.textContent = stage.title;
    annotDesc.textContent = stage.desc;

    // Smooth responsive camera rotation tracking cursor
    rotY += (targetRotY - rotY) * 0.08;
    rotX += (targetRotX - rotX) * 0.08;

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

    // --- 3. CENTRAL HOLOGRAPHIC LATENT ATTENTION CORE (ONLY IN STAGE 4 CONVERGENCE) ---
    if (p > 0.68) {
      const centerProj = project(0, 0, 0);
      if (centerProj.scale > 0) {
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

    requestAnimationFrame(render);
  }

  // --- Interactive Terminal Logic ---
  const termBody = document.getElementById('termBody');
  const termInput = document.getElementById('termInput');
  const termBtns = document.querySelectorAll('.term-btn');

  const COMMANDS = {
    help: 'Available commands:\n  • train --model <name>  : Launch simulated deep learning training job\n  • status                : Display CUDA GPU memory & compute utilization\n  • projects              : List highlighted production AI platforms\n  • skills                : Print technical framework arsenal\n  • contact               : Display official communication endpoints\n  • clear                 : Clear terminal console buffer',
    
    status: 'SYSTEM TELEMETRY [CUDA 12.4]:\n  • Device: NVIDIA GeForce RTX 4090 (24GB VRAM)\n  • Compute Engine: Tensor Cores Active (Mixed Precision FP16)\n  • Host OS: Linux Kernel 6.8 / Docker Containerized\n  • Active Workers: 8 DataLoader threads | NCCL Distributed',

    projects: 'HIGHLIGHTED ARCHITECTURES:\n  1. AI Decision Intelligence Platform  [RAG + Forecasting]\n  2. AI Core Models & Experiments       [PyTorch/TensorFlow]\n  3. Smart Energy Consumption Tracker   [Time-Series Anomaly]\n  4. AirPods Max 3D Motion Showcase     [Next.js + WebGL]',

    skills: 'TECHNICAL ARSENAL:\n  • Core: Python, C++, PyTorch, TensorFlow, Scikit-Learn\n  • MLOps: Docker, FastAPI, CUDA, Git, ONNX, MLflow\n  • Domains: Deep Learning, Time-Series, RAG, Computer Vision',

    contact: 'COMMUNICATION CHANNELS:\n  • GitHub: https://github.com/Gavisingh12\n  • Email: contact@gavisingh.dev\n  • LinkedIn: Gavinder Singh'
  };

  function addTermLine(text, isOutput = true) {
    const line = document.createElement('div');
    line.className = isOutput ? 'term-line output' : 'term-line';
    line.style.whiteSpace = 'pre-wrap';
    line.textContent = text;
    termBody.insertBefore(line, termBody.lastElementChild);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function handleCommand(cmd) {
    const raw = cmd.trim();
    if (!raw) return;

    addTermLine(`gavinder@ai-core:~$ ${raw}`, false);

    const lower = raw.toLowerCase();

    if (lower === 'clear') {
      const promptLine = termBody.lastElementChild;
      termBody.innerHTML = '';
      termBody.appendChild(promptLine);
      return;
    }

    if (lower.startsWith('train')) {
      addTermLine('>> [INITIATING TRAINING RUN]...\n>> Loading weights...\n>> Epoch [1/10] Loss: 1.842 | Val Acc: 78.4%\n>> Epoch [5/10] Loss: 0.412 | Val Acc: 94.2%\n>> Epoch [10/10] Loss: 0.089 | Val Acc: 99.1%\n>> [OPTIMIZATION CONVERGED] Model checkpoint exported.');
    } else if (COMMANDS[lower]) {
      addTermLine(COMMANDS[lower]);
    } else {
      addTermLine(`Command not found: "${raw}". Type "help" for a list of valid commands.`);
    }
  }

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = termInput.value;
      termInput.value = '';
      handleCommand(val);
    }
  });

  termBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      handleCommand(cmd);
    });
  });

  // ==========================================
  // --- LIVE IN-BROWSER AI DIGIT RECOGNIZER ---
  // ==========================================
  const drawCanvas = document.getElementById('drawCanvas');
  if (drawCanvas) {
    const dCtx = drawCanvas.getContext('2d', { willReadFrequently: true });
    const padStatus = document.getElementById('padStatus');
    const topDigitEl = document.getElementById('topDigit');
    const topConfEl = document.getElementById('topConf');
    const inferTimeEl = document.getElementById('inferTime');
    const meterBars = document.getElementById('meterBars');
    const btnClearPad = document.getElementById('btnClearPad');
    const btnPresetPad = document.getElementById('btnPresetPad');
    const brushSizeInput = document.getElementById('brushSize');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let strokeCount = 0;
    let inferTimeout = null;

    // Initialize 0 - 9 Probability Meter Bars
    if (meterBars) {
      meterBars.innerHTML = '';
      for (let d = 0; d < 10; d++) {
        const row = document.createElement('div');
        row.className = 'meter-row';
        row.innerHTML = `
          <div class="meter-label-wrap">
            <span class="meter-class">CLASS [${d}]</span>
            <span class="meter-pct" id="pct-${d}">0.0%</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill" id="fill-${d}"></div>
          </div>
        `;
        meterBars.appendChild(row);
      }
    }

    function initDrawCanvas() {
      dCtx.fillStyle = '#05070c';
      dCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
      dCtx.lineCap = 'round';
      dCtx.lineJoin = 'round';
      dCtx.strokeStyle = '#ffffff';
    }
    initDrawCanvas();

    function getCanvasCoords(e) {
      const rect = drawCanvas.getBoundingClientRect();
      const scaleX = drawCanvas.width / rect.width;
      const scaleY = drawCanvas.height / rect.height;
      if (e.touches && e.touches.length > 0) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }

    function startDraw(e) {
      e.preventDefault();
      isDrawing = true;
      const coords = getCanvasCoords(e);
      lastX = coords.x;
      lastY = coords.y;
      strokeCount++;
      if (padStatus) padStatus.textContent = 'INFERRING...';
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const coords = getCanvasCoords(e);
      const brushSize = brushSizeInput ? parseInt(brushSizeInput.value, 10) : 20;

      dCtx.lineWidth = brushSize;
      dCtx.beginPath();
      dCtx.moveTo(lastX, lastY);
      dCtx.lineTo(coords.x, coords.y);
      dCtx.stroke();

      lastX = coords.x;
      lastY = coords.y;

      clearTimeout(inferTimeout);
      inferTimeout = setTimeout(runInference, 40);
    }

    function stopDraw(e) {
      if (!isDrawing) return;
      isDrawing = false;
      clearTimeout(inferTimeout);
      runInference();
    }

    // Mouse Listeners
    drawCanvas.addEventListener('mousedown', startDraw);
    window.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    // Touch Listeners (Mobile & Tablet)
    drawCanvas.addEventListener('touchstart', startDraw, { passive: false });
    drawCanvas.addEventListener('touchmove', draw, { passive: false });
    drawCanvas.addEventListener('touchend', stopDraw, { passive: false });

    // Clear Pad
    if (btnClearPad) {
      btnClearPad.addEventListener('click', () => {
        initDrawCanvas();
        strokeCount = 0;
        if (topDigitEl) topDigitEl.textContent = '-';
        if (topConfEl) topConfEl.textContent = '--%';
        if (inferTimeEl) inferTimeEl.textContent = '~0.0 ms';
        if (padStatus) padStatus.textContent = 'READY TO INFER';
        for (let d = 0; d < 10; d++) {
          const pct = document.getElementById(`pct-${d}`);
          const fill = document.getElementById(`fill-${d}`);
          if (pct) pct.textContent = '0.0%';
          if (fill) {
            fill.style.width = '0%';
            fill.classList.remove('winner');
          }
        }
      });
    }

    // Preset Digits for Instant Demonstration
    const PRESETS = [
      // Digit 3
      [
        [{x: 80, y: 70}, {x: 190, y: 70}, {x: 140, y: 135}, {x: 185, y: 175}, {x: 170, y: 225}, {x: 90, y: 220}]
      ],
      // Digit 7
      [
        [{x: 75, y: 75}, {x: 205, y: 75}, {x: 125, y: 225}]
      ],
      // Digit 8
      [
        [{x: 140, y: 70}, {x: 100, y: 100}, {x: 140, y: 145}, {x: 185, y: 185}, {x: 140, y: 225}, {x: 95, y: 185}, {x: 140, y: 145}, {x: 180, y: 100}, {x: 140, y: 70}]
      ],
      // Digit 0
      [
        [{x: 140, y: 70}, {x: 90, y: 110}, {x: 90, y: 180}, {x: 140, y: 225}, {x: 190, y: 180}, {x: 190, y: 110}, {x: 140, y: 70}]
      ],
      // Digit 5
      [
        [{x: 180, y: 75}, {x: 105, y: 75}, {x: 100, y: 140}, {x: 175, y: 140}, {x: 185, y: 185}, {x: 140, y: 225}, {x: 85, y: 215}]
      ],
      // Digit 1
      [
        [{x: 110, y: 100}, {x: 145, y: 75}, {x: 145, y: 225}]
      ],
      // Digit 4
      [
        [{x: 170, y: 65}, {x: 85, y: 165}, {x: 205, y: 165}],
        [{x: 170, y: 110}, {x: 170, y: 225}]
      ]
    ];
    let presetIdx = 0;

    if (btnPresetPad) {
      btnPresetPad.addEventListener('click', () => {
        initDrawCanvas();
        const strokes = PRESETS[presetIdx % PRESETS.length];
        presetIdx++;

        dCtx.lineWidth = 20;
        strokes.forEach(stroke => {
          if (stroke.length < 2) return;
          dCtx.beginPath();
          dCtx.moveTo(stroke[0].x, stroke[0].y);
          for (let i = 1; i < stroke.length; i++) {
            dCtx.lineTo(stroke[i].x, stroke[i].y);
          }
          dCtx.stroke();
        });

        runInference();
      });
    }

    // --- FEATURE EXTRACTION & NEURAL CLASSIFIER ---
    function runInference() {
      const startTime = performance.now();

      // Extract 280x280 image data
      const imgData = dCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
      const data = imgData.data;

      // Find bounding box of drawn pixels
      let minX = drawCanvas.width, maxX = 0;
      let minY = drawCanvas.height, maxY = 0;
      let activePixels = 0;
      let sumX = 0, sumY = 0;

      for (let y = 0; y < drawCanvas.height; y++) {
        for (let x = 0; x < drawCanvas.width; x++) {
          const idx = (y * drawCanvas.width + x) * 4;
          const val = data[idx]; // red channel (grayscale)
          if (val > 35) {
            activePixels++;
            sumX += x;
            sumY += y;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // If nothing drawn, reset
      if (activePixels < 50) {
        if (topDigitEl) topDigitEl.textContent = '-';
        if (topConfEl) topConfEl.textContent = '--%';
        if (padStatus) padStatus.textContent = 'READY TO INFER';
        for (let d = 0; d < 10; d++) {
          const pct = document.getElementById(`pct-${d}`);
          const fill = document.getElementById(`fill-${d}`);
          if (pct) pct.textContent = '0.0%';
          if (fill) {
            fill.style.width = '0%';
            fill.classList.remove('winner');
          }
        }
        return;
      }

      // Center of mass and dimensions
      const bbW = Math.max(1, maxX - minX + 1);
      const bbH = Math.max(1, maxY - minY + 1);
      const aspectRatio = bbW / bbH;
      const comX = (sumX / activePixels - minX) / bbW; // 0 to 1
      const comY = (sumY / activePixels - minY) / bbH; // 0 to 1

      // Downsample to normalized 7x7 grid (49 zone features)
      const grid = new Float32Array(49);
      for (let gy = 0; gy < 7; gy++) {
        for (let gx = 0; gx < 7; gx++) {
          const startX = Math.floor(minX + (gx / 7) * bbW);
          const endX = Math.floor(minX + ((gx + 1) / 7) * bbW);
          const startY = Math.floor(minY + (gy / 7) * bbH);
          const endY = Math.floor(minY + ((gy + 1) / 7) * bbH);
          let sum = 0, count = 0;

          for (let py = startY; py < endY; py++) {
            for (let px = startX; px < endX; px++) {
              if (px >= 0 && px < drawCanvas.width && py >= 0 && py < drawCanvas.height) {
                const idx = (py * drawCanvas.width + px) * 4;
                sum += data[idx] > 35 ? 1 : 0;
                count++;
              }
            }
          }
          grid[gy * 7 + gx] = count > 0 ? sum / count : 0;
        }
      }

      // Geometric indicators
      const topHalfWeight = (grid.slice(0, 21).reduce((a, b) => a + b, 0)) / (activePixels / 100 + 1);
      const bottomHalfWeight = (grid.slice(28, 49).reduce((a, b) => a + b, 0)) / (activePixels / 100 + 1);
      const centerDensity = grid[3 * 7 + 3];
      const middleRowDensity = (grid[3*7+1] + grid[3*7+2] + grid[3*7+3] + grid[3*7+4] + grid[3*7+5]) / 5;

      // Count horizontal crossings across middle vertical axis (helps distinguish 1, 0, 8, 3, etc.)
      let crossingsMidX = 0;
      let inStroke = false;
      const midXCoord = Math.floor(minX + bbW * 0.5);
      for (let y = minY; y <= maxY; y++) {
        const idx = (y * drawCanvas.width + midXCoord) * 4;
        const isSet = data[idx] > 35;
        if (isSet && !inStroke) {
          crossingsMidX++;
          inStroke = true;
        } else if (!isSet) {
          inStroke = false;
        }
      }

      // Check hole in top half and hole in bottom half (0 has central hole, 8 has 2 holes, 6 has bottom hole, 9 has top hole)
      const topHole = (grid[1*7+3] < 0.25 && grid[1*7+2] > 0.4 && grid[1*7+4] > 0.4 && grid[0*7+3] > 0.4);
      const botHole = (grid[5*7+3] < 0.25 && grid[5*7+2] > 0.4 && grid[5*7+4] > 0.4 && grid[6*7+3] > 0.4);
      const centerHole = (grid[3*7+3] < 0.2 && grid[3*7+1] > 0.4 && grid[3*7+5] > 0.4);

      // Archetypal Spatial Prototypes for 0 - 9 (7x7)
      const PROTOTYPES = [
        // 0: hollow center, strong perimeter
        [
          0,1,1,1,1,1,0,
          1,1,0,0,0,1,1,
          1,0,0,0,0,0,1,
          1,0,0,0,0,0,1,
          1,0,0,0,0,0,1,
          1,1,0,0,0,1,1,
          0,1,1,1,1,1,0
        ],
        // 1: tall, narrow, centered vertical line
        [
          0,0,1,1,0,0,0,
          0,1,1,1,0,0,0,
          0,0,1,1,0,0,0,
          0,0,1,1,0,0,0,
          0,0,1,1,0,0,0,
          0,0,1,1,0,0,0,
          0,1,1,1,1,0,0
        ],
        // 2: top curve, diagonal down-left, flat bottom base
        [
          0,1,1,1,1,0,0,
          1,1,0,0,1,1,0,
          0,0,0,1,1,0,0,
          0,0,1,1,0,0,0,
          0,1,1,0,0,0,0,
          1,1,0,0,0,1,0,
          1,1,1,1,1,1,1
        ],
        // 3: top bar/curve, middle pinch, bottom curve
        [
          0,1,1,1,1,1,0,
          1,0,0,0,0,1,1,
          0,0,0,1,1,1,0,
          0,0,1,1,1,1,0,
          0,0,0,0,0,1,1,
          1,0,0,0,0,1,1,
          0,1,1,1,1,1,0
        ],
        // 4: left vertical down, horizontal cross, main vertical stalk
        [
          0,0,0,1,1,0,0,
          0,0,1,1,1,0,0,
          0,1,0,1,1,0,0,
          1,0,0,1,1,0,0,
          1,1,1,1,1,1,1,
          0,0,0,1,1,0,0,
          0,0,0,1,1,0,0
        ],
        // 5: top horizontal bar, vertical left, middle curve, bottom loop
        [
          1,1,1,1,1,1,0,
          1,1,0,0,0,0,0,
          1,1,1,1,1,0,0,
          0,0,0,0,1,1,0,
          0,0,0,0,0,1,1,
          1,0,0,0,0,1,1,
          0,1,1,1,1,1,0
        ],
        // 6: smooth sweep down, closed bottom circle
        [
          0,0,1,1,1,0,0,
          0,1,1,0,0,0,0,
          1,1,0,0,0,0,0,
          1,1,1,1,1,0,0,
          1,1,0,0,1,1,0,
          1,1,0,0,1,1,0,
          0,1,1,1,1,0,0
        ],
        // 7: top horizontal line, sharp diagonal descending left
        [
          1,1,1,1,1,1,1,
          0,0,0,0,0,1,1,
          0,0,0,0,1,1,0,
          0,0,0,1,1,0,0,
          0,0,1,1,0,0,0,
          0,1,1,0,0,0,0,
          0,1,1,0,0,0,0
        ],
        // 8: top loop, pinch waist, bottom loop
        [
          0,1,1,1,1,0,0,
          1,1,0,0,1,1,0,
          1,1,0,0,1,1,0,
          0,1,1,1,1,0,0,
          1,1,0,0,1,1,0,
          1,1,0,0,1,1,0,
          0,1,1,1,1,0,0
        ],
        // 9: top closed loop, stem descending on right
        [
          0,1,1,1,1,0,0,
          1,1,0,0,1,1,0,
          1,1,0,0,1,1,0,
          0,1,1,1,1,1,0,
          0,0,0,0,1,1,0,
          0,0,0,1,1,0,0,
          0,1,1,1,0,0,0
        ]
      ];

      // Calculate Cosine Similarity & Topological Boosting for each digit
      const logits = new Float32Array(10);
      for (let d = 0; d < 10; d++) {
        const proto = PROTOTYPES[d];
        let dot = 0, magA = 0, magB = 0;
        for (let i = 0; i < 49; i++) {
          dot += grid[i] * proto[i];
          magA += grid[i] * grid[i];
          magB += proto[i] * proto[i];
        }
        const sim = (magA > 0 && magB > 0) ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
        logits[d] = sim * 5.0; // Base score scaled

        // Structural Feature Boosting
        if (d === 1) {
          if (aspectRatio < 0.45) logits[1] += 2.5;
          if (aspectRatio > 0.75) logits[1] -= 3.0;
        }
        if (d === 0) {
          if (centerHole) logits[0] += 2.2;
          if (crossingsMidX === 2 && aspectRatio > 0.5) logits[0] += 1.5;
          if (centerDensity > 0.5) logits[0] -= 2.5;
        }
        if (d === 8) {
          if (crossingsMidX >= 3) logits[8] += 2.4;
          if (topHole && botHole) logits[8] += 3.0;
        }
        if (d === 7) {
          if (grid[0] > 0.4 && grid[6] > 0.4 && grid[48] < 0.2) logits[7] += 2.0;
          if (aspectRatio > 0.5 && bottomHalfWeight < topHalfWeight) logits[7] += 1.2;
        }
        if (d === 4) {
          if (middleRowDensity > 0.4 && grid[4*7+3] > 0.4) logits[4] += 1.8;
        }
        if (d === 3) {
          if (crossingsMidX >= 2 && grid[3*7+6] > 0.3) logits[3] += 1.5;
        }
        if (d === 6) {
          if (botHole && !topHole) logits[6] += 2.2;
        }
        if (d === 9) {
          if (topHole && !botHole) logits[9] += 2.2;
        }
      }

      // Softmax with temperature scaling
      const temperature = 1.3;
      let maxLogit = -Infinity;
      for (let d = 0; d < 10; d++) {
        if (logits[d] > maxLogit) maxLogit = logits[d];
      }

      let sumExp = 0;
      const probs = new Float32Array(10);
      for (let d = 0; d < 10; d++) {
        probs[d] = Math.exp((logits[d] - maxLogit) / temperature);
        sumExp += probs[d];
      }

      let topDigit = 0;
      let topConfidence = 0;
      for (let d = 0; d < 10; d++) {
        probs[d] = probs[d] / sumExp;
        if (probs[d] > topConfidence) {
          topConfidence = probs[d];
          topDigit = d;
        }
      }

      const inferenceDuration = (performance.now() - startTime).toFixed(1);

      // Update UI Telemetry
      if (topDigitEl) topDigitEl.textContent = topDigit;
      if (topConfEl) topConfEl.textContent = (topConfidence * 100).toFixed(1) + '%';
      if (inferTimeEl) inferTimeEl.textContent = `~${inferenceDuration} ms`;
      if (padStatus) padStatus.textContent = 'INFERENCE COMPLETE';

      // Update Meter Bars
      for (let d = 0; d < 10; d++) {
        const pctEl = document.getElementById(`pct-${d}`);
        const fillEl = document.getElementById(`fill-${d}`);
        const pctVal = (probs[d] * 100).toFixed(1);
        if (pctEl) pctEl.textContent = `${pctVal}%`;
        if (fillEl) {
          fillEl.style.width = `${pctVal}%`;
          if (d === topDigit) {
            fillEl.classList.add('winner');
          } else {
            fillEl.classList.remove('winner');
          }
        }
      }
    }
  }

  // Start Rendering
  updateScrollProgress();
  requestAnimationFrame(render);

})();
