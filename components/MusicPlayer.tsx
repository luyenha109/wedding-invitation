"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SC_WIDGET_API = "https://w.soundcloud.com/player/api.js";

type SoundCloudWidget = {
  play: () => void;
  pause: () => void;
  bind: (event: string, listener: () => void) => void;
};

type SoundCloudApi = {
  Widget: ((element: HTMLIFrameElement) => SoundCloudWidget) & {
    Events: { READY: string; PLAY: string; PAUSE: string; FINISH: string };
  };
};

declare global {
  interface Window {
    SC?: SoundCloudApi;
  }
}

interface MusicPlayerProps {
  src?: string;
  /** SoundCloud track or playlist URL. When set, it replaces the local audio file. */
  soundcloudUrl?: string;
  className?: string;
}

function loadSoundCloudApi(): Promise<SoundCloudApi> {
  if (window.SC) return Promise.resolve(window.SC);

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${SC_WIDGET_API}"]`
  );
  const script = existing ?? document.createElement("script");

  if (!existing) {
    script.src = SC_WIDGET_API;
    script.async = true;
    document.body.appendChild(script);
  }

  return new Promise((resolve, reject) => {
    script.addEventListener(
      "load",
      () => (window.SC ? resolve(window.SC) : reject(new Error("no SC"))),
      { once: true }
    );
    script.addEventListener("error", () => reject(new Error("SC load failed")), {
      once: true,
    });
  });
}

export function MusicPlayer({
  src = "/audio/wedding-music.mp3",
  soundcloudUrl,
  className,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => setPlaying(false);

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    if (!soundcloudUrl) return;
    let disposed = false;

    loadSoundCloudApi()
      .then((SC) => {
        if (disposed || !iframeRef.current) return;
        const widget = SC.Widget(iframeRef.current);
        widgetRef.current = widget;
        widget.bind(SC.Widget.Events.PLAY, () => setPlaying(true));
        widget.bind(SC.Widget.Events.PAUSE, () => setPlaying(false));
        widget.bind(SC.Widget.Events.FINISH, () => setPlaying(false));
      })
      .catch(() => {
        if (!disposed) setPlaying(false);
      });

    return () => {
      disposed = true;
      widgetRef.current = null;
    };
  }, [soundcloudUrl]);

  async function togglePlay() {
    if (soundcloudUrl) {
      const widget = widgetRef.current;
      if (!widget) return;

      if (playing) {
        widget.pause();
        setPlaying(false);
      } else {
        widget.play();
        setPlaying(true);
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        audio.volume = 0.5;
        audio.loop = true;
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  }

  const soundcloudSrc = soundcloudUrl
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(
        soundcloudUrl
      )}&color=%23D4AF37&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`
    : null;

  return (
    <>
      {soundcloudSrc ? (
        <iframe
          ref={iframeRef}
          title="SoundCloud player"
          src={soundcloudSrc}
          allow="autoplay"
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      ) : (
        <audio ref={audioRef} src={src} preload="metadata" aria-hidden />
      )}
      <motion.button
        onClick={togglePlay}
        className={cn(
          "group relative flex h-10 w-10 items-center justify-center rounded-full",
          "border border-[#D4AF37]/30 bg-[color:var(--card-bg)] backdrop-blur-sm",
          "text-[#D4AF37] shadow-[0_2px_12px_rgba(212,175,55,0.1)]",
          "transition-all duration-300 hover:border-[#D4AF37]/60 hover:shadow-[0_4px_20px_rgba(212,175,55,0.2)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]",
          className
        )}
        aria-label={playing ? "Pause music" : "Play music"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ duration: 0.15 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {playing ? (
            <motion.span
              key="pause"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Pause className="h-4 w-4" />
            </motion.span>
          ) : (
            <motion.span
              key="play"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Music2 className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>

        {playing && (
          <span
            className="absolute inset-0 rounded-full animate-ping border border-[#D4AF37]/20"
            aria-hidden
          />
        )}
      </motion.button>
    </>
  );
}
