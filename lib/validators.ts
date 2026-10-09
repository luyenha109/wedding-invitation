import { z } from "zod";
import {
  MAX_NAME_LENGTH,
  MAX_MESSAGE_LENGTH,
  MIN_GUEST_COUNT,
  MAX_GUEST_COUNT,
} from "@/lib/constants";

export const rsvpSchema = z.object({
  name: z
    .string()
    .min(2, "Tên tối thiểu 2 ký tự")
    .max(MAX_NAME_LENGTH, `Tên tối đa ${MAX_NAME_LENGTH} ký tự`)
    .regex(/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF'-]+$/, "Tên không hợp lệ"),
  attendance: z.enum(["attending", "not_attending", "maybe"], {
    errorMap: () => ({ message: "Chọn trạng thái tham dự" }),
  }),
  guestCount: z
    .number()
    .int()
    .min(MIN_GUEST_COUNT, `Tối thiểu ${MIN_GUEST_COUNT} khách`)
    .max(MAX_GUEST_COUNT, `Tối đa ${MAX_GUEST_COUNT} khách`),
  message: z
    .string()
    .max(MAX_MESSAGE_LENGTH, `Lời nhắn tối đa ${MAX_MESSAGE_LENGTH} ký tự`)
    .optional()
    .default(""),
});

export const guestbookSchema = z.object({
  name: z
    .string()
    .min(2, "Tên tối thiểu 2 ký tự")
    .max(MAX_NAME_LENGTH, `Tên tối đa ${MAX_NAME_LENGTH} ký tự`)
    .regex(/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF'-]+$/, "Tên không hợp lệ"),
  message: z
    .string()
    .min(5, "Lời nhắn tối thiểu 5 ký tự")
    .max(MAX_MESSAGE_LENGTH, `Lời nhắn tối đa ${MAX_MESSAGE_LENGTH} ký tự`),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;
export type GuestbookFormValues = z.infer<typeof guestbookSchema>;
