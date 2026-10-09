export interface CoupleInfo {
  groom: string;
  bride: string;
  groomFull: string;
  brideFull: string;
  groomTitle: string;
  brideTitle: string;
  groomParents: string;
  brideParents: string;
}

export interface EventInfo {
  akad: EventDetail;
  reception: EventDetail;
}

export interface EventDetail {
  name: string;
  date: string;
  day: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  mapsUrl: string;
  mapsLabel: string;
}

export interface GiftAccount {
  label: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
}

export interface StoryItem {
  year: string;
  month: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface InvitationData {
  couple: CoupleInfo;
  event: EventInfo;
  gift: GiftAccount[];
  story: StoryItem[];
  gallery: GalleryImage[];
  hashtag: string;
  themeColor: string;
}

export type AttendanceStatus = "attending" | "not_attending" | "maybe";

export interface RsvpPayload {
  name: string;
  attendance: AttendanceStatus;
  guestCount: number;
  message: string;
}

export interface GuestbookPayload {
  name: string;
  message: string;
}

export interface GuestbookEntry {
  timestamp: string;
  name: string;
  message: string;
}
