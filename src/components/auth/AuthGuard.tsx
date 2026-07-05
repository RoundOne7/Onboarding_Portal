'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { get, orderByChild, query, ref, equalTo } from 'firebase/database'
import { auth, db } from '../../lib/firebase'

const PUBLIC_PATHS = ['/', '/login']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const isPublicRoute = PUBLIC_PATHS.includes(pathname)

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isPublicRoute) {
        setReady(true)
        return
      }

      if (!user) {
        router.replace('/')
        setReady(true)
        return
      }

      try {
        const email = user.email || ''
        if (!email) {
          await signOut(auth)
          router.replace('/')
          setReady(true)
          return
        }

        const userRef = ref(db, 'internal_users')
        const q = query(userRef, orderByChild('email'), equalTo(email))
        const snapshot = await get(q)

        let activeUser = false
        snapshot.forEach((child) => {
          if (child.val().is_active === true) {
            activeUser = true
          }
        })

        if (!snapshot.exists() || !activeUser) {
          await signOut(auth)
          router.replace('/')
          setReady(true)
          return
        }
      } catch (error) {
        console.error('AuthGuard check failed:', error)
        await signOut(auth)
        router.replace('/')
      } finally {
        setReady(true)
      }
    })

    return () => unsubscribe()
  }, [pathname, router])

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-500">Checking authorization...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
