"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import type { Ref } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MusicPlayerHandle {
  play: () => void;
  pause: () => void;
}

interface MusicPlayerProps {
  src?: string;
  className?: string;
  ref?: Ref<MusicPlayerHandle>;
}

export function MusicPlayer({
  src = "/audio/wedding-music.mp3",
  className,
  ref,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      play() {
        const audio = audioRef.current;
        if (!audio) return;
        // Must stay synchronous with the caller's tap: iOS grants playback
        // permission only inside the originating user gesture.
        audio.play().catch(() => setPlaying(false));
      },
      pause() {
        audioRef.current?.pause();
      },
    }),
    []
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    const onPlay = () => setPlaying(true);
    const onStop = () => setPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onStop);
    audio.addEventListener("ended", onStop);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onStop);
      audio.removeEventListener("ended", onStop);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        loop
        playsInline
        aria-hidden
      />
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
