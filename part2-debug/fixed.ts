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
export const bookSession = onCall((request) => {
  const data = request.data as BookingRequest;
  const context = request;
  const booking = {
    studentId: data.studentId,
    teacherId: data.teacherId,
    slot: data.slot,
    subject: data.subject,
    status: "confirmed",
    createdAt: new Date(),
    

  };
  const teacherRef = db.collection("teachers").doc(data.teacherId);
  const existing = teacherRef
    .collection("bookings")
    .where("slot", "==", data.slot)
    .get();
  if (existing.docs.length > 0) {
    return { success: false, message: "Slot already booked" };
  }

  db.collection("bookings").add(booking);
  return { success: true };
});
