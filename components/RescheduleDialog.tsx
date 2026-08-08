"use client";

import { FormEvent, useState } from "react";

import type {
  RescheduleReason,
  RescheduleResponse,
  Session,
} from "@/shared/types";

import { requestReschedule } from "@/functions/requestReschedule";
interface RescheduleDialogProps {
  session: Session;
  onClose: () => void;
}

export function RescheduleDialog({ session, onClose }: RescheduleDialogProps) {
  const [newSlot, setNewSlot] = useState("");
  const [reason, setReason] = useState<RescheduleReason | "">("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!newSlot) {
      setError("Please select a new date and time.");
      return;
    }

    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    setIsLoading(true);

    try {
      const localDate = new Date(newSlot);

      const result: RescheduleResponse = await requestReschedule({
        sessionId: session.id,
        existingSlot: session.datetime,
        newSlot: localDate.toISOString(),
        reason,
      });

      if (!result.success) {
        setError(result.error ?? "Unable to request reschedule.");
        return;
      }

      setSuccess(true);
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
            className="text-xl"
          >
            ×
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          {session.subject} with {session.teacherName}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="new-slot">New date and time</label>

            <input
              id="new-slot"
              type="datetime-local"
              value={newSlot}
              onChange={(event) => setNewSlot(event.target.value)}
              className="w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label htmlFor="reason">Reason</label>

            <select
              id="reason"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value as RescheduleReason)
              }
              className="w-full rounded-lg border p-2"
            >
              <option value="">Select a reason</option>
              <option value="Conflict">Conflict</option>
              <option value="Illness">Illness</option>
              <option value="Time zone">Time zone</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {success && (
            <p className="text-sm text-green-600">
              Reschedule request submitted successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
