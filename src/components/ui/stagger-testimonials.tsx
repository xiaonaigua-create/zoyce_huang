import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

const BASE = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '';

const TESTIMONIALS_EN = [
  {
    tempId: 1,
    testimonial: "Cyber Feed — A spiritual food platform for young workers, combining content recommendation with gamified engagement loops.",
    by: "Baidu / YY Live · Product Manager",
    imgSrc: `${BASE}cyber-feed-1.png`,
    videoSrc: `${BASE}cyber-feed-demo.mp4`,
  },
  {
    tempId: 3,
    testimonial: "A Rain Addict's Flow Moments — AI Immersive Dialogue",
    by: "Qingyue Tech · PM",
    imgSrc: `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=400&q=80`,
    videoSrc: `${BASE}rain-addict-demo.mp4`,
  },
  {
    tempId: 4,
    testimonial: "Focus Assistant — A rainy night immersion simulator. Follow the raindrops and capture your current mood, let your heart dance with the rain.",
    by: "Personal Project · Full Stack",
    imgSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
    videoSrc: `${BASE}portfolio-demo.mp4`,
  },
]

const TESTIMONIALS_ZH = [
  {
    ...TESTIMONIALS_EN[0],
    testimonial: "Cyber Feed — 面向年轻职场人的精神食粮平台，融合内容推荐与游戏化互动循环。",
    by: "百度 / YY直播 · 产品经理",
  },
  {
    ...TESTIMONIALS_EN[1],
    testimonial: "雨瘾者的心流时刻 — AI沉浸式对话体验",
    by: "清越科技 · 产品经理",
  },
  {
    ...TESTIMONIALS_EN[2],
    testimonial: "专注助手 — 雨夜沉浸模拟器。跟随雨滴捕捉此刻的心情，让心灵随雨起舞。",
    by: "个人项目 · 全栈开发",
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize
}) => {
  const { t } = useI18n()
  const isCenter = position === 0;
  const hasVideo = !!testimonial.videoSrc;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 1.2;
    if (isCenter) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isCenter]);

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer transition-transform duration-500 ease-in-out",
        isCenter ? "z-10" : "z-0",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        contain: 'layout style paint',
      }}
    >
      <div
        className={cn(
          "w-full h-full border-2 p-8",
          isCenter
            ? "bg-[#7C3AED] text-white border-[#7C3AED]"
            : "bg-white text-[#1a1a2e] border-gray-200 hover:border-[#7C3AED]/50"
        )}
        style={{
          clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
          boxShadow: isCenter ? "0px 12px 0px 6px rgba(124,58,237,0.25)" : "0px 0px 0px 0px transparent",
          contain: 'layout style',
        }}
      >
      {hasVideo ? (
        <video
          ref={videoRef}
          src={testimonial.videoSrc}
          muted
          loop
          playsInline
          className="mb-4 w-full max-h-[200px] object-contain rounded-lg bg-black/5"
          style={{ boxShadow: "3px 3px 0px rgba(0,0,0,0.1)" }}
        />
      ) : (
        <img
          src={testimonial.imgSrc}
          alt={`${testimonial.by.split(',')[0]}`}
          className="mb-4 h-14 w-12 bg-gray-100 object-cover object-top rounded-lg"
          style={{ boxShadow: "3px 3px 0px rgba(0,0,0,0.1)" }}
        />
      )}
      <h3 className={cn(
        "text-sm sm:text-lg font-medium leading-snug text-left",
        isCenter ? "text-white" : "text-[#1a1a2e]"
      )}>
        {testimonial.testimonial}
      </h3>
      <button
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 mt-2 px-5 py-1.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap",
          isCenter
            ? "bg-white text-[#7C3AED] hover:bg-white/90 shadow-lg"
            : "bg-[#7C3AED]/20 text-[#7C3AED] hover:bg-[#7C3AED]/30"
        )}
      >
        {t('Try it now →', '立即体验 →')}
      </button>
      </div>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const { locale, t } = useI18n()
  const testimonialsList = locale === 'en' ? TESTIMONIALS_EN : TESTIMONIALS_ZH
  const [cardSize, setCardSize] = useState(440);
  const [list, setList] = useState(testimonialsList);

  // ─── 切换语言时重新加载对应语言数据 ───
  useEffect(() => {
    setList(testimonialsList)
  }, [testimonialsList])

  const handleMove = (steps: number) => {
    const newList = [...list];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 440 : 320);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Auto-rotate every 4 seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleMove(1);
    }, 8000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [list]);

  return (
    <div
      className="relative w-full overflow-hidden bg-white/80"
      style={{ height: 600 }}
    >
      {list.map((testimonial, index) => {
        const centerIndex = Math.floor(list.length / 2);
        const position = index - centerIndex;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
    </div>
  );
};
