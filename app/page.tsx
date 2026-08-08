import { sessions } from "@/data/sessions";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Upcoming Tutoring Sessions</h1>

      <div className="mt-6 space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="rounded-lg border p-4">
            <h2 className="text-xl font-semibold">{session.subject}</h2>

            <p>Teacher: {session.teacherName}</p>

            <p>Date: {new Date(session.datetime).toLocaleString()}</p>

            <p>Status: {session.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
