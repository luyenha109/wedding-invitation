"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Gift } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { invitationData } from "@/data/invitation";
import { copyToClipboard } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { GiftAccount } from "@/types/invitation";

function AccountCard({ account }: { account: GiftAccount }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(text: string) {
    try {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard API might not be supported, fallback to prompt
    }
  }

  return (
    <div className="card-glass h-full rounded-3xl border border-[#D4AF37]/15 overflow-hidden shadow-[0_4px_32px_rgba(212,175,55,0.08)]">
      <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent p-5 pb-4 border-b border-[#D4AF37]/10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/15">
            <Gift className="h-4 w-4 text-[#D4AF37]" aria-hidden />
          </div>
          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-widest text-[color:var(--text-muted)]">
              {account.label}
            </p>
            <p className="font-serif text-sm font-semibold text-[color:var(--text-primary)]">
              Ngân Hàng {account.bankName}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-sans text-[0.65rem] text-[color:var(--text-muted)]">
            Chủ tài khoản
          </p>
          <p className="font-serif text-sm font-semibold text-[color:var(--text-primary)]">
            {account.accountHolder}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-sans text-[0.65rem] text-[color:var(--text-muted)]">
            Số tài khoản
          </p>
          <div className="flex items-center gap-3">
            <p className="font-mono text-base font-bold tracking-widest text-[#D4AF37]">
              {account.accountNumber}
            </p>
            <motion.button
              onClick={() => handleCopy(account.accountNumber)}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]",
                copied
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/60"
              )}
              whileTap={{ scale: 0.9 }}
              aria-label={
                copied
                  ? `Đã sao chép số tài khoản ${account.label}`
                  : `Sao chép số tài khoản ${account.label}`
              }
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          <AnimatePresence>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[0.65rem] text-emerald-400"
                role="status"
                aria-live="polite"
              >
                Đã sao chép số tài khoản {account.label} vào clipboard
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function GiftSection() {
  return (
    <section
      id="gift"
      className="py-24 section-padding overflow-hidden"
      aria-label="Thông tin quà tặng và tài khoản"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal direction="up">
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-[color:var(--text-muted)]">
              Wedding Gift
            </span>
            <h2 className="font-serif text-3xl font-bold gold-text sm:text-4xl">
              Quà Tặng
            </h2>
            <div className="gold-divider w-24" aria-hidden />
            <p className="font-sans text-sm text-[color:var(--text-secondary)] max-w-sm text-balance leading-relaxed">
              Sự hiện diện và những lời chúc của bạn là món quà tuyệt vời nhất đối
              với chúng tôi. Nhưng nếu bạn muốn gửi tặng một chút tấm lòng,
              chúng tôi xin trân trọng đón nhận với lòng biết ơn.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {invitationData.gift.map((account, index) => (
            <Reveal key={account.label} delay={0.15 + index * 0.1} direction="up">
              <AccountCard account={account} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25} direction="up">
          <p className="mt-6 text-center font-sans text-xs text-[color:var(--text-muted)] leading-relaxed">
            Bạn có thể xác nhận chuyển khoản qua Facebook hoặc Zalo cho gia đình cô dâu
            chú rể. Cảm ơn tấm lòng tốt của bạn.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
