'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiGrid, FiUsers, FiSettings, FiHeadphones, FiLogOut } from 'react-icons/fi'
import { MdOutlineLocalHospital } from 'react-icons/md'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi'
import { FaQuestion } from 'react-icons/fa6'
import { auth } from '../../lib/firebase'
import { signOut } from 'firebase/auth'
import { TbFile } from 'react-icons/tb'
import { motion, AnimatePresence } from 'framer-motion'

export default function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (collapsed: boolean) => void }) {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  async function logout() {
    await signOut(auth)
    window.location.href = '/'
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { href: '/hospitals', label: 'Hospitals', icon: MdOutlineLocalHospital },
    { href: '/doctors', label: 'Doctors', icon: FiUsers },
    { href: '/reports', label: 'Reports', icon: TbFile },
    { href: '/settings', label: 'Settings', icon: FiSettings },
    { href: '/support', label: 'Contact Support', icon: FiHeadphones }
  ]

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 88 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col justify-between py-6 z-50 shadow-premium"
    >
      <div>
        {/* HEADER / LOGO SECTION */}
        <div className={`flex items-center mb-10 transition-all duration-300 relative ${
          isCollapsed ? 'justify-center flex-col gap-4 px-2' : 'justify-between px-6'
        }`}>
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-w-[36px] w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm"
            >
              <FaQuestion className="text-base" />
            </motion.div>
            
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.h1 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-bold text-slate-800 tracking-tight whitespace-nowrap bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                >
                  QuickCheck
                </motion.h1>
              )}
            </AnimatePresence>
          </Link>
          
          {/* Collapse Toggle Button */}
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: '#f8fafc' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shadow-sm z-50 cursor-pointer"
          >
            {isCollapsed ? <BiChevronRight size={20} /> : <BiChevronLeft size={20} />}
          </motion.button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-1.5 px-4 relative">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`relative flex items-center py-3.5 rounded-xl font-medium transition-all group overflow-hidden ${
                  active 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-slate-800'
                } ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
              >
                {/* Dynamic Sliding Indicator Background */}
                {active && (
                  <motion.div
                    layoutId="sidebarActiveBg"
                    className="absolute inset-0 bg-blue-50/60 rounded-xl -z-10 border-l-4 border-blue-600"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}

                <motion.div 
                  whileHover={{ scale: active ? 1 : 1.1 }}
                  className={`flex items-center justify-center ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'}`}
                >
                  <Icon size={20} className="min-w-[20px]" />
                </motion.div>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 text-sm whitespace-nowrap font-semibold"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!isCollapsed && !active && (
                  <BiChevronRight 
                    size={16} 
                    className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" 
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* BOTTOM LOGOUT SECTION */}
      <div className="px-4 mt-auto">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className={`flex items-center w-full py-3.5 rounded-xl font-semibold text-red-500 hover:bg-red-50/60 transition-all ${
            isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'
          }`}
        >
          <FiLogOut size={20} className="min-w-[20px] text-red-400" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm whitespace-nowrap"
              >
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  )
}