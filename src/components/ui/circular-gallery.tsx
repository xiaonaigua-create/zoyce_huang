import React, { useState, useEffect, useRef, useCallback, HTMLAttributes } from 'react';
import { cn } from "@/lib/utils";
import { useI18n } from '@/lib/i18n'

export interface GalleryItem {
  common: string;
  binomial: string;
  typeBadge?: string;
  badge?: string;
  logo?: string;
  duration?: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;
  };
  tags?: string[];
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 500, autoRotateSpeed = 0.005, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastAngleRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useI18n()

    // ─── Scroll-based rotation ───
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = -scrollProgress * 120;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, []);

    // ─── Auto-rotate when not scrolling and not dragging ───
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling && !isDragging) setRotation(prev => prev - autoRotateSpeed);
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };
      animationFrameRef.current = requestAnimationFrame(autoRotate);
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }, [isScrolling, isDragging, autoRotateSpeed]);

    // ─── Drag to manually rotate ───
    const getAngleFromEvent = useCallback((clientX: number, clientY: number) => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    }, []);

    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      lastAngleRef.current = getAngleFromEvent(clientX, clientY);
    }, [getAngleFromEvent]);

    const handleDragMove = useCallback((clientX: number, clientY: number) => {
      if (!isDragging) return;
      const currentAngle = getAngleFromEvent(clientX, clientY);
      let delta = currentAngle - lastAngleRef.current;

      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      setRotation(prev => prev - delta * 1.5);
      lastAngleRef.current = currentAngle;
    }, [isDragging, getAngleFromEvent]);

    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Global drag event listeners
    useEffect(() => {
      if (!isDragging) return;
      const onMove = (e: MouseEvent | TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as TouchEvent).clientY;
        handleDragMove(clientX, clientY);
      };
      const onEnd = () => handleDragEnd();
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
      };
    }, [isDragging, handleDragMove, handleDragEnd]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={ref}
        role="region"
        aria-label={t('Circular Gallery', '圆形画廊')}
        className={cn(
          "relative w-full h-full flex items-center justify-center select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          className,
        )}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          ref={containerRef}
          className="relative w-full h-full"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.15s linear',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.5, 1 - (normalizedAngle / 180));

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                className="absolute w-[220px] h-[300px] sm:w-[260px] sm:h-[340px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-110px',
                  marginTop: '-150px',
                  opacity,
                }}
                onClick={() => {}}
              >
                <div
                  className="relative w-full h-full rounded-xl shadow-xl overflow-hidden border-2 border-[#e8e6f0] bg-white"
                  style={{ transition: 'opacity 0.35s ease' }}
                >
                  {/* ─── Front Face ─── */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl bg-white hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden"
                    style={{
                      transition: 'opacity 0.3s ease',
                      opacity: flippedIndex === i ? 0 : 1,
                      pointerEvents: flippedIndex === i ? 'none' : 'auto',
                    }}
                  >
                    {/* Photo area — takes up most of the card */}
                    <div className="relative flex-shrink-0 h-[68%] overflow-hidden">
                      <img
                        src={item.photo.url}
                        alt={item.common}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Type badge — top-left corner */}
                      {item.typeBadge && (
                        <span className="absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#1a1a2e]/70 border border-[#1a1a2e]/10 shadow-sm whitespace-nowrap z-10">
                          {item.typeBadge}
                        </span>
                      )}
                      {/* Gradient overlay at bottom of photo for smooth text transition */}
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
                    </div>

                    {/* Text area below photo */}
                    <div className="flex-1 flex flex-col justify-center px-3.5 pb-3 pt-0.5 -mt-1">
                      {/* Company name + Duration badge row */}
                      <div className="flex items-center gap-1.5">
                        {item.logo && (
                          <img src={item.logo} alt="" className="w-5 h-5 sm:w-6 sm:h-6 rounded object-cover flex-shrink-0" loading="lazy" />
                        )}
                        <h3 className="text-xs sm:text-sm font-bold leading-tight text-[#1a1a2e] truncate min-w-0">{item.common}</h3>
                        {item.badge && (
                          <span className="text-[8px] sm:text-[9px] font-medium px-1 py-px rounded border border-black/12 text-black/40 whitespace-nowrap flex-shrink-0">
                            {item.badge}
                          </span>
                        )}
                        {item.duration && (
                          <span className="inline-flex items-center text-[8px] sm:text-[9px] font-medium px-1 py-px rounded-full border border-black/15 text-black/45 whitespace-nowrap flex-shrink-0">
                            {item.duration}
                          </span>
                        )}
                      </div>
                      {/* Role / subtitle */}
                      {item.binomial && (
                        <p className="text-[10px] sm:text-xs text-[#1a1a2e]/50 font-medium mt-0.5 leading-snug">{item.binomial}</p>
                      )}
                      {/* Tags on front face */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="px-1.5 py-px rounded-full border border-[#7C3AED]/15 bg-[#7C3AED]/6 text-[#7C3AED]/80 text-[9px] sm:text-[10px] font-medium whitespace-nowrap leading-none">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ─── Back Face ─── */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl bg-white border-2 border-[#e8e6f0] shadow-lg p-5 flex flex-col justify-between"
                    style={{
                      transition: 'opacity 0.35s ease',
                      opacity: flippedIndex === i ? 1 : 0,
                      pointerEvents: flippedIndex === i ? 'auto' : 'none',
                    }}
                  >
                    {item.tags && item.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {item.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-[11px] font-medium whitespace-nowrap">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#1a1a2e]/30 text-xs text-center italic">{t('No details yet', '暂无详情')}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
