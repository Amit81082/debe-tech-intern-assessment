"use client";

import { useState } from "react";
import { sessions } from "@/data/sessions";
import type { Session } from "@/shared/types";
import { SessionList } from "@/components/SessionList";
import { RescheduleDialog } from "@/components/RescheduleDialog";

export default function Home() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

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
          />
        )}
      </div>
    </main>
  );
}
