'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiMail, FiLock, FiEye, FiEyeOff, FiX, FiCheckCircle, FiSend, FiInfo, FiShield, FiHeadphones } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'

import { MdSecurity } from 'react-icons/md'
import { FaHospital, FaQuestion } from 'react-icons/fa6'
import { FaFileAlt, FaUser, FaUserMd } from 'react-icons/fa'
import loginWallpaper from '../assets/final.jpeg'  
// import { supabase } from '../lib/supabase'
import { auth, db } from '../lib/firebase'
import { ref, get,query, orderByChild, equalTo, push, set } from 'firebase/database'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()

  // UI States
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordHelp, setShowPasswordHelp] = useState(false)
  const [viewMode, setViewMode] = useState<'login' | 'forgot_password' | 'request_success'>('login')
  const [forgotEmail, setForgotEmail] = useState('')
  const [requestLoading, setRequestLoading] = useState(false)
  
  // Modal States
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  // Support Form State
  const [supportEmail, setSupportEmail] = useState('')
  const [supportSubject, setSupportSubject] = useState('')
  const [supportMessage, setSupportMessage] = useState('')
  const [supportLoading, setSupportLoading] = useState(false)
  const [supportSuccess, setSupportSuccess] = useState(false)

  // const handleSupportSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setSupportLoading(true)
  //   setTimeout(() => {
  //     setSupportLoading(false)
  //     setSupportSuccess(true)
  //     setSupportEmail('')
  //     setSupportSubject('')
  //     setSupportMessage('')
  //     setTimeout(() => {
  //       setSupportSuccess(false)
  //       setShowSupportModal(false)
  //     }, 2500)
  //   }, 1500)
  // }

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSupportLoading(true)

    try {
      // Create a new support ticket
      const supportRef = push(ref(db, "support_requests"))

      await set(supportRef, {
        email: supportEmail,
        subject: supportSubject,
        message: supportMessage,
        status: "Pending",
        createdAt: Date.now()
      })

      setSupportLoading(false)
      setSupportSuccess(true)

      // Clear form
      setSupportEmail("")
      setSupportSubject("")
      setSupportMessage("")

      setTimeout(() => {
        setSupportSuccess(false)
        setShowSupportModal(false)
      }, 2500)

    } catch (error: any) {
        console.error(error.code)
        console.error(error.message)
      }
  }

  // Auth States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setRequestLoading(true)
  //   setTimeout(() => {
  //     setRequestLoading(false)
  //     setViewMode('request_success')
  //   }, 1200)
  // }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  setRequestLoading(true)

    try {
      // Create a new request
      const requestRef = push(ref(db, "password_reset_requests"))

      await set(requestRef, {
        email: forgotEmail,
        status: "Pending",
        createdAt: Date.now()
      })

      setRequestLoading(false)
      setViewMode("request_success")

    } catch (error) {
      console.error("Forgot Password Error:", error)
      alert("Unable to submit your request. Please try again.")
      setRequestLoading(false)
    }
  }

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

    try {
      // 1. Authenticate the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userEmail = userCredential.user.email

      // 2. Query Realtime Database (db) for this email
      const usersRef = ref(db, 'internal_users')
      const emailQuery = query(usersRef, orderByChild('email'), equalTo(userEmail))
      
      const snapshot = await get(emailQuery)

      // 3. Check if they exist AND if they are active
      let hasAccess = false;

      if (snapshot.exists()) {
          // Loop through the results (even if there is only one)
          snapshot.forEach((childSnapshot) => {
              const userData = childSnapshot.val()
              if (userData.is_active === true) {
                  hasAccess = true
              }
          })
      }

      // 4. If no active user was found, kick them out
      if (!hasAccess) {
        alert('No portal access')
        await signOut(auth)
        setLoading(false)
        return
      }

      router.replace('/dashboard')

    } catch (error: any) {
      console.error("Login Error:", error)
      alert(error.message)
      setLoading(false)
    }
}
      

  return (
    <div className="h-screen flex w-full bg-[#f8fafc] font-sans overflow-hidden">
      
      {/* ========================================== */}
      {/* LEFT SIDE: Promotional & Branding          */}
      {/* ========================================== */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className='hidden lg:flex flex-col w-[40%] xl:w-[45%] h-full justify-between relative bg-cover bg-center bg-no-repeat border-r border-slate-100'
        style={{ backgroundImage: `url(${loginWallpaper.src})` }}
      >
        <div className="absolute inset-0 bg-transparent -z-0" />

        <div className="relative z-10 flex flex-col h-full p-10 pb-0 justify-between">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="flex items-center gap-3 mb-10"
            >
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0"
              >
                <FaQuestion className='text-white text-lg'/>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 leading-tight tracking-tight">Quick<span className="text-blue-600">Check</span></h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Onboarding Portal</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className='text-2xl xl:text-4.5xl font-extrabold leading-tight text-slate-800 tracking-tight'>
                Simplify Onboarding.<br />
                Empower <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>Care.</span>
              </h2>
              <p className='mt-4 text-slate-600 text-sm xl:text-base font-medium leading-relaxed max-w-md'>
                Streamline Hospital, Doctor and Staff Onboarding with speed, accuracy and enterprise compliance.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.4
                  }
                }
              }}
              className='grid grid-cols-2 gap-4 mt-10 max-w-md'
            >
              {[
                { label: 'Hospital Onboarding', desc: 'Manage facilities', icon: FaHospital, color: 'text-blue-500 bg-blue-50' },
                { label: 'Doctor Onboarding', desc: 'Verify qualifications', icon: FaUserMd, color: 'text-emerald-500 bg-emerald-50' },
                { label: 'Staff Onboarding', desc: 'Assign system access', icon: FaUser, color: 'text-indigo-500 bg-indigo-50' },
                { label: 'Document Verification', desc: 'Secure verification', icon: FaFileAlt, color: 'text-amber-500 bg-amber-50' }
              ].map((feat, index) => (
                <motion.div 
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  whileHover={{ y: -4, scale: 1.02, boxShadow: '0 12px 20px -8px rgba(11,21,40,0.08)' }}
                  className='bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 shadow-premium cursor-pointer transition-all duration-300 hover:scale-105'
                >
                  <div className={`w-10 h-10 mb-3 rounded-xl flex items-center justify-center ${feat.color} font-bold`}>
                    <feat.icon className='text-lg' />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{feat.label}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{feat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="w-[calc(100%+80px)] -ml-10 relative z-10 flex items-center gap-4 bg-blue-50/70 border-t border-slate-100/50 px-8 py-4 shrink-0 mt-8"
          >
            <div className="text-blue-600 bg-blue-100/60 p-2.5 rounded-xl">
              <MdSecurity size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-0.5">Secure. Reliable. Compliant.</h4>
              <p className="text-xs text-slate-500 font-medium">
                Your data is protected with enterprise-grade security and industry best practices.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* RIGHT SIDE: Auth Forms                     */}
      {/* ========================================== */}
      <div className="w-full lg:w-[60%] xl:w-[55%] h-full flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-50/40 relative overflow-y-auto">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md bg-white rounded-3xl shadow-premium border border-slate-100/80 p-8 relative z-10 my-auto shrink-0"
        >
          <AnimatePresence mode="wait">
            
            {/* --- LOGIN VIEW --- */}
            {viewMode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col items-center mb-8 text-center">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20"
                  >
                     <FaQuestion className='text-white text-xl'/>
                  </motion.div>
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">Welcome Back!</h2>
                  <p className="text-sm font-semibold text-slate-500">Sign in to your onboarding portal account</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                  
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Email Address</label>
                    <div className="relative group hover:scale-[1.02] transition-transform duration-200">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <FiMail size={18} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.slice(0, 20))}
                        disabled={loading}
                        maxLength={20}
                        placeholder="admin@quickcheck.com"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50/90 focus:bg-white border border-slate-200/80 focus:border-blue-500 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex justify-between items-center mb-1 ml-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                      <button
                        type="button"
                        onClick={() => setViewMode('forgot_password')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative group hover:scale-[1.02] transition-transform duration-200">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <FiLock size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value.slice(0, 20))}
                        disabled={loading}
                        maxLength={20}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-10 py-3 bg-slate-50/50 hover:bg-slate-50/90 focus:bg-white border border-slate-200/80 focus:border-blue-500 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
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
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_0_rgba(0,102,255,0.39)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.03]"
                  >
                    {loading ? 'Signing In...' : (
                      <>
                        Sign In <span className="text-lg leading-none mt-[1px]">→</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* --- FORGOT PASSWORD VIEW --- */}
            {viewMode === 'forgot_password' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col items-center mb-8 text-center">
                   <div className="w-12 h-12 mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                     <FiLock size={24} />
                   </div>
                   <h2 className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">Reset Password</h2>
                   <p className="text-sm font-semibold text-slate-500">Enter your email to request a reset link</p>
                </div>

                <form className="space-y-5" onSubmit={handleForgotPasswordSubmit}>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <FiMail size={18} />
                      </div>
                      <input 
                        type="email" 
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        disabled={requestLoading}
                        placeholder="Enter your registered email" 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50/90 focus:bg-white border border-slate-200/80 focus:border-blue-500 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={requestLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {requestLoading ? 'Submitting...' : 'Submit Request'}
                  </motion.button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setViewMode('login'); setForgotEmail(''); }}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* --- SUCCESS VIEW --- */}
            {viewMode === 'request_success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                  <FiCheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">Request Submitted</h2>
                <p className="text-sm font-semibold text-slate-500 mb-6 px-4 leading-relaxed">
                  A password reset request for <strong className="text-slate-700">{forgotEmail}</strong> has been submitted to the admin. Please contact your administrator to retrieve your temporary credentials.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={() => { setViewMode('login'); setForgotEmail(''); }}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                  Back to Sign In
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {viewMode === 'login' && (
            <p className="text-center text-sm font-medium text-slate-500 mt-6">
              Need help? <button onClick={() => setShowSupportModal(true)} className="text-blue-600 hover:underline">Contact Support</button>
            </p>
          )}
        </motion.div>

        {/* Footer */}
        <div className="w-full mt-auto pt-6 flex justify-between items-center text-[11px] font-bold text-slate-400 max-w-md mx-auto shrink-0">
          <p>© 2026 QuickCheck.</p>
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-slate-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Privacy
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="hover:text-slate-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Terms
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODALS                                     */}
      {/* ========================================== */}
      <AnimatePresence>
        
        {/* Support Modal */}
        {showSupportModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
            >
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50/30 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <FiHeadphones size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg">Contact Technical Support</h3>
                    <p className="text-xs text-slate-500 font-semibold">We usually respond within 24-48 hours</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSupportSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence mode="wait">
                  {supportSuccess ? (
                    <motion.div 
                      key="support-success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-8 text-center"
                    >
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <FiCheckCircle size={32} />
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-xl mb-2">Message Sent!</h4>
                      <p className="text-sm font-semibold text-slate-500 max-w-sm leading-relaxed">
                        Thank you for contacting support. Our technical team has received your inquiry and will reach out shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="support-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Your Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <FiMail size={16} />
                          </div>
                          <input 
                            type="email"
                            required
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                            placeholder="Enter your email so we can reply"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Issue Subject</label>
                        <select
                          required
                          value={supportSubject}
                          onChange={(e) => setSupportSubject(e.target.value)}
                          className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800"
                        >
                          <option value="">Select a topic...</option>
                          <option value="login">Login / Authentication Issue</option>
                          <option value="hospital_onboarding">Hospital Onboarding Error</option>
                          <option value="doctor_onboarding">Doctor Profile Update</option>
                          <option value="bug_report">Report a System Bug</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Detailed Description</label>
                        <textarea
                          required
                          rows={5}
                          value={supportMessage}
                          onChange={(e) => setSupportMessage(e.target.value)}
                          placeholder="Describe your issue in detail. Include any error messages you received."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 resize-none"
                        />
                      </div>

                      <div className="pt-2">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          disabled={supportLoading}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          {supportLoading ? 'Submitting Request...' : (
                            <>
                              <FiSend size={16} />
                              Send Message
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Privacy Policy Modal */}
        {showPrivacyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100"
            >
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-teal-50/50 to-blue-50/20 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                    <FiShield size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg">Privacy Policy</h3>
                    <p className="text-xs text-slate-500 font-semibold">Last updated: July 2026</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-600 space-y-4 leading-relaxed font-medium">
                <h4 className="font-bold text-slate-800 text-base">1. Introduction</h4>
                <p>
                  QuickCheck ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal and healthcare-related onboarding information is collected, used, and safeguarded when you access the QuickCheck Onboarding Portal.
                </p>

                <h4 className="font-bold text-slate-800 text-base">2. Information We Collect</h4>
                <p>
                  To provide hospital, doctor, and staff onboarding services, we collect information including, but not limited to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-500">
                  <li>Professional credentials and certifications</li>
                  <li>Hospital affiliation and location details</li>
                  <li>Personal identification information (name, contact details, email)</li>
                  <li>System usage logs and authentication metadata</li>
                </ul>

                <h4 className="font-bold text-slate-800 text-base">3. How We Use Your Information</h4>
                <p>
                  We use the collected information to verify qualifications, perform onboarding workflows, manage portal access, verify document authenticity, and ensure regulatory compliance in healthcare systems.
                </p>

                <h4 className="font-bold text-slate-800 text-base">4. Security of Data</h4>
                <p>
                  We implement enterprise-grade encryption and administrative safeguards to protect data from unauthorized access, alteration, or disclosure. All connections are secured via SSL, and databases are protected by row-level security (RLS) policies.
                </p>

                <h4 className="font-bold text-slate-800 text-base">5. Contact Info</h4>
                <p>
                  For questions about this policy or data protection, please contact your portal administrator or submit a request via our Support panel.
                </p>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Terms of Service Modal */}
        {showTermsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100"
            >
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                    <FiInfo size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg">Terms of Service</h3>
                    <p className="text-xs text-slate-500 font-semibold">Last updated: July 2026</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-600 space-y-4 leading-relaxed font-medium">
                <h4 className="font-bold text-slate-800 text-base">1. Agreement to Terms</h4>
                <p>
                  By accessing or using the QuickCheck Onboarding Portal, you agree to be bound by these Terms of Service. If you do not agree, you must not use or access the portal.
                </p>

                <h4 className="font-bold text-slate-800 text-base">2. Authorized Use</h4>
                <p>
                  This portal is intended solely for authorized personnel onboarding hospitals, doctors, and medical staff. Unauthorized use, copying, or tampering is strictly prohibited and subject to legal action under applicable laws.
                </p>

                <h4 className="font-bold text-slate-800 text-base">3. User Responsibilities</h4>
                <p>
                  You are responsible for keeping your login credentials secure. You must provide accurate, up-to-date information during onboarding. Any false representation may result in instant termination of portal access and revocation of credentials.
                </p>

                <h4 className="font-bold text-slate-800 text-base">4. Compliance & Regulations</h4>
                <p>
                  All users must comply with national and state healthcare regulations (such as HIPAA, data compliance guidelines, and privacy regulations) when submitting onboarding information and files.
                </p>

                <h4 className="font-bold text-slate-800 text-base">5. Termination</h4>
                <p>
                  We reserve the right to suspend or terminate access to the portal at any time, with or without cause or notice, for conduct that violates these Terms or is harmful to the portal's integrity.
                </p>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}