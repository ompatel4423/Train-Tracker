// =========================================================================
// ThreeUI Engine for Chennai AC Local Train Tracker
// Integrates:
// 1. PortalFieldCollection (variant="flow-field") Background
// 2. SkeuomorphicToggleCollection (variant="shader") Dual-Theme WebGL Switches:
//    - Theme 0 (Train): Left = Morning 49002 (Yellow), Right = Evening 49007 (Cyan)
//    - Theme 1 (Target): Left = Boarding Arrival (Mint Green), Right = Deboarding Arrival (Violet Magenta)
// 3. GalleryHeading (variant="rising-diagonal") Kinetic Typography
// Powered by @designcodeio/threeui
// =========================================================================

// ─────────────────────────────────────────────────────────────────────────
// 1. Simplex Noise 3D Implementation (Flow Field Mathematics)
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// 2. PortalFieldCollection (variant="flow-field")
// ─────────────────────────────────────────────────────────────────────────
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
    this.density = 1.0;
    this.opacity = 1.0;
    this.hue = 0;

    const isMobile = window.innerWidth < 768;
    this.particleCount = isMobile ? 950 : 2000;
    this.noiseScale = 0.0024 / this.length;
    this.particles = [];
    this.time = 0;
    this.mouse = { x: -9999, y: -9999, active: false };

    // Chennai AC Electric Cyan / Cobalt transit palette
    this.palette = [
      { r: 6, g: 182, b: 212 },   // Electric Cyan
      { r: 2, g: 132, b: 199 },   // SR Blue
      { r: 14, g: 165, b: 233 },  // Sky Electric
      { r: 34, g: 211, b: 238 },  // Aqua Glow
      { r: 59, g: 130, b: 246 }   // Cobalt
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());

    window.addEventListener("pointermove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      this.mouse.active = false;
    });

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
    const mouseRadius = 130;
    const mouseForce = 2.0;

    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particles[i];
      const nx = p.x * this.noiseScale;
      const ny = p.y * this.noiseScale;
      const angle = this.noise.noise3D(nx, ny, this.time) * Math.PI * 2;
      const colorNoise = this.noise.noise3D(nx * 1.5 + 20, ny * 1.5 + 20, this.time * 0.7);

      let vx = Math.cos(angle) * p.speed * 1.2;
      let vy = Math.sin(angle) * p.speed * 1.2;

      if (this.mouse.active) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * mouseForce;
          vx += (dx / dist) * force;
          vy += (dy / dist) * force;
        }
      }

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
      this.ctx.strokeStyle = "rgba(" + c.r + "," + c.g + "," + c.b + "," + p.alpha + ")";
      this.ctx.lineWidth = p.size;
      this.ctx.stroke();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ─────────────────────────────────────────────────────────────────────────
