import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei'
import { motion, useSpring, useTransform } from 'framer-motion'
import * as THREE from 'three'

const BASE = import.meta.env.BASE_URL

/* ========== Spotlight Component (from ibelick) ========== */
interface SpotlightProps {
  size?: number
}

function Spotlight({ size = 200 }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null)

  const mouseX = useSpring(0, { bounce: 0 })
  const mouseY = useSpring(0, { bounce: 0 })

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`)
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`)

  // Sync parent element ref
  setTimeout(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement
      if (parent && !parentElement) {
        parent.style.position = 'relative'
        parent.style.overflow = 'hidden'
        setParentElement(parent)
      }
    }
  }, 0)

  return (
    <motion.div
      ref={containerRef}
      className="pointer-events-none absolute rounded-full z-10 transition-opacity duration-200"
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
        background: 'radial-gradient(circle at center, rgba(255,250,205,0.15), transparent 80%)',
        filter: 'blur(20px)',
        opacity: isHovered ? 1 : 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  )
}

/* ========== 3D Model ========== */
function Model({ url }: { url: string }) {
  const gltf = useGLTF(url)
  return <primitive object={gltf.scene} scale={2.2} position={[0, -0.3, 0]} rotation-y={Math.PI / 1.8} />
}

/* ========== Floating Ring ========== */
function FloatingRing() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.position.y = Math.sin(t * 1.5) * 0.08
    meshRef.current.rotation.z = t * 0.4
  })

  return (
    <mesh ref={meshRef} rotation-x={-Math.PI / 2} position={[0, -1.4, 0]}>
      <ringGeometry args={[1.6, 1.4, 64]} />
      <meshStandardMaterial
        color="#fffaf"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
        emissive="#fffaf"
        emissiveIntensity={0.25}
      />
    </mesh>
  )
}

/* ========== Particles ========== */
function Particles() {
  const count = 30
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 5
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3
  }

  const pointsRef = useRef<THREE.Points>(null!)

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={0xfffaf}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ========== Main 3D Avatar Component ========== */
export default function Avatar3D({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '480px' }}>
      {/* Spotlight layer - follows mouse */}
      <Spotlight size={350} />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.2, 3.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} color="#ffffff" />
        <directionalLight position={[-5, 3, 2]} intensity={0.3} color="#E879F9" />

        <Suspense fallback={null}>
          <Model url={`${BASE}avatar-3d.glb`} />
          <ContactShadows position={[0, -1.2, 0]} opacity={0.35} blur={2.5} far={4} />
          <FloatingRing />
          <Particles />
        </Suspense>

        <Environment preset="apartment" environmentIntensity={0.3} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
