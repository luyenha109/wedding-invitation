"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check, Heart } from "lucide-react";
import { GoldShimmerText } from "@/components/motion/GoldShimmerText";
import { FloatingParticles } from "@/components/motion/FloatingParticles";
import { Button } from "@/components/ui/Button";
import { invitationData } from "@/data/invitation";
import { SITE_URL } from "@/lib/constants";
import { copyToClipboard } from "@/lib/utils";

export function FooterSection() {
  const [shared, setShared] = useState(false);
  const [failed, setFailed] = useState(false);
  const { couple, hashtag } = invitationData;

  async function handleShare() {
    const shareData = {
      title: `Đám cưới ${couple.groomFull} & ${couple.brideFull}`,
      text: `Bạn được mời đến dự đám cưới ${couple.groomFull} & ${couple.brideFull} vào Thứ Bảy, ngày 20 tháng 12 năm 2026 tại Yogyakarta. ${hashtag}`,
      url: SITE_URL,
    };

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.(shareData)
      ) {
        await navigator.share(shareData);
        return;
      }

      await copyToClipboard(SITE_URL);
      setFailed(false);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch (error) {
      // Người dùng huỷ hộp thoại chia sẻ — không phải lỗi.
      if (error instanceof DOMException && error.name === "AbortError") return;

      setShared(false);
      setFailed(true);
      setTimeout(() => setFailed(false), 6000);
    }
  }

  return (
    <footer
      id="footer"
      className="relative overflow-hidden pt-24 pb-12 section-padding"
      aria-label="Chân trang thiệp mời"
    >
      <FloatingParticles count={14} className="z-0" />

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/3 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-[color:var(--text-muted)]">
            Với Tình Yêu
          </span>
          <div className="gold-divider w-16 my-2" aria-hidden />
          <GoldShimmerText
            text={`${couple.groomFull} & ${couple.brideFull}`}
            as="p"
            size="xl"
            className="leading-tight"
          />
          <p className="mt-2 font-sans text-sm text-[color:var(--text-muted)] tracking-wider">
            {hashtag}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="font-sans text-sm text-[color:var(--text-secondary)] max-w-xs">
            Chia sẻ thiệp mời này đến gia đình và bạn bè mà bạn muốn cùng
            tham dự.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              size="md"
              onClick={handleShare}
              className="gap-2"
              aria-label="Chia sẻ thiệp mời này"
            >
              <AnimatePresence mode="wait" initial={false}>
                {shared ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 text-emerald-400" aria-hidden />
                    Đã Sao Chép Liên Kết!
                  </motion.span>
                ) : (
                  <motion.span
                    key="share"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" aria-hidden />
                    Chia Sẻ Thiệp Mời
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
          <AnimatePresence>
            {failed && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-sans text-xs text-amber-400 text-center max-w-xs"
                role="status"
                aria-live="polite"
              >
                Trình duyệt không cho sao chép tự động. Nhấn giữ liên kết{" "}
                <span className="select-all">{SITE_URL}</span> để sao chép thủ
                công.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="gold-divider w-full" aria-hidden />

        <div className="flex flex-col items-center gap-3">
          <p className="font-sans text-xs text-[color:var(--text-muted)] leading-relaxed max-w-sm">
            Đó là vinh dự và niềm hạnh phúc của chúng tôi nếu quý vị có thể
            đến dự và gửi lời chúc phúc.
          </p>
          <div className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
            <span>Được tạo với</span>
            <Heart className="h-3 w-3 text-[#D4AF37]" aria-hidden />
            <span>cho một khoảnh khắc khó quên</span>
          </div>
          <p className="font-sans text-xs text-[color:var(--text-muted)]/60">
            © 2026 {couple.groomFull} &amp; {couple.brideFull}
          </p>
        </div>
      </div>
    </footer>
  );
}
