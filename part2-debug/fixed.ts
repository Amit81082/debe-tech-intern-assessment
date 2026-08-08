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

// BUG #1: Typing
// The callable function receives a request object, not the
// BookingRequest directly. Typing the callable with
// BookingRequest makes request.data type-safe and prevents
// incorrect request data from being accepted silently.
export const bookSession = onCall<BookingRequest>(async (request) => {
  const data = request.data;

  // BUG #2: Async read
  // Firestore's get() is asynchronous and returns a Promise.
  // Without awaiting it, we cannot safely access the returned
  // QuerySnapshot or its docs, so duplicate-slot validation fails.
  const teacherRef = db.collection("teachers").doc(data.teacherId);

  const existing = await teacherRef
    .collection("bookings")
    .where("slot", "==", data.slot)
    .get();

  // BUG #3: Security
  // The function must verify both authentication and ownership.
  // Otherwise, an unauthenticated caller or another authenticated
  // user could create a booking using someone else's studentId.
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

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

  if (existing.docs.length > 0) {
    return { success: false, message: "Slot already booked" };
  }

  // BUG #4: Async write
  // Firestore's add() returns a Promise. Without awaiting the write,
  // the function could return success before the booking is actually
  // persisted, causing the client to receive a false success.
  await db.collection("bookings").add(booking);

  return { success: true };
});
