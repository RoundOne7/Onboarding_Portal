'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Manage the sidebar state here at the layout level
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      
      {/* 2. Pass the state and updater function down to the Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* 3. Apply a dynamic margin-left that matches the exact width of your sidebar */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-[88px]' : 'ml-[260px]'
        }`}
      >
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
    </div>
  )
}