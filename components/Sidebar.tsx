"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleOptionSelect = (option: string) => {
    router.push(`/dashboard/${option}`);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <button onClick={() => handleOptionSelect('voice-ai')} className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded">
              Voice AI
            </button>
          </li>
          <li className="mb-2">
            <button onClick={() => handleOptionSelect('call-analysis')} className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded">
              Call Analysis
            </button>
          </li>
        </ul>
      </nav>
      <button 
        onClick={handleLogout}
        className="mt-8 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}