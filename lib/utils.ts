import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Ghép ngày (yyyy-mm-dd) và giờ (HH:mm) thành ISO string theo giờ Việt Nam (+07:00). */
export function getEventDateTime(dateStr: string, time: string): string {
  return `${dateStr}T${time}:00+07:00`;
}

export function formatTime(seconds: number): {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
} {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return {
    days: String(d).padStart(2, "0"),
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    seconds: String(s).padStart(2, "0"),
  };
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sao chép văn bản bằng execCommand — đường dự phòng cho trình duyệt không hỗ
 * trợ Clipboard API (WKWebView của Zalo/Messenger/Facebook trên iOS) hoặc khi
 * Clipboard API bị từ chối.
 *
 * iOS yêu cầu textarea phải nằm trong DOM, không readonly, và có selection hợp
 * lệ thì execCommand("copy") mới chạy.
 */
function legacyCopy(text: string): boolean {
  if (typeof document === "undefined") return false;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("aria-hidden", "true");
  // font-size >= 16px tránh iOS tự zoom trang khi focus.
  textarea.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;outline:0;box-shadow:none;background:transparent;font-size:16px;opacity:0;";

  const selection = document.getSelection();
  const previousRange =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  document.body.appendChild(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();
  textarea.setSelectionRange(0, text.length); // iOS: cần cho execCommand copy

  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }

  document.body.removeChild(textarea);

  if (selection) {
    selection.removeAllRanges();
    if (previousRange) selection.addRange(previousRange);
  }

  return succeeded;
}

export async function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Bị từ chối (NotAllowedError) hoặc không có quyền — thử đường dự phòng.
    }
  }

  if (legacyCopy(text)) return;

  throw new Error("Không thể sao chép. Vui lòng sao chép thủ công.");
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function getGuestName(searchParams: URLSearchParams): string {
  const name = searchParams.get("to") ?? searchParams.get("name");
  if (!name) return "Khách mời";
  const decoded = decodeURIComponent(name);
  return decoded.slice(0, 80);
}