// 3. SkeuomorphicToggleCollection (variant="shader") Dual-Theme WebGL Engine
// ─────────────────────────────────────────────────────────────────────────
const THREEUI_SHADER_TOGGLE_VERTEX = "attribute vec2 aPosition;\nvoid main() {\n  gl_Position = vec4(aPosition, 0.0, 1.0);\n}";
const THREEUI_SHADER_TOGGLE_FRAGMENT = `precision highp float;

uniform vec2 uRes;
uniform float uUnit;
uniform float uTime;
uniform float uOn;
uniform float uProgress;
uniform float uMode;
uniform vec2 uPointer;
uniform float uTheme;

const float R = 1.0;
const float L = 1.35;
const float TH = 0.78;
const float PI = 3.14159265359;

float hash11(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

vec2 hash21(float n) {
  return fract(sin(vec2(n * 127.1, n * 311.7)) * 43758.5453123);
}

float hash22(vec2 co) {
  return fract(sin(dot(mod(co, 512.0), vec2(12.9898, 78.233))) * 43758.5453123);
}

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
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * valueNoise(p);
    p = p * 2.03 + 11.3;
    amplitude *= 0.5;
  }
  return value;
}

float ridged(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    float n = 1.0 - abs(valueNoise(p) * 2.0 - 1.0);
    value += amplitude * n * n;
    p = p * 2.11 + 7.7;
    amplitude *= 0.5;
  }
  return value;
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

  // Theme 0: Train Switcher (Morning Sunrise Yellow -> Evening Electric Cyan)
  // LEFT: Intense Radiant Golden Yellow
  vec3 t0_mornAccent = vec3(1.0, 0.82, 0.05);
  vec3 t0_mornAccentWarm = vec3(1.0, 0.48, 0.02);
  vec3 t0_mornAccentCool = vec3(1.0, 0.98, 0.35);
  vec3 t0_mornSparkColor = vec3(1.0, 1.0, 0.70);

  // RIGHT: Intense Electric Cyan
  vec3 t0_eveAccent = vec3(0.04, 0.78, 1.0);
  vec3 t0_eveAccentWarm = vec3(0.12, 0.45, 1.0);
  vec3 t0_eveAccentCool = vec3(0.40, 0.96, 1.0);
  vec3 t0_eveSparkColor = vec3(0.70, 1.0, 1.0);

  // Theme 1: Target Arrival Switcher (Mint Green Boarding -> Violet/Magenta Deboarding)
  // LEFT: Intense Emerald Mint Green
  vec3 t1_boardAccent = vec3(0.06, 0.92, 0.50);
  vec3 t1_boardAccentWarm = vec3(0.02, 0.68, 0.36);
  vec3 t1_boardAccentCool = vec3(0.38, 1.0, 0.75);
  vec3 t1_boardSparkColor = vec3(0.75, 1.0, 0.88);

  // RIGHT: Intense Electric Crimson / Ruby Red
  vec3 t1_deboardAccent = vec3(1.0, 0.16, 0.22);
  vec3 t1_deboardAccentWarm = vec3(0.95, 0.05, 0.10);
  vec3 t1_deboardAccentCool = vec3(1.0, 0.38, 0.42);
  vec3 t1_deboardSparkColor = vec3(1.0, 0.82, 0.85);

  // Select left and right color palette based on theme (Train = 0, Target = 1)
  vec3 leftAccent = mix(t0_mornAccent, t1_boardAccent, uTheme);
  vec3 leftAccentWarm = mix(t0_mornAccentWarm, t1_boardAccentWarm, uTheme);
  vec3 leftCool = mix(t0_mornAccentCool, t1_boardAccentCool, uTheme);
  vec3 leftSparkColor = mix(t0_mornSparkColor, t1_boardSparkColor, uTheme);

  vec3 rightAccent = mix(t0_eveAccent, t1_deboardAccent, uTheme);
  vec3 rightAccentWarm = mix(t0_eveAccentWarm, t1_deboardAccentWarm, uTheme);
  vec3 rightCool = mix(t0_eveAccentCool, t1_deboardAccentCool, uTheme);
  vec3 rightSparkColor = mix(t0_eveSparkColor, t1_deboardSparkColor, uTheme);

  // Smoothly blend based on thumb position uProgress:
  vec3 accent = mix(leftAccent, rightAccent, pProg);
  vec3 accentWarm = mix(leftAccentWarm, rightAccentWarm, pProg);
  vec3 accentCool = mix(leftCool, rightCool, pProg);
  vec3 sparkColor = mix(leftSparkColor, rightSparkColor, pProg);

  /* Stage background */
  vec3 skyTop = vec3(0.045, 0.052, 0.075);
  vec3 skyBottom = vec3(0.012, 0.015, 0.025);
  vec3 color = mix(skyBottom, skyTop, smoothstep(-0.55, 0.55, screen.y));

  /* Bloom halo in the active theme accent (Yellow on Left, Cyan on Right, Mint on Left, Violet on Right) */
  float haloR = capsuleHalo(p * 0.985, 1.22);
  float haloG = capsuleHalo(p, 1.38);
  float haloB = capsuleHalo(p * 1.015, 1.52);
  vec3 halo = vec3(haloR, haloG, haloB) * mix(accent, accentWarm, 0.35);
  color += halo * 0.72;

  float d = sdCapsule(p, L, R);
  float inside = fill(d);

  /* ---- Trough interior ---------------------------------------------- */
  vec2 flowP = vec2(p.x * 0.72 - uTime * 0.3, p.y * 1.25);
  vec2 w = warp(flowP, uTime);
  float plasma = fbm(w * 1.5);
  float threads = ridged(vec2(w.x * 2.2, w.y * 3.4 + uTime * 0.16));

  /* Brushed striations along travel axis */
  float brushed = 0.5 + 0.5 * sin(p.y * 74.0 + fbm(w * 3.0) * 9.0);
  brushed *= 0.5 + 0.5 * valueNoise(vec2(p.x * 26.0, p.y * 4.0));

  /* Interference caustic bands */
  float caustic = pow(abs(sin(w.x * 3.6 - uTime * 1.5 + threads * 2.4)), 9.0);

  /* Micro lattice */
  vec2 cell = fract(p * vec2(22.0, 19.0)) - 0.5;
  float micro = stroke(length(cell) - 0.2, 0.035);

  /* Travelling charge front */
  float streak = pow(max(0.0, sin(p.x * 2.1 - uTime * 2.6 + plasma * 3.4)), 7.0);

  /* Fully energized luminous plasma trough on BOTH left and right */
  vec3 interior = mix(accent * 0.40, mix(accent, accentWarm, plasma * 0.85), 0.88);
  interior += accentCool * threads * threads * 0.60;
  interior += mix(accent, vec3(1.0), 0.55) * caustic * 0.50;
  interior += accentCool * micro * 0.12;
  interior *= 0.86 + 0.25 * brushed;
  interior += mix(accentCool, vec3(1.0), 0.50) * streak * 0.60;

  /* Inner shading depth */
  float trough = smoothstep(-R, R * 0.35, p.y);
  interior *= mix(0.55, 1.25, trough);

  /* ---- Sparks streaming continuously with comets --------------------- */
  vec3 sparks = vec3(0.0);
  for (int i = 0; i < 64; i++) {
    float fi = float(i);
    vec2 h = hash21(fi + 3.7);
    float phase = hash11(fi * 7.13 + 1.7);
    float weight = hash11(fi * 3.31 + 5.9);
    float life = fract(uTime * (0.24 + h.x * 0.38) + phase);
    float x = mix(-L - R * 0.55, L + R * 0.55, life);
    float y = (h.y - 0.5) * 1.52 * (0.32 + 0.68 * sin(life * PI)) + sin(life * 6.4 + fi) * 0.06;
    vec2 sp = p - vec2(x, y);
    sp.x *= 0.45;
    float fade = sin(life * PI);
    float grain = 1500.0 + 5200.0 * weight;
    float core = exp(-dot(sp, sp) * grain * 3.0);
    float tail = exp(-dot(sp, sp) * grain);
    float brightness = 0.40 + 0.60 * weight;
    sparks += mix(sparkColor, vec3(1.0), 0.65 * fade) * (tail * 0.60 + core) * fade * brightness;
  }
  interior += sparks * 2.4;

  color = mix(color, interior, inside);

  /* ---- Borders ------------------------------------------------------- */
  color *= 1.0 - stroke(d - 0.028, 0.026) * 0.35;
  vec3 rimColor = mix(accent, vec3(1.0), 0.35);
  color += rimColor * stroke(d, 0.013) * 1.1;
  float bevel = stroke(d + 0.062, 0.02) * smoothstep(-0.35, 0.85, p.y / R);
  color += mix(accentCool, vec3(1.0), 0.55) * bevel * 0.7;
  color += rimColor * exp(-abs(d) * 16.0) * 0.35 * inside;

  /* ---- Thumb --------------------------------------------------------- */
  float thumbX = mix(-L, L, uProgress);
  vec2 tp = p - vec2(thumbX, 0.0);
  float td = length(tp) - TH;
  float thumbIn = fill(td);
  vec2 disc = tp / TH;
  float discLength = min(1.0, length(disc));
  vec3 normal = normalize(vec3(disc, sqrt(max(1e-4, 1.0 - discLength * discLength))));

  vec2 shellUv = vec2(atan(normal.y, normal.x) * 1.6, normal.z * 2.4);
  float relief = valueNoise(shellUv * 15.0) * 0.6 + valueNoise(shellUv * 41.0) * 0.4;
  vec3 bumped = normalize(normal + vec3((relief - 0.5) * 0.035, (relief - 0.5) * 0.035, 0.0));

  vec3 light = normalize(vec3(-0.42 + uPointer.x * 0.35, 0.58 + uPointer.y * 0.35, 0.8));
  vec3 fillDir = normalize(vec3(0.62, -0.28, 0.55));
  vec3 rimDir = normalize(vec3(0.34, 0.5, -0.72));
  float diffuse = max(0.0, dot(bumped, light));
  float specular = pow(max(0.0, dot(reflect(-light, bumped), vec3(0.0, 0.0, 1.0))), 120.0);
  vec3 stretched = normalize(vec3(bumped.x * 0.28, bumped.y, bumped.z));
  float sheen = pow(max(0.0, dot(reflect(-light, stretched), vec3(0.0, 0.0, 1.0))), 16.0);
  float fillTerm = max(0.0, dot(bumped, fillDir));
  float rimTerm = pow(max(0.0, dot(bumped, rimDir)), 2.2) * pow(1.0 - max(0.0, normal.z), 1.6);
  float fresnel = pow(1.0 - max(0.0, normal.z), 2.6);

  vec3 thumbBase = vec3(0.78, 0.82, 0.90);
  vec3 thumbColor = thumbBase * (0.17 + 0.86 * diffuse * diffuse);
  thumbColor += thumbBase * mix(accentCool, vec3(1.0), 0.35) * fillTerm * 0.3;
  thumbColor += mix(accentCool, vec3(1.0), 0.5) * rimTerm * 0.55;
  thumbColor *= 0.975 + 0.05 * relief;
  thumbColor += mix(accent, accentWarm, 0.4) * fresnel * 0.65;
  thumbColor += vec3(1.0) * specular * 1.6;
  thumbColor += mix(vec3(1.0), accentCool, 0.35) * sheen * 0.13;
  thumbColor += mix(accent, accentWarm, 0.6) * 0.22;
  thumbColor += accentCool * smoothstep(0.2, -0.9, disc.y) * 0.22;
  thumbColor = thumbColor / (1.0 + thumbColor * 0.22);

  /* Center illuminated core jewel on the thumb */
  float coreDist = length(disc);
  float jewel = smoothstep(0.36, 0.08, coreDist);
  thumbColor = mix(thumbColor, mix(accentCool, vec3(1.0), 0.45) * 1.35, jewel * 0.9);

  /* Contact shadow under thumb */
  float contact = exp(-dot(tp * vec2(0.8, 1.6), tp * vec2(0.8, 1.6)) * 1.9);
  color *= 1.0 - contact * 0.42 * inside;

  color = mix(color, thumbColor, thumbIn);
  color += mix(vec3(1.0), accentCool, 0.4) * stroke(td, 0.01) * 0.3;
  color += mix(accent, accentWarm, 0.35) * exp(-max(0.0, td) * 7.0) * 0.35 * inside;

  /* ---- Grade --------------------------------------------------------- */
  color *= mix(0.86, 1.0, smoothstep(1.0, 0.2, length(screen * vec2(1.0, 1.25))));
  float grain = hash22(gl_FragCoord.xy + vec2(mod(uTime * 61.0, 512.0), mod(uTime * 37.0, 512.0)));
  color += (grain - 0.5) * 0.02;

  gl_FragColor = vec4(max(color, 0.0), 1.0);
}
`;

