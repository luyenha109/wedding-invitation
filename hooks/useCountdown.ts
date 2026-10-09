"use client";

import { useState, useEffect } from "react";

interface CountdownValues {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

const ZERO: CountdownValues = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
  isExpired: false,
};

function toValues(diffSeconds: number): CountdownValues {
  if (diffSeconds <= 0) {
    return { ...ZERO, isExpired: true };
  }

  const d = Math.floor(diffSeconds / 86400);
  const h = Math.floor((diffSeconds % 86400) / 3600);
  const m = Math.floor((diffSeconds % 3600) / 60);
  const s = diffSeconds % 60;

  return {
    days: String(d).padStart(2, "0"),
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    seconds: String(s).padStart(2, "0"),
    isExpired: false,
  };
}

export function useCountdown(target: Date | string): CountdownValues {
  const [values, setValues] = useState<CountdownValues>(ZERO);

  useEffect(() => {
    const targetMs = new Date(target).getTime();

    function calculate(): CountdownValues {
      if (Number.isNaN(targetMs)) return ZERO;
      const diff = Math.floor((targetMs - Date.now()) / 1000);
      return toValues(diff);
    }

    setValues(calculate());
    const interval = setInterval(() => setValues(calculate()), 1000);
    return () => clearInterval(interval);
  }, [target]);

  return values;
}
