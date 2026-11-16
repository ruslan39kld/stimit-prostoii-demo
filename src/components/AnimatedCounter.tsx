import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  durationMs?: number;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  durationMs = 950,
  suffix = ' ₽',
}) => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Smooth ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    setValue(0);
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs]);

  const formatted = new Intl.NumberFormat('ru-RU').format(value);

  return (
    <span className="tabular-nums font-mono">
      {formatted}
      {suffix}
    </span>
  );
};
