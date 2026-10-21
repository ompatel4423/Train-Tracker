// =========================================================================
// ThreeUI Engine for Chennai AC Local Train Tracker
// Integrates:
// 1. PortalFieldCollection (variant="flow-field") Background
// 2. SkeuomorphicToggleCollection (variant="shader") Dual-Theme WebGL Switches
//    - Ball Transition Timing: Exact ThreeUI 0.35s cubic-bezier(0.22, 1, 0.36, 1)
//    - Plasma/Sparks Internal Flow: speed = 2.00
//    - Color Palettes:
//      * Morning 49002:  Golden Sunrise Amber [1.0, 0.74, 0.05]
//      * Evening 49007:  ThreeUI Default Blue Remix [0.23, 0.51, 0.96] (matches #3b82f6)
//      * Boarding:       Mint Emerald Green [0.06, 0.88, 0.44]
//      * Deboarding:     Electric Crimson Ruby Red [1.0, 0.16, 0.24]
// Powered by @designcodeio/threeui
// =========================================================================

const ThreeUISimplexNoise = (function() {
  const F3 = 1.0 / 3.0;
  const G3 = 1.0 / 6.0;
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  function SimplexNoise(seed) {
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    const p = new Uint8Array(256);
    seed = seed || Math.random() * 65536;
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      const j = seed % (i + 1);
      const tmp = p[i];
      p[i] = p[j];
      p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  SimplexNoise.prototype.noise3D = function(xin, yin, zin) {
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
    const x3 = x0 - 1.0 + 3*G3, y3 = y0 - 1.0 + 3*G3, z3 = z0 - 1.0 + 3*G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;
    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if (t0 > 0) {
      t0 *= t0;
      const gi0 = this.permMod12[ii + this.perm[jj + this.perm[kk]]];
      n0 = t0 * t0 * (grad3[gi0][0]*x0 + grad3[gi0][1]*y0 + grad3[gi0][2]*z0);
    }
    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if (t1 > 0) {
      t1 *= t1;
      const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]];
      n1 = t1 * t1 * (grad3[gi1][0]*x1 + grad3[gi1][1]*y1 + grad3[gi1][2]*z1);
    }
    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if (t2 > 0) {
      t2 *= t2;
      const gi2 = this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]];
      n2 = t2 * t2 * (grad3[gi2][0]*x2 + grad3[gi2][1]*y2 + grad3[gi2][2]*z2);
    }
    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if (t3 > 0) {
      t3 *= t3;
      const gi3 = this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]];
      n3 = t3 * t3 * (grad3[gi3][0]*x3 + grad3[gi3][1]*y3 + grad3[gi3][2]*z3);
    }
    return 32.0 * (n0 + n1 + n2 + n3);
  };

  return SimplexNoise;
})();

class ThreeUIFlowFieldBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.noise = new ThreeUISimplexNoise(777);

    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.speed = 1.0;
    this.size = 1.0;
    this.length = 1.0;
    this.opacity = 1.0;

    const isMobile = window.innerWidth < 768;
    this.particleCount = isMobile ? 950 : 2000;
    this.noiseScale = 0.0024 / this.length;
    this.particles = [];
    this.time = 0;

    this.palette = [
      { r: 6, g: 182, b: 212 },
      { r: 2, g: 132, b: 199 },
      { r: 14, g: 165, b: 233 },
      { r: 34, g: 211, b: 238 },
      { r: 59, g: 130, b: 246 }
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
    this.animate();
  }

  createParticle() {
    return {
      x: Math.random() * this.W,
      y: Math.random() * this.H,
      speed: (0.45 + Math.random() * 0.95) * this.speed,
      alpha: (0.15 + Math.random() * 0.5) * this.opacity,
      size: (0.7 + Math.random() * 1.3) * this.size
    };
  }

  resize() {
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
    this.canvas.style.width = this.W + "px";
    this.canvas.style.height = this.H + "px";
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.fillStyle = "#090D16";
    this.ctx.fillRect(0, 0, this.W, this.H);
  }

  getColor(noiseVal) {
    const t = Math.max(0, Math.min(1, (noiseVal + 1) * 0.5));
    const idx = t * (this.palette.length - 1);
    const i = Math.floor(idx);
    const f = idx - i;
    const a = this.palette[Math.min(i, this.palette.length - 1)];
    const b = this.palette[Math.min(i + 1, this.palette.length - 1)];
    return {
      r: Math.round(a.r + (b.r - a.r) * f),
      g: Math.round(a.g + (b.g - a.g) * f),
      b: Math.round(a.b + (b.b - a.b) * f)
    };
  }

  animate() {
    this.ctx.fillStyle = "rgba(9, 13, 22, 0.06)";
    this.ctx.fillRect(0, 0, this.W, this.H);
    this.time += 0.001 * this.speed;

    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particles[i];
      const nx = p.x * this.noiseScale;
      const ny = p.y * this.noiseScale;
      const angle = this.noise.noise3D(nx, ny, this.time) * Math.PI * 2;
      const colorNoise = this.noise.noise3D(nx * 1.5 + 20, ny * 1.5 + 20, this.time * 0.7);

      const vx = Math.cos(angle) * p.speed * 1.2;
      const vy = Math.sin(angle) * p.speed * 1.2;

      const prevX = p.x;
      const prevY = p.y;
      p.x += vx;
      p.y += vy;

      if (p.x < 0) p.x = this.W;
      else if (p.x > this.W) p.x = 0;
      if (p.y < 0) p.y = this.H;
      else if (p.y > this.H) p.y = 0;

      const c = this.getColor(colorNoise);
      this.ctx.beginPath();
      this.ctx.moveTo(prevX, prevY);
      this.ctx.lineTo(p.x, p.y);
      this.ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${p.alpha})`;
      this.ctx.lineWidth = p.size;
      this.ctx.stroke();
    }

    requestAnimationFrame(() => this.animate());
  }
}

const THREEUI_SHADER_TOGGLE_VERTEX = "attribute vec2 aPosition;\nvoid main() {\n  gl_Position = vec4(aPosition, 0.0, 1.0);\n}";
const THREEUI_SHADER_TOGGLE_FRAGMENT = `precision highp float;

uniform vec2 uRes;
uniform float uUnit;
uniform float uTime;
uniform float uProgress;

uniform vec3 uColorLeft;
uniform vec3 uColorRight;

const float R = 1.0;
const float L = 1.35;
const float TH = 0.78;
const float PI = 3.14159265359;

float hash11(float n) { return fract(sin(n * 127.1) * 43758.5453123); }
vec2 hash21(float n) { return fract(sin(vec2(n * 127.1, n * 311.7)) * 43758.5453123); }

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash11(i.x + i.y * 57.0);
  float b = hash11(i.x + 1.0 + i.y * 57.0);
  float c = hash11(i.x + (i.y + 1.0) * 57.0);
  float d = hash11(i.x + 1.0 + (i.y + 1.0) * 57.0);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * valueNoise(p);
    p = p * 2.03 + 11.3;
    a *= 0.5;
  }
  return v;
}

float ridged(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    float n = 1.0 - abs(valueNoise(p) * 2.0 - 1.0);
    v += a * n * n;
    p = p * 2.11 + 7.7;
    a *= 0.5;
  }
  return v;
}

vec2 warp(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.12)), fbm(p + vec2(5.2, 1.3) - t * 0.09));
  vec2 r = vec2(fbm(p + 3.4 * q + vec2(1.7, 9.2)), fbm(p + 3.4 * q + vec2(8.3, 2.8)));
  return p + 0.42 * r;
}

float sdCapsule(vec2 p, float halfLength, float radius) {
  p.x -= clamp(p.x, -halfLength, halfLength);
  return length(p) - radius;
}

float fw(float d) {
#ifdef HAS_DERIVATIVES
  return max(fwidth(d), 1e-5);
#else
  return 1.6 / uUnit;
#endif
}

float fill(float d) {
  float w = fw(d) * 0.72;
  return smoothstep(w, -w, d);
}

float stroke(float d, float halfWidth) {
  float w = fw(d) * 0.8;
  return smoothstep(halfWidth + w, halfWidth - w, abs(d));
}

float capsuleHalo(vec2 p, float spread) {
  return exp(-max(0.0, sdCapsule(p, L, R)) * spread);
}

