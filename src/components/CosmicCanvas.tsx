import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CosmicFilter } from '../data/epochs';

interface CosmicCanvasProps {
  scrollRef: React.MutableRefObject<number>;
  activeFilter: CosmicFilter;
  detonationPulseRef: React.MutableRefObject<number>;
}

export default function CosmicCanvas({
  scrollRef,
  activeFilter,
  detonationPulseRef,
}: CosmicCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<CosmicFilter>(activeFilter);

  useEffect(() => {
    filterRef.current = activeFilter;
  }, [activeFilter]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const dpr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2);

    const preExpBgColor = new THREE.Color(0x020204);
    const postExpBgColor = new THREE.Color(0x020204);
    const activeBgColor = new THREE.Color(0x020204);

    const scene = new THREE.Scene();
    scene.background = activeBgColor;
    const sceneFog = new THREE.FogExp2(0x020204, 0.0055);
    scene.fog = sceneFog;

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 350);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];

    // =========================================================================
    // 1. DEEP BACKGROUND MOVING STARFIELD
    //    - Pre-Explosion (Section 01): Preserves original ambient starfield look
    //    - Post-Explosion (Sections 02-08): Reveals the reference video's sweeping
    //      lower galactic band, upper-left blue star cluster, warm orange-red star,
    //      dark dust rift, and razor-sharp pinpoint star aesthetic.
    // =========================================================================
    const preExpStarCount = isSoftwareGl ? 1500 : 2800;
    const bgStarCount = isSoftwareGl ? 9500 : 18500;
    const bgStarGeo = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgStarCount * 3);
    const bgColors = new Float32Array(bgStarCount * 3);
    const bgSizes = new Float32Array(bgStarCount);
    const bgPhases = new Float32Array(bgStarCount);

    // Original Section 1 pre-explosion star palette
    const preExpPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#e2e8f0'),
      new THREE.Color('#bae6fd'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#c4b5fd'),
      new THREE.Color('#cbd5e1'),
      new THREE.Color('#f1f5f9'),
      new THREE.Color('#a5f3fc'),
    ];

    // Post-explosion reference video star palette (cool silver-white, steel-blue, ice-blue, and rare warm orange-red giants)
    const postExpPalette = [
      new THREE.Color('#ffffff'), // Pure pinpoint white
      new THREE.Color('#f1f5f9'), // Crisp silver-white
      new THREE.Color('#cbd5e1'), // Cool slate-silver
      new THREE.Color('#93c5fd'), // Steel-blue galactic star
      new THREE.Color('#bae6fd'), // Ice-blue OB star
      new THREE.Color('#e2e8f0'), // Soft starlight white
      new THREE.Color('#60a5fa'), // Deep sapphire-blue star
      new THREE.Color('#cbd5e1'), // Cool silver
    ];

    for (let i = 0; i < bgStarCount; i++) {
      const isPostExplosionLayer = i >= preExpStarCount;

      if (!isPostExplosionLayer) {
        // Wider spatial separation for Section 1 / base star layer
        bgPositions[i * 3] = (Math.random() - 0.5) * 250;
        bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 185;
        bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 220 - 38;

        const c = preExpPalette[i % preExpPalette.length];
        bgColors[i * 3] = c.r;
        bgColors[i * 3 + 1] = c.g;
        bgColors[i * 3 + 2] = c.b;

        const r = Math.random();
        bgSizes[i] = r > 0.96 ? 4.2 : r > 0.8 ? 2.6 : 1.5;
        bgPhases[i] = Math.random() * Math.PI * 2;
      } else {
        // Post-explosion reference video deep-space structures with wider spacing between stars
        const postIdx = i - preExpStarCount;
        const roll = Math.random();

        if (postIdx === 0) {
          // Primary signature orange-red giant star with 4-point diffraction spikes
          bgPositions[i * 3] = -26.5;
          bgPositions[i * 3 + 1] = 29.5;
          bgPositions[i * 3 + 2] = -68.0;
        } else if (postIdx >= 1 && postIdx <= 4) {
          // Additional prominent giant stars spaced further apart across the post-explosion sky
          const redGiantCoords = [
            [24.0, 19.5, -64.0],
            [-52.0, -7.5, -66.0],
            [44.0, -22.0, -70.0],
            [-12.5, -28.0, -62.0],
          ];
          const rg = redGiantCoords[postIdx - 1];
          bgPositions[i * 3] = rg[0];
          bgPositions[i * 3 + 1] = rg[1];
          bgPositions[i * 3 + 2] = rg[2];
        } else if (postIdx >= 5 && postIdx <= 20) {
          // Companion white star asterism with wider distance around the primary giant star
          const asterismOffsets = [
            [-4.2, 3.2, 0.2],
            [-3.7, 4.3, -0.3],
            [-2.2, 3.6, 0.1],
            [-1.1, 4.1, -0.2],
            [0.4, 5.1, 0.3],
            [-2.3, 5.8, -0.4],
            [-4.1, -0.4, 0.2],
            [-2.1, -2.5, -0.1],
            [-2.7, -3.5, 0.2],
            [0.1, -3.9, -0.2],
            [-1.2, -5.8, 0.1],
            [5.8, 6.2, -0.5],
            [5.4, 3.9, 0.2],
            [5.8, 3.6, -0.1],
            [3.2, -3.8, 0.3],
            [-5.6, 1.8, -0.2],
          ];
          const off = asterismOffsets[postIdx - 5];
          bgPositions[i * 3] = -26.5 + off[0] * 1.45;
          bgPositions[i * 3 + 1] = 29.5 + off[1] * 1.45;
          bgPositions[i * 3 + 2] = -68.0 + off[2] * 1.45;
        } else if (postIdx >= 21 && postIdx <= 52) {
          // Open star clusters with wider inter-star spacing
          const isLowerCluster = postIdx > 34;
          const cx = isLowerCluster ? -64.0 : -46.0;
          const cy = isLowerCluster ? -18.0 : 6.5;
          const cz = isLowerCluster ? -64.0 : -68.0;
          const spread = isLowerCluster ? 12.5 : 5.8;
          const a = Math.random() * Math.PI * 2.0;
          const r = Math.pow(Math.random(), 1.15) * spread;
          bgPositions[i * 3] = cx + Math.cos(a) * r;
          bgPositions[i * 3 + 1] = cy + Math.sin(a) * r * 0.85;
          bgPositions[i * 3 + 2] = cz + (Math.random() - 0.5) * 7.5;
        } else if (postIdx >= 53 && postIdx <= 57) {
          // Prominent beacon stars with wider separation
          const blueBeaconCoords = [
            [-42.0, 18.5, -65.0],
            [-33.5, 13.5, -66.5],
            [30.5, -14.0, -64.0],
            [34.2, -16.8, -65.0],
            [36.5, -23.0, -63.5],
          ];
          const bb = blueBeaconCoords[postIdx - 53];
          bgPositions[i * 3] = bb[0];
          bgPositions[i * 3 + 1] = bb[1];
          bgPositions[i * 3 + 2] = bb[2];
        } else if (roll < 0.28) {
          // Diagonal Galactic Plane Star Band with wider spacing
          const along = (Math.random() - 0.5) * 265.0;
          const perp = (Math.random() - 0.5) * (Math.random() < 0.65 ? 28.0 : 58.0);
          const tiltAngle = 0.275;
          const ca = Math.cos(tiltAngle);
          const sa = Math.sin(tiltAngle);
          bgPositions[i * 3] = along * ca - perp * sa;
          bgPositions[i * 3 + 1] = along * sa + perp * ca;
          bgPositions[i * 3 + 2] = -46.0 - Math.random() * 145.0;
        } else if (roll < 0.50) {
          // Sweeping lower galactic star-cloud arc with wider spacing
          const x = (Math.random() - 0.5) * 270.0;
          const arcY = -44.0 + Math.pow(x / 115.0, 2.0) * 16.0 + (Math.random() - 0.5) * 38.0;
          const z = -45.0 - Math.random() * 150.0;
          bgPositions[i * 3] = x;
          bgPositions[i * 3 + 1] = arcY;
          bgPositions[i * 3 + 2] = z;
        } else if (roll < 0.66) {
          // Upper-left star-forming cluster with wider spacing
          const angle = Math.random() * Math.PI * 2.0;
          const rad = Math.pow(Math.random(), 1.15) * 42.0;
          bgPositions[i * 3] = -30.0 + Math.cos(angle) * rad * 1.45;
          bgPositions[i * 3 + 1] = 44.0 + Math.sin(angle) * rad * 0.85;
          bgPositions[i * 3 + 2] = -58.0 - Math.random() * 105.0;
        } else {
          // Deep-field stars filling a larger 3D volume so stars have ample distance between them
          const u = (Math.random() - 0.5) * 2.0;
          const phi = Math.acos(u);
          const theta = Math.random() * Math.PI * 2.0;
          const rad = 60.0 + Math.random() * 155.0;
          let px = Math.sin(phi) * Math.cos(theta) * rad;
          let py = Math.cos(phi) * rad;
          if (py > -10.0 && py < 11.0 && px < 10.0 && Math.random() < 0.42) {
            py -= 28.0;
          }
          bgPositions[i * 3] = px;
          bgPositions[i * 3 + 1] = py;
          bgPositions[i * 3 + 2] = -Math.abs(Math.sin(phi) * Math.sin(theta) * rad) - 22.0;
        }

        const isProminentBgGiant = postIdx <= 4 || (postIdx % 140 === 0 && roll > 0.45);
        const isSpikedOrangeGiant = isProminentBgGiant && postIdx % 2 === 0;
        const isWhiteBeacon =
          (isProminentBgGiant && postIdx % 2 === 1) || (postIdx >= 53 && postIdx <= 57);
        const isMediumWarm = !isProminentBgGiant && postIdx % 52 === 0 && roll > 0.35;
        const isMediumWhite = !isProminentBgGiant && postIdx % 52 === 26 && roll > 0.35;

        let c: THREE.Color;
        if (isSpikedOrangeGiant) {
          c = new THREE.Color('#ea580c'); // Rich crimson-amber / burnt-orange giant
        } else if (isWhiteBeacon) {
          c = new THREE.Color('#ffffff'); // Balanced crisp pure-white giant beacon star
        } else if (postIdx >= 5 && postIdx <= 20) {
          c = new THREE.Color('#f8fafc'); // Crisp pure white asterism companions
        } else if (isMediumWarm) {
          c = new THREE.Color('#fdba74');
        } else if (isMediumWhite) {
          c = new THREE.Color('#ffffff');
        } else {
          c = postExpPalette[postIdx % postExpPalette.length];
        }
        bgColors[i * 3] = c.r;
        bgColors[i * 3 + 1] = c.g;
        bgColors[i * 3 + 2] = c.b;

        const r = Math.random();
        bgSizes[i] =
          postIdx === 0
            ? 24.0
            : isSpikedOrangeGiant || isWhiteBeacon
            ? 17.5 + Math.random() * 5.0
            : isMediumWarm || isMediumWhite
            ? 3.2 + Math.random() * 1.4
            : postIdx >= 5 && postIdx <= 9
            ? 3.8 + Math.random() * 0.9
            : postIdx >= 10 && postIdx <= 20
            ? 2.2 + Math.random() * 1.1
            : postIdx >= 21 && postIdx <= 52
            ? 2.2 + Math.random() * 1.8
            : r > 0.98
            ? 3.4
            : r > 0.90
            ? 2.2
            : r > 0.58
            ? 1.45
            : 0.95;
        // Phase >= 60.0 marks a glowing white giant star; >= 40.0 marks a spiked orange-red giant; >= 20.0 standard post-explosion star
        bgPhases[i] =
          Math.random() * Math.PI * 2 +
          (isWhiteBeacon ? 60.0 : isSpikedOrangeGiant ? 40.0 : 20.0);
      }
    }

    bgStarGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgStarGeo.setAttribute('aColor', new THREE.BufferAttribute(bgColors, 3));
    bgStarGeo.setAttribute('aSize', new THREE.BufferAttribute(bgSizes, 1));
    bgStarGeo.setAttribute('aPhase', new THREE.BufferAttribute(bgPhases, 1));
    disposables.push(bgStarGeo);

    const bgStarMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr },
        uScrollWarp: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHoverActive: { value: 0 },
      },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uScrollWarp;
        uniform vec2 uMouse;
        uniform float uHoverActive;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vHover;
        varying float vPostExpBlend;
        varying float vSpikedGiant;
        varying float vBlueBeacon;

        void main() {
          vColor = aColor;
          float isBackPostExp = step(10.0, aPhase);
          vBlueBeacon = step(55.0, aPhase);
          vSpikedGiant = step(35.0, aPhase) * (1.0 - vBlueBeacon);
          float phase = mod(aPhase, 10.0);

          // 0.0 in Section 1 before explosion; progresses from 0.0 to 1.0 after Big Bang explosion
          float rawExp = clamp((uScrollWarp - 0.095) / 0.905, 0.0, 1.0);
          float postExpBlend = smoothstep(0.095, 0.20, uScrollWarp);
          vPostExpBlend = max(isBackPostExp, postExpBlend);

          vec3 targetPos = position;
          float randSpeedA = fract(sin(phase * 12.9898) * 43758.5453);
          float randSpeedB = fract(sin(phase * 78.233) * 24634.6345);

          // Continuous 3D orbital & peculiar motion synchronized with foreground stars and cosmic objects
          float driftSpeedX = 0.18 + 0.32 * randSpeedA;
          float driftSpeedY = 0.14 + 0.28 * randSpeedB;
          targetPos.x += sin(uTime * driftSpeedX + phase) * (0.85 + 1.15 * randSpeedB);
          targetPos.y += cos(uTime * driftSpeedY + phase * 1.3) * (0.72 + 0.95 * randSpeedA);

          // Continuous outward radial expansion & gentle Keplerian spiral across the full scroll while staying framed in the viewport
          float baseGrow = pow(rawExp, 0.68 + 0.18 * randSpeedB);
          float radialGrow = baseGrow * (0.98 + 0.44 * rawExp);
          float keplerSwirl = (1.0 - baseGrow) * (0.55 + 0.35 * randSpeedA) * (randSpeedB > 0.5 ? 1.0 : -1.0)
            + rawExp * (0.16 + 0.12 * randSpeedA)
            + uTime * (0.012 + 0.014 * randSpeedB);
          float cs = cos(keplerSwirl);
          float sn = sin(keplerSwirl);

          vec2 swirledXY = vec2(
            targetPos.x * cs - targetPos.y * sn,
            targetPos.x * sn + targetPos.y * cs
          ) * radialGrow;
          float zOrigin = -32.0;
          vec3 pos = vec3(swirledXY, mix(zOrigin, targetPos.z, baseGrow));

          // Multi-layer depth parallax coupled with mouse hover
          float depthFactor = clamp((pos.z + 115.0) / 165.0, 0.18, 1.25);
          pos.x += uMouse.x * 6.5 * depthFactor;
          pos.y += uMouse.y * 4.8 * depthFactor;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vec4 clipPos = projectionMatrix * mvPosition;

          vec2 ndc = clipPos.xy / max(0.0001, clipPos.w);
          vec2 toMouse = ndc - uMouse;
          float mouseDist = length(toMouse);
          float hoverMask = smoothstep(0.36, 0.0, mouseDist) * uHoverActive;

          gl_Position = clipPos;
          float twinkleFreq = mix(2.2, 1.4, vPostExpBlend);
          float twinkleAmp = mix(0.38, 0.22, vPostExpBlend);
          float twinkle = (1.0 - twinkleAmp) + twinkleAmp * sin(uTime * twinkleFreq + phase);
          vHover = hoverMask;

          // Sharp, pinpoint stars twinkle behind the orb and headline
          float starReveal = mix(0.92 + 0.08 * twinkle, smoothstep(0.01, 0.18 + 0.32 * randSpeedA, rawExp), isBackPostExp);
          float dustDim = 1.0;
          if (isBackPostExp < 0.5 && pos.y > -12.0 && pos.y < 12.0 && pos.x < 10.0) {
            dustDim = mix(1.0, 0.55, postExpBlend);
          }

          float depthBrightness = mix(
            clamp(1.28 - (-mvPosition.z / 165.0), 0.25, 1.0),
            clamp(1.28 - (-mvPosition.z / 180.0), 0.28, 0.98),
            vPostExpBlend
          );
          vAlpha = min(1.0, (twinkle * depthBrightness * dustDim + hoverMask * 0.35) * starReveal);

          float postExpHoverScale = 1.0 + hoverMask * 0.65;
          float maxPostSize = (vSpikedGiant > 0.5 || vBlueBeacon > 0.5) ? 34.0 : 7.2;
          float postExpSize = clamp((aSize * mix(0.72, 1.0, isBackPostExp)) * postExpHoverScale * starReveal * uPixelRatio * (21.0 / max(1.0, -mvPosition.z)), 0.0, maxPostSize);

          gl_PointSize = postExpSize;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vHover;
        varying float vPostExpBlend;
        varying float vSpikedGiant;
        varying float vBlueBeacon;
        void main() {
          if (vAlpha <= 0.002) discard;
          vec2 uv = gl_PointCoord.xy - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;

          if (vBlueBeacon > 0.5) {
            // Luminous Pure-White / Diamond-White Giant Star with soft halo & 4-point diffraction spikes (balancing the orange-red giants)
            float ca = 0.990;
            float sa = 0.139;
            vec2 rUv = vec2(uv.x * ca - uv.y * sa, uv.x * sa + uv.y * ca);

            float whiteCore = exp(-d * d * 115.0);
            float whiteInnerHalo = exp(-d * 8.2) * 0.78;
            float silverOuterMist = exp(-d * 4.4) * 0.36;
            float spikeVert = exp(-abs(rUv.x) * 48.0) * exp(-abs(rUv.y) * 5.2);
            float spikeHoriz = exp(-abs(rUv.y) * 48.0) * exp(-abs(rUv.x) * 5.2);
            float spikes = (spikeVert + spikeHoriz) * 0.92 * smoothstep(0.5, 0.05, d);

            float totalGlow = clamp(whiteCore + whiteInnerHalo + silverOuterMist + spikes, 0.0, 1.0);
            vec3 beaconCol = mix(vec3(0.82, 0.90, 1.0), vec3(1.0, 1.0, 1.0), clamp(whiteCore + whiteInnerHalo * 0.8 + spikes * 0.7, 0.0, 1.0));
            gl_FragColor = vec4(beaconCol, totalGlow * vAlpha);
            return;
          }

          if (vSpikedGiant > 0.5) {
            // Luminous Orange-Red Giant Star with 4-point telescope diffraction spikes (matching reference image)
            // Slight ~8 degree tilt matching the telescope diffraction cross in the reference photo
            float ca = 0.990;
            float sa = 0.139;
            vec2 rUv = vec2(uv.x * ca - uv.y * sa, uv.x * sa + uv.y * ca);

            float intenseCore = exp(-d * d * 115.0);
            float warmAmberCorona = exp(-d * 8.2) * 0.78;
            float outerCrimsonGlow = exp(-d * 4.4) * 0.36;

            // Crisp 4-point telescope diffraction spikes tapering out from the orange-red giant
            float spikeVert = exp(-abs(rUv.x) * 48.0) * exp(-abs(rUv.y) * 5.2);
            float spikeHoriz = exp(-abs(rUv.y) * 48.0) * exp(-abs(rUv.x) * 5.2);
            float spikes = (spikeVert + spikeHoriz) * 0.92 * smoothstep(0.5, 0.05, d);

            float totalGlow = clamp(intenseCore + warmAmberCorona + outerCrimsonGlow + spikes, 0.0, 1.0);
            vec3 crimsonHalo = vec3(0.86, 0.24, 0.06);
            vec3 brightOrange = vec3(0.99, 0.54, 0.18);
            vec3 hotWhiteGold = vec3(1.0, 0.98, 0.92);

            vec3 giantCol = mix(crimsonHalo, brightOrange, clamp(warmAmberCorona + spikes * 0.75, 0.0, 1.0));
            giantCol = mix(giantCol, hotWhiteGold, clamp(intenseCore * 1.15 + spikes * 0.35, 0.0, 1.0));
            gl_FragColor = vec4(giantCol, totalGlow * vAlpha);
            return;
          }

          // Pre-explosion Section 1 soft star glow vs Post-explosion razor-sharp documentary pinpoint core
          float core = exp(-d * d * mix(28.0, 44.0, vPostExpBlend));
          float skirt = exp(-d * mix(5.2, 7.5, vPostExpBlend)) * mix(0.65, 0.28, vPostExpBlend);
          float glow = clamp(core + skirt, 0.0, 1.0);
          vec3 finalCol = mix(vColor, vec3(1.0), core * 0.55 + vHover * mix(0.6, 0.35, vPostExpBlend));
          gl_FragColor = vec4(finalCol, glow * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(bgStarMat);

    const bgStarField = new THREE.Points(bgStarGeo, bgStarMat);
    scene.add(bgStarField);

    const cameraLookTarget = new THREE.Vector3();

    // =========================================================================
    // 2. SECTION 01: REALISTIC QUARK-GLUON PLASMA CORE (10^32 K Relativistic Fluid)
    //    - 3D Domain-Warped MHD Boiling Photosphere + Supergranulation Cells
    //    - Chromospheric Spicule & Flare Shell
    //    - 3D Arched Coronal Magnetic Flux Loops (Prominences)
    //    - High-Energy Quark-Antiquark Annihilation Sparks & Dual Radiation Corona
    // =========================================================================
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const moonGeo = new THREE.IcosahedronGeometry(0.92, isSoftwareGl ? 32 : 64);
    disposables.push(moonGeo);

    const moonMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uStress: { value: 0 },
        uExplodeFade: { value: 1 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uStress;
        varying vec3 vObjPos;
        varying vec3 vObjNormal;
        varying vec3 vWorldPos;
        varying mat3 vNormalMat;
        varying float vDisplacement;

        float hash(vec3 p) {
          p = fract(p * vec3(443.897, 441.423, 437.195));
          p += dot(p, p.yzx + 19.19);
          return fract((p.x + p.y) * p.z);
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }

        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.06;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 nPos = normalize(position);
          vObjPos = nPos;
          vObjNormal = normalize(normal);
          vNormalMat = normalMatrix;

          float speed = 0.55 + uStress * 1.85;
          vec3 flow = vec3(uTime * speed, -uTime * speed * 0.82, uTime * speed * 0.60);

          // Multi-scale boiling MHD convection displacement
          vec3 warp = vec3(
            fbm(nPos * 3.0 + flow),
            fbm(nPos * 3.0 - flow + 4.1),
            fbm(nPos * 3.0 + flow * 0.7 + 8.3)
          );
          float convection = fbm(nPos * 4.6 + warp * 2.1);
          float microBoil = fbm(nPos * 10.5 - flow * 1.8) * 0.35;

          float pulseWave = sin(nPos.x * 7.0 + uTime * 4.8) * cos(nPos.y * 7.0 - uTime * 4.2) * 0.004;
          float disp = (convection - 0.46) * (0.012 + uStress * 0.14) + microBoil * 0.006 + pulseWave;
          vDisplacement = disp;

          vec3 tremor = vec3(
            sin(uTime * 54.0 + position.y * 18.0),
            cos(uTime * 49.0 + position.z * 18.0),
            sin(uTime * 58.0 + position.x * 18.0)
          ) * (uStress * uStress * 0.045);

          vec3 displaced = position + normal * disp + tremor;
          vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
          vWorldPos = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uStress;
        uniform float uExplodeFade;
        varying vec3 vObjPos;
        varying vec3 vObjNormal;
        varying vec3 vWorldPos;
        varying mat3 vNormalMat;
        varying float vDisplacement;

        float hash(vec3 p) {
          p = fract(p * vec3(443.897, 441.423, 437.195));
          p += dot(p, p.yzx + 19.19);
          return fract((p.x + p.y) * p.z);
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }

        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p *= 2.08;
            a *= 0.5;
          }
          return v;
        }

        // Ridged multifractal for sharp, realistic magnetic plasma filaments & electric arcs
        float ridgedFbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          float weight = 1.0;
          for (int i = 0; i < 4; i++) {
            float n = 1.0 - abs(noise(p) * 2.0 - 1.0);
            n = n * n * weight;
            weight = clamp(n * 1.8, 0.0, 1.0);
            v += n * a;
            p *= 2.15;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          if (uExplodeFade <= 0.001) discard;

          vec3 p = normalize(vObjPos);
          float t = uTime * (0.48 + uStress * 1.6);

          // Domain-warped 3D magneto-hydrodynamic (MHD) convection
          vec3 q = vec3(
            fbm(p * 3.4 + vec3(0.0, t * 0.45, t * 0.28)),
            fbm(p * 3.4 + vec3(5.2, -t * 0.38, 1.3)),
            fbm(p * 3.4 + vec3(2.1, 1.7, -t * 0.42))
          );
          vec3 r = vec3(
            fbm(p * 6.0 + 2.5 * q + vec3(1.7, 9.2, t * 0.58)),
            fbm(p * 6.0 + 2.5 * q + vec3(8.3, 2.8, -t * 0.52)),
            fbm(p * 6.0 + 2.5 * q + vec3(3.4, -t * 0.55, 6.1))
          );
          float fluidTurbulence = fbm(p * 7.2 + 2.8 * r);
          float fineGranulation = fbm(p * 16.0 - 2.4 * q);

          // Razor-sharp incandescent magnetic filament veins & subsurface plasma fissures
          float plasmaVeins = ridgedFbm(p * 5.2 + r * 1.65 - vec3(t * 0.32));
          float microVeins  = ridgedFbm(p * 11.5 - q * 1.8 + vec3(t * 0.48));
          float filamentIntensity = pow(clamp(plasmaVeins * 0.72 + microVeins * 0.42, 0.0, 1.0), 2.4);

          // Deep convection hotspots glowing inside the dark singularity cavity
          float emberCells = smoothstep(0.52, 0.84, fluidTurbulence * 0.68 + fineGranulation * 0.32);

          vec3 geoN = normalize(vNormalMat * vObjNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float geoNdotV = max(dot(geoN, viewDir), 0.0);

          // Radial distance from center of sphere projection (0 = dead center, 1 = outer limb)
          float radialLimb = sqrt(max(0.0, 1.0 - geoNdotV * geoNdotV));
          float boundaryWarp = (fluidTurbulence - 0.5) * 0.18 + (plasmaVeins - 0.5) * 0.11 + (fineGranulation - 0.5) * 0.06;
          float warpedLimb = clamp(radialLimb + boundaryWarp, 0.0, 1.0);

          // 1. LUMINOUS SWIRLING ELECTRIC-BLUE / CYAN PLASMA CORE (Matching reference orb interior)
          vec3 deepSapphire    = vec3(0.024, 0.240, 0.560);
          vec3 royalCobalt     = vec3(0.045, 0.460, 0.860);
          vec3 electricBlue    = vec3(0.140, 0.720, 0.990);
          vec3 brightCyan      = vec3(0.520, 0.920, 1.000);
          vec3 plasmaIceWhite  = vec3(0.960, 0.995, 1.000);

          float swirlBand = smoothstep(0.14, 0.82, fluidTurbulence * 0.68 + fineGranulation * 0.32);
          float brightCloud = smoothstep(0.36, 0.78, fluidTurbulence + (plasmaVeins - 0.25) * 0.40);

          vec3 coreCol = mix(deepSapphire, royalCobalt, smoothstep(0.08, 0.52, swirlBand));
          coreCol = mix(coreCol, electricBlue, clamp(emberCells * 0.88 + swirlBand * 0.32, 0.0, 1.0));
          coreCol = mix(coreCol, brightCyan, brightCloud * 0.72);
          coreCol += brightCyan * filamentIntensity * 0.78;
          coreCol += plasmaIceWhite * pow(filamentIntensity, 2.0) * 0.68;

          // 2. SEAMLESS CYAN-WHITE LIMB MERGING DIRECTLY INTO THE HALO RING
          float rimCurve = pow(warpedLimb, 4.2);
          float ringMask = smoothstep(0.70, 0.95, warpedLimb);
          float hotRimPeak = smoothstep(0.84, 0.98, warpedLimb);
          vec3 ringCol = mix(electricBlue, brightCyan, smoothstep(0.66, 0.89, warpedLimb + plasmaVeins * 0.14));
          ringCol = mix(ringCol, plasmaIceWhite, clamp(hotRimPeak * 0.96 + rimCurve * 0.48, 0.0, 1.0));

          vec3 col = mix(coreCol, ringCol * 1.30, ringMask);

          // Pre-detonation runaway supercritical flash
          col = mix(col, plasmaIceWhite * 1.8, pow(uStress, 2.2) * 0.94);

          // Keep sphere edge solid enough to meet the additive halo ring seamlessly
          float edgeFeather = smoothstep(0.01, 0.18, geoNdotV + (fluidTurbulence - 0.5) * 0.08);
          gl_FragColor = vec4(col, edgeFeather * uExplodeFade);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    disposables.push(moonMat);

    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);

    // 2B. 3D Magnetic Plasma Eruptions Shell (Organic filamentary tongues without any hard geometric rim)
    const chromoGeo = new THREE.IcosahedronGeometry(1.02, isSoftwareGl ? 28 : 48);
    disposables.push(chromoGeo);
    const chromoMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uStress: { value: 0 },
        uExplodeFade: { value: 1 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uStress;
        varying vec3 vObjPos;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying float vSpicule;

        float hash(vec3 p) {
          p = fract(p * vec3(443.897, 441.423, 437.195));
          p += dot(p, p.yzx + 19.19);
          return fract((p.x + p.y) * p.z);
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }

        void main() {
          vec3 nPos = normalize(position);
          vObjPos = nPos;
          vNormal = normalize(normalMatrix * normal);

          float r1 = 1.0 - abs(noise(nPos * 5.5 + vec3(uTime * 1.25, -uTime * 0.95, uTime * 0.70)) * 2.0 - 1.0);
          float r2 = 1.0 - abs(noise(nPos * 12.0 - vec3(uTime * 1.75, uTime * 1.35, -uTime * 1.05)) * 2.0 - 1.0);
          float spicule = pow(clamp(r1 * 0.65 + r2 * 0.35, 0.0, 1.0), 2.8);
          vSpicule = spicule;

          vec3 displaced = position + normal * spicule * (0.015 + uStress * 0.16);
          vec4 wp = modelMatrix * vec4(displaced, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uStress;
        uniform float uExplodeFade;
        varying vec3 vObjPos;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying float vSpicule;

        void main() {
          if (uExplodeFade <= 0.001) discard;
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float ndotv = abs(dot(vNormal, viewDir));
          // Silky soft outer rim glow with zero hard polygonal teeth
          float ringZone = smoothstep(0.54, 0.30, ndotv) * smoothstep(0.14, 0.32, ndotv);

          vec3 deepSapphire = vec3(0.02, 0.44, 0.84);
          vec3 cherenkovCyan = vec3(0.32, 0.85, 1.00);
          vec3 hotIceWhite = vec3(0.96, 0.99, 1.00);

          float filament = pow(vSpicule, 2.0);
          vec3 col = mix(deepSapphire, cherenkovCyan, 0.55 + 0.30 * sin(uTime * 1.8 + vObjPos.x * 6.0));
          col = mix(col, hotIceWhite, smoothstep(0.30, 0.78, filament));

          float alpha = ringZone * filament * (0.38 + uStress * 0.35) * uExplodeFade * 0.45;
          gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.42));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(chromoMat);
    const chromoMesh = new THREE.Mesh(chromoGeo, chromoMat);
    moonGroup.add(chromoMesh);

    // Unused placeholder material reference kept for uniform update compatibility
    const prominenceMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uStress: { value: 0 },
        uExplodeFade: { value: 1 },
      },
    });
    disposables.push(prominenceMat);

    // 2D. Fine Ejected Pinpoint Plasma Sparks Scattered Around the Blazing Ring & Rays (Matching reference image)
    const qgpSparkCount = isSoftwareGl ? 180 : 320;
    const qgpSparkPos = new Float32Array(qgpSparkCount * 3);
    const qgpSparkPhase = new Float32Array(qgpSparkCount);
    for (let i = 0; i < qgpSparkCount; i++) {
      const theta = Math.random() * Math.PI * 2.0;
      const zSpread = (Math.random() - 0.5) * 0.55;
      const ringRad = 0.94 + Math.pow(Math.random(), 1.6) * 0.52;
      qgpSparkPos[i * 3] = ringRad * Math.cos(theta);
      qgpSparkPos[i * 3 + 1] = ringRad * Math.sin(theta);
      qgpSparkPos[i * 3 + 2] = zSpread;
      qgpSparkPhase[i] = Math.random() * Math.PI * 2;
    }
    const qgpSparkGeo = new THREE.BufferGeometry();
    qgpSparkGeo.setAttribute('position', new THREE.BufferAttribute(qgpSparkPos, 3));
    qgpSparkGeo.setAttribute('aPhase', new THREE.BufferAttribute(qgpSparkPhase, 1));
    disposables.push(qgpSparkGeo);

    const qgpSparkMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uStress: { value: 0 },
        uExplodeFade: { value: 1 },
      },
      vertexShader: `
        attribute float aPhase;
        uniform float uTime;
        uniform float uStress;
        varying float vAlpha;
        varying float vTone;
        void main() {
          float speed = 1.4 + uStress * 3.2;
          float angle = uTime * (0.14 + fract(aPhase) * 0.20) + aPhase * 0.25;
          float c = cos(angle);
          float s = sin(angle);
          vec3 p = position;
          vec3 rotated = vec3(p.x * c - p.y * s, p.x * s + p.y * c, p.z);
          float drift = 0.94 + 0.10 * fract(uTime * 0.25 + aPhase / 6.2831) + uStress * 0.14;
          vec4 mv = modelViewMatrix * vec4(rotated * drift, 1.0);
          gl_Position = projectionMatrix * mv;
          float blink = 0.40 + 0.60 * pow(0.5 + 0.5 * sin(uTime * (3.6 + speed) + aPhase * 5.0), 2.2);
          vAlpha = blink;
          vTone = fract(aPhase * 1.73);
          gl_PointSize = clamp((10.0 + 11.5 * blink) / max(1.0, -mv.z), 1.2, 5.5);
        }
      `,
      fragmentShader: `
        uniform float uExplodeFade;
        varying float vAlpha;
        varying float vTone;
        void main() {
          if (uExplodeFade <= 0.001) discard;
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float core = exp(-d * d * 48.0);
          float halo = exp(-d * 9.5) * 0.42;
          vec3 col = mix(vec3(0.20, 0.64, 1.0), vec3(0.65, 0.94, 1.0), vTone);
          col = mix(col, vec3(1.0), clamp(core * 1.25, 0.0, 1.0));
          gl_FragColor = vec4(col * 1.35, clamp(core + halo, 0.0, 1.0) * vAlpha * uExplodeFade);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(qgpSparkMat);
    const qgpSparkPoints = new THREE.Points(qgpSparkGeo, qgpSparkMat);
    moonGroup.add(qgpSparkPoints);

    // 2E. Realistic High-Dynamic-Range (HDR) Volumetric Blue Plasma Corona, Ridged Fire Filaments & Flare Hotspots
    const haloGeo = new THREE.PlaneGeometry(5.2, 5.2, 1, 1);
    disposables.push(haloGeo);
    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uStress: { value: 0 },
        uExplodeFade: { value: 1 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv * 2.0 - 1.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uStress;
        uniform float uExplodeFade;
        varying vec2 vUv;

        float hash21(vec2 p) {
          p = fract(p * vec2(127.1, 311.7));
          p += dot(p, p + 34.23);
          return fract(p.x * p.y);
        }

        float noise2(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
            mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float fbm2(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
          for (int i = 0; i < 4; i++) {
            v += a * noise2(p);
            p = rot * p * 2.06;
            a *= 0.5;
          }
          return v;
        }

        // Ridged multifractal 2D for razor-sharp, realistic solar plasma tongues & coronal shock arcs
        float ridgedFbm2(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          float w = 1.0;
          mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
          for (int i = 0; i < 4; i++) {
            float n = 1.0 - abs(noise2(p) * 2.0 - 1.0);
            n = n * n * w;
            w = clamp(n * 1.9, 0.0, 1.0);
            v += n * a;
            p = rot * p * 2.12;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          if (uExplodeFade <= 0.001) discard;
          float r = length(vUv);
          if (r > 1.0) discard;

          float angle = atan(vUv.y, vUv.x);
          vec2 dir = vUv / max(r, 1e-4);
          vec2 tang = vec2(-dir.y, dir.x);
          float t = uTime * (0.52 + uStress * 1.45);

          // 1. DOMAIN-WARPED MAGNETO-PLASMA TURBULENCE & RIDGED FLAME FILAMENTS
          vec2 advectedUv = vUv * 4.2 - dir * t * 0.55;
          float curlA = fbm2(advectedUv + vec2(t * 0.28, -t * 0.22));
          float curlB = fbm2(vUv * 8.4 + tang * (curlA - 0.5) * 1.4 - dir * t * 0.72);
          float plasmaFilaments = ridgedFbm2(vUv * 6.8 + dir * (curlA - 0.5) * 1.6 - dir * t * 0.65);
          float fineFilaments   = ridgedFbm2(vUv * 13.5 - tang * (curlB - 0.5) * 1.2 - dir * t * 0.95);

          float radialWarp = (curlA - 0.5) * 0.026 + (plasmaFilaments - 0.5) * 0.018;
          float rWarped = max(0.0, r + radialWarp);

          // Smooth inner mask starting inside moonGeo's perimeter so there is zero gap between core and ring
          float innerHoleMask = smoothstep(0.245, 0.320, rWarped);

          // Soft inward-curling cyan plasma tendrils connecting the bright ring to the swirling interior
          float innerTongues = exp(-pow((rWarped - 0.305) / 0.028, 2.0))
                             * pow(clamp(plasmaFilaments * 0.72 + fineFilaments * 0.42, 0.0, 1.0), 1.6) * 0.82;

          // 2. SILKY INCANDESCENT WHITE-HOT RING WRAPPED IN ELECTRIC CYAN HALO (Seated seamlessly on sphere rim)
          float ringSpine = exp(-pow((rWarped - 0.338) / 0.020, 2.0)) * innerHoleMask * (1.06 + 0.36 * plasmaFilaments);
          float ringTurbulence = exp(-pow((rWarped - 0.347) / 0.042, 2.0)) * innerHoleMask
                               * (0.72 + 0.48 * pow(plasmaFilaments * 0.65 + fineFilaments * 0.35, 1.5));
          float ringOuterAtmosphere = exp(-pow((rWarped - 0.372) / 0.128, 2.0)) * smoothstep(0.20, 0.34, rWarped) * 0.62;

          // 3. ORGANIC CIRCUMFERENTIAL CORONAL FLARE WISPS (Cohesive around the ring without off-center white blobs)
          float ringFlareBand = exp(-pow((rWarped - 0.342) / 0.026, 2.0)) * innerHoleMask;
          float angularShimmer = 0.5 + 0.5 * sin(angle * 3.0 + t * 0.6 + curlA * 3.4);
          float hotspots = ringFlareBand * (0.28 + 0.42 * pow(plasmaFilaments, 1.8) * angularShimmer);

          // 4. SOFT SILKY CORONAL LIGHT RAYS RADIATING SMOOTHLY INTO THE STARFIELD
          float rayNoiseA = noise2(vec2(angle * 8.0 + sin(t * 0.22), r * 2.4 - t * 0.55));
          float rayNoiseB = noise2(vec2(angle * 20.0 - cos(t * 0.18), r * 3.8 - t * 0.85));
          float softRays = pow(0.5 + 0.5 * sin(angle * 36.0 + rayNoiseA * 5.2), 2.8);
          float filamentStreams = pow(0.5 + 0.5 * cos(angle * 14.0 - rayNoiseB * 4.0), 2.2);
          float rayStructure = softRays * 0.48 + filamentStreams * 0.38 + plasmaFilaments * 0.22;

          float rayEnvelope = smoothstep(0.31, 0.365, rWarped)
                            * exp(-max(0.0, r - 0.35) * 5.4)
                            * smoothstep(0.84, 0.44, r);
          float coronalRays = rayStructure * rayEnvelope * 0.58;

          // 5. FINE PINPOINT WHITE/CYAN PLASMA SPARKS SCATTERED AROUND THE CORONA
          vec2 sparkGrid = vUv * 32.0;
          vec2 sCell = floor(sparkGrid);
          vec2 sFract = fract(sparkGrid) - vec2(0.5);
          float sRand = hash21(sCell);
          vec2 sJitter = (vec2(hash21(sCell + 11.3), hash21(sCell + 27.9)) - vec2(0.5)) * 0.62;
          float sDist = length(sFract - sJitter);
          float sparkZone = exp(-pow((r - 0.44) / 0.115, 2.0));
          float microSparks = exp(-sDist * sDist * 260.0) * step(0.82, sRand) * sparkZone
                            * (0.65 + 0.35 * sin(uTime * 4.2 + sRand * 14.0));

          // 6. HIGH-CONTRAST WHITE-HOT RING + LUMINOUS CYAN/SAPPHIRE CORONA
          vec3 deepCobalt        = vec3(0.015, 0.360, 0.720);
          vec3 electricCobalt    = vec3(0.045, 0.580, 0.950);
          vec3 cherenkovAzure    = vec3(0.380, 0.880, 1.000);
          vec3 relativisticWhite = vec3(1.000, 1.000, 1.000);

          float energy = ringSpine * 1.45
                       + ringTurbulence * 0.85
                       + ringOuterAtmosphere * 0.65
                       + coronalRays * 0.55
                       + innerTongues * 0.65
                       + hotspots * 0.90
                       + microSparks * 1.05;
          energy *= (1.0 + uStress * 0.75);

          vec3 rawCol = deepCobalt * (ringOuterAtmosphere * 0.85 + coronalRays * 0.65)
                      + electricCobalt * (ringTurbulence * 1.05 + coronalRays * 0.85 + innerTongues * 0.70)
                      + cherenkovAzure * (ringSpine * 1.15 + ringOuterAtmosphere * 0.70 + innerTongues * 0.80 + hotspots * 0.75)
                      + relativisticWhite * (pow(ringSpine, 1.75) * 1.45 + hotspots * 1.10 + microSparks * 1.15);

          vec3 hdrCol = (rawCol * (2.51 * rawCol + 0.03)) / (rawCol * (2.43 * rawCol + 0.59) + 0.14);

          float outerVignette = smoothstep(0.86, 0.46, r);
          float alpha = clamp(energy * outerVignette * 0.92, 0.0, 0.94) * uExplodeFade;

          gl_FragColor = vec4(hdrCol * 1.22, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(haloMat);
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    moonGroup.add(haloMesh);

    // =========================================================================
    // 3. SECTION 02: CINEMATIC BIG BANG EXPLOSION (MATCHING REFERENCE VIDEO)
    //    - Stage 1 (00:00-00:01): Iridescent quantum halo imploding to infinite-density pinpoint
    //    - Stage 2 (00:02): Blinding white-gold organic fireball + dense 360° fine needle starburst
    //    - Stage 3 (00:03-00:04): Unfurling Emerald-Green, Warm Amber-Gold & Rose-Violet
    //      primordial nebula shock clouds + 3D radial star-streak needles flying past camera
    // =========================================================================
    const blastSphereGeo = new THREE.SphereGeometry(1.0, isSoftwareGl ? 40 : 64, isSoftwareGl ? 40 : 64);
    disposables.push(blastSphereGeo);

    const blastSphereMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uShockProgress: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uShockProgress;
        varying vec3 vObjPos;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying float vShockDisp;

        float hash(vec3 p) {
          p = fract(p * vec3(443.897, 441.423, 437.195));
          p += dot(p, p.yzx + 19.19);
          return fract((p.x + p.y) * p.z);
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }

        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.05;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 nPos = normalize(position);
          vObjPos = nPos;
          float rtLobes = fbm(nPos * 3.8 - vec3(uTime * 0.85));
          float fineRipples = noise(nPos * 9.5 + vec3(uTime * 1.6));
          float disp = ((rtLobes - 0.48) * 0.22 + (fineRipples - 0.5) * 0.06) * sin(uShockProgress * 3.14159265);
          vShockDisp = rtLobes;

          vec3 displaced = position + normal * disp;
          vec4 wp = modelMatrix * vec4(displaced, 1.0);
          vWorldPos = wp.xyz;
          vNormal = normalize(normalMatrix * normalize(displaced));
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uShockProgress;
        varying vec3 vObjPos;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying float vShockDisp;

        float hash(vec3 p) {
          p = fract(p * vec3(443.897, 441.423, 437.195));
          p += dot(p, p.yzx + 19.19);
          return fract((p.x + p.y) * p.z);
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }

        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.08;
            a *= 0.5;
          }
          return v;
        }

        float ridgedFbm(vec3 p) {
          float v = 0.0;
          float a = 0.55;
          for (int i = 0; i < 4; i++) {
            float n = 1.0 - abs(noise(p) * 2.0 - 1.0);
            v += a * n * n;
            p *= 2.12;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          float emerge = smoothstep(0.08, 0.24, uShockProgress);
          float fadeOut = 1.0 - smoothstep(0.72, 1.0, uShockProgress);
          float life = emerge * fadeOut;
          if (life <= 0.001) discard;

          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float ndotv = abs(dot(normalize(vNormal), viewDir));
          float primaryShockRim = pow(1.0 - ndotv, 2.4);

          vec3 warp = vec3(
            fbm(vObjPos * 3.2 + uTime * 0.45),
            fbm(vObjPos * 3.2 + vec3(4.2, 1.8, 7.1) - uTime * 0.45),
            fbm(vObjPos * 3.2 + vec3(8.5, 3.1, 2.4))
          );
          float shockFilaments = ridgedFbm(vObjPos * 4.6 + warp * 1.85 - vec3(0.0, uTime * 0.35, 0.0));
          float cloudDensity = fbm(vObjPos * 3.8 + warp * 2.1);
          float regionMask = fbm(vObjPos * 2.2 - warp * 1.2);

          // Cosmic Blue & Subtle Crisp White Primordial Shock Palette:
          // Deep Cobalt Blue + Electric Sapphire Blue + Celestial Ice-Blue + Subtle White filament highlights
          vec3 deepCobaltBlue   = vec3(0.08, 0.34, 0.92);
          vec3 electricBlue     = vec3(0.20, 0.56, 1.00);
          vec3 celestialIceBlue = vec3(0.46, 0.76, 1.00);
          vec3 crispBlueWhite   = vec3(0.92, 0.97, 1.00);

          vec3 nebCol = mix(deepCobaltBlue, electricBlue, smoothstep(0.28, 0.72, regionMask));
          nebCol = mix(nebCol, celestialIceBlue, smoothstep(0.55, 0.86, cloudDensity) * 0.55);
          // Subtle white highlight along the sharpest shock filaments and initial burst
          float earlyFlash = 1.0 - smoothstep(0.10, 0.32, uShockProgress);
          float whiteHighlight = clamp(earlyFlash * 0.45 + pow(shockFilaments, 2.6) * 0.38, 0.0, 0.75);
          vec3 col = mix(nebCol, crispBlueWhite, whiteHighlight);

          float filamentGlow = pow(shockFilaments, 1.85) * (0.45 + 0.55 * primaryShockRim);
          float billowGlow = smoothstep(0.30, 0.78, cloudDensity) * (0.35 + 0.65 * primaryShockRim);
          float alpha = (billowGlow * 0.52 + filamentGlow * 0.55) * life;

          gl_FragColor = vec4(col * 1.32, clamp(alpha, 0.0, 0.68));
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(blastSphereMat);
    const blastSphereMesh = new THREE.Mesh(blastSphereGeo, blastSphereMat);
    scene.add(blastSphereMesh);

    // Camera-Facing Cinematic Big Bang Core, Fine Needle Starburst & Blue-White Nebular Shock Cloud
    const shockGeo = new THREE.PlaneGeometry(3.4, 3.4, 1, 1);
    disposables.push(shockGeo);
    const shockMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uShockProgress: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv * 2.0 - 1.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uShockProgress;
        varying vec2 vUv;

        float hash21(vec2 p) {
          p = fract(p * vec2(127.1, 311.7));
          p += dot(p, p + 34.23);
          return fract(p.x * p.y);
        }

        float noise2(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
            mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float fbm2(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
          for (int i = 0; i < 4; i++) {
            v += a * noise2(p);
            p = rot * p * 2.05;
            a *= 0.5;
          }
          return v;
        }

        float ridged2(vec2 p) {
          float v = 0.0;
          float a = 0.55;
          mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
          for (int i = 0; i < 4; i++) {
            float n = 1.0 - abs(noise2(p) * 2.0 - 1.0);
            v += a * n * n;
            p = rot * p * 2.12;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          float fade = sin(clamp(uShockProgress, 0.0, 1.0) * 3.14159265);
          if (fade <= 0.001) discard;
          float r = length(vUv);
          if (r > 1.0) discard;

          float angle = atan(vUv.y, vUv.x);
          vec2 dirUv = vUv / max(r, 1e-4);

          // 1. COMPACT WHITE-BLUE CENTRAL CORE & ELECTRIC-BLUE CORONA
          float coreWarp = (fbm2(vUv * 5.5 + vec2(uTime * 0.8, -uTime * 0.6)) - 0.5) * 0.075;
          float rCore = max(0.0, r + coreWarp);
          float burstSwelling = smoothstep(0.04, 0.18, uShockProgress) * (1.0 - smoothstep(0.22, 0.62, uShockProgress) * 0.52);
          float coreScale = mix(0.035, 0.14, burstSwelling);
          // Tight little white core with a wider luminous blue corona
          float blindingCore = exp(-pow(rCore / max(0.018, coreScale), 2.4)) * 1.15;
          float blueCorona = exp(-rCore * mix(10.5, 4.6, burstSwelling)) * 0.92;

          // 2. DENSE 360-DEGREE FINE BLUE-WHITE NEEDLE STARBURST RAYS
          float needlePhase = smoothstep(0.05, 0.16, uShockProgress) * (1.0 - smoothstep(0.32, 0.72, uShockProgress));
          float ang1 = sin(angle * 140.0 + noise2(vec2(angle * 18.0, uShockProgress * 6.0)) * 6.28);
          float ang2 = cos(angle * 230.0 - noise2(vec2(angle * 29.0, uTime * 0.5)) * 6.28);
          float fineNeedles = pow(max(0.0, ang1 * 0.55 + ang2 * 0.45), 3.2);
          float radialStreakNoise = noise2(vec2(r * 24.0 - uShockProgress * 18.0, angle * 32.0));
          float needleEnv = smoothstep(0.03, 0.14, r) * smoothstep(0.88, 0.22, r);
          float needleBurst = (fineNeedles * (0.45 + 0.85 * radialStreakNoise) + exp(-r * 3.8) * 0.32) * needleEnv * needlePhase * 1.40;

          // 3. BILLOWING COSMIC BLUE & ICE-WHITE NEBULA SHOCK CLOUD
          float nebulaPhase = smoothstep(0.16, 0.38, uShockProgress);
          vec2 flowUv = vUv * 2.8 - dirUv * (uShockProgress * 1.65 + uTime * 0.18);
          vec2 q = vec2(fbm2(flowUv), fbm2(flowUv + vec2(4.3, 2.1)));
          float cloudBillows = fbm2(flowUv * 1.4 + q * 1.85);
          float caustics = ridged2(vUv * 4.5 - dirUv * (uShockProgress * 2.1) + q * 1.2);

          // Radial expansion shell for the blue nebula shock clouds
          float shellRadius = mix(0.18, 0.68, smoothstep(0.14, 0.92, uShockProgress));
          float rWarped = r + (cloudBillows - 0.5) * 0.22;
          float nebRingEnv = exp(-pow((rWarped - shellRadius) / 0.28, 2.0)) * smoothstep(0.98, 0.58, r);
          float innerWhiteBlueEnv = exp(-pow((rWarped - shellRadius * 0.50) / 0.18, 2.0));

          // Blue & Little White palette:
          vec3 deepRoyalBlue = vec3(0.08, 0.32, 0.92);
          vec3 electricSapphire = vec3(0.20, 0.58, 1.00);
          vec3 skyIceBlue = vec3(0.48, 0.78, 1.00);
          vec3 softWhiteBlue = vec3(0.86, 0.94, 1.00);
          vec3 pureWhite = vec3(0.96, 0.99, 1.00);

          float sectorMix = smoothstep(-0.35, 0.45, sin(angle * 2.0 + 0.6) + (q.x - 0.5) * 0.8);
          vec3 outerNebCol = mix(deepRoyalBlue, mix(electricSapphire, skyIceBlue, caustics), sectorMix);
          vec3 nebCol = mix(outerNebCol, softWhiteBlue, clamp(innerWhiteBlueEnv * 0.45 + pow(caustics, 2.4) * 0.32, 0.0, 0.65));

          float nebIntensity = (cloudBillows * 0.72 + pow(caustics, 1.6) * 0.68) * nebRingEnv * nebulaPhase;

          // Needle rays are predominantly electric/ice blue with a touch of crisp white on the sharpest streaks
          vec3 needleCol = mix(electricSapphire, pureWhite, clamp(fineNeedles * 0.55 + exp(-r * 5.0) * 0.35, 0.0, 0.75));

          vec3 finalCol = nebCol * nebIntensity * 1.35;
          finalCol += needleCol * needleBurst * 1.25;
          finalCol += electricSapphire * blueCorona + pureWhite * blindingCore * 0.85;

          float radialEdgeFade = smoothstep(1.0, 0.72, r);
          float totalAlpha = clamp((blindingCore * 0.85 + blueCorona * 0.85 + needleBurst * 0.95 + nebIntensity * 0.88) * radialEdgeFade * fade, 0.0, 0.95);

          gl_FragColor = vec4(finalCol, totalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(shockMat);
    const shockRing = new THREE.Mesh(shockGeo, shockMat);
    scene.add(shockRing);

    // 3C. 3D Radial Starburst Needles & Flying Relativistic Star-Streaks (Frames 00:02 - 00:04)
    const needleCount = isSoftwareGl ? 450 : 950;
    const needlePositions = new Float32Array(needleCount * 2 * 3);
    const needleDirs = new Float32Array(needleCount * 2 * 3);
    const needleAttribs = new Float32Array(needleCount * 2 * 3); // x: endpointFlag (0=inner, 1=outer), y: speed, z: seed

    for (let i = 0; i < needleCount; i++) {
      const u = (Math.random() - 0.5) * 2.0;
      const phi = Math.acos(u);
      const theta = Math.random() * Math.PI * 2.0;
      const dx = Math.sin(phi) * Math.cos(theta);
      const dy = Math.cos(phi);
      const dz = Math.sin(phi) * Math.sin(theta);

      const speed = 6.0 + Math.pow(Math.random(), 0.75) * 24.0;
      const seed = Math.random();

      const baseIdx = i * 6;
      needleDirs[baseIdx] = dx;
      needleDirs[baseIdx + 1] = dy;
      needleDirs[baseIdx + 2] = dz;
      needleDirs[baseIdx + 3] = dx;
      needleDirs[baseIdx + 4] = dy;
      needleDirs[baseIdx + 5] = dz;

      needleAttribs[baseIdx] = 0.0;
      needleAttribs[baseIdx + 1] = speed;
      needleAttribs[baseIdx + 2] = seed;

      needleAttribs[baseIdx + 3] = 1.0;
      needleAttribs[baseIdx + 4] = speed;
      needleAttribs[baseIdx + 5] = seed;
    }

    const bigBangNeedleGeo = new THREE.BufferGeometry();
    bigBangNeedleGeo.setAttribute('position', new THREE.BufferAttribute(needlePositions, 3));
    bigBangNeedleGeo.setAttribute('aDir', new THREE.BufferAttribute(needleDirs, 3));
    bigBangNeedleGeo.setAttribute('aNeedle', new THREE.BufferAttribute(needleAttribs, 3));
    disposables.push(bigBangNeedleGeo);

    const bigBangNeedleMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uShockProgress: { value: 0 },
      },
      vertexShader: `
        attribute vec3 aDir;
        attribute vec3 aNeedle;
        uniform float uTime;
        uniform float uShockProgress;
        varying float vAlpha;
        varying float vTip;

        void main() {
          float isOuter = aNeedle.x;
          float speed = aNeedle.y;
          float seed = aNeedle.z;
          vTip = isOuter;

          // Erupt outward right after the pinpoint singularity (uShockProgress > 0.05)
          float burstT = max(0.0, uShockProgress - 0.04) / 0.96;
          float baseDist = pow(burstT, 0.78) * speed * (0.55 + 0.65 * seed);
          // Needle length stretches during the 00:02 starburst, then forms crisp flying streaks at 00:03-00:04
          float streakLen = (0.45 + 1.35 * fract(seed * 7.13)) * sin(clamp(burstT * 1.25, 0.0, 1.0) * 3.14159);
          float r = baseDist + isOuter * streakLen;

          vec3 pos = aDir * r;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

          float appear = smoothstep(0.04, 0.14, uShockProgress);
          float fade = 1.0 - smoothstep(0.58, 0.96, uShockProgress);
          vAlpha = appear * fade * (0.35 + 0.65 * isOuter);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vTip;
        void main() {
          if (vAlpha <= 0.002) discard;
          vec3 electricBlue = vec3(0.22, 0.58, 1.00);
          vec3 crispIceWhite = vec3(0.88, 0.95, 1.00);
          vec3 col = mix(electricBlue, crispIceWhite, vTip * 0.65);
          gl_FragColor = vec4(col, vAlpha * 0.82);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(bigBangNeedleMat);
    const bigBangNeedleLines = new THREE.LineSegments(bigBangNeedleGeo, bigBangNeedleMat);
    scene.add(bigBangNeedleLines);

    // =========================================================================
    // 5. SECTION 04 & SECTION 05: BILLOWING NEBULAE (JWST Domain-Warped Pillars & Dust Lanes)
    // =========================================================================
    // 5B. Realistic Deep-Space Galactic Star-Clouds, Dark Dust Lanes, Faint Distant Galaxies
    //     + Sculpted Bottom-Right Indigo-Violet/Cyan-Rim Molecular Pillars, Emerald-Teal Veil & Left Plum Haze
    const nebulaCloudCount = isSoftwareGl ? 14 : 20;
    const nebulaPlaneGeo = new THREE.PlaneGeometry(1.0, 1.0, 1, 1);
    const nebulaInstGeo = new THREE.InstancedBufferGeometry();
    nebulaInstGeo.index = nebulaPlaneGeo.index;
    nebulaInstGeo.attributes.position = nebulaPlaneGeo.attributes.position;
    nebulaInstGeo.attributes.uv = nebulaPlaneGeo.attributes.uv;
    disposables.push(nebulaPlaneGeo, nebulaInstGeo);

    const nebDirs = new Float32Array(nebulaCloudCount * 3);
    const nebCoreColors = new Float32Array(nebulaCloudCount * 3);
    const nebRimColors = new Float32Array(nebulaCloudCount * 3);
    const nebDustColors = new Float32Array(nebulaCloudCount * 3);
    const nebParams = new Float32Array(nebulaCloudCount * 4); // x: scale, y: seed, z: speed, w: aspect/tilt

    // Authentic Deep-Space Documentary Palettes + Attached Nebula Image Palettes
    const nebulaSpectra: {
      core: THREE.Color;
      rim: THREE.Color;
      dust: THREE.Color;
    }[] = [
      {
        // 0: Upper-Left Star-Forming Cloud (Crisp Ice-White Core + Steel-Blue Mist & Dark Slate Dust)
        core: new THREE.Color('#e2e8f0'),
        rim: new THREE.Color('#60a5fa'),
        dust: new THREE.Color('#090d16'),
      },
      {
        // 1: Sweeping Galactic Band Cloud (Silver-Blue Starlight + Deep Cobalt Mist)
        core: new THREE.Color('#cbd5e1'),
        rim: new THREE.Color('#3b82f6'),
        dust: new THREE.Color('#050811'),
      },
      {
        // 2: Faint Distant Spiral/Elliptical Galaxy Smudge (Soft Ivory-Silver Core + Slate Disk)
        core: new THREE.Color('#f1f5f9'),
        rim: new THREE.Color('#94a3b8'),
        dust: new THREE.Color('#0f172a'),
      },
      {
        // 3: Deep-Field Ionized H-II Patch (Cool Azure-White + Subtle Slate-Indigo)
        core: new THREE.Color('#e0f2fe'),
        rim: new THREE.Color('#64748b'),
        dust: new THREE.Color('#020617'),
      },
      {
        // 4: Bottom-Right Sculpted Molecular Dust Pillar (Luminous Cyan-Silver Rim + Deep Indigo-Violet Fold + Obsidian Dust)
        core: new THREE.Color('#7dd3fc'),
        rim: new THREE.Color('#4c1d95'),
        dust: new THREE.Color('#050714'),
      },
      {
        // 5: Mid-Right / Upper-Right Emerald-Teal & Deep Cyan Atmospheric Veil
        core: new THREE.Color('#2dd4bf'),
        rim: new THREE.Color('#0f766e'),
        dust: new THREE.Color('#021014'),
      },
      {
        // 6: Left-Side Deep Violet-Plum / Magenta Nebula Haze
        core: new THREE.Color('#a855f7'),
        rim: new THREE.Color('#4a154b'),
        dust: new THREE.Color('#0c0414'),
      },
    ];

    // Anchor clusters combining the existing universe with the new nebula features:
    // Clusters 0..5: Existing upper-left blue cluster & sweeping lower galactic arc
    // Clusters 6..9: Existing distant deep-field galaxies across the dark void
    // Clusters 10..12: Bottom-right sculpted indigo-violet & cyan-rim molecular dust pillars (from attached image)
    // Clusters 13..14: Mid-right / upper-right emerald-teal atmospheric veil (from attached image)
    // Clusters 15..16: Left-side deep plum / violet-magenta nebula haze (from attached image)
    const clusterCount = 17;
    const clusterCenters: THREE.Vector3[] = [
      new THREE.Vector3(-0.38, 0.56, -0.73).normalize(),  // 0: Upper-left bright blue nebula cluster
      new THREE.Vector3(-0.62, -0.48, -0.62).normalize(), // 1: Bottom-left galactic band
      new THREE.Vector3(-0.24, -0.58, -0.78).normalize(), // 2: Bottom-mid-left galactic band
      new THREE.Vector3(0.18, -0.60, -0.78).normalize(),  // 3: Bottom-mid-right galactic band
      new THREE.Vector3(0.58, -0.46, -0.67).normalize(),  // 4: Bottom-right galactic band
      new THREE.Vector3(-0.48, 0.42, -0.77).normalize(),  // 5: Upper-left secondary cloud
      new THREE.Vector3(0.45, 0.34, -0.82).normalize(),   // 6: Upper-right distant galaxy field
      new THREE.Vector3(0.12, 0.14, -0.98).normalize(),   // 7: Center-right distant galaxy smudge
      new THREE.Vector3(-0.52, -0.12, -0.84).normalize(), // 8: Mid-left faint galaxy smudge
      new THREE.Vector3(0.64, -0.08, -0.76).normalize(),  // 9: Far-right faint galaxy smudge
      new THREE.Vector3(0.44, -0.34, -0.74).normalize(),  // 10: Bottom-right primary sculpted molecular pillar
      new THREE.Vector3(0.28, -0.46, -0.76).normalize(),  // 11: Bottom-right lower sweeping cyan-rimmed ridge
      new THREE.Vector3(0.56, -0.20, -0.74).normalize(),  // 12: Bottom-right upper billowing indigo-blue peak
      new THREE.Vector3(0.36, 0.08, -0.82).normalize(),   // 13: Mid-right emerald-teal diffuse veil
      new THREE.Vector3(0.58, 0.18, -0.76).normalize(),   // 14: Upper-right dark teal-cyan atmospheric mist
      new THREE.Vector3(-0.54, 0.06, -0.78).normalize(),  // 15: Mid-left deep plum / violet-magenta haze
      new THREE.Vector3(-0.62, -0.24, -0.72).normalize(), // 16: Lower-left violet-indigo nebula glow
    ];
    const clusterSpeeds: number[] = [
      32.0, 37.0, 35.0, 36.0, 39.0, 34.0,
      50.0, 56.0, 48.0, 53.0,
      31.5, 33.0, 34.5,
      36.5, 38.5,
      35.0, 37.0,
    ];

    for (let i = 0; i < nebulaCloudCount; i++) {
      const cIdx = i % clusterCount;
      const baseDir = clusterCenters[cIdx];
      const isSculptedPillar = cIdx >= 10 && cIdx <= 12;
      const isTealVeil = cIdx === 13 || cIdx === 14;
      const isPlumHaze = cIdx === 15 || cIdx === 16;
      const isDistantGalaxy = cIdx >= 6 && cIdx <= 9;

      const jitterScale = isSculptedPillar ? 0.18 : 0.28;
      const jitter = new THREE.Vector3(
        (Math.random() - 0.5) * jitterScale,
        (Math.random() - 0.5) * jitterScale,
        (Math.random() - 0.5) * jitterScale
      );
      const dir = baseDir.clone().add(jitter).normalize();

      nebDirs[i * 3] = dir.x;
      nebDirs[i * 3 + 1] = dir.y;
      nebDirs[i * 3 + 2] = dir.z;

      const palette = isSculptedPillar
        ? nebulaSpectra[4]
        : isTealVeil
        ? nebulaSpectra[5]
        : isPlumHaze
        ? nebulaSpectra[6]
        : isDistantGalaxy
        ? nebulaSpectra[2]
        : nebulaSpectra[i % 4];

      nebCoreColors[i * 3] = palette.core.r;
      nebCoreColors[i * 3 + 1] = palette.core.g;
      nebCoreColors[i * 3 + 2] = palette.core.b;

      nebRimColors[i * 3] = palette.rim.r;
      nebRimColors[i * 3 + 1] = palette.rim.g;
      nebRimColors[i * 3 + 2] = palette.rim.b;

      nebDustColors[i * 3] = palette.dust.r;
      nebDustColors[i * 3 + 1] = palette.dust.g;
      nebDustColors[i * 3 + 2] = palette.dust.b;

      const worldScale = isDistantGalaxy
        ? 2.4 + Math.random() * 2.4
        : isSculptedPillar
        ? 10.5 + Math.random() * 4.5
        : isTealVeil || isPlumHaze
        ? 10.0 + Math.random() * 5.0
        : cIdx === 0
        ? 7.5 + Math.random() * 4.0
        : 8.5 + Math.random() * 5.5;

      // Encode cloud type in seed:
      // 0..100: standard galactic cloud / veil
      // 200..300: distant galaxy smudge
      // 300..400: sculpted bottom-right indigo-violet & cyan-rim molecular pillar
      const typeOffset = isSculptedPillar ? 300.0 : isDistantGalaxy ? 200.0 : 0.0;
      const seed = Math.random() * 100.0 + typeOffset;
      const speed = clusterSpeeds[cIdx] * (0.92 + Math.random() * 0.16);
      const rotAngle = isSculptedPillar
        ? -0.55 + (Math.random() - 0.5) * 0.35
        : Math.random() * Math.PI * 2.0;

      nebParams[i * 4] = worldScale;
      nebParams[i * 4 + 1] = seed;
      nebParams[i * 4 + 2] = speed;
      nebParams[i * 4 + 3] = rotAngle;
    }

    nebulaInstGeo.setAttribute('aDir', new THREE.InstancedBufferAttribute(nebDirs, 3));
    nebulaInstGeo.setAttribute('aCoreColor', new THREE.InstancedBufferAttribute(nebCoreColors, 3));
    nebulaInstGeo.setAttribute('aRimColor', new THREE.InstancedBufferAttribute(nebRimColors, 3));
    nebulaInstGeo.setAttribute('aDustColor', new THREE.InstancedBufferAttribute(nebDustColors, 3));
    nebulaInstGeo.setAttribute('aParams', new THREE.InstancedBufferAttribute(nebParams, 4));

    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uExpansion: { value: 0 },
        uFilterOpacity: { value: 1 },
      },
      vertexShader: `
        attribute vec3 aDir;
        attribute vec3 aCoreColor;
        attribute vec3 aRimColor;
        attribute vec3 aDustColor;
        attribute vec4 aParams;
        uniform float uTime;
        uniform float uExpansion;
        varying vec2 vUv;
        varying vec3 vCoreColor;
        varying vec3 vRimColor;
        varying vec3 vDustColor;
        varying float vSeed;
        varying float vAlpha;

        void main() {
          vUv = uv;
          vCoreColor = aCoreColor;
          vRimColor = aRimColor;
          vDustColor = aDustColor;

          float worldScale = aParams.x;
          float seed = aParams.y;
          float speed = aParams.z;
          float isPillar = step(290.0, seed);
          float isGalaxy = step(150.0, seed) * (1.0 - isPillar);
          float rawSeed = mod(seed, 100.0);
          float rotAngle = aParams.w + uTime * 0.006 * (mod(rawSeed, 2.0) > 1.0 ? 1.0 : -1.0);
          vSeed = seed;

          // Zero presence in Section 1 before explosion; expands continuously across the 8 scroll sections at anchored directions
          float expRadius = (0.18 + 0.82 * pow(uExpansion, 0.75)) * speed;
          float swirlAngle = (1.0 - uExpansion) * 0.35 + uExpansion * 0.25;
          float cs = cos(swirlAngle);
          float sn = sin(swirlAngle);

          vec3 centerPos = vec3(
            (aDir.x * cs - aDir.z * sn) * expRadius,
            aDir.y * expRadius,
            (aDir.x * sn + aDir.z * cs) * expRadius
          );

          vec4 mvCenter = modelViewMatrix * vec4(centerPos, 1.0);
          float emerge = smoothstep(0.01, 0.16, uExpansion);
          float continuousScale = 0.35 + 0.85 * pow(uExpansion, 0.55);
          float aspect = isGalaxy > 0.5
            ? (1.85 + 0.65 * sin(rawSeed * 4.1))
            : isPillar > 0.5
            ? (1.55 + 0.25 * sin(rawSeed * 2.9))
            : (1.45 + 0.35 * sin(rawSeed * 3.7));
          vec2 scaledQuad = vec2(position.x * aspect, position.y) * worldScale * continuousScale;

          float cr = cos(rotAngle);
          float sr = sin(rotAngle);
          vec2 rotatedQuad = vec2(
            scaledQuad.x * cr - scaledQuad.y * sr,
            scaledQuad.x * sr + scaledQuad.y * cr
          );

          mvCenter.xy += rotatedQuad;
          gl_Position = projectionMatrix * mvCenter;

          float camDistFade = smoothstep(2.5, 9.0, -mvCenter.z);
          float baseOpacity = isGalaxy > 0.5 ? 0.18 : isPillar > 0.5 ? 0.24 : 0.14;
          vAlpha = emerge * camDistFade * baseOpacity;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uFilterOpacity;
        varying vec2 vUv;
        varying vec3 vCoreColor;
        varying vec3 vRimColor;
        varying vec3 vDustColor;
        varying float vSeed;
        varying float vAlpha;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = rot * p * 2.03;
            a *= 0.5;
          }
          return v;
        }

        float ridgedFbm(vec2 p) {
          float v = 0.0;
          float weight = 1.0;
          float a = 0.5;
          mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
          for (int i = 0; i < 4; i++) {
            float n = 1.0 - abs(noise(p) * 2.0 - 1.0);
            n = n * n * weight;
            weight = clamp(n * 1.8, 0.0, 1.0);
            v += n * a;
            p = rot * p * 2.12;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          if (uFilterOpacity <= 0.01 || vAlpha <= 0.001) discard;

          vec2 centered = (vUv - vec2(0.5)) * 2.0;
          float r2 = dot(centered, centered);
          if (r2 > 1.0) discard;

          float isPillar = step(290.0, vSeed);
          float isGalaxy = step(150.0, vSeed) * (1.0 - isPillar);
          float rawSeed = mod(vSeed, 100.0);

          if (isGalaxy > 0.5) {
            // Faint, soft-focus distant galaxy smudge
            float rEllip = length(vec2(centered.x, centered.y * 1.85));
            if (rEllip > 1.0) discard;
            float angle = atan(centered.y * 1.85, centered.x);
            float spiral = 0.65 + 0.35 * cos(angle * 2.0 - rEllip * 7.5 + rawSeed);
            float dust = fbm(centered * 4.5 + rawSeed);
            float coreBulge = exp(-rEllip * rEllip * 14.0);
            float disk = exp(-rEllip * 3.6) * spiral * (0.6 + 0.4 * dust);
            vec3 galCol = mix(vec3(0.58, 0.68, 0.84), vec3(0.94, 0.92, 0.88), coreBulge);
            float alpha = (coreBulge * 0.85 + disk * 0.45) * smoothstep(1.0, 0.25, rEllip) * vAlpha * uFilterOpacity;
            gl_FragColor = vec4(galCol, clamp(alpha, 0.0, 0.38));
            return;
          }

          vec2 seedOffset = vec2(fract(rawSeed * 0.173) * 12.0, fract(rawSeed * 0.317) * 12.0);
          vec2 flow = vec2(uTime * 0.008, -uTime * 0.006);

          if (isPillar > 0.5) {
            // Sculpted Billowing Molecular Pillar with Crisp Photoionized Silver-Cyan Rim Ridges
            // & Deep Indigo-Violet / Cobalt Folds (matching bottom-right of attached image)
            vec2 pPillar = centered * vec2(1.65, 1.95) + seedOffset;
            vec2 qP = vec2(fbm(pPillar + flow), fbm(pPillar + vec2(4.1, 2.3) - flow));
            vec2 warpP = vec2(
              fbm(pPillar + 2.3 * qP + vec2(1.7, 9.2)),
              fbm(pPillar + 2.3 * qP + vec2(8.3, 2.8))
            );

            float billowBody = fbm(pPillar * 1.35 + 2.2 * warpP);
            float sharpRidges = ridgedFbm(pPillar * 2.1 + 1.65 * warpP);
            float darkCavity = smoothstep(0.38, 0.72, fbm(pPillar * 2.6 - warpP * 1.8));

            float envWarp = (qP.x - 0.5) * 0.42 + (warpP.y - 0.5) * 0.36;
            float envDist = length(centered * vec2(0.88, 1.05)) + envWarp;
            float pillarMask = smoothstep(0.96, 0.18, envDist);
            if (pillarMask <= 0.002) discard;

            // Directional photoionized rim lighting along the upper-left ridge of the billowing pillar
            float eps = 0.035;
            float bNext = fbm((pPillar + vec2(-eps, eps)) * 1.35 + 2.2 * warpP);
            float rimSlope = clamp((bNext - billowBody) * 9.5, 0.0, 1.0);
            float ionizedEdge = pow(sharpRidges, 1.8) * (0.45 + 0.85 * rimSlope);

            vec3 deepIndigoBody = vec3(0.11, 0.14, 0.38);
            vec3 violetFold = vec3(0.32, 0.16, 0.52);
            vec3 cyanSilverRim = vec3(0.62, 0.88, 1.00);
            vec3 darkMolecularDust = vec3(0.02, 0.04, 0.10);

            vec3 col = mix(deepIndigoBody, violetFold, smoothstep(0.32, 0.74, billowBody));
            col = mix(col, darkMolecularDust, darkCavity * 0.72);
            col += cyanSilverRim * ionizedEdge * 0.92;

            float alpha = clamp((billowBody * 0.65 + ionizedEdge * 0.75) * (1.0 - darkCavity * 0.45) * pillarMask, 0.0, 1.0) * vAlpha * uFilterOpacity;
            gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.48));
            return;
          }

          // Fine-grained wispy galactic dust cloud / atmospheric veil with dark dust lanes
          vec2 p = centered * vec2(1.75, 2.15) + seedOffset;
          vec2 q = vec2(
            fbm(p + flow),
            fbm(p + vec2(5.2, 1.3) - flow)
          );
          vec2 warp = vec2(
            fbm(p + 2.2 * q + vec2(1.7, 9.2)),
            fbm(p + 2.2 * q + vec2(8.3, 2.8))
          );

          float boundaryWarp = (q.x - 0.5) * 0.44 + (warp.y - 0.5) * 0.34;
          float warpedDist = length(centered * vec2(0.90, 1.12)) + boundaryWarp;
          float cloudEnvelope = smoothstep(0.96, 0.15, warpedDist);
          if (cloudEnvelope <= 0.002) discard;

          float diffuseGas = fbm(p * 1.45 + 2.1 * warp);
          float filaments = ridgedFbm(p * 1.85 + 1.55 * warp);
          float dustLane = smoothstep(0.44, 0.72, fbm(p * 2.4 - warp * 1.6));

          // Fine resolved micro-star dust embedded inside the galactic cloud
          vec2 nurseryUv = centered * 9.5 + seedOffset;
          vec2 nCell = floor(nurseryUv);
          vec2 nFract = fract(nurseryUv) - vec2(0.5);
          float cellRand = hash(nCell + floor(rawSeed));
          vec2 starJitter = (vec2(hash(nCell + 13.7), hash(nCell + 29.3)) - vec2(0.5)) * 0.55;
          float distN = length(nFract - starJitter);
          float microStar = exp(-distN * distN * 260.0) * step(0.64, cellRand) * smoothstep(0.38, 0.68, diffuseGas);

          vec3 gasCol = mix(vRimColor * 0.65, vCoreColor, smoothstep(0.38, 0.84, diffuseGas + filaments * 0.25));
          gasCol = mix(gasCol, vDustColor * 0.25, dustLane * 0.68);
          gasCol += vec3(0.88, 0.94, 1.0) * microStar * 0.75;

          float density = clamp((diffuseGas * 0.58 + filaments * 0.42) * cloudEnvelope, 0.0, 1.0);
          float gasAlpha = pow(density, 1.45) * (1.0 - dustLane * 0.52) * vAlpha;
          float finalAlpha = (gasAlpha + microStar * cloudEnvelope * 0.22) * uFilterOpacity;

          gl_FragColor = vec4(gasCol, clamp(finalAlpha, 0.0, 0.36));
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(nebulaMat);
    const nebulaPoints = new THREE.Mesh(nebulaInstGeo, nebulaMat);
    nebulaPoints.frustumCulled = false;
    scene.add(nebulaPoints);

    // 5C. 3D Stellar Nursery Pinpoint Clusters (Fine Resolved Micro-Stars Inside Galactic Clouds)
    const nurseryStarCount = isSoftwareGl ? 320 : 650;
    const nurseryStarGeo = new THREE.BufferGeometry();
    const nurseryDirs = new Float32Array(nurseryStarCount * 3);
    const nurseryColors = new Float32Array(nurseryStarCount * 3);
    const nurseryParams = new Float32Array(nurseryStarCount * 4);

    for (let i = 0; i < nurseryStarCount; i++) {
      // Spread nursery stars with wider local distance across the clusters
      const cIdx = i < nurseryStarCount * 0.35 ? 0 : (i % 6);
      const baseDir = clusterCenters[cIdx];
      const localOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 0.34,
        (Math.random() - 0.5) * 0.28,
        (Math.random() - 0.5) * 0.34
      );
      const dir = baseDir.clone().add(localOffset).normalize();
      nurseryDirs[i * 3] = dir.x;
      nurseryDirs[i * 3 + 1] = dir.y;
      nurseryDirs[i * 3 + 2] = dir.z;

      const roll = Math.random();
      const col =
        roll < 0.55
          ? new THREE.Color('#ffffff')
          : roll < 0.88
          ? new THREE.Color('#93c5fd')
          : new THREE.Color('#cbd5e1');
      nurseryColors[i * 3] = col.r;
      nurseryColors[i * 3 + 1] = col.g;
      nurseryColors[i * 3 + 2] = col.b;

      const speed = clusterSpeeds[cIdx] * (0.85 + Math.random() * 0.38);
      const seed = Math.random() * 100.0;
      const size = 0.8 + Math.pow(Math.random(), 2.2) * 1.4;
      const twinkleSpeed = 1.6 + Math.random() * 2.5;

      nurseryParams[i * 4] = speed;
      nurseryParams[i * 4 + 1] = seed;
      nurseryParams[i * 4 + 2] = size;
      nurseryParams[i * 4 + 3] = twinkleSpeed;
    }

    nurseryStarGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nurseryStarCount * 3), 3));
    nurseryStarGeo.setAttribute('aDir', new THREE.BufferAttribute(nurseryDirs, 3));
    nurseryStarGeo.setAttribute('aColor', new THREE.BufferAttribute(nurseryColors, 3));
    nurseryStarGeo.setAttribute('aParams', new THREE.BufferAttribute(nurseryParams, 4));
    disposables.push(nurseryStarGeo);

    const nurseryStarMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uExpansion: { value: 0 },
        uFilterOpacity: { value: 1 },
        uPixelRatio: { value: dpr },
      },
      vertexShader: `
        attribute vec3 aDir;
        attribute vec3 aColor;
        attribute vec4 aParams;
        uniform float uTime;
        uniform float uExpansion;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = aColor;
          float speed = aParams.x;
          float seed = aParams.y;
          float size = aParams.z;
          float twinkleSpeed = aParams.w;

          float randExpPower = 0.72 + 0.18 * fract(seed * 0.317);
          float randSwirlSpeed = 0.006 + 0.014 * fract(seed * 0.713);
          float expRadius = (0.18 + 0.82 * pow(uExpansion, randExpPower)) * speed;
          float swirlAngle = (1.0 - uExpansion) * 0.35 + uExpansion * 0.25 + uTime * randSwirlSpeed;
          float cs = cos(swirlAngle);
          float sn = sin(swirlAngle);

          vec3 pos = vec3(
            (aDir.x * cs - aDir.z * sn) * expRadius,
            aDir.y * expRadius,
            (aDir.x * sn + aDir.z * cs) * expRadius
          );

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float twinkle = 0.65 + 0.35 * sin(uTime * twinkleSpeed + seed * 6.2831);
          float appear = smoothstep(0.02, 0.20, uExpansion);
          vAlpha = appear * (0.45 + 0.45 * twinkle);

          gl_PointSize = clamp(size * appear * uPixelRatio * (14.0 / max(2.5, -mvPosition.z)), 0.8, 4.2);
        }
      `,
      fragmentShader: `
        uniform float uFilterOpacity;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          if (uFilterOpacity <= 0.01 || vAlpha <= 0.001) discard;
          vec2 uv = gl_PointCoord.xy - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;

          float core = exp(-d * d * 55.0);
          float halo = exp(-d * 9.0) * 0.22;
          float intensity = clamp(core + halo, 0.0, 1.0);
          vec3 col = mix(vColor, vec3(1.0), core * 0.6);
          gl_FragColor = vec4(col, intensity * vAlpha * uFilterOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(nurseryStarMat);
    const nurseryStarPoints = new THREE.Points(nurseryStarGeo, nurseryStarMat);
    scene.add(nurseryStarPoints);

    // =========================================================================
    // 6. SECTION 06: IGNITION OF FIRST SUNS & SECTION 07: SPIRAL STREAMS & GIANTS
    //    (32,000 Living Stars Across Near, Mid & Deep Galactic Streams)
    // =========================================================================
    const starExplosionCount = isSoftwareGl ? 10000 : 18500;
    const starExpGeo = new THREE.BufferGeometry();
    const starExpDirs = new Float32Array(starExplosionCount * 3);
    const starExpColors = new Float32Array(starExplosionCount * 3);
    const starExpSizes = new Float32Array(starExplosionCount);
    const starExpSpeeds = new Float32Array(starExplosionCount);
    const starExpSeeds = new Float32Array(starExplosionCount);

    // Realistic Deep-Space Star Colors (Crisp White, Silver-Blue, Steel-Blue, and Rare Warm Orange-Red)
    const stellarClasses = [
      new THREE.Color('#ffffff'), // Pure Pinpoint White
      new THREE.Color('#f1f5f9'), // Crisp Silver-White
      new THREE.Color('#cbd5e1'), // Cool Slate-Silver
      new THREE.Color('#93c5fd'), // Steel-Blue Galactic Star
      new THREE.Color('#bae6fd'), // Ice-Blue Star
      new THREE.Color('#e2e8f0'), // Starlight White
      new THREE.Color('#f8fafc'), // Diamond White
      new THREE.Color('#fb923c'), // Warm Orange-Red Giant
    ];

    for (let i = 0; i < starExplosionCount; i++) {
      const radialFrac = Math.pow(Math.random(), 0.78);
      const u = (Math.random() - 0.5) * 2.0;
      const phi = Math.acos(u);
      const streamTwist = (i % 6) * ((Math.PI * 2) / 6) + radialFrac * 2.2;
      const theta = streamTwist + (Math.random() - 0.5) * 2.35;

      const dx = Math.sin(phi) * Math.cos(theta);
      const dy = Math.cos(phi);
      const dz = Math.sin(phi) * Math.sin(theta);

      const dir = new THREE.Vector3(dx, dy, dz).normalize();

      starExpDirs[i * 3] = dir.x;
      starExpDirs[i * 3 + 1] = dir.y;
      starExpDirs[i * 3 + 2] = dir.z;

      // Balanced 50/50 split between glowing Pure White Giant stars and Warm Orange-Red Giant stars
      const isProminentGiant = i % 34 === 0;
      const isOrangeRedGiant = isProminentGiant && Math.floor(i / 34) % 2 === 0;
      const isWhiteGiant = isProminentGiant && Math.floor(i / 34) % 2 === 1;
      const c = isOrangeRedGiant
        ? stellarClasses[7]
        : isWhiteGiant
        ? stellarClasses[0]
        : stellarClasses[i % 7];
      starExpColors[i * 3] = c.r;
      starExpColors[i * 3 + 1] = c.g;
      starExpColors[i * 3 + 2] = c.b;

      const lum = Math.random();
      starExpSizes[i] =
        isOrangeRedGiant || isWhiteGiant
          ? 5.8 + Math.random() * 4.2
          : lum > 0.98
          ? 4.8
          : lum > 0.90
          ? 3.0
          : lum > 0.58
          ? 1.85
          : 1.05 + Math.random() * 0.55;

      // Wider multi-tier radial speed distribution so every star has more distance from neighboring stars
      const tierRoll = i % 10;
      const speedJitter = 0.82 + Math.random() * 0.52;
      if (tierRoll < 5) {
        starExpSpeeds[i] = (7.5 + radialFrac * 38.0) * speedJitter;
      } else if (tierRoll < 8) {
        starExpSpeeds[i] = (24.0 + radialFrac * 54.0) * speedJitter;
      } else {
        starExpSpeeds[i] = (46.0 + radialFrac * 78.0) * speedJitter;
      }
      starExpSeeds[i] = Math.random() * Math.PI * 2;
    }

    starExpGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(starExplosionCount * 3), 3)
    );
    starExpGeo.setAttribute('aDir', new THREE.BufferAttribute(starExpDirs, 3));
    starExpGeo.setAttribute('aColor', new THREE.BufferAttribute(starExpColors, 3));
    starExpGeo.setAttribute('aSize', new THREE.BufferAttribute(starExpSizes, 1));
    starExpGeo.setAttribute('aSpeed', new THREE.BufferAttribute(starExpSpeeds, 1));
    starExpGeo.setAttribute('aSeed', new THREE.BufferAttribute(starExpSeeds, 1));
    disposables.push(starExpGeo);

    const starExpMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uExpansion: { value: 0 },
        uFilterOpacity: { value: 1 },
        uPixelRatio: { value: dpr },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHoverActive: { value: 0 },
      },
      vertexShader: `
        attribute vec3 aDir;
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aSpeed;
        attribute float aSeed;
        uniform float uTime;
        uniform float uExpansion;
        uniform float uPixelRatio;
        uniform vec2 uMouse;
        uniform float uHoverActive;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vLuminosity;

        void main() {
          vColor = aColor;
          vLuminosity = smoothstep(2.2, 5.2, aSize);

          // Continuous radial expansion across the 8 scroll sections + Keplerian spiral spin
          float randExpA = fract(aSeed * 3.173);
          float randExpB = fract(aSeed * 7.431);
          float expExponent = 0.72 + 0.22 * randExpA;
          float peculiarDrift = sin(uTime * (0.28 + 0.55 * randExpB) + aSeed) * (0.16 + 0.34 * randExpA) * smoothstep(0.04, 0.22, uExpansion);
          float expDist = pow(uExpansion, expExponent) * aSpeed + peculiarDrift;

          float randOrbitRate = 0.012 + 0.028 * randExpB;
          float keplerSpin = uExpansion * (0.85 + 0.95 * randExpA) + uTime * randOrbitRate;
          float cs = cos(keplerSpin);
          float sn = sin(keplerSpin);

          vec3 dir = vec3(
            aDir.x * cs - aDir.z * sn,
            aDir.y,
            aDir.x * sn + aDir.z * cs
          );

          vec3 pos = dir * expDist;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vec4 clipPos = projectionMatrix * mvPosition;

          vec2 ndc = clipPos.xy / max(0.0001, clipPos.w);
          vec2 toMouse = ndc - uMouse;
          float mouseDist = length(toMouse);
          float hoverBoost = smoothstep(0.32, 0.0, mouseDist) * uHoverActive * smoothstep(0.03, 0.15, uExpansion);

          gl_Position = clipPos;

          float birth = smoothstep(0.01, 0.08, uExpansion);
          float twinkle = 0.84 + 0.16 * sin(uTime * 2.2 + aSeed * 7.0);
          vAlpha = min(1.0, birth * twinkle + hoverBoost * 0.35);
          vLuminosity = clamp(vLuminosity + hoverBoost * 0.45, 0.0, 1.0);

          gl_PointSize = clamp(aSize * (1.0 + hoverBoost * 0.42) * birth * uPixelRatio * (20.5 / max(1.6, -mvPosition.z)), 1.0, 16.5);
        }
      `,
      fragmentShader: `
        uniform float uFilterOpacity;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vLuminosity;

        void main() {
          if (uFilterOpacity <= 0.01 || vAlpha <= 0.001) discard;
          vec2 uv = gl_PointCoord.xy - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;

          // Both White Giants and Warm Orange-Red Giants share the same luminous halo & 4-point diffraction spikes
          float isWarmGiant = step(0.45, vColor.r - vColor.b);
          float isGiantStar = step(0.55, vLuminosity);
          float ca = 0.990;
          float sa = 0.139;
          vec2 rUv = vec2(uv.x * ca - uv.y * sa, uv.x * sa + uv.y * ca);

          // Razor-sharp pinpoint stellar photosphere + balanced airy halo + telescope diffraction spikes on both white & red giants
          float core = exp(-d * d * mix(42.0, 72.0, isGiantStar));
          float halo = exp(-d * mix(7.8, 6.2, isGiantStar)) * (0.22 + mix(0.26, 0.54, isGiantStar) * vLuminosity);
          float subtleCross = (exp(-abs(rUv.x) * 42.0) * exp(-abs(rUv.y) * 6.5) + exp(-abs(rUv.y) * 42.0) * exp(-abs(rUv.x) * 6.5)) * mix(0.24, 0.78, isGiantStar) * vLuminosity;

          float intensity = clamp(core + halo + subtleCross, 0.0, 1.0);
          vec3 baseCol = isWarmGiant > 0.5
            ? mix(vec3(0.88, 0.26, 0.06), vColor, 0.65)
            : mix(vec3(0.88, 0.94, 1.0), vec3(1.0, 1.0, 1.0), 0.75);
          vec3 finalColor = mix(baseCol, vec3(1.0, 0.99, 0.97), core * 0.75);
          gl_FragColor = vec4(finalColor, intensity * vAlpha * uFilterOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(starExpMat);
    const starExplosionPoints = new THREE.Points(starExpGeo, starExpMat);
    scene.add(starExplosionPoints);

    // 6B. 3D Resolved Living Suns (Main-Sequence & Supergiant Spheres)
    const heroStarsGroup = new THREE.Group();
    scene.add(heroStarsGroup);

    const heroStarCount = isSoftwareGl ? 10 : 18;
    const heroStarGeo = new THREE.SphereGeometry(0.026, isSoftwareGl ? 14 : 20, isSoftwareGl ? 14 : 20);
    disposables.push(heroStarGeo);

    const heroStarFlareGeo = new THREE.PlaneGeometry(0.68, 0.68);
    disposables.push(heroStarFlareGeo);

    interface HeroStarNode {
      mesh: THREE.Mesh;
      flareMesh: THREE.Mesh;
      mat: THREE.ShaderMaterial;
      flareMat: THREE.ShaderMaterial;
      dir: THREE.Vector3;
      speed: number;
      expPower: number;
      orbitSpeed: number;
      baseScale: number;
    }
    const heroStarNodes: HeroStarNode[] = [];

    const heroStarSpectra = [
      { core: new THREE.Color('#fff7ed'), limb: new THREE.Color('#ea580c'), scale: 0.90 }, // Warm Orange-Red Giant
      { core: new THREE.Color('#ffffff'), limb: new THREE.Color('#e2e8f0'), scale: 0.90 }, // Pure Diamond-White Giant
      { core: new THREE.Color('#fff7ed'), limb: new THREE.Color('#dc2626'), scale: 0.90 }, // Crimson-Amber Red Giant
      { core: new THREE.Color('#ffffff'), limb: new THREE.Color('#bae6fd'), scale: 0.90 }, // Crisp Ice-White Supergiant
    ];

    for (let i = 0; i < heroStarCount; i++) {
      const spec = heroStarSpectra[i % heroStarSpectra.length];
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uCoreColor: { value: spec.core },
          uLimbColor: { value: spec.limb },
          uOpacity: { value: 1 },
          uSeed: { value: i * 13.7 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vObjPos;
          varying vec3 vWorldPos;
          void main() {
            vObjPos = normalize(position);
            vNormal = normalize(normalMatrix * normal);
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uCoreColor;
          uniform vec3 uLimbColor;
          uniform float uOpacity;
          uniform float uSeed;
          varying vec3 vNormal;
          varying vec3 vObjPos;
          varying vec3 vWorldPos;

          void main() {
            if (uOpacity <= 0.01) discard;
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float mu = clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0);

            // Soft radial falloff to zero at the sphere limb so it never looks like a solid ball
            float coreIntensity = pow(mu, 1.9);
            float whiteHotCenter = pow(mu, 4.2);
            vec3 col = mix(uLimbColor, uCoreColor * 1.35, coreIntensity);
            col = mix(col, vec3(1.0, 0.99, 0.96), whiteHotCenter);

            gl_FragColor = vec4(col * 1.4, coreIntensity * uOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      disposables.push(mat);

      const flareMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uCoreColor: { value: spec.core },
          uLimbColor: { value: spec.limb },
          uOpacity: { value: 1 },
          uSeed: { value: i * 9.3 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv - vec2(0.5);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uCoreColor;
          uniform vec3 uLimbColor;
          uniform float uOpacity;
          uniform float uSeed;
          varying vec2 vUv;
          void main() {
            if (uOpacity <= 0.01) discard;
            float d = length(vUv);
            if (d > 0.5) discard;

            // ~8 degree tilt matching the telescope diffraction cross in the reference photo
            float ca = 0.990;
            float sa = 0.139;
            vec2 rUv = vec2(vUv.x * ca - vUv.y * sa, vUv.x * sa + vUv.y * ca);

            float pulse = 0.92 + 0.08 * sin(uTime * 2.6 + uSeed);
            float intensePinpoint = exp(-d * d * 240.0);
            float innerCorona = exp(-d * 14.5) * 0.85 * pulse;
            float outerHalo = exp(-d * 5.6) * 0.42;

            float spikeV = exp(-abs(rUv.x) * 58.0) * exp(-abs(rUv.y) * 6.2);
            float spikeH = exp(-abs(rUv.y) * 58.0) * exp(-abs(rUv.x) * 6.2);
            float spikes = (spikeV + spikeH) * 0.95 * smoothstep(0.5, 0.03, d);

            float totalGlow = clamp((intensePinpoint * 1.3 + innerCorona + outerHalo + spikes) * smoothstep(0.5, 0.06, d), 0.0, 1.0);
            vec3 col = mix(uLimbColor * 0.95, uCoreColor, clamp(innerCorona + spikes * 0.65, 0.0, 1.0));
            col = mix(col, vec3(1.0, 0.99, 0.95), clamp(intensePinpoint * 1.2 + spikes * 0.35, 0.0, 1.0));
            gl_FragColor = vec4(col * 1.25, totalGlow * uOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      disposables.push(flareMat);

      const mesh = new THREE.Mesh(heroStarGeo, mat);
      const flareMesh = new THREE.Mesh(heroStarFlareGeo, flareMat);
      mesh.add(flareMesh);

      const fibU = 1.0 - (2.0 * (i + 0.5)) / heroStarCount;
      const fibPhi = Math.acos(THREE.MathUtils.clamp(fibU, -1, 1));
      const fibTheta = Math.PI * (1.0 + Math.sqrt(5.0)) * i;
      const dir =
        i === 0
          ? new THREE.Vector3(-0.38, 0.24, -0.45).normalize()
          : new THREE.Vector3(
              Math.sin(fibPhi) * Math.cos(fibTheta),
              Math.cos(fibPhi) * 0.92,
              Math.sin(fibPhi) * Math.sin(fibTheta)
            ).normalize();

      heroStarsGroup.add(mesh);
      heroStarNodes.push({
        mesh,
        flareMesh,
        mat,
        flareMat,
        dir,
        speed: (8.5 + (i % 6) * 5.8) * (0.85 + Math.random() * 0.38),
        expPower: 0.68 + Math.random() * 0.24,
        orbitSpeed: 0.014 + Math.random() * 0.032,
        baseScale: spec.scale,
      });
    }

    // =========================================================================
    // 7. SECTION 08: REALISTIC DEAD STARS, PULSARS, MAGNETARS & BLACK HOLE REMNANTS
    // =========================================================================
    const deadStarCount = isSoftwareGl ? 60 : 96;
    const deadStarGeo = new THREE.BufferGeometry();
    const deadDirs = new Float32Array(deadStarCount * 3);
    const deadColors = new Float32Array(deadStarCount * 3);
    const deadSizes = new Float32Array(deadStarCount);
    const deadSpeeds = new Float32Array(deadStarCount);
    const deadTypes = new Float32Array(deadStarCount);
    const deadSeeds = new Float32Array(deadStarCount);

    const deadStarPalette = [
      new THREE.Color('#93c5fd'), // Pulsar Wind X-Ray Steel-Blue
      new THREE.Color('#cbd5e1'), // White Dwarf Silver-Blue Remnant
      new THREE.Color('#7dd3fc'), // Synchrotron Ice-Cyan
      new THREE.Color('#fcd34d'), // Relativistic Black Hole Photon Ring Gold
    ];

    for (let i = 0; i < deadStarCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const u = (Math.random() - 0.5) * 2;
      const phi = Math.acos(u);

      deadDirs[i * 3] = Math.sin(phi) * Math.cos(theta);
      deadDirs[i * 3 + 1] = Math.cos(phi);
      deadDirs[i * 3 + 2] = Math.sin(phi) * Math.sin(theta);

      const isBlackHoleSprite = i % 2 === 0;
      const c = isBlackHoleSprite ? deadStarPalette[3] : deadStarPalette[i % 3];
      deadColors[i * 3] = c.r;
      deadColors[i * 3 + 1] = c.g;
      deadColors[i * 3 + 2] = c.b;

      deadSizes[i] = isBlackHoleSprite ? 9.5 + Math.random() * 8.5 : 6.0 + Math.random() * 6.5;
      deadSpeeds[i] = 15.0 + Math.random() * 92.0;
      deadTypes[i] = isBlackHoleSprite ? 2 : i % 2;
      deadSeeds[i] = Math.random();
    }

    deadStarGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(deadStarCount * 3), 3)
    );
    deadStarGeo.setAttribute('aDir', new THREE.BufferAttribute(deadDirs, 3));
    deadStarGeo.setAttribute('aColor', new THREE.BufferAttribute(deadColors, 3));
    deadStarGeo.setAttribute('aSize', new THREE.BufferAttribute(deadSizes, 1));
    deadStarGeo.setAttribute('aSpeed', new THREE.BufferAttribute(deadSpeeds, 1));
    deadStarGeo.setAttribute('aType', new THREE.BufferAttribute(deadTypes, 1));
    deadStarGeo.setAttribute('aSeed', new THREE.BufferAttribute(deadSeeds, 1));
    disposables.push(deadStarGeo);

    const deadStarMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uExpansion: { value: 0 },
        uFilterOpacity: { value: 1 },
        uPixelRatio: { value: dpr },
      },
      vertexShader: `
        attribute vec3 aDir;
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aSpeed;
        attribute float aType;
        attribute float aSeed;
        uniform float uTime;
        uniform float uExpansion;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vType;
        varying float vAlpha;
        varying float vSeed;

        void main() {
          vColor = aColor;
          vType = aType;
          vSeed = aSeed;

          float expDist = pow(uExpansion, 0.82) * aSpeed;
          float angle = uExpansion * 0.9 - uTime * 0.018;
          float cs = cos(angle);
          float sn = sin(angle);

          vec3 dir = vec3(
            aDir.x * cs - aDir.z * sn,
            aDir.y,
            aDir.x * sn + aDir.z * cs
          );

          vec3 pos = normalize(dir) * expDist;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float emerge = smoothstep(0.05, 0.25, uExpansion);
          vAlpha = emerge * 0.82;
          gl_PointSize = clamp(aSize * emerge * uPixelRatio * (20.0 / max(2.2, -mvPosition.z)), 0.0, 32.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uFilterOpacity;
        varying vec3 vColor;
        varying float vType;
        varying float vAlpha;
        varying float vSeed;

        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float noise2(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash21(i);
          float b = hash21(i + vec2(1.0, 0.0));
          float c = hash21(i + vec2(0.0, 1.0));
          float d = hash21(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm2(vec2 p) {
          float v = 0.0;
          float amp = 0.5;
          mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
          for (int i = 0; i < 3; i++) {
            v += amp * noise2(p);
            p = rot * p * 2.05;
            amp *= 0.5;
          }
          return v;
        }

        void main() {
          if (uFilterOpacity <= 0.01 || vAlpha <= 0.001) discard;
          vec2 uv = gl_PointCoord.xy - vec2(0.5);
          float r = length(uv);
          if (r > 0.5) discard;

          float tiltAngle = vSeed * 6.2831853;
          float ca = cos(tiltAngle);
          float sa = sin(tiltAngle);
          vec2 rotUv = vec2(uv.x * ca - uv.y * sa, uv.x * sa + uv.y * ca);
          float aspect = 1.85 + fract(vSeed * 13.7) * 1.45;
          float radialMask = smoothstep(0.5, 0.12, r);

          if (vType < 0.5) {
            float wdCore = exp(-r * r * 210.0);
            float wdGlint = (exp(-abs(rotUv.x) * 34.0) * exp(-abs(rotUv.y) * 9.0) +
                             exp(-abs(rotUv.y) * 34.0) * exp(-abs(rotUv.x) * 9.0)) * 0.35;

            float n1 = fbm2(rotUv * 8.5 + vec2(vSeed * 9.1, uTime * 0.12));
            float n2 = fbm2(rotUv * 15.0 - vec2(uTime * 0.08, vSeed * 5.7));
            float ridgeFilaments = pow(1.0 - abs(n2 * 2.0 - 1.0), 2.4);

            vec2 lobeUv = vec2(rotUv.x * (1.45 - abs(rotUv.y) * 1.6), rotUv.y * 1.15);
            float rLobe = length(lobeUv) + (n1 - 0.5) * 0.14;
            float shockedShell = exp(-pow((rLobe - 0.19) * 9.5, 2.0)) * (0.35 + 0.65 * ridgeFilaments);
            float innerSynchrotron = exp(-rLobe * 7.5) * (0.35 + 0.45 * n1);

            vec3 innerCol = vec3(0.68, 0.85, 1.0);
            vec3 filamentCol = mix(vColor, vec3(0.82, 0.88, 0.98), ridgeFilaments * 0.5);
            vec3 col = mix(innerCol, filamentCol, smoothstep(0.08, 0.26, rLobe));
            col += vec3(0.96, 0.98, 1.0) * (wdCore * 1.35 + wdGlint);

            float alpha = clamp((wdCore * 1.1 + wdGlint + innerSynchrotron * 0.45 + shockedShell * 0.65) * radialMask, 0.0, 1.0);
            gl_FragColor = vec4(col, alpha * vAlpha * uFilterOpacity);
          } else if (vType < 1.5) {
            float pulse = 0.82 + 0.38 * sin(uTime * 16.0 + vSeed * 40.0);
            float neutronCore = exp(-r * r * 195.0) * pulse;

            float wispNoise = fbm2(rotUv * 9.0 + vec2(uTime * 0.45, vSeed * 12.0));
            float rTorus = length(vec2(rotUv.x, rotUv.y * aspect)) + (wispNoise - 0.5) * 0.055;
            float torusGlow = exp(-pow((rTorus - 0.16) * 14.0, 2.0)) * (0.45 + 0.55 * wispNoise);
            float innerDisk = exp(-rTorus * 9.5) * 0.45;

            float jetPrecession = sin(uTime * 3.2 + vSeed * 19.0) * 0.09;
            float jetX = rotUv.x - rotUv.y * jetPrecession;
            float jetWidth = 0.016 + abs(rotUv.y) * 0.085;
            float jetSpine = exp(-pow(jetX / jetWidth, 2.0)) * smoothstep(0.01, 0.08, abs(rotUv.y)) * smoothstep(0.49, 0.12, abs(rotUv.y));
            float jetKnots = 0.62 + 0.38 * sin(abs(rotUv.y) * 38.0 - uTime * 11.0 + vSeed * 10.0);
            float polarJets = jetSpine * jetKnots * 0.95;

            vec3 torusCol = mix(vColor, vec3(0.58, 0.82, 1.0), 0.55);
            vec3 jetCol = mix(vec3(0.68, 0.88, 1.0), vec3(0.96, 0.99, 1.0), jetSpine);
            vec3 col = torusCol * (torusGlow + innerDisk) + jetCol * polarJets + vec3(1.0) * neutronCore * 1.25;

            float alpha = clamp((neutronCore + torusGlow * 0.75 + innerDisk * 0.5 + polarJets) * radialMask, 0.0, 1.0);
            gl_FragColor = vec4(col, alpha * vAlpha * uFilterOpacity);
          } else {
            float eventHorizonShadow = smoothstep(0.068, 0.105, r);
            float dopplerShift = 0.58 + 0.62 * clamp(rotUv.x * 6.5, -0.7, 0.9);
            float photonRing = exp(-pow((r - 0.112) * 26.0, 2.0)) * (0.75 + 0.55 * dopplerShift);

            float diskTurb = fbm2(vec2(rotUv.x * 7.0 + uTime * 0.5, rotUv.y * 14.0 + vSeed * 8.0));
            float rDisk = length(vec2(rotUv.x, rotUv.y * 3.1));
            float eqDisk = exp(-pow((rDisk - 0.21) * 10.5, 2.0)) * (0.55 + 0.65 * diskTurb) * dopplerShift;

            float rLensed = length(vec2(rotUv.x * 1.12, abs(rotUv.y) * 1.48));
            float lensedArch = exp(-pow((rLensed - 0.15) * 15.0, 2.0)) * 0.65 * dopplerShift;

            vec3 warmGold = vec3(0.96, 0.78, 0.48);
            vec3 hotBlueWhite = vec3(0.98, 0.96, 0.92);
            vec3 redshiftAmber = vec3(0.82, 0.42, 0.24);
            vec3 diskCol = mix(redshiftAmber, warmGold, clamp(dopplerShift * 0.75, 0.0, 1.0));
            diskCol = mix(diskCol, hotBlueWhite, clamp(photonRing * 0.85, 0.0, 1.0));

            float glowIntensity = (photonRing * 1.15 + eqDisk * 0.95 + lensedArch * 0.75) * eventHorizonShadow;
            float outerAlpha = clamp(glowIntensity * radialMask, 0.0, 1.0);
            gl_FragColor = vec4(diskCol * glowIntensity, outerAlpha * vAlpha * uFilterOpacity);
          }
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(deadStarMat);
    const deadStarPoints = new THREE.Points(deadStarGeo, deadStarMat);
    scene.add(deadStarPoints);

    // 7B. 3D Resolved Pulsar, Magnetosphere & Relativistic Accretion Assemblies
    const pulsarClusterGroup = new THREE.Group();
    scene.add(pulsarClusterGroup);

    const pulsarCount = isSoftwareGl ? 3 : 4;
    const pulsarCoreGeo = new THREE.SphereGeometry(0.16, 32, 32);
    // Seamless quad plane for FBM accretion disk (eliminates artificial polygonal ring edges)
    const pulsarDiskGeo = new THREE.PlaneGeometry(2.8, 2.8, 1, 1);
    const pulsarBeamGeo = new THREE.ConeGeometry(0.24, 3.6, 32, 1, true);
    disposables.push(pulsarCoreGeo, pulsarDiskGeo, pulsarBeamGeo);

    // Build 3D dipole magnetic flux loop geometries curving from north to south pole
    const dipoleLoopGeos: THREE.TubeGeometry[] = [];
    for (let m = 0; m < 4; m++) {
      const az = (m / 4) * Math.PI * 2;
      const loopPts: THREE.Vector3[] = [];
      const steps = 20;
      for (let s = 0; s <= steps; s++) {
        const t = (s / steps) * Math.PI; // 0 (north pole) to PI (south pole)
        // Dipole field line r = L * sin^2(theta)
        const sinT = Math.sin(t);
        const rDipole = 0.14 + 0.62 * sinT * sinT;
        const x = rDipole * sinT * Math.cos(az);
        const y = rDipole * Math.cos(t);
        const z = rDipole * sinT * Math.sin(az);
        loopPts.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(loopPts);
      const tGeo = new THREE.TubeGeometry(curve, 20, 0.014, 6, false);
      dipoleLoopGeos.push(tGeo);
      disposables.push(tGeo);
    }

    // Custom GLSL Neutron Core with Thermal X-Ray Polar Hotspots & Magnetospheric Limb Glow
    const pulsarCoreMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vObjPos;
        varying vec3 vViewDir;
        void main() {
          vObjPos = normalize(position);
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec3 vNormal;
        varying vec3 vObjPos;
        varying vec3 vViewDir;
        void main() {
          if (uOpacity <= 0.01) discard;
          float poleHotspot = pow(abs(vObjPos.y), 3.2);
          float fresnel = pow(1.0 - max(0.0, dot(vNormal, vViewDir)), 2.2);
          float crustArcs = 0.5 + 0.5 * sin(vObjPos.x * 18.0 + vObjPos.z * 18.0 + uTime * 6.0);

          vec3 crustCol = vec3(0.32, 0.68, 0.98);
          vec3 arcCol = vec3(0.68, 0.92, 1.0);
          vec3 poleCol = vec3(1.0, 0.99, 1.0);

          vec3 col = mix(crustCol, arcCol, crustArcs * 0.45);
          col = mix(col, poleCol, clamp(poleHotspot + fresnel * 0.65, 0.0, 1.0));
          gl_FragColor = vec4(col * 1.45, uOpacity);
        }
      `,
      transparent: true,
    });

    // Custom GLSL Relativistic Accretion & Pulsar Wind Torus (Seamless FBM Spiral Plasma & Doppler Beaming)
    const pulsarDiskMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
      },
      vertexShader: `
        varying vec2 vPos;
        void main() {
          vPos = position.xy;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vPos;

        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float noise2(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
            mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        void main() {
          if (uOpacity <= 0.01) discard;
          float r = length(vPos);
          if (r > 1.38 || r < 0.16) discard;

          float normR = clamp((r - 0.18) / (1.35 - 0.18), 0.0, 1.0);
          float angle = atan(vPos.y, vPos.x);

          // Differential Keplerian shear + FBM plasma turbulence
          float shearPhase = angle * 3.0 - log(max(0.18, r)) * 9.5 + uTime * 5.5;
          float spiral1 = sin(shearPhase) * 0.5 + 0.5;
          float spiral2 = sin(angle * 7.0 - normR * 22.0 + uTime * 9.0) * 0.5 + 0.5;
          float turb = noise2(vec2(normR * 10.0 - uTime * 1.2, angle * 3.0 + normR * 6.0));
          float plasmaFilament = pow(mix(spiral1, spiral2, 0.45) * (0.55 + 0.65 * turb), 1.35);

          // Innermost stable circular orbit (ISCO) photon ring + smooth inner/outer Gaussian falloff
          float innerCavFade = smoothstep(0.16, 0.25, r);
          float outerFade = exp(-pow(normR * 1.85, 2.0)) * smoothstep(1.38, 0.95, r);
          float innerPhotonRing = exp(-pow((r - 0.25) * 16.0, 2.0)) * innerCavFade;

          // Relativistic Doppler boosting on approaching side of the disk
          float doppler = 0.68 + 0.42 * cos(angle - uTime * 2.4);

          vec3 innerCol = vec3(0.98, 0.98, 1.0);
          vec3 midCol = vec3(0.32, 0.85, 1.0);
          vec3 outerCol = vec3(0.68, 0.36, 0.98);

          vec3 col = mix(outerCol, midCol, exp(-normR * 2.2));
          col = mix(col, innerCol, clamp(innerPhotonRing * 1.1, 0.0, 1.0)) * doppler;

          float alpha = (innerPhotonRing * 0.95 + plasmaFilament * outerFade * innerCavFade * 0.82) * uOpacity;
          gl_FragColor = vec4(col * 1.35, clamp(alpha, 0.0, 0.94));
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // Custom GLSL Relativistic Synchrotron Jet Beams & Dipole Field Loops (Volumetric Fresnel Edge Softening)
    const pulsarBeamMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          if (uOpacity <= 0.01) discard;
          // Volumetric Fresnel silhouette softening so cones & flux tubes never show hard polygon edges
          float edgeSoftness = pow(abs(dot(normalize(vNormal), normalize(vViewDir))), 1.55);

          float axialDist = 1.0 - vUv.y;
          float coreSpine = exp(-pow((abs(vUv.x - 0.5) * 4.8), 2.0));
          // Superluminal relativistic plasma knots racing outward along the magnetic axis
          float knots = 0.52 + 0.48 * sin(axialDist * 26.0 - uTime * 15.0);
          float helix1 = 0.5 + 0.5 * sin(vUv.x * 18.849 + axialDist * 16.0 - uTime * 11.0);
          float helix2 = 0.5 + 0.5 * sin(-vUv.x * 12.566 + axialDist * 22.0 - uTime * 9.0);
          float braidedHelix = mix(helix1, helix2, 0.45);
          float lengthFade = pow(smoothstep(1.0, 0.0, axialDist), 1.45) * smoothstep(0.0, 0.09, axialDist);

          vec3 jetCyan = vec3(0.32, 0.86, 1.0);
          vec3 jetViolet = vec3(0.78, 0.52, 1.0);
          vec3 col = mix(jetViolet, jetCyan, braidedHelix);
          col = mix(col, vec3(0.98, 0.99, 1.0), coreSpine * 0.72);

          float alpha = edgeSoftness * lengthFade * knots * (0.38 + coreSpine * 0.72) * 0.75 * uOpacity;
          gl_FragColor = vec4(col * 1.35, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(pulsarCoreMat, pulsarDiskMat, pulsarBeamMat);

    interface PulsarNode {
      group: THREE.Group;
      dir: THREE.Vector3;
      speed: number;
      rotSpeed: THREE.Vector3;
    }
    const pulsarNodes: PulsarNode[] = [];

    for (let i = 0; i < pulsarCount; i++) {
      const g = new THREE.Group();
      const core = new THREE.Mesh(pulsarCoreGeo, pulsarCoreMat);
      const disk = new THREE.Mesh(pulsarDiskGeo, pulsarDiskMat);
      disk.rotation.x = Math.PI * 0.5;

      const beamTop = new THREE.Mesh(pulsarBeamGeo, pulsarBeamMat);
      beamTop.position.y = 1.9;
      beamTop.rotation.x = Math.PI;

      const beamBottom = new THREE.Mesh(pulsarBeamGeo, pulsarBeamMat);
      beamBottom.position.y = -1.9;

      g.add(core, disk, beamTop, beamBottom);

      // Attach 3D dipole magnetosphere field loops around the neutron star core
      for (let m = 0; m < dipoleLoopGeos.length; m++) {
        const loopMesh = new THREE.Mesh(dipoleLoopGeos[m], pulsarBeamMat);
        g.add(loopMesh);
      }

      // Frame Pulsars clearly inside the forward -Z deep-space viewport so they are prominent in Section 08
      const pulsarDirs = [
        new THREE.Vector3(-0.62, 0.32, 0.45).normalize(),
        new THREE.Vector3(0.55, -0.28, -0.48).normalize(),
        new THREE.Vector3(-0.35, -0.48, -0.62).normalize(),
        new THREE.Vector3(0.42, 0.44, 0.52).normalize(),
      ];
      const dir = pulsarDirs[i % pulsarDirs.length];

      pulsarClusterGroup.add(g);
      pulsarNodes.push({
        group: g,
        dir,
        speed: 11.5 + (i % 4) * 5.4,
        rotSpeed: new THREE.Vector3(
          1.4 + (i % 3) * 0.9,
          3.8 + (i % 2) * 2.1,
          0.9 + (i % 4) * 0.7
        ),
      });
    }

    // =========================================================================
    // 7C. 3D RESOLVED RELATIVISTIC KERR BLACK HOLES (Gargantua-Style Event Horizon,
    //     Photon Ring, Doppler-Boosted Accretion Disk & Gravitational Lensing Halo)
    // =========================================================================
    const blackHoleClusterGroup = new THREE.Group();
    scene.add(blackHoleClusterGroup);

    const blackHoleCount = isSoftwareGl ? 2 : 3;
    const bhHorizonGeo = new THREE.SphereGeometry(0.46, 36, 36);
    const bhDiskGeo = new THREE.PlaneGeometry(4.6, 4.6, 1, 1);
    const bhLensGeo = new THREE.PlaneGeometry(3.4, 3.4, 1, 1);
    disposables.push(bhHorizonGeo, bhDiskGeo, bhLensGeo);

    // 1. Event Horizon Shadow Sphere + Razor-Sharp Golden-White Relativistic Photon Ring
    const bhHorizonMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          if (uOpacity <= 0.01) discard;
          float ndotv = max(0.0, dot(normalize(vNormal), normalize(vViewDir)));
          float limb = 1.0 - ndotv;
          // Sharp photon sphere capture ring right at the boundary of the black hole shadow
          float photonRing = pow(limb, 4.2) * 2.4 + exp(-pow((limb - 0.86) * 14.0, 2.0)) * 1.6;
          float shimmer = 0.88 + 0.12 * sin(uTime * 5.0 + vNormal.x * 12.0);
          vec3 ringCol = mix(vec3(0.96, 0.58, 0.18), vec3(1.0, 0.96, 0.86), clamp(photonRing * 0.65, 0.0, 1.0));
          // Absolute black event horizon core with glowing relativistic photon ring
          vec3 finalCol = ringCol * photonRing * shimmer;
          gl_FragColor = vec4(finalCol, uOpacity);
        }
      `,
      transparent: true,
      depthWrite: true,
    });

    // 2. Relativistic Equatorial Accretion Disk (Keplerian Spiral Plasma + Doppler Beaming)
    const bhDiskMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
      },
      vertexShader: `
        varying vec2 vPos;
        void main() {
          vPos = position.xy;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vPos;

        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float noise2(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
            mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise2(p);
            p = p * 2.04 + vec2(3.1, 1.7);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          if (uOpacity <= 0.01) discard;
          float r = length(vPos);
          if (r > 2.25 || r < 0.45) discard;

          float normR = clamp((r - 0.46) / (2.22 - 0.46), 0.0, 1.0);
          float angle = atan(vPos.y, vPos.x);

          // Differential relativistic Keplerian shear
          float shear = angle * 2.0 - log(max(0.46, r)) * 11.5 + uTime * 4.2;
          float spiralA = sin(shear) * 0.5 + 0.5;
          float spiralB = sin(angle * 5.0 - normR * 18.0 + uTime * 6.8) * 0.5 + 0.5;
          float turb = fbm(vec2(normR * 8.5 - uTime * 0.9, angle * 2.5 + normR * 5.0));
          float rings = 0.65 + 0.35 * sin(normR * 28.0 - uTime * 3.5 + turb * 4.0);
          float plasma = pow(mix(spiralA, spiralB, 0.45) * (0.5 + 0.65 * turb) * rings, 1.2);

          // Innermost Stable Circular Orbit (ISCO) blazing ring + smooth outer Gaussian taper
          float innerCut = smoothstep(0.45, 0.54, r);
          float outerFade = exp(-pow(normR * 1.75, 2.0)) * smoothstep(2.25, 1.65, r);
          float iscoRing = exp(-pow((r - 0.53) * 14.0, 2.0)) * innerCut;

          // Relativistic Doppler beaming (left/approaching side brighter & hotter)
          float doppler = 0.72 + 0.52 * clamp(-vPos.x / max(0.5, r), -0.8, 0.9);

          vec3 iscoWhite = vec3(1.0, 0.98, 0.92);
          vec3 midGold = vec3(0.98, 0.72, 0.32);
          vec3 outerAmber = vec3(0.82, 0.28, 0.08);

          vec3 col = mix(outerAmber, midGold, exp(-normR * 1.9));
          col = mix(col, iscoWhite, clamp(iscoRing * 1.15 + exp(-normR * 5.5) * 0.65, 0.0, 1.0)) * doppler;

          float alpha = (iscoRing * 1.1 + plasma * outerFade * innerCut * 0.92) * uOpacity;
          gl_FragColor = vec4(col * 1.45, clamp(alpha, 0.0, 0.96));
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // 3. Gravitationally Lensed Einstein Arch (Upper & Lower Bent Accretion Halo)
    const bhLensMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
      },
      vertexShader: `
        varying vec2 vPos;
        void main() {
          vPos = position.xy;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vPos;
        void main() {
          if (uOpacity <= 0.01) discard;
          float r = length(vPos);
          if (r > 1.65 || r < 0.44) discard;

          // Lensed upper and lower arches curving around the event horizon shadow
          float rArch = length(vec2(vPos.x * 0.92, vPos.y * 1.06));
          float photonCircle = exp(-pow((r - 0.50) * 18.0, 2.0));
          float lensedHalo = exp(-pow((rArch - 0.62) * 7.5, 2.0)) * pow(abs(vPos.y) / max(0.3, r), 0.75);
          float swirl = 0.78 + 0.22 * sin(atan(vPos.y, vPos.x) * 4.0 - uTime * 4.5);
          float doppler = 0.75 + 0.45 * clamp(-vPos.x / max(0.45, r), -0.8, 0.9);

          vec3 goldCol = vec3(0.98, 0.74, 0.36);
          vec3 whiteGold = vec3(1.0, 0.96, 0.88);
          vec3 col = mix(goldCol, whiteGold, clamp(photonCircle * 0.9, 0.0, 1.0)) * doppler;

          float alpha = (photonCircle * 0.85 + lensedHalo * swirl * 0.78) * smoothstep(1.65, 0.95, r) * uOpacity;
          gl_FragColor = vec4(col * 1.35, clamp(alpha, 0.0, 0.92));
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(bhHorizonMat, bhDiskMat, bhLensMat);

    interface BlackHoleNode {
      group: THREE.Group;
      lensMesh: THREE.Mesh;
      dir: THREE.Vector3;
      speed: number;
      baseScale: number;
    }
    const blackHoleNodes: BlackHoleNode[] = [];

    const bhConfigs = [
      {
        // Primary flagship Black Hole positioned with ample distance in the left-center vista
        dir: new THREE.Vector3(-0.34, 0.14, -0.52).normalize(),
        speed: 13.5,
        scale: 0.95,
        tiltX: Math.PI * 0.41,
        tiltZ: -0.22,
      },
      {
        // Secondary Black Hole in the right-hand galactic stream
        dir: new THREE.Vector3(0.42, -0.22, 0.48).normalize(),
        speed: 18.0,
        scale: 0.82,
        tiltX: Math.PI * 0.38,
        tiltZ: 0.28,
      },
      {
        // Deep-horizon Black Hole visible in the final Section 08 vista
        dir: new THREE.Vector3(-0.52, -0.16, -0.34).normalize(),
        speed: 22.5,
        scale: 0.78,
        tiltX: Math.PI * 0.43,
        tiltZ: -0.16,
      },
    ];

    for (let i = 0; i < blackHoleCount; i++) {
      const cfg = bhConfigs[i];
      const g = new THREE.Group();

      const horizonMesh = new THREE.Mesh(bhHorizonGeo, bhHorizonMat);
      const diskMesh = new THREE.Mesh(bhDiskGeo, bhDiskMat);
      diskMesh.rotation.x = cfg.tiltX;
      diskMesh.rotation.z = cfg.tiltZ;

      const lensMesh = new THREE.Mesh(bhLensGeo, bhLensMat);

      g.add(horizonMesh, diskMesh, lensMesh);
      blackHoleClusterGroup.add(g);
      blackHoleNodes.push({
        group: g,
        lensMesh,
        dir: cfg.dir,
        speed: cfg.speed,
        baseScale: cfg.scale,
      });
    }

    // =========================================================================
    // 8. POINTER HOVER, DRAG-TO-MOVE BACKGROUND & RESIZE INTERACTION
    // =========================================================================
    const targetPointer = new THREE.Vector2(0, 0);
    const currentPointer = new THREE.Vector2(0, 0);
    let hoverStrengthTarget = 0;
    let hoverStrengthCurrent = 0;

    // Interactive click-and-drag orbital pan state with smooth inertia
    let isDragging = false;
    const prevDragMouse = new THREE.Vector2(0, 0);
    const dragOffset = new THREE.Vector2(0, 0);
    const dragVelocity = new THREE.Vector2(0, 0);

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore clicks directly on interactive buttons so UI controls stay crisp
      const targetEl = e.target as HTMLElement | null;
      if (targetEl && targetEl.closest('button, a')) return;
      isDragging = true;
      prevDragMouse.set(e.clientX, e.clientY);
      dragVelocity.set(0, 0);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const x = (e.clientX / w) * 2 - 1;
      const y = -(e.clientY / h) * 2 + 1;
      targetPointer.set(x, y);
      hoverStrengthTarget = 1.0;

      if (isDragging) {
        const dx = (e.clientX - prevDragMouse.x) / w;
        const dy = (e.clientY - prevDragMouse.y) / h;
        prevDragMouse.set(e.clientX, e.clientY);

        const panX = dx * Math.PI * 1.65;
        const panY = dy * Math.PI * 1.15;
        dragOffset.x += panX;
        dragOffset.y = THREE.MathUtils.clamp(dragOffset.y + panY, -1.15, 1.15);
        dragVelocity.set(panX, panY);
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handlePointerLeave = () => {
      isDragging = false;
      hoverStrengthTarget = 0.0;
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 9. ANIMATION & 8-SECTION SCROLL-DRIVEN BIG BANG EXPANSION LOOP
    // =========================================================================
    const clock = new THREE.Clock();
    let smoothScroll = scrollRef.current;
    let frameId = 0;
    let isDisposed = false;

    const filterOpacities = {
      nebulae: 1,
      stars: 1,
      dead_stars: 1,
    };

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      smoothScroll += (scrollRef.current - smoothScroll) * Math.min(1, delta * 6.5);
      currentPointer.lerp(targetPointer, Math.min(1, delta * 5.5));
      hoverStrengthCurrent += (hoverStrengthTarget - hoverStrengthCurrent) * Math.min(1, delta * 5.0);

      // Apply smooth inertia when not actively dragging
      if (!isDragging) {
        dragOffset.x += dragVelocity.x;
        dragOffset.y = THREE.MathUtils.clamp(dragOffset.y + dragVelocity.y, -1.15, 1.15);
        dragVelocity.multiplyScalar(Math.pow(0.92, delta * 60));
      }

      if (detonationPulseRef.current > 0) {
        detonationPulseRef.current = Math.max(0, detonationPulseRef.current - delta * 1.4);
      }

      // 8-Section Phase Choreography
      const preExplosionStress = THREE.MathUtils.clamp(smoothScroll / 0.105, 0, 1);
      const moonFade = 1.0 - THREE.MathUtils.smoothstep(smoothScroll, 0.098, 0.128);
      const rawExpansion = THREE.MathUtils.clamp((smoothScroll - 0.095) / 0.905, 0, 1);
      const shockWaveProgress = THREE.MathUtils.clamp((smoothScroll - 0.090) / 0.28, 0, 1);

      // 1. Update Quark-Gluon Plasma Core (Section 01):
      //    At rest in Section 01, stays untouched at scale ~ 1.0.
      //    As detonation begins (00:00 -> 00:01 in video), implodes inward into an infinite-density pinpoint!
      const currentStress = Math.max(preExplosionStress, detonationPulseRef.current);
      moonMat.uniforms.uTime.value = elapsed;
      moonMat.uniforms.uStress.value = currentStress;
      moonMat.uniforms.uExplodeFade.value = moonFade;

      chromoMat.uniforms.uTime.value = elapsed;
      chromoMat.uniforms.uStress.value = currentStress;
      chromoMat.uniforms.uExplodeFade.value = moonFade;

      prominenceMat.uniforms.uTime.value = elapsed;
      prominenceMat.uniforms.uStress.value = currentStress;
      prominenceMat.uniforms.uExplodeFade.value = moonFade;

      qgpSparkMat.uniforms.uTime.value = elapsed;
      qgpSparkMat.uniforms.uStress.value = currentStress;
      qgpSparkMat.uniforms.uExplodeFade.value = moonFade;

      haloMat.uniforms.uTime.value = elapsed;
      haloMat.uniforms.uStress.value = currentStress;
      haloMat.uniforms.uExplodeFade.value = moonFade;

      const implosionSqueeze = THREE.MathUtils.smoothstep(smoothScroll, 0.025, 0.102);
      const moonScale =
        (1.0 + Math.sin(elapsed * 2.2) * 0.02) * (1.0 - implosionSqueeze * 0.975);
      const isDesktop = window.innerWidth >= 1024;
      const baseOffsetX = 0;
      const baseOffsetY = isDesktop ? 1.22 : 1.75;
      const targetScale = (isDesktop ? 2.35 : 1.12) * Math.max(0.018, moonScale);

      moonGroup.scale.setScalar(targetScale);
      moonGroup.rotation.y =
        elapsed * 0.14 + smoothScroll * 3.2 + currentPointer.x * 0.45 + dragOffset.x * 0.6;
      moonGroup.rotation.x =
        Math.sin(elapsed * 0.35) * 0.08 - currentPointer.y * 0.35 + dragOffset.y * 0.5;

      moonGroup.position.x = baseOffsetX + currentPointer.x * 0.35 * moonFade;
      moonGroup.position.y = baseOffsetY + currentPointer.y * 0.25 * moonFade;
      moonGroup.visible = moonFade > 0.005;
      if (moonGroup.visible) {
        haloMesh.lookAt(camera.position);
      }

      // 2. Update Cinematic Big Bang Explosion (Section 02: Blinding Core + 360° Fine Needles + Emerald/Amber/Rose Nebula Cloud)
      const isBlastActive = shockWaveProgress > 0.001 && shockWaveProgress < 0.999;
      blastSphereMesh.visible = isBlastActive;
      shockRing.visible = isBlastActive;
      bigBangNeedleLines.visible = isBlastActive;
      if (isBlastActive) {
        blastSphereMat.uniforms.uTime.value = elapsed;
        blastSphereMat.uniforms.uShockProgress.value = shockWaveProgress;
        const fireballRadius = 0.65 + Math.pow(shockWaveProgress, 0.68) * 11.5;
        blastSphereMesh.scale.setScalar(fireballRadius);
        blastSphereMesh.rotation.y = elapsed * 0.24;
        blastSphereMesh.rotation.x = elapsed * 0.14;

        shockMat.uniforms.uTime.value = elapsed;
        shockMat.uniforms.uShockProgress.value = shockWaveProgress;
        const shockScale = 1.4 + Math.pow(shockWaveProgress, 0.62) * 8.2;
        shockRing.scale.setScalar(shockScale);
        shockRing.lookAt(camera.position);

        bigBangNeedleMat.uniforms.uTime.value = elapsed;
        bigBangNeedleMat.uniforms.uShockProgress.value = shockWaveProgress;
      }

      // Filter Opacity Interpolation
      const f = filterRef.current;
      const targetNeb = f === 'all' || f === 'nebulae' ? 1.0 : 0.08;
      const targetStars = f === 'all' || f === 'stars' ? 1.0 : 0.08;
      const targetDead = f === 'all' || f === 'dead_stars' ? 1.0 : 0.08;

      const lerpRate = Math.min(1, delta * 6.0);
      filterOpacities.nebulae += (targetNeb - filterOpacities.nebulae) * lerpRate;
      filterOpacities.stars += (targetStars - filterOpacities.stars) * lerpRate;
      filterOpacities.dead_stars += (targetDead - filterOpacities.dead_stars) * lerpRate;

      // Keep Section 01 as a pure deep black void (#000000) before explosion; transition to #010206 after explosion
      const postExpEnv = THREE.MathUtils.smoothstep(smoothScroll, 0.095, 0.22);
      activeBgColor.copy(preExpBgColor).lerp(postExpBgColor, postExpEnv);
      sceneFog.color.copy(activeBgColor);
      sceneFog.density = THREE.MathUtils.lerp(0.0055, 0.0052, postExpEnv);

      // 4. Update Billowing Nebulae (Section 04 & Section 05)
      nebulaPoints.visible = rawExpansion > 0.01 && filterOpacities.nebulae > 0.02;
      nebulaMat.uniforms.uTime.value = elapsed;
      nebulaMat.uniforms.uExpansion.value = rawExpansion;
      nebulaMat.uniforms.uFilterOpacity.value = filterOpacities.nebulae;

      nurseryStarPoints.visible = rawExpansion > 0.02 && filterOpacities.nebulae > 0.02;
      nurseryStarMat.uniforms.uTime.value = elapsed;
      nurseryStarMat.uniforms.uExpansion.value = rawExpansion;
      nurseryStarMat.uniforms.uFilterOpacity.value = filterOpacities.nebulae;

      // 5. Update Ignition of First Suns (Section 06) & Spiral Streams & Giants (Section 07)
      starExplosionPoints.visible = rawExpansion > 0.005 && filterOpacities.stars > 0.02;
      if (starExplosionPoints.visible) {
        starExpMat.uniforms.uTime.value = elapsed;
        starExpMat.uniforms.uExpansion.value = rawExpansion;
        starExpMat.uniforms.uFilterOpacity.value = filterOpacities.stars;
        starExpMat.uniforms.uMouse.value.copy(currentPointer);
        starExpMat.uniforms.uHoverActive.value = hoverStrengthCurrent;
      }

      const heroStarEmerge =
        THREE.MathUtils.smoothstep(rawExpansion, 0.05, 0.28) * filterOpacities.stars;
      heroStarsGroup.visible = heroStarEmerge > 0.02;
      if (heroStarsGroup.visible) {
        for (let i = 0; i < heroStarNodes.length; i++) {
          const node = heroStarNodes[i];
          const dist = Math.pow(rawExpansion, node.expPower) * node.speed;
          const angle = rawExpansion * (1.1 + node.orbitSpeed * 12.0) + elapsed * node.orbitSpeed;
          const cs = Math.cos(angle);
          const sn = Math.sin(angle);
          node.mesh.position.set(
            (node.dir.x * cs - node.dir.z * sn) * dist,
            node.dir.y * dist,
            (node.dir.x * sn + node.dir.z * cs) * dist
          );
          node.mesh.scale.setScalar(node.baseScale * heroStarEmerge);
          node.mat.uniforms.uTime.value = elapsed;
          node.mat.uniforms.uOpacity.value = filterOpacities.stars;
          node.flareMat.uniforms.uTime.value = elapsed;
          node.flareMat.uniforms.uOpacity.value = filterOpacities.stars;
          node.flareMesh.lookAt(camera.position);
        }
      }

      // 6. Update Dead Stars, Pulsars & Relativistic Remnants (Section 08)
      deadStarPoints.visible = rawExpansion > 0.02 && filterOpacities.dead_stars > 0.02;
      if (deadStarPoints.visible) {
        deadStarMat.uniforms.uTime.value = elapsed;
        deadStarMat.uniforms.uExpansion.value = rawExpansion;
        deadStarMat.uniforms.uFilterOpacity.value = filterOpacities.dead_stars;
      }

      const pulsarScale =
        THREE.MathUtils.smoothstep(rawExpansion, 0.04, 0.25) * filterOpacities.dead_stars;
      pulsarClusterGroup.visible = pulsarScale > 0.02;
      if (pulsarClusterGroup.visible) {
        pulsarCoreMat.uniforms.uTime.value = elapsed;
        pulsarCoreMat.uniforms.uOpacity.value = filterOpacities.dead_stars;
        pulsarDiskMat.uniforms.uTime.value = elapsed;
        pulsarDiskMat.uniforms.uOpacity.value = filterOpacities.dead_stars;
        pulsarBeamMat.uniforms.uTime.value = elapsed;
        pulsarBeamMat.uniforms.uOpacity.value = filterOpacities.dead_stars;

        for (let i = 0; i < pulsarNodes.length; i++) {
          const node = pulsarNodes[i];
          const dist = Math.pow(rawExpansion, 0.85) * node.speed;
          node.group.position.copy(node.dir).multiplyScalar(dist);
          node.group.scale.setScalar(pulsarScale * 0.42);
          node.group.rotation.x += delta * node.rotSpeed.x;
          node.group.rotation.y += delta * node.rotSpeed.y;
          node.group.rotation.z += delta * node.rotSpeed.z;
        }
      }

      const bhEmerge =
        THREE.MathUtils.smoothstep(rawExpansion, 0.04, 0.24) * filterOpacities.dead_stars;
      blackHoleClusterGroup.visible = bhEmerge > 0.02;
      if (blackHoleClusterGroup.visible) {
        bhHorizonMat.uniforms.uTime.value = elapsed;
        bhHorizonMat.uniforms.uOpacity.value = filterOpacities.dead_stars;
        bhDiskMat.uniforms.uTime.value = elapsed;
        bhDiskMat.uniforms.uOpacity.value = filterOpacities.dead_stars;
        bhLensMat.uniforms.uTime.value = elapsed;
        bhLensMat.uniforms.uOpacity.value = filterOpacities.dead_stars;

        for (let i = 0; i < blackHoleNodes.length; i++) {
          const bh = blackHoleNodes[i];
          const dist = Math.pow(rawExpansion, 0.84) * bh.speed;
          bh.group.position.copy(bh.dir).multiplyScalar(dist);
          bh.group.scale.setScalar(bh.baseScale * bhEmerge);
          // Keep the gravitationally lensed Einstein arch facing the camera
          bh.lensMesh.lookAt(camera.position);
        }
      }

      // 7. Update Background Starfield Stream & Interactive Mouse Hover/Drag Camera Flight
      bgStarField.visible = postExpEnv > 0.002;
      if (bgStarField.visible) {
        bgStarMat.uniforms.uTime.value = elapsed;
        bgStarMat.uniforms.uScrollWarp.value = smoothScroll;
        bgStarMat.uniforms.uMouse.value.copy(currentPointer);
        bgStarMat.uniforms.uHoverActive.value = hoverStrengthCurrent;

        // Move & tilt the deep-space background starfield with both mouse hover and click-drag
        bgStarField.rotation.y =
          elapsed * 0.012 + smoothScroll * 0.55 + currentPointer.x * 0.32 + dragOffset.x * 0.85;
        bgStarField.rotation.x =
          Math.sin(elapsed * 0.08) * 0.03 - currentPointer.y * 0.26 + dragOffset.y * 0.75;
        bgStarField.position.x = -currentPointer.x * 2.4;
        bgStarField.position.y = -currentPointer.y * 1.8;
      }

      const camOrbitAngle =
        smoothScroll * Math.PI * 0.72 + currentPointer.x * 0.52 + dragOffset.x;
      const camRadius = 13.5 + Math.sin(smoothScroll * Math.PI) * 8.5 + smoothScroll * 6.8;
      const camElevation =
        Math.sin(smoothScroll * Math.PI * 2.0) * 3.2 +
        currentPointer.y * 4.5 +
        dragOffset.y * 8.5;

      const horizontalOrbitInfluence = 0.45 + smoothScroll * 0.55;
      camera.position.x = Math.sin(camOrbitAngle) * camRadius * horizontalOrbitInfluence;
      camera.position.y = camElevation;
      camera.position.z = Math.cos(camOrbitAngle) * camRadius;
      cameraLookTarget.set(
        currentPointer.x * 2.2 + dragOffset.x * 0.8,
        currentPointer.y * 1.6 - dragOffset.y * 0.6,
        0
      );
      camera.lookAt(cameraLookTarget);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollRef, detonationPulseRef]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
