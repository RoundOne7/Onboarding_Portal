// CODE ONLY ACCESS THE EXISTING USER AND DON'T TAKE LOGIN OF NEW USERS.
// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'

// import { supabase } from '../lib/supabase'

// export default function LoginPage() {

//     const router = useRouter()

//     const [email, setEmail] =
//         useState('')

//     const [password, setPassword] =
//         useState('')

//     const [loading, setLoading] =
//         useState(false)

//     async function handleLogin() {

//         setLoading(true)

//         const { data, error } =
//             await supabase.auth.signInWithPassword({

//                 email,
//                 password
//             })

//         if (error) {

//             alert(error.message)

//             setLoading(false)

//             return
//         }

//         const userEmail =
//             data.user.email

//         const { data: internalUser }
//             = await supabase

//                 .from('internal_users')

//                 .select('*')

//                 .eq('email', userEmail)

//                 .eq('is_active', true)

//                 .single()

//         if (!internalUser) {

//             alert(
//                 'No portal access'
//             )

//             await supabase.auth.signOut()

//             setLoading(false)

//             return
//         }

//         router.push('/dashboard')
//     }

//     return (

//         <main
//             className='
//       min-h-screen
//       flex
//       items-center
//       justify-center
//       bg-linear-to-br from-gray-600 via-gray-400 to-gray-600
//     '>

//             <div
//                 className='
//         bg-gray-200/80
//         p-10
//         rounded-2xl
//         w-full
//         max-w-md
//         shadow-gray-100
//         shadow-3xl
//         hover:shadow-gray-300
//         hover:shadow-4xl
//         hover:scale-110
//         hover:bg-gray-200/90
//         transition
//         duration-300
//       '>

//                 <h1
//                     className='
//           text-3xl
//           font-bold
//           mb-8
//           text-center
//         '>

//                     Doctor Portal Login

//                 </h1>

//                 <input
//                     type='email'
//                     placeholder='Email'

//                     value={email}

//                     onChange={(e) =>
//                         setEmail(e.target.value)
//                     }

//                     className='
//           w-full
//           border
//           p-4
//           rounded-xl
//           mb-4
//           hover:scale-105
//           transition
//           duration-200
//         '
//                 />

//                 <input
//                     type='password'
//                     placeholder='Password'

//                     value={password}

//                     onChange={(e) =>
//                         setPassword(e.target.value)
//                     }

//                     className='
//           w-full
//           border
//           p-4
//           rounded-xl
//           mb-6
//           hover:scale-105
//           transition
//           duration-200
//         '
//                 />

//                 <button

//                     onClick={handleLogin}

//                     disabled={loading}

//                     className='
//           w-full
//           bg-gray-800/90
//           text-white
//           p-4
//           rounded-xl
//           font-semibold
//           hover:scale-115
//           transition
//           duration-300
//         '
//                 >

//                     {
//                         loading
//                             ? 'Logging in...'
//                             : 'Login'
//                     }

//                 </button>

//             </div>

//         </main>
//     )
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Icons
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { MdSecurity } from 'react-icons/md'
import { FaHospital, FaQuestion } from 'react-icons/fa6'
import { FaFileAlt, FaUser, FaUserMd } from 'react-icons/fa'

// Assets and Libs
import loginWallpaper from '../assets/login_wallpaper_exact.png'
import { supabase } from '../lib/supabase' // Make sure this path is correct!

