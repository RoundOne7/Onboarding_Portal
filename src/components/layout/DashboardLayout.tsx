// 'use client'

// import { useState } from 'react'
// import Sidebar from './Sidebar'

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   // 1. Manage the sidebar state here at the layout level
//   const [isCollapsed, setIsCollapsed] = useState(false)

//   return (
//     <div className="flex min-h-screen bg-[#f8fafc]">
      
//       {/* 2. Pass the state and updater function down to the Sidebar */}
//       <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

//       {/* 3. Apply a dynamic margin-left that matches the exact width of your sidebar */}
//       <div 
//         className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
//           isCollapsed ? 'ml-[88px]' : 'ml-[260px]'
//         }`}
//       >
//         <main className="flex-1 p-6">
//           {children}
//         </main>
//       </div>
      
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 1. Add a new state to track if the component has fully loaded in the browser
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Check memory first
    const savedState = localStorage.getItem('sidebarState')
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState))
    }
    // Now tell React we are ready to safely show the UI
    setIsMounted(true)
  }, [])

  const handleToggleSidebar = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    localStorage.setItem('sidebarState', JSON.stringify(collapsed))
  }

  // 2. Prevent rendering the layout until we know the correct sidebar state.
  // This completely eliminates the flash!
  if (!isMounted) {
    return <div className="flex h-screen bg-gray-50 overflow-hidden" /> 
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={handleToggleSidebar} />
      
      <div className={`flex-1 h-screen overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[88px]' : 'ml-[260px]'}`}>
        {children}
      </div>
    </div>
  )
}