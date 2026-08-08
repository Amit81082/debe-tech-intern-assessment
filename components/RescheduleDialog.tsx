"use client";

import type { Session } from "@/shared/types";

interface RescheduleDialogProps {
  session: Session;
  onClose: () => void;
}

export function RescheduleDialog({ session, onClose }: RescheduleDialogProps) {
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

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="new-slot"
              className="mb-1 block text-sm font-medium"
            >
              New date and time
            </label>

            <input
              id="new-slot"
              type="datetime-local"
              className="w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label htmlFor="reason" className="mb-1 block text-sm font-medium">
              Reason
            </label>

            <select
              id="reason"
              defaultValue=""
              className="w-full rounded-lg border p-2"
            >
              <option value="" disabled>
                Select a reason
              </option>
              <option value="Conflict">Conflict</option>
              <option value="Illness">Illness</option>
              <option value="Time zone">Time zone</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-black px-4 py-2 text-white"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
