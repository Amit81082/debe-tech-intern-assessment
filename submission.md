# Debe Learning — Tech Intern Assessment Submission

## Part 1 — GitHub Portfolio Walkthrough

### GitHub Profile

https://github.com/Amit81082

### Repository 1 — MessageHub

Repository: https://github.com/Amit81082/MessageHub

**Problem it solves**

MessageHub is a real-time messaging application that allows users to communicate through private and group conversations.

**What I built**

* Built the application using Next.js, TypeScript, MongoDB, Prisma, and Pusher.
* Implemented authentication with Google and GitHub.
* Built private and group conversations.
* Implemented real-time message delivery using Pusher.
* Added optimistic message sending so messages appear immediately in the UI.
* Added online/offline presence and seen-message functionality.
* Added image uploads using Cloudinary.
* Built responsive conversation interfaces for different screen sizes.
* Worked on performance improvements around conversation creation, navigation, and data fetching.

**One design decision I would make differently today**

I would separate some of the real-time event handling from the data-fetching and state-update logic more explicitly. As the application grows, this would make the messaging flow easier to test and maintain.

---

### Repository 2 — Rentopia

Repository: https://github.com/Amit81082/Rentopia

**Problem it solves**

Rentopia is an Airbnb-style property rental application where users can discover properties and manage booking-related actions.

**What I built**

* Built the application with Next.js and TypeScript.
* Implemented authentication.
* Built property listing and property-detail interfaces.
* Implemented property search and filtering functionality.
* Built reservation-related functionality.
* Added favorites functionality.
* Implemented host/property management features.
* Integrated image uploads and location-related functionality.
* Built responsive interfaces for desktop and mobile layouts.

**One design decision I would make differently today**

I would make the reservation and availability validation more centralized and independently testable. Booking conflicts are business-critical, so having the important rules concentrated in a clearly defined layer would make the system easier to reason about and maintain.

---

## Part 2 — Debugging Round

### Location

* Original code: `part2-debug/original.ts`
* Fixed code: `part2-debug/fixed.ts`

### Bug 1 — Missing `await` when reading Firestore

`get()` returns a Promise. The original code attempted to access `.docs` before the Promise had resolved.

This could cause the duplicate-slot check to fail and allow an already-booked slot to be treated as available.

**Fix:** Await the Firestore query before checking `existing.docs`.

### Bug 2 — Missing authentication

The original function did not verify whether the caller was authenticated.

In production, an unauthenticated caller could potentially invoke the function and create bookings.

**Fix:** Check `request.auth` and reject unauthenticated requests.

### Bug 3 — Missing student ownership validation

Authentication alone is not enough. An authenticated user could submit another student's ID.

That could allow users to create bookings on behalf of other students.

**Fix:** Verify that `request.auth.uid` matches `data.studentId`.

### Bug 4 — Missing `await` on the booking write

`db.collection("bookings").add()` is asynchronous.

Without awaiting it, the function could return `{ success: true }` before Firestore actually completed the write.

If the write subsequently failed, the client could incorrectly believe the booking was successful.

**Fix:** Await the Firestore write before returning success.

---

## Part 3 — Session Reschedule Widget

### Overview

I built a parent-facing Next.js App Router widget that displays a student's next three tutoring sessions and allows a parent to request a reschedule.

### Main functionality

* Displays the next three sessions.
* Shows subject, teacher, local date/time, and status.
* Opens a reschedule dialog for each session.
* Provides a date/time picker.
* Provides the required reason options:

  * Conflict
  * Illness
  * Time zone
  * Other
* Validates the selected date/time.
* Prevents selecting a slot within two hours of the current time.
* Prevents selecting the same slot as the existing session.
* Provides loading and error states.
* Displays a success toast after a successful request.
* Updates the session locally after rescheduling.
* Persists the updated mock session data locally.

### Local Time and UTC

The `datetime-local` input represents the parent's local wall-clock time.

The selected value is converted using:

`selectedDate.toISOString()`

before being passed to the reschedule function.

This means the UI can continue displaying the parent's local time while the value sent across the application boundary is represented as UTC.

### Two-Hour Lead-Time Policy

The two-hour restriction is calculated from the current time:

`current time + 2 hours`

It is not calculated from the existing session time.

For example, if the current time is 8:00 PM, a new slot before 10:00 PM is rejected.

This follows the requirement that slots within two hours of the current time must be disabled.

### Validation Flow

```text
Parent selects new slot
        ↓
Validate date/time
        ↓
Validate reason
        ↓
Validate current time + 2 hours
        ↓
Convert local Date → UTC ISO string
        ↓
requestReschedule()
        ↓
Validate again
        ↓
Return typed response
        ↓
Update session
        ↓
Show success toast
```

### TypeScript

Shared types are defined in `shared/types.ts` and are used by the frontend and reschedule function.

The implementation avoids `any` in the application code.

---

## Part 4 — Explain-It-Yourself Video

Video recording:

https://www.loom.com/share/649b2746fa054fda864d74f00ab42ed8

The recording demonstrates:

* Part 3 implementation.
* The local-time to UTC conversion.
* The two-hour lead-time policy.
* An intentional timezone-related code break.
* The resulting problem and why the conversion is necessary.

---

## Commit History

The project was developed incrementally rather than using a single squashed commit.

The main Part 3 progression was:

```text
1d2ae2e  → add session types and upcoming sessions
4a4629b  → build session reschedule widget UI
7edbaed  → add reschedule validation and request flow
9bb2d89  → persist rescheduled sessions locally
3f06eb8  → add reschedule success toast
```

Part 2 was also developed through multiple debugging/fix commits.

This reflects the actual development process and preserves the commit history requested in the assessment.