void main() {
  vec2 frag = gl_FragCoord.xy - 0.5 * uRes;
  vec2 p = frag / uUnit;
  vec2 screen = frag / max(uRes.x, uRes.y);
  float pProg = clamp(uProgress, 0.0, 1.0);

  vec3 accent = mix(uColorLeft, uColorRight, pProg);

  vec3 skyTop = vec3(0.045, 0.052, 0.075);
  vec3 skyBottom = vec3(0.012, 0.015, 0.025);
  vec3 color = mix(skyBottom, skyTop, smoothstep(-0.55, 0.55, screen.y));

  float halo = capsuleHalo(p, 1.35);
  color += accent * halo * 0.72;

  float d = sdCapsule(p, L, R);
  float inside = fill(d);

  vec2 flowP = vec2(p.x * 0.72 - uTime * 0.3, p.y * 1.25);
  vec2 w = warp(flowP, uTime);
  float plasma = fbm(w * 1.5);
  float threads = ridged(vec2(w.x * 2.2, w.y * 3.4 + uTime * 0.16));

  vec3 interior = mix(accent * 0.35, accent * 1.25, plasma);
  interior += vec3(0.95, 0.98, 1.0) * threads * threads * 0.55;

  vec3 sparks = vec3(0.0);
  for (int i = 0; i < 32; i++) {
    float fi = float(i);
    vec2 h = hash21(fi + 3.7);
    float phase = hash11(fi * 7.13 + 1.7);
    float life = fract(uTime * 0.28 + phase);
    float x = mix(-L - 0.4, L + 0.4, life);
    float y = (h.y - 0.5) * 1.4;
    vec2 sp = p - vec2(x, y);
    sp.x *= 0.45;
    float fade = sin(life * PI);
    float core = exp(-dot(sp, sp) * 2800.0);
    sparks += mix(accent, vec3(1.0), 0.5) * core * fade * 2.2;
  }
  interior += sparks;

  color = mix(color, interior, inside);
  color += accent * stroke(d, 0.015) * 1.2;

  // Thumb Sphere with Ambient Shading
  float thumbX = mix(-L, L, uProgress);
  vec2 tp = p - vec2(thumbX, 0.0);
  float td = length(tp) - TH;
  float thumbIn = fill(td);
  vec2 disc = tp / TH;
  float discLen = min(1.0, length(disc));
  vec3 normal = normalize(vec3(disc, sqrt(max(1e-4, 1.0 - discLen * discLen))));

  vec3 light = normalize(vec3(-0.4, 0.6, 0.8));
  float diff = max(0.0, dot(normal, light));
  float spec = pow(max(0.0, dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0))), 60.0);

  vec3 thumbColor = vec3(0.85, 0.89, 0.95) * (0.25 + 0.75 * diff);
  thumbColor += vec3(1.0) * spec * 1.5;
  thumbColor += accent * 0.32;

  float coreJewel = smoothstep(0.35, 0.05, length(disc));
  thumbColor = mix(thumbColor, vec3(1.0), coreJewel * 0.85);

  color = mix(color, thumbColor, thumbIn);
  gl_FragColor = vec4(max(color, 0.0), 1.0);
}
`;

function cubicBezierEasing(t) {
  return 1 - Math.pow(1 - t, 3.2);
}

function createShaderToggleWebGLScene(canvas, options) {
  const opts = Object.assign({
    speed: 2.0,
    on: true,
    colorLeft: [1.0, 0.74, 0.05],
    colorRight: [0.23, 0.51, 0.96] // ThreeUI Default Blue Remix
  }, options);

  const gl = canvas.getContext("webgl", { antialias: true, alpha: true }) ||
             canvas.getContext("experimental-webgl", { antialias: true, alpha: true });
  if (!gl) return null;

  const hasDeriv = !!gl.getExtension("OES_standard_derivatives");
  const fragmentCode = (hasDeriv ? "#extension GL_OES_standard_derivatives : enable\n#define HAS_DERIVATIVES\n" : "") + THREEUI_SHADER_TOGGLE_FRAGMENT;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, THREEUI_SHADER_TOGGLE_VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentCode);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uUnit = gl.getUniformLocation(program, "uUnit");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uProgress = gl.getUniformLocation(program, "uProgress");
  const uColorLeft = gl.getUniformLocation(program, "uColorLeft");
  const uColorRight = gl.getUniformLocation(program, "uColorRight");

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  
  let startProgress = opts.on ? 1.0 : 0.0;
  let targetProgress = startProgress;
  let animStartTime = 0;
  const DURATION = 350; // 0.35s
  let progress = targetProgress;

  let simTime = 0;
  let lastNow = performance.now();
  let isRunning = true;
  let animId = null;

  function resize() {
    const cssW = canvas.clientWidth || 96;
    const cssH = canvas.clientHeight || 44;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function render(now) {
    if (!isRunning) return;
    const dt = Math.min(0.05, (now - lastNow) / 1000);
    lastNow = now;
    simTime += dt * opts.speed;

    if (progress !== targetProgress) {
      const elapsed = now - animStartTime;
      const t = Math.min(1.0, elapsed / DURATION);
      const easedT = cubicBezierEasing(t);
      progress = startProgress + (targetProgress - startProgress) * easedT;
      if (t >= 1.0) progress = targetProgress;
    }

    const unit = Math.min(canvas.width / 5.2, canvas.height / 2.3);

    gl.useProgram(program);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uUnit, unit);
    gl.uniform1f(uTime, simTime);
    gl.uniform1f(uProgress, progress);

    gl.uniform3f(uColorLeft, opts.colorLeft[0], opts.colorLeft[1], opts.colorLeft[2]);
    gl.uniform3f(uColorRight, opts.colorRight[0], opts.colorRight[1], opts.colorRight[2]);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    animId = requestAnimationFrame(render);
  }

  resize();
  animId = requestAnimationFrame(render);

  return {
    resize,
    setProgress(val) {
      const newTarget = val ? 1.0 : 0.0;
      if (newTarget !== targetProgress) {
        startProgress = progress;
        targetProgress = newTarget;
        animStartTime = performance.now();
      }
    },
    dispose() {
      isRunning = false;
      cancelAnimationFrame(animId);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    }
  };
}

class ThreeUISkeuomorphicToggle {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.isRight = options.initialState !== undefined ? options.initialState : true;
    this.canvas = this.container.querySelector(".shader-toggle__canvas");
    this.switchBtn = this.container.querySelector(".shader-toggle__switch");

    this.scene = null;
    if (this.canvas) {
      try {
        this.scene = createShaderToggleWebGLScene(this.canvas, {
          speed: 2.0,
          on: this.isRight,
          colorLeft: options.colorLeft,
          colorRight: options.colorRight
        });
      } catch (e) {
        console.warn("Shader init notice:", e);
      }
    }

    window.addEventListener("resize", () => {
      if (this.scene) this.scene.resize();
    });

    this.updateUI();
  }

  syncState(isRight) {
    this.isRight = isRight;
    this.updateUI();
  }

  updateUI() {
    this.container.setAttribute("data-state", this.isRight ? "on" : "off");

    if (this.switchBtn) {
      this.switchBtn.setAttribute("aria-checked", this.isRight ? "true" : "false");
    }

    if (this.scene) {
      this.scene.setProgress(this.isRight);
    }
  }
}

function initThreeUIEngine() {
  if (window._threeuiEngineInitialized) return;
  window._threeuiEngineInitialized = true;

  if (document.getElementById("threeuiFlowCanvas")) {
    window.threeuiFlowField = new ThreeUIFlowFieldBackground("threeuiFlowCanvas");
  }

  const savedPrefs = (() => {
    try { return JSON.parse(localStorage.getItem("commuter_prefs") || "{}"); } catch(e) { return {}; }
  })();

  const initialIsEvening = (savedPrefs && savedPrefs.trainId)
    ? (savedPrefs.trainId === "49007")
    : (new Date().getHours() >= 12);

  const initialIsDeboard = (savedPrefs && savedPrefs.alertTargetMode)
    ? (savedPrefs.alertTargetMode === "dest")
    : false;

  // 1. Train Switcher
  // Morning 49002 (Left): Radiant Sunrise Gold [1.0, 0.74, 0.05]
  // Evening 49007 (Right): ThreeUI Default Blue Remix [0.23, 0.51, 0.96]
  if (document.getElementById("skeuoTrainToggle")) {
    window.threeuiTrainToggle = new ThreeUISkeuomorphicToggle("skeuoTrainToggle", {
      initialState: initialIsEvening,
      colorLeft:  [1.0, 0.74, 0.05],
      colorRight: [0.23, 0.51, 0.96]
    });
  }

  // 2. Alert Target Switcher
  // Boarding (Left): Mint Emerald Green [0.06, 0.88, 0.44]
  // Deboarding (Right): Crimson Ruby Red [1.0, 0.16, 0.24]
  if (document.getElementById("skeuoTargetToggle")) {
    window.threeuiTargetToggle = new ThreeUISkeuomorphicToggle("skeuoTargetToggle", {
      initialState: initialIsDeboard,
      colorLeft:  [0.06, 0.88, 0.44],
      colorRight: [1.0, 0.16, 0.24]
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThreeUIEngine);
} else {
  initThreeUIEngine();
}
