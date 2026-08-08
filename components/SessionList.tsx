"use client";

import type { Session } from "@/shared/types";
import { SessionCard } from "./SessionCard";

interface SessionListProps {
  sessions: Session[];
  onReschedule: (session: Session) => void;
}

export function SessionList({ sessions, onReschedule }: SessionListProps) {
  return (
    <section className="mt-6 space-y-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onReschedule={onReschedule}
        />
      ))}
    </section>
  );
}
