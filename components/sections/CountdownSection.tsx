"use client";

import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { Reveal } from "@/components/motion/Reveal";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { invitationData } from "@/data/invitation";
import { formatDate, getEventDateTime } from "@/lib/utils";
import type { EventDetail } from "@/types/invitation";

interface CountdownCardProps {
  value: string;
  label: string;
  delay: number;
}

function CountdownCard({ value, label, delay }: CountdownCardProps) {
  return (
    <Reveal delay={delay} direction="up">
      <motion.div
        className="card-glass flex min-w-[60px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#D4AF37]/15 px-3 py-4 sm:min-w-[72px] sm:py-5"
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
        aria-label={`${value} ${label}`}
      >
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -12, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="gold-text font-serif text-2xl font-bold tabular-nums sm:text-3xl"
          aria-hidden
        >
          {value}
        </motion.span>
        <span className="font-sans text-[10px] uppercase tracking-widest text-[color:var(--text-muted)] sm:text-xs">
          {label}
        </span>
      </motion.div>
    </Reveal>
  );
}

function Separator({ delay }: { delay: number }) {
  return (
    <Reveal delay={delay} direction="none">
      <span
        className="self-center pb-2 font-serif text-xl font-bold text-[#D4AF37]/50"
        aria-hidden
      >
        :
      </span>
    </Reveal>
  );
}

function EventCountdown({
  event,
  baseDelay,
}: {
  event: EventDetail;
  baseDelay: number;
}) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    getEventDateTime(event.date, event.time),
  );

  return (
    <Reveal direction="up" delay={baseDelay}>
      <div className="card-glass flex h-full flex-col items-center gap-5 rounded-3xl border border-[#D4AF37]/15 px-5 py-8">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            {event.name}
          </span>
          <p className="font-serif text-base font-semibold text-[color:var(--text-primary)]">
            {formatDate(event.date)}
          </p>
          <p className="font-sans text-sm text-[color:var(--text-secondary)]">
            {event.time}
          </p>
          <div className="gold-divider mt-1 w-16" aria-hidden />
        </div>

        {isExpired ? (
          <p className="py-4 font-serif text-lg italic text-[#D4AF37]">
            Ngày hạnh phúc đã đến!
          </p>
        ) : (
          <div
            role="timer"
            aria-live="off"
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            <CountdownCard value={days} label="Ngày" delay={baseDelay} />
            <Separator delay={baseDelay + 0.15} />
            <CountdownCard value={hours} label="Giờ" delay={baseDelay + 0.1} />
            <Separator delay={baseDelay + 0.25} />
            <CountdownCard value={minutes} label="Phút" delay={baseDelay + 0.2} />
            <Separator delay={baseDelay + 0.35} />
            <CountdownCard value={seconds} label="Giây" delay={baseDelay + 0.3} />
          </div>
        )}
      </div>
    </Reveal>
  );
}

export function CountdownSection() {
  const { akad, reception } = invitationData.event;

  return (
    <section
      id="countdown"
      className="section-padding relative overflow-hidden py-20"
      aria-label="Đếm ngược ngày cưới"
    >
      <AnimatedGradient className="z-0 opacity-50" />

      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <Reveal direction="up">
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-[color:var(--text-muted)]">
              Hướng Về Ngày Hạnh Phúc
            </span>
            <h2 className="gold-text font-serif text-3xl font-bold sm:text-4xl">
              Đếm Ngược
            </h2>
            <div className="gold-divider w-24" aria-hidden />
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          <EventCountdown event={akad} baseDelay={0} />
          <EventCountdown event={reception} baseDelay={0.15} />
        </div>
      </div>
    </section>
  );
}
