'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { auth, db, ref, onValue, update } from '../../lib/firebase'
import {FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaHospitalSymbol} from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { MdOutlineLocalHospital } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

export default function HospitalsPage() {
    const router = useRouter()
    const [hospitals, setHospitals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState('All')
    const [editingHospital, setEditingHospital] = useState<any | null>(null)

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
        setLoading(true)
        const hospRef = ref(db, 'hospitals')
        const unsubscribe = onValue(hospRef, (snapshot) => {
            const list: any[] = []
            snapshot.forEach((child) => {
                list.push({ id: child.key, ...child.val() })
            })
            list.reverse()
            setHospitals(list)
            setLoading(false)
        }, (err) => {
            console.error('Failed to subscribe to hospitals:', err)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    async function toggleHospitalStatus(hospital: any) {
        try {
            const hospRef = ref(db, `hospitals/${hospital.id}`)
            await update(hospRef, { is_active: !hospital.is_active })
        } catch (e: any) {
            alert(e.message || 'Failed to update hospital status')
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

    // Filter logic handling both Search and Tabs
    const filteredHospitals = useMemo(() => {
        return hospitals.filter((hospital) => {
            const matchesSearch = 
                hospital.name?.toLowerCase().includes(search.toLowerCase()) ||
                hospital.city?.toLowerCase().includes(search.toLowerCase())

            let matchesTab = true
            if (activeTab === 'Approved') matchesTab = hospital.is_active === true
            if (activeTab === 'Pending') matchesTab = hospital.is_active === false
            if (activeTab === 'Rejected') matchesTab = false

            return matchesSearch && matchesTab
        })
    }, [hospitals, search, activeTab])

    // Dynamic Tab Counts
    const counts = {
        all: hospitals.length,
        approved: hospitals.filter(h => h.is_active).length,
        pending: hospitals.filter(h => !h.is_active).length,
        rejected: 0
    }

    return (
        <DashboardLayout>
            <main className="w-full flex-1 px-8 pt-6 pb-8 text-[#0B1528] h-full overflow-y-auto">
                
                {/* --- HEADER --- */}
                <section className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex flex-row items-center gap-3"> 
                            <div className="min-w-[36px] w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/10">
                                <MdOutlineLocalHospital className="text-base" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Hospitals</h1>
                        </div>
                        <p className="text-xs text-[#889ABF] mt-2 font-bold">
                            Dashboard &gt; <span className="text-[#2B3E64]">Hospitals</span>
                        </p>
                    </div>
                </section>

                {/* --- SEARCH & ACTIONS BAR --- */}
                <section className="bg-white border border-[#EAEEF6]/80 rounded-2xl p-4 mb-5 shadow-premium">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#889ABF] text-sm" />
                            <input
                                type="text"
                                placeholder="Search hospital name, city..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-12 bg-slate-50 hover:bg-slate-100/75 focus:bg-white border border-[#EAEEF6] rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-[#889ABF] font-semibold text-slate-800"
                            />
                        </div>

                        <button className="h-12 px-5 rounded-xl border border-[#EAEEF6] bg-white text-[#2B3E64] text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
                            <FaFilter className="text-xs text-[#889ABF]" />
                            Filters
                        </button>

                        <Link
                            href="/hospitals/add"
                            className="h-12 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/10 hover:scale-[1.01] transition-all"
                        >
                            <FaPlus className="text-xs" />
                            Add Hospital
                        </Link>
                    </div>
                </section>

                {/* --- TABS --- */}
                <section className="flex items-center gap-3 mb-5 overflow-x-auto pb-1">
                    {[
                        { id: 'All', label: `All (${counts.all})` },
                        { id: 'Approved', label: `Approved (${counts.approved})` },
                        { id: 'Pending', label: `Pending (${counts.pending})` },
                        { id: 'Rejected', label: `Rejected (${counts.rejected})` }
                    ].map((tab) => {
                        const active = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative min-w-fit px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors whitespace-nowrap cursor-pointer ${
                                    active
                                        ? 'text-blue-600 border-blue-200 shadow-sm shadow-blue-500/5'
                                        : 'bg-white border-[#EAEEF6] text-[#2B3E64] hover:bg-slate-50'
                                }`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="activeHospitalTabBg"
                                        className="absolute inset-0 bg-blue-50/60 rounded-xl -z-10"
                                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                    />
                                )}
                                <span className="relative z-10">{tab.label}</span>
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
                                    <th className="text-left px-6 py-4 text-[11px] tracking-wider font-bold uppercase">
                                        Hospital Name
                                    </th>
                                    <th className="text-left px-4 py-4 text-[11px] tracking-wider font-bold uppercase">
                                        City
                                    </th>
                                    <th className="text-left px-4 py-4 text-[11px] tracking-wider font-bold uppercase">
                                        Contact Person
                                    </th>
                                    <th className="text-left px-4 py-4 text-[11px] tracking-wider font-bold uppercase">
                                        Status
                                    </th>
                                    <th className="text-left px-4 py-4 text-[11px] tracking-wider font-bold uppercase">
                                        Joined On
                                    </th>
                                    <th className="text-center px-4 py-4 text-[11px] tracking-wider font-bold uppercase">
                                        Actions
                                    </th>
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
                                                Loading hospitals...
                                            </td>
                                        </tr>
                                    ) : filteredHospitals.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-400">
                                                        <FaHospitalSymbol size={20} />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-700">No Hospitals Found</p>
                                                    <p className="text-xs text-slate-500 mt-1 font-semibold">Try adjusting your filters or search query.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredHospitals.map((hospital) => (
                                            <motion.tr
                                                key={hospital.id}
                                                variants={rowVariants}
                                                whileHover={{ backgroundColor: "#fafbfc" }}
                                                className="border-b border-[#F3F5FA] transition-colors group"
                                            >
                                                {/* Hospital Name & Icon */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
                                                            <FaHospitalSymbol size={16} />
                                                        </div>
                                                        <span className="font-bold text-slate-800">{hospital.name}</span>
                                                    </div>
                                                </td>

                                                {/* City */}
                                                <td className="px-4 py-4 text-[#2B3E64] font-semibold">
                                                    {hospital.city || 'N/A'}
                                                </td>

                                                {/* Contact Person (Mapped from admin_name) */}
                                                <td className="px-4 py-4 text-[#2B3E64] font-semibold">
                                                    {hospital.admin_name || 'Not Provided'}
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                                                            hospital.is_active
                                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                        }`}
                                                    >
                                                        {hospital.is_active ? 'Approved' : 'Pending'}
                                                    </span>
                                                </td>

                                                {/* Joined On */}
                                                <td className="px-4 py-4 text-[#2B3E64] font-semibold">
                                                    {formatDate(hospital.created_at)}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center gap-2.5">
                                                        <button 
                                                            className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center hover:bg-[#0066FF] hover:text-white transition-colors cursor-pointer" 
                                                            title="View Details" 
                                                            onClick={() => router.push(`/hospitals/details?id=${hospital.id}`)}
                                                        >
                                                            <FaEye size={13} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setEditingHospital(hospital)}
                                                            className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-150 transition-colors cursor-pointer" 
                                                            title="Edit Hospital"
                                                        >
                                                            <FaEdit size={13} />
                                                        </button>
                                                        <button 
                                                            onClick={() => toggleHospitalStatus(hospital)}
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                                                hospital.is_active 
                                                                    ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' 
                                                                    : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                                                            }`} 
                                                            title={hospital.is_active ? "Deactivate" : "Activate"}
                                                        >
                                                            <FaTrash size={12} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </motion.tbody>
                            </AnimatePresence>
                        </table>
                    </div>

                    {/* --- PAGINATION FOOTER --- */}
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#EAEEF6]">
                        <p className="text-xs font-semibold text-[#889ABF]">
                            Showing {filteredHospitals.length > 0 ? 1 : 0} to {filteredHospitals.length} of {hospitals.length} entries
                        </p>

                        <div className="flex items-center gap-1.5">
                            <button className="w-8 h-8 rounded-lg border border-[#EAEEF6] flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50">
                                <FaChevronLeft size={10} />
                            </button>

                            <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-sm shadow-blue-500/10">
                                1
                            </button>

                            <button className="w-8 h-8 rounded-lg border border-[#EAEEF6] flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
                                <FaChevronRight size={10} />
                            </button>
                        </div>
                    </div>
                </section>
                {editingHospital && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl border border-gray-150 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-800">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Edit Hospital Info</h3>
                            <form onSubmit={async (e) => {
                                e.preventDefault()
                                setLoading(true)
                                try {
                                    const hospRef = ref(db, `hospitals/${editingHospital.id}`)
                                    await update(hospRef, {
                                        name: editingHospital.name,
                                        hospital_type: editingHospital.hospital_type,
                                        registration_number: editingHospital.registration_number,
                                        email: editingHospital.email,
                                        phone: editingHospital.phone,
                                        city: editingHospital.city
                                    })
                                    setEditingHospital(null)
                                    alert('Hospital details updated successfully!')
                                } catch (err: any) {
                                    alert(err.message || 'Failed to update hospital details')
                                } finally {
                                    setLoading(false)
                                }
                            }} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Hospital Name</label>
                                    <input type="text" required value={editingHospital.name} onChange={(e) => setEditingHospital({...editingHospital, name: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-800" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Type</label>
                                        <select value={editingHospital.hospital_type} onChange={(e) => setEditingHospital({...editingHospital, hospital_type: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold bg-white text-slate-800">
                                            <option value="General">General Hospital</option>
                                            <option value="Specialty">Specialty Clinic</option>
                                            <option value="Multi-Specialty">Multi-Specialty</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">City</label>
                                        <input type="text" required value={editingHospital.city} onChange={(e) => setEditingHospital({...editingHospital, city: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-800" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Registration Number</label>
                                    <input type="text" required value={editingHospital.registration_number} onChange={(e) => setEditingHospital({...editingHospital, registration_number: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-800" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Email</label>
                                        <input type="email" required value={editingHospital.email} onChange={(e) => setEditingHospital({...editingHospital, email: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Phone</label>
                                        <input type="text" required value={editingHospital.phone} onChange={(e) => setEditingHospital({...editingHospital, phone: e.target.value})} className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-800" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setEditingHospital(null)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">Cancel</button>
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