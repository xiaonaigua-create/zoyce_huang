'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    };
  }, [refs]);
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue);
    };

    handleResize();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [baseValue, mobileValue]);

  return value;
}

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (hoveredIndex: number | null) => ReactNode[];
  scrollDuration?: number;
  visiblePercentage?: number;
  baseRadius?: number;
  mobileRadius?: number;
  startTrigger?: string;
  onItemSelect?: (index: number) => void;
  direction?: 'ltr' | 'rtl';
  disabled?: boolean;
}

/**
 * A scroll-driven interaction that rotates items along a large, partially hidden circle.
 * Supports mouse drag rotation and click-to-flip cards.
 */
export const RadialScrollGallery = forwardRef<
  HTMLDivElement,
  RadialScrollGalleryProps
>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 420,
      mobileRadius = 240,
      className = '',
      startTrigger = 'center center',
      onItemSelect,
      direction = 'ltr',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const pinRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLUListElement>(null);
    const childRef = useRef<HTMLLIElement>(null);
    const dragAreaRef = useRef<HTMLDivElement>(null);

    const mergedRef = useMergeRefs(ref, pinRef);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [manualRotation, setManualRotation] = useState(0);

    const currentRadius = useResponsiveValue(baseRadius, mobileRadius);
    const circleDiameter = currentRadius * 2;

    // Drag state
    const isDragging = useRef(false);
    const lastAngle = useRef(0);
    const startAngle = useRef(0);
    const containerCenter = useRef({ x: 0, y: 0 });

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage));
      const v = clamped / 100;
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);

    const childrenNodes = useMemo(
      () => React.Children.toArray(children(hoveredIndex)),
      [children, hoveredIndex]
    );
    const childrenCount = childrenNodes.length;

    // Measure the first child to determine layout buffers.
    useEffect(() => {
      setIsMounted(true);

      if (!childRef.current) return;

      const observer = new ResizeObserver((entries) => {
        let hasChanged = false;
        for (const entry of entries) {
          setChildSize({
            w: entry.contentRect.width,
            h: entry.contentRect.height,
          });
          hasChanged = true;
        }
        if (hasChanged) {
          ScrollTrigger.refresh();
        }
      });

      observer.observe(childRef.current);
      return () => observer.disconnect();
    }, [childrenCount]);

    // ─── Drag rotation logic ───
    const getAngleFromEvent = (e: React.MouseEvent | MouseEvent): number => {
      if (!dragAreaRef.current) return 0;
      const rect = dragAreaRef.current.getBoundingClientRect();
      containerCenter.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      return Math.atan2(
        e.clientY - containerCenter.current.y,
        e.clientX - containerCenter.current.x
      ) * (180 / Math.PI);
    };

    const handleDragStart = (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      lastAngle.current = getAngleFromEvent(e);
      startAngle.current = manualRotation;
      document.body.style.cursor = 'grabbing';
    };

    const handleDragMove = (e: React.MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const angle = getAngleFromEvent(e);
      let delta = angle - lastAngle.current;

      // Handle crossing the -180/180 boundary
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      const newRot = startAngle.current + delta * (direction === 'rtl' ? -1 : 1);
      setManualRotation(newRot);
      gsap.set(containerRef.current, { rotation: newRot });
      lastAngle.current = angle;
    };

    const handleDragEnd = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
    };

    useGSAP(
      () => {
        if (!pinRef.current || !containerRef.current || childrenCount === 0)
          return;

        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        if (!prefersReducedMotion) {
          gsap.fromTo(
            containerRef.current.children,
            { scale: 0, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: 'back.out(1.2)',
              stagger: 0.05,
              scrollTrigger: {
                trigger: pinRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          gsap.to(containerRef.current, {
            rotation: 360,
            ease: 'none',
            scrollTrigger: {
              trigger: pinRef.current,
              pin: true,
              start: startTrigger,
              end: `+=${scrollDuration}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      },
      {
        scope: pinRef,
        dependencies: [
          scrollDuration,
          currentRadius,
          startTrigger,
          childrenCount,
        ],
      }
    );

    if (childrenCount === 0) return null;

    const scaleFactor = 1.25;
    const calculatedBuffer = childSize
      ? childSize.h * scaleFactor - childSize.h + 60
      : 150;

    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200;

    const handleCardClick = (index: number) => {
      if (disabled) return;
      setFlippedIndex(prev => prev === index ? null : index);
      onItemSelect?.(index);
    };

    return (
      <div
        ref={mergedRef}
        className={`min-h-screen w-full relative flex items-center justify-center overflow-hidden ${className}`}
        {...rest}
      >
        {/* Drag area — captures mouse events for rotation */}
        <div
          ref={dragAreaRef}
          className='relative w-full overflow-hidden cursor-grab active:cursor-grabbing'
          style={{
            height: `${visibleAreaHeight}px`,
            maskImage:
              'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <ul
            ref={containerRef}
            className={`
              absolute left-1/2 -translate-x-1/2 will-change-transform m-0 p-0 list-none
              transition-opacity duration-500 ease-out
              ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''}
              ${isMounted ? 'opacity-100' : 'opacity-0'}
            `}
            dir={direction}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal),
            }}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI;
              let x = currentRadius * Math.cos(angle);
              const y = currentRadius * Math.sin(angle);

              if (direction === 'rtl') {
                x = -x;
              }

              const rotationAngle = (angle * 180) / Math.PI;
              const isHovered = hoveredIndex === index;
              const isFlipped = flippedIndex === index;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  className='absolute top-1/2 left-1/2'
                  style={{
                    zIndex: isHovered ? 100 : 10,
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${
                      rotationAngle + 90
                    }deg)`,
                  }}
                >
                  <div
                    role='button'
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => handleCardClick(index)}
                    onKeyDown={(e) => {
                      if (disabled) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(index);
                      }
                    }}
                    onMouseEnter={() => !disabled && !isFlipped && setHoveredIndex(index)}
                    onMouseLeave={() => !disabled && setHoveredIndex(null)}
                    onFocus={() => !disabled && !isFlipped && setHoveredIndex(index)}
                    onBlur={() => !disabled && setHoveredIndex(null)}
                    className={`
                      block cursor-pointer outline-none text-left
                      focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2
                      rounded-lg transition-all duration-500 ease-out will-change-transform
                      ${isHovered && !isFlipped ? 'scale-125 -translate-y-8' : 'scale-100'}
                      ${
                        isAnyHovered && !isHovered && !isFlipped
                          ? 'blur-[2px] opacity-40 grayscale'
                          : 'blur-0 opacity-100'
                      }
                      ${isFlipped ? 'z-[200]' : ''}
                    `}
                    style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
                  >
                    {/* Flip animation */}
                    <motion.div
                      className="w-full h-full"
                      style={{ transformStyle: 'preserve-3d' }}
                      animate={{
                        rotateY: isFlipped ? 180 : 0,
                      }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {/* Front face */}
                      <div
                        className={`w-full h-full ${isFlipped ? 'invisible' : ''}`}
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {child}
                      </div>
                      {/* Back face */}
                      <div
                        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#9E7AFF] p-5 ${!isFlipped ? 'invisible' : ''}`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <span className="text-white/60 text-xs font-medium tracking-wider uppercase">Details</span>
                        <span className="text-white text-lg font-bold text-center leading-tight">
                          Click again to flip back
                        </span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40 mt-2">
                          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Drag hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#7C3AED]/30 select-none pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-bounce">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span className="text-[10px] font-medium tracking-widest uppercase">Drag to rotate</span>
          </div>
        </div>
      </div>
    );
  }
);

RadialScrollGallery.displayName = 'RadialScrollGallery';

// ─── Mini motion.div for flip animation (avoids full framer-motion import in this file) ───
const motion = {
  div: ({ children, style, animate, transition, className }: any) => {
    const [currentStyle, setCurrentStyle] = React.useState(style);
    React.useEffect(() => {
      if (animate && typeof animate.rotateY !== 'undefined') {
        setCurrentStyle({
          ...style,
          transform: `rotateY(${animate.rotateY}deg)`,
          transition: `transform ${transition?.duration || 0.6}s ${transition?.ease || 'cubic-bezier(0.4, 0, 0.2, 1)'}`,
        });
      }
    }, [animate?.rotateY]);
    return (
      <div className={className} style={currentStyle}>
        {children}
      </div>
    );
  },
};
