"use client";

import type { Session } from "@/shared/types";
import { useEffect, useState } from "react";

interface SessionCardProps {
  session: Session;
  onReschedule: (session: Session) => void;
}

export function SessionCard({ session, onReschedule }: SessionCardProps) {
  const [formattedDate, setFormattedDate] = useState(session.datetime);

  useEffect(() => {
    setFormattedDate(
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
        hour12: true,
      }).format(new Date(session.datetime)),
    );
  }, [session.datetime]);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Tutoring Session
          </p>

          <h2 className="mt-1 text-lg font-semibold text-gray-900">
            {session.subject}
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Teacher: {session.teacherName}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
          {session.status}
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Date & Time
        </p>

        <p className="mt-1 text-sm font-medium text-gray-900">
          {formattedDate}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Shown in your local timezone
        </p>
      </div>

      <button
        type="button"
        onClick={() => onReschedule(session)}
        className="mt-4 w-full rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer"
      >
        Request Reschedule
      </button>
    </article>
  );
}
