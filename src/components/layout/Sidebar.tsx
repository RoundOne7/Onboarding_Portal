// 'use client'

// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { FaChartPie, FaUserMd, FaHospital, FaCog } from 'react-icons/fa'
// import { FaKitMedical } from 'react-icons/fa6'

// export default function Sidebar() {
//   const pathname = usePathname();

//   // Helper function to check if the link is active
//   const isActive = (path: string) => pathname === path;

//   return (
//     <aside
//       className='
//         fixed
//         left-4
//         top-4
//         w-64
//         h-[calc(100vh-32px)] 
//         bg-cyan-900/99 
//         text-white
//         rounded-3xl 
//         flex
//         flex-col
//         shadow-2xl
//         overflow-hidden
//       '
//     >
//       {/* HEADER SECTION */}
//       <div className='p-8 pb-4'>
//         <h1 className='text-2xl font-bold flex items-center gap-3 tracking-wide'>
//           <div className='text-[#5ff67b] bg-white/10 p-2 rounded-lg'>
//              <FaKitMedical className=" text-2xl" />
//           </div>
//           HMS Portal
//         </h1>
//       </div>

//       {/* NAVIGATION SECTION */}
//       <nav className='flex flex-col gap-2 px-4 mt-6 flex-1'>
        
//         <Link 
//           href='/dashboard'
//           className={`
//             flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all
//             ${isActive('/dashboard') 
//               ? 'bg-[#5ff67b] text-slate-900 shadow-xl shadow-slate-700' // Matches the bright neon/green from the image
//               : 'text-gray-200 hover:text-white hover:bg-white/5 hover:scale-105'
//             }
//           `}
//         >
//           <FaChartPie className="text-xl" />
//           Dashboard
//         </Link>

//         <Link 
//           href='/doctors'
//           className={`
//             flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all
//             ${isActive('/doctors') 
//               ? 'bg-[#5ff67b] text-slate-900 shadow-xl shadow-slate-700' 
//               : 'text-gray-200 hover:text-white hover:bg-white/5 hover:scale-105'
//             }
//           `}
//         >
//           <FaUserMd className="text-xl" />
//           Doctors
//         </Link>

//         <Link 
//           href='/hospitals'
//           className={`
//             flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all
//             ${isActive('/hospitals') 
//               ? 'bg-[#5ff67b] text-slate-900 shadow-xl shadow-slate-700' 
//               : 'text-gray-200 hover:text-white hover:bg-white/5 hover:scale-105'
//             }
//           `}
//         >
//           <FaHospital className="text-xl" />
//           Hospitals
//         </Link>

//       </nav>

//       {/* BOTTOM SETTINGS & PROMO AREA */}
//       <div className='p-4 mb-4'>
//         <Link 
//           href='/settings'
//           className={`
//             flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all mb-4
//             ${isActive('/settings') 
//               ? 'bg-[#5ff67b] text-slate-900 shadow-xl shadow-slate-700' 
//               : 'text-gray-200 hover:text-white hover:bg-white/5 hover:scale-105'
//             }
//           `}
//         >
//           <FaCog className="text-xl" />
//           Settings
//         </Link>

//         {/* Matching the bottom card from the reference image */}
//         <div className='bg-[#5ff67b] text-slate-900 p-5 rounded-2xl relative overflow-hidden'>
//            <div className='relative z-10'>
//               <h3 className='font-bold text-sm mb-1'>Need Support?</h3>
//               <p className='text-xs opacity-80 mb-3'>Contact IT helpdesk for onboarding issues.</p>
//               <button className='bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full w-full hover:bg-slate-800 hover:scale-105 transition-all'>
//                  Contact Us
//               </button>
//            </div>
//            {/* Decorative background element for the card */}
//            <div className='absolute -bottom-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl'></div>
//         </div>
//       </div>

//     </aside>
//   )
// }


'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiGrid, FiUsers, FiSettings, FiHeadphones, FiLogOut } from 'react-icons/fi'
import { MdOutlineLocalHospital } from 'react-icons/md'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi'
import { FaKitMedical, FaQ, FaQuestion } from 'react-icons/fa6'
import { supabase } from '@/src/lib/supabase'
import { TbFile, TbFile3D, TbFileReport } from 'react-icons/tb'

export default function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (collapsed: boolean) => void }) {
  const pathname = usePathname()
  
  // State to manage sidebar expansion/collapse
  // const [isCollapsed, setIsCollapsed] = useState(false)

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
              <FaQuestion className="text-lg" />
            </div>
            {/* Hide text when collapsed */}
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap">
                QuickCheck
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
            href="/reports"
            className={`flex items-center py-3.5 rounded-xl font-medium transition-colors ${
              isActive('/reports') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-slate-800 hover:bg-gray-100 hover:scale-110 transition-all duration-200'
            } ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
          >
            <TbFile size={22} className="min-w-[22px]" />
            {!isCollapsed && <span className="flex-1 text-sm whitespace-nowrap">Reports</span>}
            {!isCollapsed && !isActive('/reports') && <BiChevronRight size={18} className="text-gray-400" />}
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