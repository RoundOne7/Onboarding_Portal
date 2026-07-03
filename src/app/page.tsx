'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiEye, FiEyeOff, FiX, FiCheckCircle, FiSend, FiInfo, FiShield, FiHeadphones } from 'react-icons/fi'
import { MdSecurity } from 'react-icons/md'
import { FaHospital, FaQuestion } from 'react-icons/fa6'
import { FaFileAlt, FaUser, FaUserMd } from 'react-icons/fa'
import loginWallpaper from '../assets/final.jpeg'
import { auth, db } from '../lib/firebase'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { ref, get, query, orderByChild, equalTo } from 'firebase/database'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordHelp, setShowPasswordHelp] = useState(false)
  const [viewMode, setViewMode] = useState<'login' | 'forgot_password' | 'request_success'>('login')
  const [forgotEmail, setForgotEmail] = useState('')
  const [requestLoading, setRequestLoading] = useState(false)

  const [showSupportModal, setShowSupportModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  const [supportEmail, setSupportEmail] = useState('')
  const [supportSubject, setSupportSubject] = useState('')
  const [supportMessage, setSupportMessage] = useState('')
  const [supportLoading, setSupportLoading] = useState(false)
  const [supportSuccess, setSupportSuccess] = useState(false)

  const [email, setEmail] = useState('admn@hospital.com')
  const [password, setPassword] = useState('Paasword')
  const [loading, setLoading] = useState(false)

  const handleSupportSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSupportLoading(true)
    setTimeout(() => {
      setSupportLoading(false)
      setSupportSuccess(true)
      setSupportEmail('')
      setSupportSubject('')
      setSupportMessage('')
      setTimeout(() => {
        setSupportSuccess(false)
        setShowSupportModal(false)
      }, 2500)
    }, 1500)
  }

  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setRequestLoading(true)
    try {
      await sendPasswordResetEmail(auth, forgotEmail)
      setRequestLoading(false)
      setViewMode('request_success')
    } catch (err: any) {
      alert(err.message || 'Failed to send password reset email.')
      setRequestLoading(false)
    }
  }

  // Merged Firebase Login Logic
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const userEmail = user.email || ''

      // Verify in Realtime Database internal_users list
      const userRef = ref(db, 'internal_users')
      const q = query(userRef, orderByChild('email'), equalTo(userEmail))
      const snapshot = await get(q)

      if (!snapshot.exists()) {
        alert('No portal access')
        await auth.signOut()
        setLoading(false)
        return
      }

      // Check if user is active
      let isActive = false
      snapshot.forEach((child) => {
        if (child.val().is_active === true) {
          isActive = true
        }
      })

      if (!isActive) {
        alert('Your portal access is deactivated.')
        await auth.signOut()
        setLoading(false)
        return
      }

      router.push('/dashboard')
      
    } catch (err: any) {
      console.error("Login error:", err)
      alert(err?.message || "An unexpected error occurred.")
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc] font-sans">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden h-full w-[40%] flex-col justify-between border-r border-slate-100 bg-cover bg-center bg-no-repeat lg:flex xl:w-[45%]"
        style={{ backgroundImage: `url(${loginWallpaper.src})` }}
      >
        <div className="absolute inset-0 -z-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 pb-0">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="mb-10 flex items-center gap-3"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20"
              >
                <FaQuestion className="text-lg text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-800">
                  Quick<span className="text-blue-600">Check</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Onboarding Portal</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-3.5xl font-extrabold leading-tight tracking-tight text-slate-800 xl:text-4.5xl">
                Simplify Onboarding.
                <br />
                Empower <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Care.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-600 xl:text-base">
                Streamline Hospital, Doctor and Staff Onboarding with speed, accuracy and enterprise compliance.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } }
              }}
              className="mt-10 grid max-w-md grid-cols-2 gap-4"
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
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                  }}
                  whileHover={{ y: -4, scale: 1.02, boxShadow: '0 12px 20px -8px rgba(11,21,40,0.08)' }}
                  className="cursor-pointer rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-premium backdrop-blur-sm transition-all duration-300"
                >
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${feat.color} font-bold`}>
                    <feat.icon className="text-lg" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{feat.label}</h4>
                  <p className="mt-0.5 text-[10px] font-medium text-slate-500">{feat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-10 mt-8 flex w-[calc(100%+80px)] -ml-10 shrink-0 items-center gap-4 border-t border-slate-100/50 bg-blue-50/70 px-8 py-4"
          >
            <div className="rounded-xl bg-blue-100/60 p-2.5 text-blue-600">
              <MdSecurity size={24} />
            </div>
            <div>
              <h4 className="mb-0.5 text-sm font-bold text-slate-800">Secure. Reliable. Compliant.</h4>
              <p className="text-xs font-medium text-slate-500">
                Your data is protected with enterprise-grade security and industry best practices.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-slate-50/40 p-6 sm:p-8 lg:w-[60%] xl:w-[55%]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-10 my-auto w-full max-w-md shrink-0 rounded-3xl border border-slate-100/80 bg-white p-8 shadow-premium"
        >
          <AnimatePresence mode="wait">
            {viewMode === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.25 }}>
                <div className="mb-8 flex flex-col items-center text-center">
                  <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20">
                    <FaQuestion className="text-xl text-white" />
                  </motion.div>
                  <h2 className="mb-1 text-2xl font-extrabold tracking-tight text-slate-800">Welcome Back!</h2>
                  <p className="text-sm font-semibold text-slate-500">Sign in to your onboarding portal account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 ml-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-blue-500">
                        <FiMail size={18} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 transition-all hover:bg-slate-50/90 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 ml-1 flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">Password</label>
                      <button type="button" onClick={() => setViewMode('forgot_password')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                        Forgot Password?
                      </button>
                    </div>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <FiLock size={18} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-12 text-sm font-semibold text-slate-800 placeholder:text-slate-400 transition-all hover:bg-slate-50/90 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-slate-600">
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center py-2">
                    <input type="checkbox" id="remember" disabled={loading} className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="remember" className="ml-2 cursor-pointer text-sm font-medium text-slate-600">Remember me</label>
                  </div>

                  <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(0,102,255,0.39)] transition-all hover:scale-[1.03] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
                    {loading ? 'Signing In...' : <>Sign In <span className="mt-[1px] text-lg leading-none">→</span></>}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm font-medium text-slate-500">
                  Need help?{' '}
                  <button type="button" onClick={() => setShowSupportModal(true)} className="text-blue-600 hover:underline">Contact Support</button>
                </p>
              </motion.div>
            )}

            {viewMode === 'forgot_password' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.25 }}>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Reset Password</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">Enter your registered email and we will help you regain access.</p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 ml-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-blue-500">
                        <FiMail size={18} />
                      </div>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        disabled={requestLoading}
                        placeholder="Enter your registered email"
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 transition-all hover:bg-slate-50/90 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={requestLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
                    {requestLoading ? 'Submitting...' : 'Submit Request'}
                  </motion.button>

                  <div className="pt-2 text-center">
                    <button type="button" onClick={() => { setViewMode('login'); setForgotEmail(''); }} className="text-sm font-bold text-blue-600 transition-colors hover:text-blue-700">Back to Sign In</button>
                  </div>
                </form>
              </motion.div>
            )}

            {viewMode === 'request_success' && (
              <motion.div key="success" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.25 }} className="py-4 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-800">Request Submitted</h2>
                <p className="mb-6 px-4 text-sm font-semibold leading-relaxed text-slate-500">
                  A password reset request for <strong className="text-slate-700">{forgotEmail}</strong> has been submitted to the admin. Please contact your administrator to retrieve your temporary credentials.
                </p>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="button" onClick={() => { setViewMode('login'); setForgotEmail(''); }} className="w-full rounded-xl bg-slate-800 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-900">Back to Sign In</motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mx-auto mt-6 flex w-full max-w-md shrink-0 items-center justify-between pt-6 text-[11px] font-medium text-slate-400">
          <p>© 2026 QuickCheck.</p>
          <div className="flex gap-4">
            <button type="button" onClick={() => setShowPrivacyModal(true)} className="cursor-pointer border-none bg-transparent p-0 transition-colors hover:text-slate-600">Privacy</button>
            <span>•</span>
            <button type="button" onClick={() => setShowTermsModal(true)} className="cursor-pointer border-none bg-transparent p-0 transition-colors hover:text-slate-600">Terms</button>
          </div>
        </div>
      </div>

      {showPasswordHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-[1.5rem] bg-white p-6 shadow-2xl">
            <button type="button" onClick={() => setShowPasswordHelp(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-800" aria-label="Close password help">
              <FiX size={18} />
            </button>
            <div className="pr-8">
              <h3 className="text-xl font-bold text-slate-800">Reset your password</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Please contact the site administrator to reset your password and regain access to the portal.</p>
              <div className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-800">Admin Email</p>
                  <a href="mailto:admin@quickcheck.com" className="mt-1 inline-block text-blue-600 hover:underline">admin@quickcheck.com</a>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Support Contact</p>
                  <a href="tel:+911800000000" className="mt-1 inline-block text-blue-600 hover:underline">+91 1800 000 000</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showSupportModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', stiffness: 350, damping: 28 }} className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50/30 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-md shadow-blue-500/20"><FiHeadphones size={20} /></div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800">Contact Technical Support</h3>
                    <p className="text-xs font-semibold text-slate-500">We usually respond within 24-48 hours</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowSupportModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"><FiX size={18} /></button>
              </div>

              <form onSubmit={handleSupportSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {supportSuccess ? (
                    <motion.div key="support-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm"><FiCheckCircle size={32} /></div>
                      <h4 className="mb-2 text-xl font-extrabold text-slate-800">Message Sent!</h4>
                      <p className="max-w-sm text-sm font-semibold leading-relaxed text-slate-500">Thank you for contacting support. Our technical team has received your inquiry and will reach out shortly.</p>
                    </motion.div>
                  ) : (
                    <motion.div key="support-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Your Email Address</label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><FiMail size={16} /></div>
                          <input type="email" required value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="Enter your email so we can reply" className="w-full rounded-xl border border-slate-200/80 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Issue Subject</label>
                        <select required value={supportSubject} onChange={(e) => setSupportSubject(e.target.value)} className="w-full rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10">
                          <option value="">Select a topic...</option>
                          <option value="login">Login / Authentication Issue</option>
                          <option value="hospital_onboarding">Hospital Onboarding Error</option>
                          <option value="doctor_onboarding">Doctor Profile Update</option>
                          <option value="bug_report">Report a System Bug</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Detailed Description</label>
                        <textarea required rows={5} value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} placeholder="Describe your issue in detail. Include any error messages you received." className="w-full resize-none rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10" />
                      </div>

                      <div className="pt-2">
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={supportLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-75">
                          {supportLoading ? 'Submitting Request...' : <> <FiSend size={16} /> Send Message </>}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showPrivacyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', stiffness: 350, damping: 28 }} className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-teal-50/50 to-blue-50/20 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white shadow-md shadow-teal-500/20"><FiShield size={20} /></div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800">Privacy Policy</h3>
                    <p className="text-xs font-semibold text-slate-500">Last updated: July 2026</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowPrivacyModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"><FiX size={18} /></button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-6 text-sm leading-relaxed text-slate-600">
                <h4 className="text-base font-bold text-slate-800">1. Introduction</h4>
                <p>QuickCheck is committed to protecting your privacy. This Privacy Policy explains how your personal and healthcare-related onboarding information is collected, used, and safeguarded.</p>
                <h4 className="text-base font-bold text-slate-800">2. Information We Collect</h4>
                <p>We collect professional credentials, hospital affiliation details, contact data, and authentication metadata needed for onboarding.</p>
                <h4 className="text-base font-bold text-slate-800">3. How We Use Your Information</h4>
                <p>We use the data to verify qualifications, manage portal access, support onboarding workflows, and ensure compliance.</p>
              </div>

              <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
                <button type="button" onClick={() => setShowPrivacyModal(false)} className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-900">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showTermsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', stiffness: 350, damping: 28 }} className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/20 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20"><FiInfo size={20} /></div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800">Terms of Service</h3>
                    <p className="text-xs font-semibold text-slate-500">Last updated: July 2026</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowTermsModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"><FiX size={18} /></button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-6 text-sm leading-relaxed text-slate-600">
                <h4 className="text-base font-bold text-slate-800">1. Agreement to Terms</h4>
                <p>By accessing the portal, you agree to use it only for authorized onboarding activities and to protect your credentials.</p>
                <h4 className="text-base font-bold text-slate-800">2. User Responsibilities</h4>
                <p>You are responsible for accuracy of provided information and for preserving account security.</p>
              </div>

              <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
                <button type="button" onClick={() => setShowTermsModal(false)} className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-900">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
