import { useEffect, useState } from 'react';

export function useCountUp(target, duration = 1200, active = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return undefined;
    }

    let start = null;
    let frame = null;
    const from = 0;
    const to = target;

    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(from + (to - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration, active]);

  return value;
}
