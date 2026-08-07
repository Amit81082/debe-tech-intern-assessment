import { onCall, HttpsError } from "firebase-functions/v2/https";

import { initializeApp } from "firebase-admin/app";

import { getFirestore } from "firebase-admin/firestore";

initializeApp();

const db = getFirestore();

interface BookingRequest {
  studentId: string;
  teacherId: string;
  slot: string; // ISO datetime string
  subject: string;
}

// BUG:
// Firestore's get() is asynchronous and returns a Promise.
// Without awaiting it, the code tries to access `docs` on a Promise,
// causing a runtime failure and preventing duplicate-slot validation.

export const bookSession = onCall<BookingRequest>(async (request) => {
  const data = request.data as BookingRequest;
  // BUG:
  // The function currently accepts unauthenticated requests.
  // In production, this would allow anyone who can call the
  // endpoint to create bookings without proving their identity.
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }
  // BUG:
  // An authenticated user could still submit another student's ID.
  // Verify ownership so users cannot create bookings on behalf of
  // another student.
  if (request.auth.uid !== data.studentId) {
    throw new HttpsError(
      "permission-denied",
      "You can only book a session for yourself",
    );
  }
  const booking = {
    studentId: data.studentId,
    teacherId: data.teacherId,
    slot: data.slot,
    subject: data.subject,
    status: "confirmed",
    createdAt: new Date(),
  };
  const teacherRef = db.collection("teachers").doc(data.teacherId);
  const existing = await teacherRef
    .collection("bookings")
    .where("slot", "==", data.slot)
    .get();
  if (existing.docs.length > 0) {
    return { success: false, message: "Slot already booked" };
  }

  await db.collection("bookings").add(booking);
  return { success: true };
});
