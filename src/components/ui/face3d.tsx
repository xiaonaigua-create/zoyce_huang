'use client'

import { Suspense, useRef, useState, useEffect, Component, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useSpring, useTransform, SpringOptions } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── AceternitySpotlight — 静态SVG光圈 ──────

type AceternitySpotlightProps = {
  className?: string;
  fill?: string;
};

export const AceternitySpotlight = ({ className, fill }: AceternitySpotlightProps) => {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-100",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "white"}
          fillOpacity="0.21"
        ></ellipse>
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
};

// ─── Spotlight — ibelick 原版鼠标跟随光圈 ──────

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        setParentElement(parent);
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (!parentElement) return;

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', () => setIsHovered(true));
    parentElement.addEventListener('mouseleave', () => setIsHovered(false));

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', () => setIsHovered(true));
      parentElement.removeEventListener('mouseleave', () =>
        setIsHovered(false)
      );
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200',
        'from-zinc-50 via-zinc-100 to-zinc-200',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  );
}

// ─── 保持旧接口兼容 ──────

interface MouseSpotlightProps {
  mouseX?: number
  mouseY?: number
}

export function MouseSpotlight(_props: MouseSpotlightProps) {
  return <Spotlight size={200} />
}

// ─── Error Boundary ──────────────────────────────────────────────

class Face3DErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: Error) {
    console.error('[Face3D]', error.message)
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

// ─── Face Model (inside Canvas) ──────────────────────────────────

function FaceModel() {
  const meshRef = useRef<THREE.Group>(null)
  const targetRotation = useRef({ x: 0, y: 0 })
  const { gl } = useThree()

  const { scene } = useGLTF(`${import.meta.env.BASE_URL}face3d.glb`)

  useEffect(() => {
    if (!scene) return

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const mat = mesh.material
        const materials: THREE.Material[] = Array.isArray(mat) ? mat : [mat]

        materials.forEach((m) => {
          if ((m as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const sm = m as THREE.MeshStandardMaterial
            sm.metalness = 0.05
            sm.roughness = 0.45
          }
          if ((m as THREE.MeshPhongMaterial).isMeshPhongMaterial) {
            const pm = m as THREE.MeshPhongMaterial
            pm.shininess = 0
            pm.specular.set(0, 0, 0)
          }
          m.needsUpdate = true
        })
      }
    })

    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    scene.position.x = -center.x
    scene.position.y = -center.y
    scene.position.z = -center.z

    const maxDim = Math.max(size.x, size.y, size.z)
    scene.scale.setScalar(1 / maxDim)
    scene.position.y -= 0.1
  }, [scene])

  // Head follows mouse
  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.08
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.08
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      targetRotation.current.y = x * 0.6
      targetRotation.current.x = -y * 0.35
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return <primitive ref={meshRef} object={scene} />
}

// ─── Main Export ──────────────────────────────────────────────────

interface Face3DProps {
  className?: string
}

export function Face3D({ className }: Face3DProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fallback = (
    <div className={`w-full h-full flex items-center justify-center ${className || ''}`}>
      <span className="text-[#7C3AED]/30 text-xs">3D</span>
    </div>
  )

  if (!mounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className || ''}`}>
        <span className="loader"></span>
      </div>
    )
  }

  return (
    <Face3DErrorBoundary fallback={fallback}>
      <div className={`relative w-full h-full ${className || ''}`} style={{ zIndex: 20, pointerEvents: 'none' }}>

        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent', pointerEvents: 'none' }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1.8} color="#ffe8d6" />
            <hemisphereLight args={['#ffd4e5', '#a78bfa', 1.2]} />
            <directionalLight position={[2, 3, 4]} intensity={0.7} color="#fff0f0" />
            <FaceModel />
          </Suspense>
        </Canvas>
      </div>
    </Face3DErrorBoundary>
  )
}
