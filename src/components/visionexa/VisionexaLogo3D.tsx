import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default function VisionexaLogo3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setSize(host.clientWidth || 180, host.clientHeight || 150);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));
    const key = new THREE.DirectionalLight(0x9cecff, 3.2);
    key.position.set(-2.5, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb58cff, 2.0);
    rim.position.set(2, -1, -3);
    scene.add(rim);

    const logoRoot = new THREE.Group();
    scene.add(logoRoot);

    let disposed = false;
    let isVisible = true;
    let model: THREE.Object3D | null = null;
    const loader = new GLTFLoader();
    loader.load(
      '/models/visionexa-logo.glb',
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);
        const largest = Math.max(size.x, size.y, size.z, 0.001);
        model.scale.setScalar(2.25 / largest);
        model.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.castShadow = false;
            obj.receiveShadow = false;
            const materials = Array.isArray(obj.material)
              ? obj.material
              : [obj.material];
            materials.forEach((material) => {
              if ('metalness' in material) material.metalness = 0.95;
              if ('roughness' in material) material.roughness = 0.16;
              material.needsUpdate = true;
            });
          }
        });
        logoRoot.add(model);
        renderer.render(scene, camera);
      },
      undefined,
      (error) => {
        console.error('Failed to load Visionexa 3D logo model:', error);
      }
    );

    const resize = () => {
      if (!host || disposed) return;
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let rafId = 0;
    let timeoutId = 0;
    const clock = new THREE.Clock();

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync !== 'function') {
        timeoutId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          timeoutId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          timeoutId = window.setTimeout(cb, 80);
        }
      };
      timeoutId = window.setTimeout(poll, 5);
    };

    const scheduleNext = () => {
      if (disposed || !isVisible || prefersReducedMotion) return;
      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        rafId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      if (disposed || !isVisible) return;
      const t = clock.getElapsedTime();
      logoRoot.rotation.y = Math.sin(t * 0.42) * 0.16;
      logoRoot.rotation.x = Math.sin(t * 0.3) * 0.035;
      renderer.render(scene, camera);
      scheduleNext();
    };

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const nextVisible = entry.isIntersecting;
        if (nextVisible && !isVisible) {
          isVisible = true;
          if (prefersReducedMotion) {
            renderer.render(scene, camera);
          } else {
            animate();
          }
        } else if (!nextVisible && isVisible) {
          isVisible = false;
          cancelAnimationFrame(rafId);
          window.clearTimeout(timeoutId);
        }
      },
      { threshold: 0.01 }
    );
    visibilityObserver.observe(host);

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];
          mats.forEach((mat) => {
            for (const value of Object.values(mat)) {
              if (value instanceof THREE.Texture) {
                value.dispose();
              }
            }
            mat.dispose();
          });
        }
      });
      envTarget.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="vx-logo3d"
      role="img"
      aria-label="Three-dimensional Visionexa emblem"
    />
  );
}
