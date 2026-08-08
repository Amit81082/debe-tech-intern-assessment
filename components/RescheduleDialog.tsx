"use client";

import { FormEvent, useState, useEffect } from "react";

import type {
  RescheduleReason,
  RescheduleResponse,
  Session,
} from "@/shared/types";

import { requestReschedule } from "@/functions/requestReschedule";
interface RescheduleDialogProps {
  session: Session;
  onClose: () => void;
  onSuccess: (sessionId: string, newDatetime: string) => void;
}

function toDateTimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function RescheduleDialog({
  session,
  onClose,
  onSuccess,
}: RescheduleDialogProps) {
  const [minimumSlot, setMinimumSlot] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [reason, setReason] = useState<RescheduleReason | "">("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // The tutoring policy requires at least 2 hours of lead time.
  // We calculate this in the parent's browser timezone because
  // `datetime-local` represents the user's local wall-clock time.
  // The selected value is converted to UTC only when submitting,
  // so the backend receives a timezone-independent instant.

  useEffect(() => {
    const minimumDate = new Date(Date.now() + 2 * 60 * 60 * 1000);

    setMinimumSlot(toDateTimeLocalValue(minimumDate));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!newSlot) {
      setError("Please select a new date and time.");
      return;
    }

    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    const selectedDate = new Date(newSlot);

    if (Number.isNaN(selectedDate.getTime())) {
      setError("Please select a valid date and time.");
      return;
    }

    const minimumDate = new Date(Date.now() + 2 * 60 * 60 * 1000);

    if (selectedDate < minimumDate) {
      setError("Please choose a time at least 2 hours from now.");
      return;
    }

    setIsLoading(true);

    try {
      // const newDatetime = newSlot;
      // console.log(newSlot);
      const newDatetime = selectedDate.toISOString();
      // console.log(newDatetime);

      const result: RescheduleResponse = await requestReschedule({
        sessionId: session.id,
        existingSlot: session.datetime,
        newSlot: newDatetime,
        reason,
      });

      if (!result.success) {
        setError(result.error ?? "Unable to request reschedule.");
        return;
      }

      onSuccess(session.id, newDatetime);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Request Reschedule</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          {session.subject} with {session.teacherName}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="new-slot"
              className="text-sm font-medium text-gray-900"
            >
              New date and time
            </label>

            <p className="mt-1 mb-1 text-xs text-gray-500">
              Times are shown in your local timezone. Rescheduling requires at
              least 2 hours' notice.
            </p>

            <input
              id="new-slot"
              type="datetime-local"
              value={newSlot}
              min={minimumSlot}
              onChange={(event) => setNewSlot(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300
             p-3 outline-none transition
             focus:border-black focus:ring-2
             focus:ring-gray-200"
            />
          </div>

          <div>
            <label
              htmlFor="reason"
              className="text-sm font-medium text-gray-900"
            >
              Reason
            </label>

            <select
              id="reason"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value as RescheduleReason)
              }
              className="mt-2 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
            >
              <option value="">Select a reason</option>
              <option value="Conflict">Conflict</option>
              <option value="Illness">Illness</option>
              <option value="Time zone">Time zone</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200
               bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-800 focus:bg-gray-800focus:ring-2"
          >
            {isLoading ? "Submitting request..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
