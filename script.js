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

  // --- Motion Frames Timeline State ---
  let targetProgress = 0.0;
  let currentProgress = 0.0;
  let autoPlay = false;
  let rotX = 0.15;
  let rotY = 0.0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

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
      phase: '4 / 4 [INFERENCE CORE]',
      tag: 'PHASE 04 // AUTONOMOUS INFERENCE',
      title: 'Converged AI Intelligence Engine',
      desc: 'The neural network reaches 99.4% benchmark accuracy. Ready for ultra-low latency real-time production inference and RAG pipelines.'
    }
  ];

  // --- 3D Neural Nodes & Layers Model Generation ---
  const NUM_INPUT_NODES = 48;
  const NUM_HIDDEN_1 = 36;
  const NUM_HIDDEN_2 = 28;
  const NUM_OUTPUT = 16;
  
  const nodes = [];
  const connections = [];

  function createLayer(count, zPos, spreadX, spreadY, layerType) {
    const layerNodes = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 120 + (i % 3) * 35;
      const node = {
        // base resting position
        baseX: (Math.random() - 0.5) * spreadX,
        baseY: (Math.random() - 0.5) * spreadY,
        baseZ: zPos,
        // randomized initial disperse position (for stage 1)
        scatterX: (Math.random() - 0.5) * 1200,
        scatterY: (Math.random() - 0.5) * 900,
        scatterZ: (Math.random() - 0.5) * 800,
        // converged core position (for stage 4)
        coreX: Math.cos(angle) * (radius * 0.8),
        coreY: Math.sin(angle) * (radius * 0.8),
        coreZ: ((i % 5) - 2) * 50,
        layer: layerType,
        pulseOffset: Math.random() * Math.PI * 2,
        color: layerType === 0 ? '#38bdf8' : layerType === 1 ? '#6366f1' : layerType === 2 ? '#a855f7' : '#10b981'
      };
      nodes.push(node);
      layerNodes.push(node);
    }
    return layerNodes;
  }

  const l1 = createLayer(NUM_INPUT_NODES, -300, 450, 350, 0);
  const l2 = createLayer(NUM_HIDDEN_1, -100, 380, 300, 1);
  const l3 = createLayer(NUM_HIDDEN_2, 100, 320, 240, 2);
  const l4 = createLayer(NUM_OUTPUT, 300, 200, 180, 3);

  // Connect adjacent layers with weights
  function buildSynapses(sourceLayer, targetLayer, density = 0.25) {
    sourceLayer.forEach(src => {
      targetLayer.forEach(tgt => {
        if (Math.random() < density) {
          connections.push({
            src,
            tgt,
            weight: Math.random(),
            pulseSpeed: 1.5 + Math.random() * 2
          });
        }
      });
    });
  }

  buildSynapses(l1, l2, 0.22);
  buildSynapses(l2, l3, 0.25);
  buildSynapses(l3, l4, 0.35);

  // --- Web Audio Synthesizer (Zero External Dependencies) ---
  let audioCtx = null;
  let isSoundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playScrubTone(pitch) {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140 + pitch * 320, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Audio fallback silent
    }
  }

  soundToggle.addEventListener('click', () => {
    initAudio();
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
      soundIcon.className = 'fa-solid fa-volume-high';
      soundToggle.style.borderColor = 'var(--cyan)';
      soundToggle.style.color = 'var(--cyan)';
    } else {
      soundIcon.className = 'fa-solid fa-volume-xmark';
      soundToggle.style.borderColor = '';
      soundToggle.style.color = '';
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
    // allow natural page scroll while fine-scrubbing progress
    if (Math.abs(e.deltaY) > 5) {
      playScrubTone(currentProgress);
    }
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    // Avoid interfering if user is typing in terminal
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

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
    }
  });

  function syncPageScroll() {
    const totalHeight = scroller.offsetHeight - window.innerHeight;
    const newScrollTop = scroller.offsetTop + targetProgress * totalHeight;
    window.scrollTo({ top: newScrollTop, behavior: 'smooth' });
  }

  // Mouse drag for 3D Camera Orbit
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
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
      rotY += deltaX * 0.005;
      rotX += deltaY * 0.005;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
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

    // Gentle camera auto-sway
    if (!isDragging) {
      rotY += 0.0015;
    }

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // Compute node coordinates based on frame progress
    // Stage 1 (0 -> 0.25): Interpolate from scatter to base
    // Stage 2 (0.25 -> 0.5): Structured layered matrix
    // Stage 3 (0.5 -> 0.75): Backprop wave activations
    // Stage 4 (0.75 -> 1.0): Converge into crystal core
    const p = currentProgress;

    const projectedNodes = nodes.map((node) => {
      let curX, curY, curZ;

      if (p < 0.35) {
        // Scatter -> Layered
        const factor = Math.min(1, p / 0.35);
        curX = node.scatterX + (node.baseX - node.scatterX) * factor;
        curY = node.scatterY + (node.baseY - node.scatterY) * factor;
        curZ = node.scatterZ + (node.baseZ - node.scatterZ) * factor;
      } else if (p < 0.75) {
        // Layered matrix with activation wobble
        const wobble = Math.sin(time * 3 + node.pulseOffset) * 12;
        curX = node.baseX + wobble;
        curY = node.baseY;
        curZ = node.baseZ;
      } else {
        // Converge to crystalline core
        const factor = (p - 0.75) / 0.25;
        curX = node.baseX + (node.coreX - node.baseX) * factor;
        curY = node.baseY + (node.coreY - node.baseY) * factor;
        curZ = node.baseZ + (node.coreZ - node.baseZ) * factor;
      }

      const proj = project(curX, curY, curZ);
      return { proj, node };
    });

    // Draw Connections (Synapses)
    ctx.lineWidth = 1;
    connections.forEach((conn) => {
      const srcNode = projectedNodes.find(n => n.node === conn.src);
      const tgtNode = projectedNodes.find(n => n.node === conn.tgt);

      if (srcNode && tgtNode && srcNode.proj.scale > 0 && tgtNode.proj.scale > 0) {
        // Dynamic opacity based on backprop pulse
        const pulse = (Math.sin(time * conn.pulseSpeed + conn.weight * 10) + 1) * 0.5;
        const alpha = Math.min(0.7, (0.08 + pulse * 0.35) * Math.min(1, p * 1.5));

        ctx.strokeStyle = p > 0.5 && p < 0.8 ? `rgba(244, 63, 94, ${alpha * 1.2})` : `rgba(99, 102, 241, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(srcNode.proj.x, srcNode.proj.y);
        ctx.lineTo(tgtNode.proj.x, tgtNode.proj.y);
        ctx.stroke();

        // Draw animated energy signal packet moving along wire
        if (p > 0.2) {
          const packetT = (time * conn.pulseSpeed * 0.4) % 1;
          const px = srcNode.proj.x + (tgtNode.proj.x - srcNode.proj.x) * packetT;
          const py = srcNode.proj.y + (tgtNode.proj.y - srcNode.proj.y) * packetT;

          ctx.fillStyle = p > 0.5 ? '#f43f5e' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(px, py, 2.5 * srcNode.proj.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // Draw Nodes (Neurons)
    projectedNodes.forEach(({ proj, node }) => {
      if (proj.scale <= 0) return;

      const baseRadius = (3.5 + Math.sin(time * 2 + node.pulseOffset) * 1.5) * proj.scale;
      const nodeRadius = Math.max(1.5, baseRadius);

      // Node Glow
      const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, nodeRadius * 4);
      grad.addColorStop(0, node.color);
      grad.addColorStop(0.4, 'rgba(99, 102, 241, 0.3)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, nodeRadius * 4, 0, Math.PI * 2);
      ctx.fill();

      // Node Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // In Stage 4 (Crystal Core): Draw orbiting hyper-rings
    if (p > 0.7) {
      const ringAlpha = (p - 0.7) / 0.3;
      ctx.strokeStyle = `rgba(6, 182, 212, ${ringAlpha * 0.4})`;
      ctx.lineWidth = 2;

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(time * 0.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, 240, 90, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(168, 85, 247, ${ringAlpha * 0.4})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 270, 110, -Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
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

  // Start Rendering
  updateScrollProgress();
  requestAnimationFrame(render);

})();
