"use client";

import { useState, useEffect } from "react";
import { sessions as initialSessions } from "@/data/sessions";
import type { Session } from "@/shared/types";
import { SessionList } from "@/components/SessionList";
import { RescheduleDialog } from "@/components/RescheduleDialog";

export default function Home() {
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    const savedSessions = localStorage.getItem("sessions");

    if (!savedSessions) {
      return;
    }

    try {
      const parsedSessions: Session[] = JSON.parse(savedSessions);
      setSessions(parsedSessions);
    } catch {
      localStorage.removeItem("sessions");
    }
  }, []);

  const handleRescheduleSuccess = (sessionId: string, newDatetime: string) => {
    setSessions((currentSessions) => {
      const updatedSessions = currentSessions.map((session) =>
        session.id === sessionId
          ? { ...session, datetime: newDatetime }
          : session,
      );

      localStorage.setItem("sessions", JSON.stringify(updatedSessions));

      return updatedSessions;
    });

    setSelectedSession(null);
  };
  
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Upcoming Tutoring Sessions</h1>

        <p className="mt-2 text-gray-600">
          View your student's next tutoring sessions.
        </p>

        <SessionList sessions={sessions} onReschedule={setSelectedSession} />

        {selectedSession && (
          <RescheduleDialog
            session={selectedSession}
            onClose={() => setSelectedSession(null)}
            onSuccess={handleRescheduleSuccess}
          />
        )}
      </div>
    </main>
  );
}
