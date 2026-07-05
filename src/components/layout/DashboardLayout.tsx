'use client'

import { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import { auth, db } from '../../lib/firebase'
import { ref, onValue, update, get, query, orderByChild, equalTo, push } from 'firebase/database'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { clearAuthSessionCookie } from '../../lib/authSession'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Default inactivity timeout: 30 minutes in milliseconds
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000 

  const logAuditActivity = async (email: string, action: string) => {
    try {
      await push(ref(db, 'audit_logs'), {
        user_email: email,
        user_role: 'N/A',
        action: action,
        ip_address: 'Client Connection',
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
        created_at: new Date().toISOString()
      })
    } catch (e) {
      console.error('Failed to log audit activity:', e)
    }
  }

  const handleLogout = async (message: string, email?: string) => {
    if (email) {
      await logAuditActivity(email, `Logout: ${message}`)
    }
    await signOut(auth)
    clearAuthSessionCookie()
    alert(message)
    router.push('/')
  }

  // Session Timeout / Inactivity listener
  const resetInactivityTimeout = (email: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      handleLogout('Session expired due to inactivity.', email)
    }, INACTIVITY_TIMEOUT)
  }

  useEffect(() => {
    let email = ''
    let isCleanup = false
    const activityEvents = ['mousemove', 'keypress', 'click', 'scroll']
    const handleUserActivity = () => {
      if (email) resetInactivityTimeout(email)
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isCleanup) return

      if (!user) {
        setLoading(false)
        return
      }

      email = user.email || ''

      try {
        await logAuditActivity(email, 'Successful Authorization Verification')
        setLoading(false)

        resetInactivityTimeout(email)
        activityEvents.forEach(event => {
          window.addEventListener(event, handleUserActivity)
        })
      } catch (err) {
        console.error('Auth check failed:', err)
        setLoading(false)
      }
    })

    const savedState = localStorage.getItem('sidebarState')
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState))
    }
    setIsMounted(true)

    return () => {
      isCleanup = true
      unsubscribe()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity)
      })
    }
  }, [router])

  const handleToggleSidebar = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    localStorage.setItem('sidebarState', JSON.stringify(collapsed))
  }

  if (!isMounted || loading) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Checking authorization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f5f7fb] overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={handleToggleSidebar} />
      
      <motion.div 
        initial={false}
        animate={{ marginLeft: isCollapsed ? 88 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="flex-1 h-screen min-w-0 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="h-full flex flex-col w-full min-w-0"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}