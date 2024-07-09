// components/Sidebar.tsx
"use client";

import React, { useState } from 'react';
import { FaMicrophone, FaPhone, FaSignOutAlt, FaAngleLeft, FaAngleRight, FaFileAlt, FaFileInvoiceDollar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, onToggleSidebar }: SidebarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isExecutionLogsOpen, setIsExecutionLogsOpen] = useState(false);

  const handleOptionSelect = (option: string) => {
    router.push(`/dashboard/${option}`);
  };

  const handleExecutionLogSelect = (logType: string) => {
    router.push(`/dashboard/execution-logs/${logType}`);
  };

  const handleLogout = async () => {
    localStorage.clear();
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className={`fixed top-0 left-0 p-2 ${isCollapsed ? 'w-20' : 'w-64'} bg-white text-black h-full transition-all duration-300`}>
      <div className='shadow-custom border h-full rounded-md bg-gray-50'>
      <div className="flex justify-between items-center mb-4 p-4">
        {!isCollapsed && <h2 className="text-2xl font-bold">Dashboard</h2>}
        <button onClick={onToggleSidebar} className="text-black focus:outline-none">
          {isCollapsed ? <FaAngleRight /> : <FaAngleLeft />}
        </button>
      </div>
      <nav>
        <ul>
          <li className="mb-2">
            <button onClick={() => handleOptionSelect('voice-ai')} className="w-full text-left py-2 px-4 hover:bg-gray-500 hover:text-white rounded flex items-center">
              <FaMicrophone className="mr-2" />
              {!isCollapsed && <span>Voice AI</span>}
            </button>
          </li>
          <li className="mb-2">
            <button onClick={() => handleOptionSelect('call-analysis')} className="w-full text-left py-2 px-4  hover:bg-gray-500 hover:text-white rounded flex items-center">
              <FaPhone className="mr-2" />
              {!isCollapsed && <span>Call Analysis</span>}
            </button>
          </li>
          <li className="mb-2">
            <button 
              onClick={() => setIsExecutionLogsOpen(!isExecutionLogsOpen)} 
              className="w-full text-left py-2 px-4  hover:bg-gray-500 hover:text-white rounded flex items-center justify-between"
            >
              <div className="flex items-center">
                <FaFileAlt className="mr-2" />
                {!isCollapsed && <span>Execution Logs</span>}
              </div>
              {!isCollapsed && (isExecutionLogsOpen ? <FaChevronUp /> : <FaChevronDown />)}
            </button>
            {!isCollapsed && isExecutionLogsOpen && (
              <ul className="ml-4 mt-2">
                <li className="mb-2">
                  <button 
                    onClick={() => handleExecutionLogSelect('call-analysis')} 
                    className="w-full text-left py-1 px-4 hover:bg-gray-500 rounded hover:text-white"
                  >
                    Call Analysis Logs
                  </button>
                </li>
                <li className="mb-2">
                  <button 
                    onClick={() => handleExecutionLogSelect('voice-ai')} 
                    className="w-full text-left py-1 px-4  hover:bg-gray-500 hover:text-white rounded"
                  >
                    Voice AI Logs
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li className="mb-2">
            <button onClick={() => handleOptionSelect('billing')} className="w-full text-left py-2 px-4  hover:bg-gray-500 hover:text-white rounded flex items-center">
              <FaFileInvoiceDollar className="mr-2" />
              {!isCollapsed && <span>Billing</span>}
            </button>
          </li>
        </ul>
      </nav>
      <div className="p-2">
      <button
        onClick={handleLogout}
        className="mt-8 w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 flex items-center justify-center"
      >
        <FaSignOutAlt className="mr-2" />
        {!isCollapsed && <span>Logout</span>}
      </button>
      </div>
      </div>
    </div>
  );
}