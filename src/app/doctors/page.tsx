'use client'

import { useState, useMemo, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaPen,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserMd,
  FaTrash
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function DoctorsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null)

  const listContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04
      }
    }
  } as const

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  } as const

  useEffect(() => {
    fetchDoctors()

    const channel = supabase
      .channel('doctors-list-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'doctors' },
        () => {
          fetchDoctors()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchDoctors() {
    setLoading(true)
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        specializations (
          name
        ),
        hospitals (
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setDoctors(data)
    }
    setLoading(false)
  }

  async function toggleDoctorStatus(doctor: any) {
    const { error } = await supabase
      .from('doctors')
      .update({ is_active: !doctor.is_active })
      .eq('id', doctor.id)

    if (!error) {
      fetchDoctors()
    }
  }

  // Format ISO date to "12 May 2024"
  const formatDate = (isoString: string) => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Filter doctors list dynamically
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const specialtyName = doctor.specializations?.name || 'Doctor'
      const hospitalName = doctor.hospitals?.name || 'N/A'
      const matchesSearch = 
        (doctor.name || '').toLowerCase().includes(search.toLowerCase()) ||
        specialtyName.toLowerCase().includes(search.toLowerCase()) ||
        hospitalName.toLowerCase().includes(search.toLowerCase())
      
      const statusText = doctor.is_active ? 'Approved' : 'Pending'
      const matchesTab = activeTab === 'All' || statusText === activeTab
      
      return matchesSearch && matchesTab
    })
  }, [doctors, search, activeTab])

  // Count helper
  const counts = useMemo(() => {
    return {
      All: doctors.length,
      Approved: doctors.filter(d => d.is_active).length,
      Pending: doctors.filter(d => !d.is_active).length,
      Rejected: 0,
    }
  }, [doctors])

  const statusClass = (status: string) => {
    if (status === 'Approved') return 'bg-[#DBF1CF] text-[#335F1B] border border-[#C2E7B0]'
    if (status === 'Pending') return 'bg-[#FFFBED] text-[#E45412] border border-[#FBEFCD]'
    return 'bg-[#FFE2E2] text-[#B91C1C] border border-[#FCD2D2]'
  }

  const statusIcon = (status: string) => {
    if (status === 'Approved') return <FaCheckCircle />
    if (status === 'Pending') return <FaClock />
    return <FaTimesCircle />
  }

  return (
    <DashboardLayout>
      <main className="w-full flex-1 px-8 pt-6 pb-8 text-[#0B1528] h-full overflow-y-auto">
        
        {/* --- HEADER --- */}
        <section className="flex items-start justify-between mb-6">
          <div>
            <div className="flex flex-row items-center gap-3"> 
              <div className="min-w-[36px] w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/10">
                <FaUserMd className="text-base" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Doctors</h1>
            </div>
            <p className="text-xs text-[#889ABF] mt-2 font-bold">
              Dashboard &gt; <span className="text-[#2B3E64]">Doctors</span>
            </p>
          </div>
        </section>

        {/* --- SEARCH BAR --- */}
        <section className="bg-white border border-[#EAEEF6]/80 rounded-2xl p-4 mb-5 shadow-premium">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#889ABF] text-sm" />
              <input
                type="text"
                placeholder="Search doctor name, specialty, hospital..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 bg-slate-50 hover:bg-slate-100/75 focus:bg-white border border-[#EAEEF6] rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-[#889ABF] font-semibold text-slate-800"
              />
            </div>

            <button className="h-12 px-5 rounded-xl border border-[#EAEEF6] bg-white text-[#2B3E64] text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
              <FaFilter className="text-xs text-slate-400" />
              Filters
            </button>

            <Link
              href="/doctors/add"
              className="h-12 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/10 hover:scale-[1.01] transition-all"
            >
              <FaPlus className="text-xs" />
              Add Doctor
            </Link>
          </div>
        </section>

        {/* --- TABS --- */}
        <section className="flex items-center gap-3 mb-5 overflow-x-auto pb-1">
          {(Object.keys(counts) as Array<keyof typeof counts>).map((tab) => {
            const active = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative min-w-[135px] px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'text-blue-600 border-blue-200 shadow-sm shadow-blue-500/5'
                    : 'bg-white border-[#EAEEF6] text-[#2B3E64] hover:bg-slate-50'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeDoctorTabBg"
                    className="absolute inset-0 bg-blue-50/60 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10">
                  {tab} ({counts[tab]})
                </span>
              </button>
            )
          })}
        </section>

        {/* --- TABLE AREA --- */}
        <section className="bg-white border border-[#EAEEF6]/80 rounded-2xl shadow-premium overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="bg-[#FCFDFF] border-b border-[#EAEEF6] text-[#889ABF]">
                <tr>
                  <th className="text-left px-6 py-4 text-[11px] tracking-wider font-bold uppercase">Doctor Name</th>
                  <th className="text-left px-5 py-4 text-[11px] tracking-wider font-bold uppercase">Specialty</th>
                  <th className="text-left px-5 py-4 text-[11px] tracking-wider font-bold uppercase">Hospital</th>
                  <th className="text-left px-5 py-4 text-[11px] tracking-wider font-bold uppercase">Status</th>
                  <th className="text-left px-5 py-4 text-[11px] tracking-wider font-bold uppercase">Joined On</th>
                  <th className="text-center px-5 py-4 text-[11px] tracking-wider font-bold uppercase">Actions</th>
                </tr>
              </thead>

              <AnimatePresence mode="popLayout">
                <motion.tbody 
                  initial="hidden"
                  animate="visible"
                  variants={listContainerVariants}
                >
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-semibold">
                        Loading doctors...
                      </td>
                    </tr>
                  ) : filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-semibold">
                        No doctors match the filters.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map((doctor) => {
                      const specialtyName = doctor.specializations?.name || 'Doctor'
                      const hospitalName = doctor.hospitals?.name || 'N/A'
                      const statusText = doctor.is_active ? 'Approved' : 'Pending'
                      const joinedDate = formatDate(doctor.created_at)
                      const imageUrl = doctor.image || `https://randomuser.me/api/portraits/men/${(doctor.id?.charCodeAt(0) || 0) % 99 + 1}.jpg`
                      
                      return (
                        <motion.tr 
                          key={doctor.id}
                          variants={rowVariants}
                          whileHover={{ backgroundColor: "#fafbfc" }}
                          className="border-t border-[#EAEEF6]/60 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={imageUrl}
                                alt={doctor.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-100/80 shadow-sm"
                              />
                              <span className="font-bold text-slate-800">{doctor.name}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-[#2B3E64] font-semibold">{specialtyName}</td>
                          <td className="px-5 py-4 text-[#2B3E64] font-semibold">{hospitalName}</td>

                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusClass(statusText)}`}>
                              {statusIcon(statusText)}
                              {statusText}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-[#2B3E64] font-semibold">{joinedDate}</td>

                          <td className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <button 
                                onClick={() => router.push(`/doctors/profile?id=${doctor.id}`)}
                                className="w-8 h-8 rounded-lg bg-blue-50 text-[#1B60E0] flex items-center justify-center hover:bg-[#1B60E0] hover:text-white transition-colors cursor-pointer" 
                                title="View Profile"
                              >
                                <FaEye size={13} />
                              </button>
                              <button 
                                onClick={() => setEditingDoctor(doctor)}
                                className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-150 transition-colors cursor-pointer" 
                                title="Edit Doctor"
                              >
                                <FaPen size={12} />
                              </button>
                              <button 
                                onClick={() => toggleDoctorStatus(doctor)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                  doctor.is_active 
                                    ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' 
                                    : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                                }`} 
                                title={doctor.is_active ? "Deactivate" : "Activate"}
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })
                  )}
                </motion.tbody>
              </AnimatePresence>
            </table>
          </div>

          {/* --- PAGINATION FOOTER --- */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#EAEEF6]">
            <p className="text-xs font-semibold text-[#889ABF]">
              Showing {filteredDoctors.length} of {doctors.length} entries
            </p>

            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-lg border border-[#EAEEF6] flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
                ‹
              </button>

              <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-sm shadow-blue-500/10">
                1
              </button>

              <button className="w-8 h-8 rounded-lg border border-[#EAEEF6] flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
                ›
              </button>
            </div>
          </div>
          </section>
    {editingDoctor && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-150 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-800">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Edit Doctor Profile</h3>
          <form onSubmit={async (e) => {
            e.preventDefault()
            setLoading(true)
            const { error } = await supabase
              .from('doctors')
              .update({
                name: editingDoctor.name,
                email: editingDoctor.email,
                phone: editingDoctor.phone,
                experience_years: parseInt(editingDoctor.experience_years || '0'),
                consultation_fee: parseFloat(editingDoctor.consultation_fee || '0')
              })
              .eq('id', editingDoctor.id)
            
            setLoading(false)
            if (error) {
              alert(error.message)
            } else {
              setEditingDoctor(null)
              alert('Doctor profile updated successfully!')
              fetchDoctors()
            }
          }} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Doctor Name</label>
              <input type="text" required value={editingDoctor.name} onChange={(e) => setEditingDoctor({...editingDoctor, name: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-800" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Experience (Years)</label>
                <input type="number" required value={editingDoctor.experience_years} onChange={(e) => setEditingDoctor({...editingDoctor, experience_years: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Consultation Fee</label>
                <input type="number" required value={editingDoctor.consultation_fee} onChange={(e) => setEditingDoctor({...editingDoctor, consultation_fee: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-800" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Email</label>
                <input type="email" required value={editingDoctor.email} onChange={(e) => setEditingDoctor({...editingDoctor, email: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Phone</label>
                <input type="text" required value={editingDoctor.phone} onChange={(e) => setEditingDoctor({...editingDoctor, phone: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-800" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setEditingDoctor(null)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </main>
</DashboardLayout>
  )
}