function createShaderToggleWebGLScene(canvas, options) {
  const opts = Object.assign({
    mode: "dark",
    speed: 1.0,
    size: 1.0,
    theme: "train", // "train" (Yellow/Cyan) or "target" (Mint Green/Violet Magenta)
    on: true // true = Right, false = Left
  }, options);

  const gl = canvas.getContext("webgl", { antialias: true, alpha: true }) ||
             canvas.getContext("experimental-webgl", { antialias: true, alpha: true });
  if (!gl) return null;

  const hasDerivatives = !!gl.getExtension("OES_standard_derivatives");
  const fragmentCode = (hasDerivatives ? "#extension GL_OES_standard_derivatives : enable\n#define HAS_DERIVATIVES\n" : "") + THREEUI_SHADER_TOGGLE_FRAGMENT;

  function compileShader(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("Shader compile error:", gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = compileShader(gl.VERTEX_SHADER, THREEUI_SHADER_TOGGLE_VERTEX);
  const fs = compileShader(gl.FRAGMENT_SHADER, fragmentCode);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }

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
  const uOn = gl.getUniformLocation(program, "uOn");
  const uProgress = gl.getUniformLocation(program, "uProgress");
  const uMode = gl.getUniformLocation(program, "uMode");
  const uPointer = gl.getUniformLocation(program, "uPointer");
  const uTheme = gl.getUniformLocation(program, "uTheme");

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let cssW = canvas.clientWidth || 140;
  let cssH = canvas.clientHeight || 52;
  let unit = Math.min(cssW / 5.2, cssH / 2.3) * opts.size;

  let targetProgress = opts.on ? 1.0 : 0.0;
  let progress = targetProgress;
  let velocity = 0;
  let simTime = 0;
  let lastNow = performance.now();
  let pointerX = 0, pointerY = 0;
  let smoothPtrX = 0, smoothPtrY = 0;
  let isRunning = true;
  let animId = null;
  const themeVal = (opts.theme === "target") ? 1.0 : 0.0;

  function resize() {
    cssW = canvas.clientWidth || 140;
    cssH = canvas.clientHeight || 52;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    unit = Math.min(cssW / 5.2, cssH / 2.3) * opts.size;
  }

  function render(now) {
    if (!isRunning) return;
    const dt = Math.min(0.05, (now - lastNow) / 1000);
    lastNow = now;
    simTime += dt * opts.speed;

    // High-fidelity spring physics for the brushed thumb
    const k = 175;
    const damping = 2 * Math.sqrt(k);
    velocity += (targetProgress - progress) * k * dt - velocity * damping * dt;
    progress += velocity * dt;

    // Smooth pointer deflection
    smoothPtrX += (pointerX - smoothPtrX) * Math.min(1.0, dt * 4.0);
    smoothPtrY += (pointerY - smoothPtrY) * Math.min(1.0, dt * 4.0);

    gl.useProgram(program);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uUnit, unit * dpr);
    gl.uniform1f(uTime, simTime);
    gl.uniform1f(uOn, 1.0); // Full energetic animation on both sides
    gl.uniform1f(uProgress, progress);
    gl.uniform1f(uMode, opts.mode === "dark" ? 1.0 : 0.0);
    gl.uniform2f(uPointer, smoothPtrX, smoothPtrY);
    gl.uniform1f(uTheme, themeVal);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    animId = requestAnimationFrame(render);
  }

  resize();
  animId = requestAnimationFrame(render);

  return {
    resize,
    setProgress(val) {
      targetProgress = val ? 1.0 : 0.0;
    },
    setPointer(x, y) {
      pointerX = x;
      pointerY = y;
    },
    dispose() {
      isRunning = false;
      cancelAnimationFrame(animId);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────
// 4. ThreeUI Skeuomorphic Toggle Component Controller (Universal)
// ─────────────────────────────────────────────────────────────────────────
class ThreeUISkeuomorphicToggle {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.onToggle = options.onToggle;
    this.theme = options.theme || "train";
    this.isRight = options.initialState !== undefined ? options.initialState : true;

    this.canvas = this.container.querySelector(".shader-toggle__canvas");
    this.thumb = this.container.querySelector(".shader-toggle__thumb");
    this.switchBtn = this.container.querySelector(".shader-toggle__switch");
    
    // Side labels
    const parent = this.container.closest(".skeuo-toggle-wrapper") || this.container.parentElement;
    this.leftSide = parent ? parent.querySelector(".skeuo-label-side.left") : null;
    this.rightSide = parent ? parent.querySelector(".skeuo-label-side.right") : null;

    this.scene = null;
    if (this.canvas) {
      try {
        this.scene = createShaderToggleWebGLScene(this.canvas, {
          mode: "dark",
          speed: 1.0,
          size: 1.0,
          theme: this.theme,
          on: this.isRight
        });
      } catch (err) {
        console.warn("ThreeUI ShaderToggle WebGL fallback:", err);
      }
    }

    this.setupEvents();
    this.updateUI();
  }

  setupEvents() {
    let startX = 0;
    let isDragging = false;
    let didMove = false;
    let lastActionTime = 0;

    const setSliderState = (toRight) => {
      const now = Date.now();
      if (this.isRight === toRight && now - lastActionTime < 250) return;
      lastActionTime = now;
      this.setState(toRight);
    };

    // Ensure switchBtn does not intercept touches
    if (this.switchBtn) {
      this.switchBtn.style.pointerEvents = "none";
    }

    // 1. Pointer Events on the slider container
    this.container.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
      isDragging = true;
      didMove = false;
      try { this.container.setPointerCapture(e.pointerId); } catch(err) {}
    });

    this.container.addEventListener("pointermove", (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      if (this.scene) {
        this.scene.setPointer(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
      }

      if (!isDragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) {
        didMove = true;
      }
    });

    const handlePointerEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try { this.container.releasePointerCapture(e.pointerId); } catch(err) {}

      const dx = e.clientX - startX;
      if (didMove && Math.abs(dx) > 10) {
        // User dragged or slid:
        // Sliding left (dx < 0) -> Left (Morning 49002 or Boarding)
        // Sliding right (dx > 0) -> Right (Evening 49007 or Deboarding)
        setSliderState(dx > 0);
      } else {
        // User clicked / tapped without sliding:
        const rect = this.container.getBoundingClientRect();
        const tapX = e.clientX - rect.left;
        if (tapX < rect.width * 0.48) {
          setSliderState(false);
        } else if (tapX > rect.width * 0.52) {
          setSliderState(true);
        } else {
          setSliderState(!this.isRight);
        }
      }
    };

    this.container.addEventListener("pointerup", handlePointerEnd);
    this.container.addEventListener("pointercancel", () => { isDragging = false; });

    // 1b. Native Touch Events for Mobile (iOS Safari / Netlify PWA)
    let touchStartX = 0;
    let touchMoved = false;

    this.container.addEventListener("touchstart", (e) => {
      if (!e.touches || e.touches.length === 0) return;
      touchStartX = e.touches[0].clientX;
      touchMoved = false;
      isDragging = false; // Prevent duplicate pointer handling
    }, { passive: true });

    this.container.addEventListener("touchmove", (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const curX = e.touches[0].clientX;
      const curY = e.touches[0].clientY;
      const dx = curX - touchStartX;
      if (Math.abs(dx) > 6) {
        touchMoved = true;
      }
      const rect = this.container.getBoundingClientRect();
      const x = ((curX - rect.left) / rect.width) * 2 - 1;
      const y = -(((curY - rect.top) / rect.height) * 2 - 1);
      if (this.scene) {
        this.scene.setPointer(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
      }
    }, { passive: true });

    this.container.addEventListener("touchend", (e) => {
      const endTouch = (e.changedTouches && e.changedTouches.length > 0) ? e.changedTouches[0] : null;
      const endX = endTouch ? endTouch.clientX : touchStartX;
      const dx = endX - touchStartX;

      if (touchMoved && Math.abs(dx) > 10) {
        // Slide left -> false (Morning 49002 / Boarding)
        // Slide right -> true (Evening 49007 / Deboarding)
        setSliderState(dx > 0);
      } else {
        const rect = this.container.getBoundingClientRect();
        const tapX = endX - rect.left;
        if (tapX < rect.width * 0.48) {
          setSliderState(false);
        } else if (tapX > rect.width * 0.52) {
          setSliderState(true);
        } else {
          setSliderState(!this.isRight);
        }
      }
    });

    this.container.addEventListener("touchcancel", () => {
      touchMoved = false;
    });

    // 2. Side Label Buttons
    if (this.leftSide) {
      this.leftSide.addEventListener("click", (e) => {
        e.preventDefault();
        setSliderState(false);
      });
      this.leftSide.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        setSliderState(false);
      });
      this.leftSide.addEventListener("touchend", (e) => {
        e.preventDefault();
        setSliderState(false);
      });
    }

    if (this.rightSide) {
      this.rightSide.addEventListener("click", (e) => {
        e.preventDefault();
        setSliderState(true);
      });
      this.rightSide.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        setSliderState(true);
      });
      this.rightSide.addEventListener("touchend", (e) => {
        e.preventDefault();
        setSliderState(true);
      });
    }

    this.container.addEventListener("pointerleave", () => {
      if (this.scene) this.scene.setPointer(0, 0);
    });

    window.addEventListener("resize", () => {
      if (this.scene) this.scene.resize();
    });
  }

  setState(isRight) {
    if (this.isRight === isRight) return;
    this.isRight = isRight;
    this.updateUI();

    if (typeof this.onToggle === "function") {
      this.onToggle(this.isRight);
    }
  }

  syncState(isRight) {
    if (this.isRight !== isRight) {
      this.isRight = isRight;
      this.updateUI();
    }
  }

  syncWithTrain(trainId) {
    this.syncState(trainId === "49007");
  }

  updateUI() {
    this.container.setAttribute("data-state", this.isRight ? "on" : "off");

    if (this.thumb) {
      this.thumb.style.transform = this.isRight ? "translateX(46px)" : "translateX(0px)";
    }

    if (this.switchBtn) {
      this.switchBtn.setAttribute("aria-checked", this.isRight ? "true" : "false");
    }

    if (this.scene) {
      this.scene.setProgress(this.isRight);
    }

    if (this.leftSide) {
      this.leftSide.classList.toggle("active", !this.isRight);
    }
    if (this.rightSide) {
      this.rightSide.classList.toggle("active", this.isRight);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// 5. Automatic Initialization
// ─────────────────────────────────────────────────────────────────────────
function initThreeUIEngine() {
  if (window._threeuiEngineInitialized) return;
  window._threeuiEngineInitialized = true;

  // Initialize PortalField flow-field
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

  // 1. Train Switcher (Theme 0: Morning Yellow 49002 <-> Evening Cyan 49007)
  if (document.getElementById("skeuoTrainToggle")) {
    window.threeuiTrainToggle = new ThreeUISkeuomorphicToggle("skeuoTrainToggle", {
      theme: "train",
      initialState: initialIsEvening,
      onToggle: (isEvening) => {
        if (window.app) {
          window.app.selectTrain(isEvening ? "49007" : "49002");
        }
      }
    });
    window.threeuiToggle = window.threeuiTrainToggle; // Backwards compatibility
  }

  // 2. Target Countdown Switcher (Theme 1: Mint Green Boarding <-> Ruby Red Deboarding)
  if (document.getElementById("skeuoTargetToggle")) {
    window.threeuiTargetToggle = new ThreeUISkeuomorphicToggle("skeuoTargetToggle", {
      theme: "target",
      initialState: initialIsDeboard,
      onToggle: (isDeboard) => {
        if (window.app) {
          window.app.setAlertTargetMode(isDeboard ? "dest" : "boarding");
        }
      }
    });
  }
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initThreeUIEngine);
} else {
  initThreeUIEngine();
}
