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
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{session.subject}</h2>

          <p className="mt-1 text-sm text-gray-600">
            Teacher: {session.teacherName}
          </p>

          <p className="mt-2 text-sm">{formattedDate}</p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
          {session.status}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onReschedule(session)}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Request Reschedule
      </button>
    </article>
  );
}
