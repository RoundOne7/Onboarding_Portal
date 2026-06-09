'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaChartPie, FaUserMd, FaHospital, FaCog } from 'react-icons/fa'
import { FaKitMedical } from 'react-icons/fa6'

export default function Sidebar() {
  const pathname = usePathname();

  // Helper function to check if the link is active
  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className='
        fixed
        left-4
        top-4
        w-64
        h-[calc(100vh-32px)] 
        bg-cyan-900/99 
        text-white
        rounded-3xl 
        flex
        flex-col
        shadow-2xl
        overflow-hidden
      '
    >
      {/* HEADER SECTION */}
      <div className='p-8 pb-4'>
        <h1 className='text-2xl font-bold flex items-center gap-3 tracking-wide'>
          <div className='text-[#5ff67b] bg-white/10 p-2 rounded-lg'>
             <FaKitMedical className=" text-2xl" />
          </div>
          HMS Portal
        </h1>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className='flex flex-col gap-2 px-4 mt-6 flex-1'>
        
        <Link 
          href='/dashboard'
          className={`
            flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all
            ${isActive('/dashboard') 
              ? 'bg-[#5ff67b] text-slate-900 shadow-xl shadow-slate-700' // Matches the bright neon/green from the image
              : 'text-gray-200 hover:text-white hover:bg-white/5 hover:scale-105'
            }
          `}
        >
          <FaChartPie className="text-xl" />
          Dashboard
        </Link>

        <Link 
          href='/doctors'
          className={`
            flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all
            ${isActive('/doctors') 
              ? 'bg-[#5ff67b] text-slate-900 shadow-xl shadow-slate-700' 
              : 'text-gray-200 hover:text-white hover:bg-white/5 hover:scale-105'
            }
          `}
        >
          <FaUserMd className="text-xl" />
          Doctors
        </Link>

        <Link 
          href='/hospitals'
          className={`
            flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all
            ${isActive('/hospitals') 
              ? 'bg-[#5ff67b] text-slate-900 shadow-xl shadow-slate-700' 
              : 'text-gray-200 hover:text-white hover:bg-white/5 hover:scale-105'
            }
          `}
        >
          <FaHospital className="text-xl" />
          Hospitals
        </Link>

      </nav>

      {/* BOTTOM SETTINGS & PROMO AREA */}
      <div className='p-4 mb-4'>
        <Link 
          href='/settings'
          className={`
            flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all mb-4
            ${isActive('/settings') 
              ? 'bg-[#5ff67b] text-slate-900 shadow-xl shadow-slate-700' 
              : 'text-gray-200 hover:text-white hover:bg-white/5 hover:scale-105'
            }
          `}
        >
          <FaCog className="text-xl" />
          Settings
        </Link>

        {/* Matching the bottom card from the reference image */}
        <div className='bg-[#5ff67b] text-slate-900 p-5 rounded-2xl relative overflow-hidden'>
           <div className='relative z-10'>
              <h3 className='font-bold text-sm mb-1'>Need Support?</h3>
              <p className='text-xs opacity-80 mb-3'>Contact IT helpdesk for onboarding issues.</p>
              <button className='bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full w-full hover:bg-slate-800 hover:scale-105 transition-all'>
                 Contact Us
              </button>
           </div>
           {/* Decorative background element for the card */}
           <div className='absolute -bottom-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl'></div>
        </div>
      </div>

    </aside>
  )
}

