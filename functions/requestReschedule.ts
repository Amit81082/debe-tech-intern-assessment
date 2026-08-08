import type { RescheduleRequest, RescheduleResponse } from "@/shared/types";

export async function requestReschedule(
  request: RescheduleRequest,
): Promise<RescheduleResponse> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const now = new Date();
  const newSlot = new Date(request.newSlot);
  const existingSlot = new Date(request.existingSlot);

  if (Number.isNaN(newSlot.getTime())) {
    return {
      success: false,
      error: "Please select a valid date and time.",
    };
  }

  if (newSlot <= now) {
    return {
      success: false,
      error: "The new session time must be in the future.",
    };
  }

  if (newSlot.getTime() === existingSlot.getTime()) {
    return {
      success: false,
      error: "The new time must be different from the current session.",
    };
  }

  return {
    success: true,
  };
}
