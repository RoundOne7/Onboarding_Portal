'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  FaCheckCircle,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaUserMd,
  FaFileAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaHistory
} from 'react-icons/fa'

function DoctorProfileContent() {
  const searchParams = useSearchParams()
  const doctorId = searchParams.get('id')
  const router = useRouter()
  
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [doctorLogs, setDoctorLogs] = useState<any[]>([])

  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails()
      fetchDoctorLogs()

      const channel = supabase
        .channel(`doctor-details-${doctorId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'doctors', filter: `id=eq.${doctorId}` },
          () => {
            fetchDoctorDetails()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } else {
      setLoading(false)
    }
  }, [doctorId])

  async function fetchDoctorDetails() {
    setLoading(true)
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        specializations (
          name
        ),
        hospitals (
          name,
          city,
          state
        ),
        qualifications (
          name
        )
      `)
      .eq('id', doctorId)
      .single()

    if (!error && data) {
      setDoctor(data)
    }
    setLoading(false)
  }

  async function fetchDoctorLogs() {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('affected_table', 'doctors')
      .eq('affected_id', doctorId)
      .order('created_at', { ascending: false })
    if (data) {
      setDoctorLogs(data)
    }
  }

  async function toggleDoctorStatus() {
    if (!doctor) return
    const newStatus = !doctor.is_active
    const { error } = await supabase
      .from('doctors')
      .update({ is_active: newStatus })
      .eq('id', doctor.id)

    if (!error) {
      setDoctor({ ...doctor, is_active: newStatus })
      alert(`Doctor successfully ${newStatus ? 'activated' : 'deactivated'}.`)
      fetchDoctorLogs()
    } else {
      alert(error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-semibold">
        Loading doctor details...
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Doctor Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">No doctor found with the provided ID.</p>
        <Link href="/doctors" className="mt-4 inline-block text-blue-600 font-bold text-sm hover:underline">
          Go Back
        </Link>
      </div>
    )
  }

  const formatDate = (isoString: string) => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const specialtyName = doctor.specializations?.name || 'Doctor'
  const hospitalName = doctor.hospitals?.name || 'N/A'
  const hospitalLocation = doctor.hospitals?.city ? `${doctor.hospitals.city}, ${doctor.hospitals.state || ''}` : 'N/A'
  const qualificationName = doctor.qualifications?.name || 'N/A'
  const imageUrl = doctor.image || `https://randomuser.me/api/portraits/men/${(doctor.id?.charCodeAt(0) || 0) % 99 + 1}.jpg`

  return (
    <>
      <section className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Doctor Profile</h1>
          <p className="text-xs text-[#889ABF] mt-2 font-bold">
            Dashboard &gt; Doctors &gt; <span className="text-[#2B3E64]">{doctor.name}</span>
          </p>
        </div>

        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${
          doctor.is_active 
            ? 'bg-[#DBF1CF] text-[#335F1B] border border-[#C2E7B0]' 
            : 'bg-[#FFFBED] text-[#E45412] border border-[#FBEFCD]'
        }`}>
          {doctor.is_active ? <FaCheckCircle /> : <FaClock />}
          {doctor.is_active ? 'Approved' : 'Pending'}
        </span>
      </section>

      <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm mb-4">
        <div className="flex justify-between gap-6 flex-wrap md:flex-nowrap">
          <div className="flex gap-5 flex-wrap sm:flex-nowrap">
            <img
              src={imageUrl}
              alt={doctor.name}
              className="w-36 h-32 rounded-2xl object-cover border border-slate-100/80 shadow-sm shrink-0"
            />

            <div>
              <h2 className="text-xl font-bold">{doctor.name}</h2>
              <p className="text-sm text-[#2B3E64] mt-1">{specialtyName}</p>
              <p className="text-sm text-[#2B3E64] mt-2 mb-4">
                {hospitalName} {hospitalLocation !== 'N/A' ? `(${hospitalLocation})` : ''}
              </p>

              <p className="flex items-center gap-2 text-sm text-[#2B3E64] mb-2 font-semibold">
                <FaPhone className="text-[#1B60E0]" />
                {doctor.phone || 'Not Provided'}
              </p>

              <p className="flex items-center gap-2 text-sm text-[#2B3E64] font-semibold">
                <FaEnvelope className="text-[#1B60E0]" />
                {doctor.email || 'Not Provided'}
              </p>
            </div>
          </div>

          <div className="w-full md:w-72 space-y-5 text-sm shrink-0">
            <InfoRow label="Joined On" value={formatDate(doctor.created_at)} />
            <InfoRow label="Experience" value={`${doctor.experience_years || 0} Years`} />
            <InfoRow label="Consultation Fee" value={`₹${doctor.consultation_fee || 0}`} />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border border-[#EAEEF6] rounded-2xl mb-4 overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 w-full">
          {[
            { id: 'Overview', label: 'Overview', icon: FaUserMd },
            { id: 'Documents', label: 'Documents', icon: FaFileAlt },
            { id: 'Availability', label: 'Availability', icon: FaCalendarAlt },
            { id: 'Consultation Fees', label: 'Consultation Fees', icon: FaDollarSign },
            { id: 'Activity Log', label: 'Activity Log', icon: FaHistory }
          ].map((tab) => {
            const active = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-bold text-center whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer transition-colors border-b-2 ${
                  active
                    ? 'text-[#1B60E0] border-[#1B60E0] bg-blue-50/10'
                    : 'text-[#2B3E64] border-transparent hover:text-[#1B60E0]'
                }`}
              >
                <Icon className="text-xs" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* --- TAB CONTENT AREA --- */}
      <div className="min-h-[250px]">
        {activeTab === 'Overview' && (
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-5 animate-in fade-in duration-200">
            <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold mb-5 text-slate-800">General Information</h2>
              <div className="space-y-4">
                <InfoBlock label="Full Name" value={doctor.name} />
                <InfoBlock label="Date of Birth" value={doctor.dob ? formatDate(doctor.dob) : 'Not Provided'} />
                <InfoBlock label="Gender" value={doctor.gender || 'Not Provided'} />
                <InfoBlock label="Experience" value={`${doctor.experience_years || 0} Years`} />
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold mb-5 text-slate-800">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InfoBlock label="Qualification" value={qualificationName} />
                <InfoBlock label="Specialization" value={specialtyName} />
                <InfoBlock label="Experience" value={`${doctor.experience_years || 0} Years`} />
                <InfoBlock label="Consultation Fee" value={`₹${doctor.consultation_fee || 0}`} />
                <div className="md:col-span-2">
                  <p className="text-xs text-[#889ABF] font-semibold mb-2">Hospital Affiliation</p>
                  <p className="text-sm font-semibold text-[#0B1528] leading-relaxed">{hospitalName}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold mb-5 text-slate-800">Statistics</h2>
              <div className="space-y-5">
                <StatRow label="Avg. Rating" value="4.8" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#2B3E64]">Rating Breakdowns</span>
                  <span className="font-bold flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    4.8
                  </span>
                </div>
                <StatRow label="Status" value={doctor.is_active ? 'Active' : 'Inactive'} />
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Documents' && (
          <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm animate-in fade-in duration-200">
            <h2 className="text-base font-bold mb-4 text-slate-800">Uploaded Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between h-40">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Medical License Certificate</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Verified Medical License Document</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white border border-slate-200 text-[#1B60E0] px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-sm">
                    Preview
                  </button>
                  <button className="bg-[#1B60E0] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 cursor-pointer shadow-sm">
                    Download
                  </button>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between h-40">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Government ID Proof</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Verified identity verification card</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white border border-slate-200 text-[#1B60E0] px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-sm">
                    Preview
                  </button>
                  <button className="bg-[#1B60E0] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 cursor-pointer shadow-sm">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Availability' && (
          <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm animate-in fade-in duration-200">
            <h2 className="text-base font-bold mb-4 text-slate-800">Weekly Consultation Slots</h2>
            <div className="space-y-4 max-w-md">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-700">Monday - Friday</span>
                <span className="font-bold text-slate-800">09:00 AM - 05:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-700">Saturday</span>
                <span className="font-bold text-slate-800">10:00 AM - 02:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-700">Sunday</span>
                <span className="text-red-500 font-bold">Closed</span>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Consultation Fees' && (
          <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm animate-in fade-in duration-200">
            <h2 className="text-base font-bold mb-4 text-slate-800">Consultation Charges</h2>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-extrabold text-lg shadow-sm">
                  ₹
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Base Consulting Charge</h3>
                  <p className="text-xs text-slate-500 font-semibold">₹{doctor.consultation_fee || 0} per consultation slot</p>
                </div>
              </div>
              <hr className="border-slate-100" />
              <div className="max-w-xl text-xs text-slate-500 font-semibold leading-relaxed space-y-2">
                <p>• Consultation fees are billed directly to patients during booking.</p>
                <p>• Refund Policy: Cancellations 24 hours prior are eligible for a 100% refund.</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Activity Log' && (
          <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm animate-in fade-in duration-200">
            <h2 className="text-base font-bold mb-4 text-slate-800">Verification & Profile Activities</h2>
            {doctorLogs.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold py-4 text-center">No profile activities logged yet.</p>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {doctorLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-3 border border-slate-50 rounded-xl bg-slate-50/50">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{log.action}</p>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Verifier: {log.user_email}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(log.created_at).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <section className="flex justify-end gap-4 mt-6">
        <Link
          href="/doctors"
          className="px-6 py-3 rounded-xl border border-[#C6D9FA] text-[#1B60E0] font-semibold text-sm hover:bg-blue-50 transition-colors"
        >
          Back to List
        </Link>

        <button 
          onClick={toggleDoctorStatus}
          className={`px-6 py-3 rounded-xl text-white font-semibold text-sm transition-colors cursor-pointer ${
            doctor.is_active ? 'bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20' : 'bg-green-500 hover:bg-green-600 shadow-md shadow-green-500/20'
          }`}
        >
          {doctor.is_active ? 'Deactivate Doctor' : 'Activate Doctor'}
        </button>
      </section>
    </>
  )
}

export default function DoctorProfilePage() {
  return (
    <DashboardLayout>
      <main className="w-full flex-1 px-6 pt-5 pb-6 text-[#0B1528] h-full overflow-y-auto">
        <Suspense fallback={<div className="text-center py-12">Loading profile page...</div>}>
          <DoctorProfileContent />
        </Suspense>
      </main>
    </DashboardLayout>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[#EAEEF6] pb-3">
      <span className="text-[#889ABF]">{label}</span>
      <span className="font-bold text-[#0B1528]">{value}</span>
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

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#2B3E64]">{label}</span>
      <span className="font-bold text-[#0B1528]">{value}</span>
    </div>
  )
}