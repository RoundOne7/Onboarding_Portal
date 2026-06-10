'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiGrid, FiUsers, FiSettings, FiHeadphones, FiLogOut } from 'react-icons/fi'
import { MdOutlineLocalHospital } from 'react-icons/md'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi'
import { FaKitMedical } from 'react-icons/fa6'
import { supabase } from '@/src/lib/supabase'

export default function Sidebar() {
  const pathname = usePathname()
  
  // State to manage sidebar expansion/collapse
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Helper to check active routes
  const isActive = (path: string) => pathname === path

  async function logout() {

        await supabase.auth.signOut()

        window.location.href = '/'
    }

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-6 z-50 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[88px]' : 'w-[260px]'
      }`}
    >
      <div>
        {/* HEADER / LOGO SECTION */}
        <div className={`flex items-center mb-10 transition-all duration-300 ${
          isCollapsed ? 'justify-center flex-col gap-4 px-2' : 'justify-between px-6'
        }`}>
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-[32px] w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
              <FaKitMedical className="text-lg" />
            </div>
            {/* Hide text when collapsed */}
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap">
                HMS Portal
              </h1>
            )}
          </Link>
          
          {/* Collapse Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="min-w-[32px] relative -right-10 w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors overflow-hidden"
          >
            {isCollapsed ? <BiChevronRight size={20} /> : <BiChevronLeft size={20} />}
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-2 px-4">
          
          <Link 
            href="/dashboard"
            className={`flex items-center py-3.5 rounded-xl font-medium transition-colors ${
              isActive('/dashboard') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-slate-800 hover:bg-gray-100 hover:scale-110 transition-all duration-200'
            } ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
          >
            <FiGrid size={22} className="min-w-[22px]" />
            {!isCollapsed && <span className="flex-1 text-sm whitespace-nowrap">Dashboard</span>}
            {/* Added arrow and hide-when-active logic here */}
            {!isCollapsed && !isActive('/dashboard') && <BiChevronRight size={18} className="text-gray-400" />}
          </Link>

          <Link 
            href="/hospitals"
            className={`flex items-center py-3.5 rounded-xl font-medium transition-colors ${
              isActive('/hospitals') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-slate-800 hover:bg-gray-100 hover:scale-110 transition-all duration-200'
            } ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
          >
            <MdOutlineLocalHospital size={24} className="min-w-[24px]" />
            {!isCollapsed && <span className="flex-1 text-sm whitespace-nowrap">Hospitals</span>}
            {!isCollapsed && !isActive('/hospitals') && <BiChevronRight size={18} className="text-gray-400" />}
          </Link>

          <Link 
            href="/doctors"
            className={`flex items-center py-3.5 rounded-xl font-medium transition-colors ${
              isActive('/doctors') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-slate-800 hover:bg-gray-100 hover:scale-110 transition-all duration-200'
            } ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
          >
            <FiUsers size={22} className="min-w-[22px]" />
            {!isCollapsed && <span className="flex-1 text-sm whitespace-nowrap">Doctors</span>}
            {!isCollapsed && !isActive('/doctors') && <BiChevronRight size={18} className="text-gray-400" />}
          </Link>

          <Link 
            href="/settings"
            className={`flex items-center py-3.5 rounded-xl font-medium transition-colors ${
              isActive('/settings') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-slate-800 hover:bg-gray-100 hover:scale-110 transition-all duration-200'
            } ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
          >
            <FiSettings size={22} className="min-w-[22px]" />
            {!isCollapsed && <span className="flex-1 text-sm whitespace-nowrap">Settings</span>}
            {!isCollapsed && !isActive('/settings') && <BiChevronRight size={18} className="text-gray-400" />}
          </Link>

          <Link 
            href="/support"
            className={`flex items-center py-3.5 rounded-xl font-medium transition-colors ${
              isActive('/support') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-slate-800 hover:bg-gray-100 hover:scale-110 transition-all duration-200'
            } ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
          >
            <FiHeadphones size={22} className="min-w-[22px]" />
            {!isCollapsed && <span className="flex-1 text-sm whitespace-nowrap">Contact Support</span>}
            {!isCollapsed && !isActive('/support') && <BiChevronRight size={18} className="text-gray-400" />}
          </Link>

        </nav>
      </div>

      {/* BOTTOM LOGOUT SECTION */}
      <div className="px-4 mt-auto">
        <button 
          onClick={logout}
          className={`flex items-center w-full py-3.5 rounded-xl font-medium text-red-500 hover:bg-red-100 transition-colors hover:scale-110 ${
            isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'
          }`}
        >
          <FiLogOut size={22} className="min-w-[22px]" />
          {!isCollapsed && <span className="text-sm whitespace-nowrap">Log Out</span>}
        </button>
      </div>

    </aside>
  )
}