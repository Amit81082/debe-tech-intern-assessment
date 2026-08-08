import type { Session } from "@/shared/types";

export const sessions: Session[] = [
  {
    id: "session-1",
    subject: "Mathematics",
    teacherName: "Sarah Johnson",
    datetime: "2026-08-10T13:30:00.000Z",
    status: "upcoming",
  },
  {
    id: "session-2",
    subject: "Physics",
    teacherName: "Michael Brown",
    datetime: "2026-08-12T15:00:00.000Z",
    status: "upcoming",
  },
  {
    id: "session-3",
    subject: "English",
    teacherName: "Emily Davis",
    datetime: "2026-08-14T14:00:00.000Z",
    status: "upcoming",
  },
];
