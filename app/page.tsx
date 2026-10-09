"use client";

import { useState, Suspense, use } from "react";
import dynamic from "next/dynamic";
import { OpeningScreen } from "@/components/sections/OpeningScreen";
import { HeroSection } from "@/components/sections/HeroSection";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { EventDetailsSection } from "@/components/sections/EventDetailsSection";
import { StorySection } from "@/components/sections/StorySection";
import { RsvpSection } from "@/components/sections/RsvpSection";
import { GiftSection } from "@/components/sections/GiftSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { FloatingNavigation } from "@/components/FloatingNavigation";
import { MusicPlayer } from "@/components/MusicPlayer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LoadingState } from "@/components/ui/LoadingState";
import { APPS_SCRIPT_ENABLED, MAX_MESSAGE_LENGTH } from "@/lib/constants";

const GallerySection = dynamic(
  () =>
    import("@/components/sections/GallerySection").then(
      (m) => m.GallerySection
    ),
  { loading: () => <LoadingState message="Đang tải thư viện ảnh..." className="py-24" /> }
);

const GuestbookSection = dynamic(
  () =>
    import("@/components/sections/GuestbookSection").then(
      (m) => m.GuestbookSection
    ),
  { loading: () => <LoadingState message="Đang tải sổ lưu bút..." className="py-24" /> }
);

type SearchParams = Record<string, string | string[] | undefined>;

function readGuestName(params: SearchParams): string {
  const raw = params.to ?? params.name;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return "Khách mời";

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }

  return decoded.trim().slice(0, 80) || "Khách mời";
}

export default function WeddingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [opened, setOpened] = useState(false);
  const guestName = readGuestName(use(searchParams));
  const isDisabledAppScript = !APPS_SCRIPT_ENABLED;

  return (
    <>
      {!opened && (
        <OpeningScreen guestName={guestName} onOpen={() => setOpened(true)} />
      )}

      {opened && (
        <>
          <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
            <MusicPlayer />
            <ThemeToggle />
          </div>

          <FloatingNavigation />

          <main id="main-content" tabIndex={-1}>
            <HeroSection />
            <CountdownSection />
            <EventDetailsSection />
            <Suspense
              fallback={
                <LoadingState message="Đang tải thư viện ảnh..." className="py-24" />
              }
            >
              <GallerySection />
            </Suspense>
            <StorySection />

            {!isDisabledAppScript && (
              <>
                <RsvpSection />
                <Suspense
                  fallback={
                    <LoadingState
                      message="Đang tải sổ lưu bút..."
                      className="py-24"
                    />
                  }
                >
                  <GuestbookSection />
                </Suspense>
              </>
            )}
            
            <GiftSection />
            <FooterSection />
          </main>
        </>
      )}
    </>
  );
}
