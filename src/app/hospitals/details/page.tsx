'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { ref, onValue, update, get, query, orderByChild, equalTo } from 'firebase/database'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Link from 'next/link'
import {
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaStar,
  FaUserMd,
  FaCalendarCheck,
  FaHospital,
} from 'react-icons/fa'

function HospitalDetailsContent() {
  const searchParams = useSearchParams()
  const hospitalId = searchParams.get('id')
  const router = useRouter()
  const [hospital, setHospital] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [doctorsCount, setDoctorsCount] = useState(0)

  useEffect(() => {
    if (hospitalId) {
      setLoading(true)
      const hospRef = ref(db, `hospitals/${hospitalId}`)
      const unsubHospital = onValue(hospRef, async (snapshot) => {
        if (snapshot.exists()) {
          const hospData = { id: snapshot.key, ...snapshot.val() }
          setHospital(hospData)

          // Fetch count of doctors in this hospital from RTDB
          try {
            const doctorsRef = ref(db, 'doctors')
            const q = query(doctorsRef, orderByChild('hospital_id'), equalTo(hospitalId))
            const docSnaps = await get(q)
            let count = 0
            if (docSnaps.exists()) {
              docSnaps.forEach(() => { count++ })
            }
            setDoctorsCount(count)
          } catch (e) {
            console.error('Failed to fetch doctor count:', e)
          }
        }
        setLoading(false)
      }, (err) => {
        console.error('Failed to fetch hospital details:', err)
        setLoading(false)
      })

      return () => unsubHospital()
    } else {
      setLoading(false)
    }
  }, [hospitalId])

  async function toggleHospitalStatus() {
    if (!hospital) return
    const newStatus = !hospital.is_active
    try {
      const hospRef = ref(db, `hospitals/${hospital.id}`)
      await update(hospRef, { is_active: newStatus })
      setHospital({ ...hospital, is_active: newStatus })
    } catch (e: any) {
      alert(e.message || 'Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-semibold">
        Loading hospital details...
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Hospital Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">No hospital found with the provided ID.</p>
        <Link href="/hospitals" className="mt-4 inline-block text-blue-600 font-bold text-sm hover:underline">
          Go Back
        </Link>
      </div>
    )
  }

  const tabs = [
    'Overview',
    'Documents',
    'Admins',
    `Doctors (${doctorsCount})`,
    'Departments',
    'Activity Log',
  ]

  const formatDate = (isoString: string) => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      <section className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Hospital Details</h1>
          <p className="text-xs text-[#889ABF] mt-2">
            Dashboard &gt; Hospitals &gt; <span className="text-[#2B3E64]">{hospital.name}</span>
          </p>
        </div>

        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${
          hospital.is_active 
            ? 'bg-[#DBF1CF] text-[#335F1B] border border-[#C2E7B0]' 
            : 'bg-[#FFFBED] text-[#E45412] border border-[#FBEFCD]'
        }`}>
          {hospital.is_active ? <FaCheckCircle /> : <FaClock />}
          {hospital.is_active ? 'Approved' : 'Pending'}
        </span>
      </section>

      <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm mb-4">
        <div className="flex justify-between gap-6">
          <div className="flex gap-5">
            <div className="w-36 h-32 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
              <FaHospital size={48} />
            </div>

            <div>
              <h2 className="text-xl font-bold">{hospital.name}</h2>
              <p className="text-sm text-[#2B3E64] mt-1 mb-4">
                {hospital.city ? `${hospital.city}, ${hospital.state || ''}` : 'N/A'}
              </p>

              <p className="flex items-center gap-2 text-sm text-[#2B3E64] mb-2">
                <FaPhone className="text-[#1B60E0]" />
                {hospital.phone || 'N/A'}
              </p>

              <p className="flex items-center gap-2 text-sm text-[#2B3E64]">
                <FaEnvelope className="text-[#1B60E0]" />
                {hospital.email || 'N/A'}
              </p>
            </div>
          </div>

          <div className="w-72 space-y-5 text-sm">
            <InfoRow label="Joined On" value={formatDate(hospital.created_at)} />
            <InfoRow label="Registration" value={hospital.registration_number || 'N/A'} />
            <InfoRow label="Established" value={hospital.year_established || 'N/A'} />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border border-[#EAEEF6] rounded-2xl mb-4 overflow-hidden">
        <div className="grid grid-cols-6 w-full">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`py-4 text-sm font-semibold text-center whitespace-nowrap ${
                index === 0
                  ? 'text-[#1B60E0] border-b-2 border-[#1B60E0]'
                  : 'text-[#2B3E64] hover:text-[#1B60E0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6">Hospital Information</h2>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <InfoBlock label="Hospital Name" value={hospital.name} />
            <InfoBlock label="Contact Person" value={hospital.admin_name || 'Not Provided'} />
            <InfoBlock label="Registration Number" value={hospital.registration_number || 'N/A'} />
            <InfoBlock label="Email" value={hospital.email || 'N/A'} />
            <InfoBlock label="Hospital Type" value={hospital.hospital_type || 'General'} />
            <InfoBlock label="Phone" value={hospital.phone || 'N/A'} />

            <div>
              <p className="text-xs text-[#889ABF] font-semibold mb-2">
                Address
              </p>
              <p className="text-sm font-semibold">
                {hospital.address ? `${hospital.address}, ${hospital.city}, ${hospital.state || ''} - ${hospital.zip_code || ''}` : 'N/A'}
              </p>
            </div>

            <InfoBlock label="Website" value={hospital.website || 'N/A'} />
          </div>
        </div>

        <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6">Statistics</h2>

          <div className="space-y-5">
            <StatRow icon={<FaUserMd />} label="Total Doctors" value={String(doctorsCount)} />
            <StatRow icon={<FaCalendarCheck />} label="Total Beds" value={String(hospital.number_of_beds || 0)} />

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#2B3E64]">Avg. Rating</span>
              <span className="font-bold flex items-center gap-1">
                <FaStar className="text-yellow-500" />
                4.6
              </span>
            </div>

            <StatRow icon={<FaHospital />} label="Status" value={hospital.is_active ? 'Active' : 'Inactive'} />
          </div>
        </div>
      </section>

      <section className="flex justify-end gap-4 mt-6">
        <Link
          href="/hospitals"
          className="px-6 py-3 rounded-xl border border-[#C6D9FA] text-[#1B60E0] font-semibold text-sm hover:bg-blue-50 transition-colors"
        >
          Back to List
        </Link>

        <button 
          onClick={toggleHospitalStatus}
          className={`px-6 py-3 rounded-xl text-white font-semibold text-sm transition-colors ${
            hospital.is_active ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {hospital.is_active ? 'Deactivate Hospital' : 'Activate Hospital'}
        </button>
      </section>
    </>
  )
}

export default function HospitalDetailsPage() {
  return (
    <DashboardLayout>
      <main className="w-full max-w-[1180px] px-6 pt-5 pb-6 text-[#0B1528]">
        <Suspense fallback={<div className="text-center py-12">Loading details page...</div>}>
          <HospitalDetailsContent />
        </Suspense>
      </main>
    </DashboardLayout>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[#EAEEF6] pb-3">
      <span className="text-[#889ABF]">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#889ABF] font-semibold mb-2">{label}</p>
      <p className="text-sm font-semibold text-[#0B1528]">{value}</p>
    </div>
  )
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#2B3E64] flex items-center gap-2">
        <span className="text-[#1B60E0]">{icon}</span>
        {label}
      </span>
      <span className="font-bold">{value}</span>
    </div>
  )
}