export default function LoginPage() {
  const router = useRouter()

  // UI States
  const [showPassword, setShowPassword] = useState(false)
  
  // Auth States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Merged Supabase Login Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Authenticate user with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        alert(error.message)
        setLoading(false)
        return
      }

      const userEmail = data.user.email

      // 2. Check internal_users table for portal access
      const { data: internalUser, error: dbError } = await supabase
        .from('internal_users')
        .select('*')
        .eq('email', userEmail)
        .eq('is_active', true)
        .single()

      if (dbError || !internalUser) {
        alert('No portal access')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      // 3. Success! Redirect to Dashboard
      router.push('/dashboard')
      
    } catch (err) {
      console.error("Login error:", err)
      alert("An unexpected error occurred.")
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex w-full bg-white font-sans overflow-hidden">
      
      {/* ========================================== */}
      {/* LEFT SIDE: Promotional & Branding */}
      {/* ========================================== */}
      <div className='flex flex-col w-[40%]'>
        <div 
          className="hidden lg:flex w-[100%] h-[100%] p-8 flex-col justify-between relative overflow-hidden border-r border-gray-100 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${loginWallpaper.src})` }}
        >
          
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg">
                <FaQuestion className='text-blue-900'/>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 leading-tight">QuickCheck</h1>
                <p className="text-xs text-slate-600 font-semibold">Onboarding Portal</p>
              </div>
            </div>
          </div>

          <div className='flex flex-row mt-4 justify-center items-center gap-12 bottom-70 right-7 relative '>
              <div className='hover:scale-110 transition-transform duration-200'>
                   <div className='w-15 h-15 bg-white mb-2 rounded-2xl flex items-center justify-center shadow-md'>
                      <FaHospital className='text-2xl text-blue-400' />
                   </div>
                   <p className="text-xs text-slate-600 font-medium text-center">Hospital</p>
                   <p className="text-xs text-slate-600 font-medium text-center">Onboarding</p>
              </div>
               <div className='hover:scale-110 transition-transform duration-200'>
                   <div className='w-15 h-15 bg-white mb-2 rounded-2xl flex items-center justify-center shadow-md'>
                      <FaUserMd className='text-2xl text-green-300'/>
                   </div>
                   <p className="text-xs text-slate-600 font-medium text-center">Doctor</p>
                   <p className="text-xs text-slate-600 font-medium text-center">Onboarding</p>
              </div>
               <div className='hover:scale-110 transition-transform duration-200'>
                   <div className='w-15 h-15 bg-white mb-2 rounded-2xl flex items-center justify-center shadow-md'>
                      <FaUser className='text-2xl text-purple-400'/>
                   </div>
                   <p className="text-xs text-slate-600 font-medium text-center">Staff</p>
                   <p className="text-xs text-slate-600 font-medium text-center">Onboarding</p>
              </div>
               <div className='hover:scale-110 transition-transform duration-200'>
                   <div className='w-15 h-15 bg-white mb-2 rounded-2xl flex items-center justify-center shadow-md'>
                      <FaFileAlt className='text-2xl text-orange-300'/>
                   </div>
                   <p className="text-xs text-slate-600 font-medium text-center">Document</p>
                   <p className="text-xs text-slate-600 font-medium text-center">Verification</p>
              </div>
          </div>
        </div>

        <div className="relative z-10 flex items-start gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm mt-4">
          <div className="mt-1 text-teal-500">
            <MdSecurity size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Secure. Reliable. Compliant.</h4>
            <p className="text-xs text-slate-600 mt-1">Your data is protected with enterprise-grade security and industry best practices.</p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT SIDE: Login Form */}
      {/* ========================================== */}
      <div className="w-full lg:w-[60%] flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-50/50 relative overflow-y-auto">
        
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 relative z-10 my-auto">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-md">
               <FaQuestion className='text-blue-900'/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome Back!</h2>
            <p className="text-sm text-slate-500">Sign in to your onboarding portal account</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiMail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading} // Disable input while loading
                  placeholder="Enter your email" 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1 ml-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiLock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading} // Disable input while loading
                  placeholder="Enter your password" 
                  className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center ml-1 py-2">
              <input 
                type="checkbox" 
                id="remember" 
                disabled={loading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
              />
              <label htmlFor="remember" className="ml-2 text-sm font-medium text-slate-600 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={loading} // Disable button while loading
              className="w-full flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_0_rgba(0,102,255,0.39)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02]"
            >
              {loading ? (
                // Show a loading text when verifying database
                'Signing In...'
              ) : (
                <>
                  Sign In <span className="text-lg leading-none mt-[1px]">→</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative bg-white px-4 text-xs font-medium text-slate-400">
                or continue with
              </div>
            </div>

            {/* Google Sign In */}
            <button 
              type="button"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcGoogle size={20} />
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-6">
            Need help? <Link href="/support" className="text-blue-600 hover:underline">Contact Support</Link>
          </p>
        </div>

        <div className="w-full mt-auto pt-6 flex justify-between items-center text-[11px] font-medium text-slate-400 max-w-md mx-auto">
          <p>© 2026 QuickCheck.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </div>
  )
}