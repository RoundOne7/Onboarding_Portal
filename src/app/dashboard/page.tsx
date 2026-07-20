'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Link from 'next/link'
import { auth, db } from '../../lib/firebase'
import { ref, onValue } from 'firebase/database'
import {
  FaUserMd,
  FaHospital,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaShieldAlt,
  FaInfoCircle,
  FaTimes
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    doctors: '...',
    hospitals: '...',
    locations: '...'
  })

  const [userName, setUserName] = useState('User')
  const [isLoading, setIsLoading] = useState(true)
  const [recentHospitals, setRecentHospitals] = useState<any[]>([])
  const [recentDoctors, setRecentDoctors] = useState<any[]>([])
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    // Set userName
    const user = auth.currentUser
    if (user) {
      setUserName(user.displayName || user.email?.split('@')[0] || 'User')
    }

    // Subscribe to hospitals
    const hospRef = ref(db, 'hospitals')
    const unsubHospitals = onValue(hospRef, (snapshot) => {
      const hospitalList: any[] = []
      snapshot.forEach((child) => {
        hospitalList.push({ id: child.key, ...child.val() })
      })

      // Reverse list to show recently created first (since RTDB is chronological)
      hospitalList.reverse()

      // Calculate cities count
      const cities = new Set(hospitalList.map((h: any) => h.city).filter(Boolean))
      
      setStats(prev => ({
        ...prev,
        hospitals: String(hospitalList.length),
        locations: String(cities.size || 0)
      }))

      // Map recent hospitals
      const mappedHospitals = hospitalList.slice(0, 5).map((h: any) => ({
        name: h.name,
        place: h.city ? `${h.city}` : 'N/A',
        status: h.is_active ? 'Approved' : 'Pending',
        date: h.created_at ? new Date(h.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=120&q=80'
      }))
      setRecentHospitals(mappedHospitals)
      setIsLoading(false)
    }, (err) => {
      console.error('Error fetching hospitals for dashboard:', err)
      setIsLoading(false)
    })

    // Subscribe to doctors
    const doctorsRef = ref(db, 'doctors')
    const unsubDoctors = onValue(doctorsRef, (snapshot) => {
      const doctorList: any[] = []
      snapshot.forEach((child) => {
        doctorList.push({ id: child.key, ...child.val() })
      })

      doctorList.reverse()

      setStats(prev => ({
        ...prev,
        doctors: String(doctorList.length)
      }))

      // Map recent doctors
      const mappedDoctors = doctorList.slice(0, 5).map((d: any) => ({
        name: d.name,
        role: d.specialization_name || d.specialty || 'Doctor',
        status: d.is_active ? 'Approved' : 'Pending',
        date: d.created_at ? new Date(d.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
        image: d.image || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 90) + 1}.jpg`
      }))
      setRecentDoctors(mappedDoctors)
    }, (err) => {
      console.error('Error fetching doctors for dashboard:', err)
    })

    return () => {
      unsubHospitals()
      unsubDoctors()
    }
  }, [])

const getStatusStyle = (status: string) => {
  if (status === 'Approved') return 'bg-[#DBF1CF] text-[#335F1B] border border-[#C2E7B0]'
  if (status === 'Pending') return 'bg-[#FFFBED] text-[#E45412] border border-[#FBEFCD]'
  return 'bg-[#FFE2E2] text-[#B91C1C] border border-[#FCD2D2]'
}

const getStatusIcon = (status: string) => {
  if (status === 'Approved') return <FaCheckCircle />
  if (status === 'Pending') return <FaClock />
  return <FaTimesCircle />
}

const listContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05
    }
  }
} as const

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
} as const


return (
  <DashboardLayout>
    <main className="w-full flex-1 px-8 pt-6 pb-8 text-[#0B1528] h-full overflow-y-auto">

      {/* --- HEADER --- */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-[#0B1528] tracking-tight">Welcome back, {userName}!</h1>
          <p className="text-xs text-[#889ABF] mt-2 font-bold">
            Dashboard &gt; <span className="text-[#2B3E64]">Overview</span>
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 bg-white border border-[#EAEEF6] rounded-2xl px-4 py-3 shadow-premium shrink-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white uppercase shadow-sm">
            {userName.charAt(0)}
          </div>
          <div className="flex flex-col items-center w-15">
            <p className="font-bold text-lg text-[#0B1528]">{userName}</p>
            {/* <p className="text-xs text-[#2B3E64] font-semibold">Super Admin</p> */}
          </div>
          {/* <span className="text-[#2B3E64] text-xs font-bold ml-1">⌄</span> */}
        </motion.div>
      </motion.header>

      {/* --- STATS SECTION --- */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={listContainerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Active Doctors */}
        <motion.div
          variants={rowVariants}
          whileHover={{ y: -4, boxShadow: "var(--shadow-premium-hover)" }}
          className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium flex items-center justify-between group cursor-pointer transition-all duration-300"
          onClick={() => window.location.href = '/doctors'}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1B60E0] flex items-center justify-center text-2xl group-hover:bg-[#1B60E0] group-hover:text-white transition-colors duration-300">
              <FaUserMd />
            </div>
            <div>
              <span className="text-xs font-bold text-[#889ABF] uppercase tracking-wider">Active Doctors</span>
              <AnimatePresence mode="popLayout">
                <motion.h2
                  key={stats.doctors}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-extrabold text-slate-800 mt-1"
                >
                  {stats.doctors}
                </motion.h2>
              </AnimatePresence>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-[#66BF36] font-bold">↑ 12.5%</span>
                <span className="text-[10px] text-slate-400 font-semibold">vs last month</span>
              </div>
            </div>
          </div>
          <FaArrowRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </motion.div>

        {/* Active Hospitals */}
        <motion.div
          variants={rowVariants}
          whileHover={{ y: -4, boxShadow: "var(--shadow-premium-hover)" }}
          className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium flex items-center justify-between group cursor-pointer transition-all duration-300"
          onClick={() => window.location.href = '/hospitals'}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-[#66BF36] flex items-center justify-center text-2xl group-hover:bg-[#66BF36] group-hover:text-white transition-colors duration-300">
              <FaHospital />
            </div>
            <div>
              <span className="text-xs font-bold text-[#889ABF] uppercase tracking-wider">Active Hospitals</span>
              <AnimatePresence mode="popLayout">
                <motion.h2
                  key={stats.hospitals}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-extrabold text-slate-800 mt-1"
                >
                  {stats.hospitals}
                </motion.h2>
              </AnimatePresence>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-[#66BF36] font-bold">↑ 8.3%</span>
                <span className="text-[10px] text-slate-400 font-semibold">vs last month</span>
              </div>
            </div>
          </div>
          <FaArrowRight className="text-slate-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
        </motion.div>

        {/* Active Locations */}
        <motion.div
          variants={rowVariants}
          whileHover={{ y: -4, boxShadow: "var(--shadow-premium-hover)" }}
          className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium flex items-center justify-between group cursor-pointer transition-all duration-300"
          onClick={() => window.location.href = '/hospitals'}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-2xl group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
              <FaMapMarkerAlt />
            </div>
            <div>
              <span className="text-xs font-bold text-[#889ABF] uppercase tracking-wider">Active Locations</span>
              <AnimatePresence mode="popLayout">
                <motion.h2
                  key={stats.locations}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-extrabold text-slate-800 mt-1"
                >
                  {stats.locations}
                </motion.h2>
              </AnimatePresence>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-[#66BF36] font-bold">↑ 6.7%</span>
                <span className="text-[10px] text-slate-400 font-semibold">vs last month</span>
              </div>
            </div>
          </div>
          <FaArrowRight className="text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
        </motion.div>
      </motion.section>

      {/* --- MAIN TABLES SECTION --- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Hospitals */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium"
        >
          <div className="flex items-center justify-center border-b border-[#EAEEF6] pb-4 mb-4">
            <h2 className="text-xl font-bold text-[#0B1528]">Recent Hospitals</h2>
            {/* <Link href="/hospitals" className="text-[#1B60E0] font-bold text-xs hover:underline flex items-center gap-1">
                View All <span className="text-sm">→</span>
              </Link> */}
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={listContainerVariants}
            className="divide-y divide-[#EAEEF6]"
          >
            {recentHospitals.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                No hospitals registered yet.
              </div>
            ) : (
              recentHospitals.map((hospital) => (
                <motion.div
                  key={hospital.name}
                  variants={rowVariants}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={hospital.image}
                      alt={hospital.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100/80 bg-[#F1F6FE] shadow-sm"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-[#0B1528] group-hover:text-blue-600 transition-colors">{hospital.name}</h3>
                      <p className="text-[11px] text-[#2B3E64] font-semibold mt-0.5">{hospital.place}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${getStatusStyle(hospital.status)}`}>
                      {getStatusIcon(hospital.status)} {hospital.status}
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold">{hospital.date}</p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          <div className="flex justify-center mt-6">
            <Link href="/hospitals" className="border border-[#C6D9FA] px-8 py-2.5 rounded-xl text-[#1B60E0] hover:text-white font-bold text-xs hover:bg-[#1B60E0] hover:border-transparent transition-all shadow-sm">
              View All Hospitals
            </Link>
          </div>
        </motion.div>

        {/* Recent Doctors */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium"
        >
          <div className="flex items-center justify-center border-b border-[#EAEEF6] pb-4 mb-4">
            <h2 className="text-xl font-bold text-[#0B1528]">Recent Doctors</h2>
            {/* <Link href="/doctors" className="text-[#1B60E0] font-bold text-xs hover:underline flex items-center gap-1">
                View All <span className="text-sm">→</span>
              </Link> */}
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={listContainerVariants}
            className="divide-y divide-[#EAEEF6]"
          >
            {recentDoctors.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                No doctors registered yet.
              </div>
            ) : (
              recentDoctors.map((doctor) => (
                <motion.div
                  key={doctor.name}
                  variants={rowVariants}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100/80 bg-[#F1F6FE] shadow-sm"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-[#0B1528] group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                      <p className="text-[11px] text-[#2B3E64] font-semibold mt-0.5">{doctor.role}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${getStatusStyle(doctor.status)}`}>
                      {getStatusIcon(doctor.status)} {doctor.status}
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold">{doctor.date}</p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          <div className="flex justify-center mt-6">
            <Link href="/doctors" className="border border-[#C6D9FA] px-8 py-2.5 rounded-xl text-[#1B60E0] hover:text-white font-bold text-xs hover:bg-[#1B60E0] hover:border-transparent transition-all shadow-sm">
              View All Doctors
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="mt-18 flex items-center justify-between border-t border-[#EAEEF6] pt-5 text-xs text-[#2B3E64] font-semibold">
        <p>© 2026 QuickCheck. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="hover:text-[#1B60E0] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="hover:text-[#1B60E0] transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
        </div>
      </footer>
    </main>

    <AnimatePresence>
      {showPrivacyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-teal-50/50 to-blue-50/20 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white shadow-md shadow-teal-500/20">
                  <FaShieldAlt size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800">Privacy Policy</h3>
                  <p className="text-xs font-semibold text-slate-500">Last updated: July 2026</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6 text-sm leading-relaxed font-medium text-slate-600">
              <h4 className="text-base font-bold text-slate-800">1. Introduction</h4>
              <p>
                QuickCheck (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how your personal and healthcare-related onboarding information is collected, used, and safeguarded when you access the QuickCheck Onboarding Portal.
              </p>

              <h4 className="text-base font-bold text-slate-800">2. Information We Collect</h4>
              <p>To provide hospital, doctor, and staff onboarding services, we collect information including, but not limited to:</p>
              <ul className="list-disc space-y-1.5 pl-5 text-slate-500">
                <li>Professional credentials and certifications</li>
                <li>Hospital affiliation and location details</li>
                <li>Personal identification information (name, contact details, email)</li>
                <li>System usage logs and authentication metadata</li>
              </ul>

              <h4 className="text-base font-bold text-slate-800">3. How We Use Your Information</h4>
              <p>
                We use the collected information to verify qualifications, perform onboarding workflows, manage portal access, verify document authenticity, and ensure regulatory compliance in healthcare systems.
              </p>

              <h4 className="text-base font-bold text-slate-800">4. Security of Data</h4>
              <p>
                We implement enterprise-grade encryption and administrative safeguards to protect data from unauthorized access, alteration, or disclosure. All connections are secured via SSL, and databases are protected by row-level security (RLS) policies.
              </p>

              <h4 className="text-base font-bold text-slate-800">5. Contact Info</h4>
              <p>
                For questions about this policy or data protection, please contact your portal administrator or submit a request via our Support panel.
              </p>
            </div>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showTermsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/20 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                  <FaInfoCircle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800">Terms of Service</h3>
                  <p className="text-xs font-semibold text-slate-500">Last updated: July 2026</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6 text-sm leading-relaxed font-medium text-slate-600">
              <h4 className="text-base font-bold text-slate-800">1. Agreement to Terms</h4>
              <p>
                By accessing or using the QuickCheck Onboarding Portal, you agree to be bound by these Terms of Service. If you do not agree, you must not use or access the portal.
              </p>

              <h4 className="text-base font-bold text-slate-800">2. Authorized Use</h4>
              <p>
                This portal is intended solely for authorized personnel onboarding hospitals, doctors, and medical staff. Unauthorized use, copying, or tampering is strictly prohibited and subject to legal action under applicable laws.
              </p>

              <h4 className="text-base font-bold text-slate-800">3. User Responsibilities</h4>
              <p>
                You are responsible for keeping your login credentials secure. You must provide accurate, up-to-date information during onboarding. Any false representation may result in instant termination of portal access and revocation of credentials.
              </p>

              <h4 className="text-base font-bold text-slate-800">4. Compliance &amp; Regulations</h4>
              <p>
                All users must comply with national and state healthcare regulations (such as HIPAA, data compliance guidelines, and privacy regulations) when submitting onboarding information and files.
              </p>

              <h4 className="text-base font-bold text-slate-800">5. Termination</h4>
              <p>
                We reserve the right to suspend or terminate access to the portal at any time, with or without cause or notice, for conduct that violates these Terms or is harmful to the portal&apos;s integrity.
              </p>
            </div>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </DashboardLayout>
)
}
