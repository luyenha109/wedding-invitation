import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import type { EventDetail } from "@/types/invitation";
import { invitationData } from "@/data/invitation";

interface EventCardProps {
  detail: EventDetail;
  delay?: number;
}

function EventCard({ 
  detail, 
  delay = 0 
}: EventCardProps) {
  const displayDate = new Date(detail.date).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayDateLunar = new Date(detail.dateLunar).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <Reveal delay={delay} direction="up">
      <article className="card-glass rounded-3xl p-8 flex flex-col gap-6 border border-[#D4AF37]/15 shadow-[0_4px_24px_rgba(212,175,55,0.08)]">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            {detail.name}
          </span>
          <h3 className="font-serif text-2xl font-bold text-[color:var(--text-primary)]">
            {detail.venue}
          </h3>
          <div className="gold-divider" aria-hidden />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden />
            <div>
              <p className="font-sans text-sm text-[color:var(--text-primary)]">
                {displayDate}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden />
            <div>
              <p className="font-sans text-sm text-[color:var(--text-primary)]">
                Nhằm ngày {displayDateLunar}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden />
            <p className="font-sans text-sm text-[color:var(--text-primary)]">
              {detail.time} - Lễ cưới
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden />
            <p className="font-sans text-sm text-[color:var(--text-primary)]">
              {detail.timeParty} - Khai tiệc
            </p>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden />
            <div className="flex flex-col gap-0.5">
              <p className="font-sans text-sm text-[color:var(--text-primary)]">
                {detail.venue}
              </p>
              <p className="font-sans text-xs text-[color:var(--text-muted)]">
                {detail.address}
              </p>
            </div>
          </div>
        </div>

        <a
          href={detail.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/40 px-5 py-3 text-sm font-medium text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] w-fit"
          aria-label={`Mở ${detail.mapsLabel} trên Google Maps`}
        >
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          Mở Google Maps
          <ExternalLink className="h-3 w-3 opacity-60" aria-hidden />
        </a>
      </article>
    </Reveal>
  );
}

export function EventDetailsSection() {
  const { event } = invitationData;

  return (
    <section
      id="event"
      className="relative py-24 section-padding overflow-hidden"
      aria-label="Chi tiết đám cưới"
    >
      <AnimatedGradient className="z-0 opacity-50" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal direction="up">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-[color:var(--text-muted)]">
              Thông Tin Sự Kiện
            </span>
            <h2 className="font-serif text-3xl font-bold gold-text sm:text-4xl">
              Chi Tiết Đám Cưới
            </h2>
            <div className="gold-divider w-24" aria-hidden />
            <p className="font-sans text-sm text-[color:var(--text-secondary)] max-w-md text-balance">
              
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <EventCard detail={event.akad} delay={0.1} />
          <EventCard detail={event.reception} delay={0.25} />
        </div>
      </div>
    </section>
  );
}
