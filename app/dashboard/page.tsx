"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {session?.user?.name}</h1>
      <p>Select an option from the sidebar to get started.</p>
    </div>
  );
}