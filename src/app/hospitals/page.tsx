'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { supabase } from '../../lib/supabase'
import {FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaHospitalSymbol} from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function HospitalsPage() {
    const router = useRouter()
    const [hospitals, setHospitals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState('All')

    useEffect(() => {
        fetchHospitals()
    }, [])

    async function fetchHospitals() {
        setLoading(true)
        const { data, error } = await supabase
            .from('hospitals')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setHospitals(data as any[])
        }
        setLoading(false)
    }

    async function toggleHospitalStatus(hospital: any) {
        await supabase
            .from('hospitals')
            .update({ is_active: !hospital.is_active })
            .eq('id', hospital.id)

        fetchHospitals()
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
            // 1. Search Filter
            const matchesSearch = 
                hospital.name?.toLowerCase().includes(search.toLowerCase()) ||
                hospital.city?.toLowerCase().includes(search.toLowerCase())

            // 2. Tab Filter (Assuming is_active=true means Approved, false means Pending)
            let matchesTab = true
            if (activeTab === 'Approved') matchesTab = hospital.is_active === true
            if (activeTab === 'Pending') matchesTab = hospital.is_active === false
            if (activeTab === 'Rejected') matchesTab = false
            // Note: If you have a dedicated 'status' text column in the future, check that here instead!

            return matchesSearch && matchesTab
        })
    }, [hospitals, search, activeTab])

    // Dynamic Tab Counts
    const counts = {
        all: hospitals.length,
        approved: hospitals.filter(h => h.is_active).length,
        pending: hospitals.filter(h => !h.is_active).length,
        rejected: 0 // Placeholder
    }

    return (
        <DashboardLayout>
            <main className="w-full flex-1 px-6 pt-5 pb-6 text-[#0B1528] h-full overflow-y-auto">
                
                {/* --- HEADER --- */}
                <section className="flex items-start justify-between mb-5">
                    <div>
                        <h1 className="text-2xl font-bold">Hospitals</h1>
                        <p className="text-xs text-[#889ABF] mt-2 font-medium">
                            Dashboard &gt; <span className="text-[#2B3E64]">Hospitals</span>
                        </p>
                    </div>
                </section>

                {/* --- SEARCH & ACTIONS BAR --- */}
                <section className="bg-white border border-[#EAEEF6] rounded-2xl p-4 mb-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#889ABF] text-sm" />
                            <input
                                type="text"
                                placeholder="Search hospital name, city..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-12 bg-[#F8F9FC] border border-[#EAEEF6] rounded-xl pl-11 pr-4 text-sm outline-none focus:border-[#C6D9FA] focus:bg-white transition-colors placeholder:text-[#889ABF]"
                            />
                        </div>

                        <button className="h-12 px-5 rounded-xl border border-[#EAEEF6] bg-white text-[#2B3E64] text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors">
                            <FaFilter className="text-xs text-[#889ABF]" />
                            Filters
                        </button>

                        <Link
                            href="/hospitals/add"
                            className="h-12 px-5 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(0,102,255,0.39)]"
                        >
                            <FaPlus className="text-xs" />
                            Add Hospital
                        </Link>
                    </div>
                </section>

                {/* --- TABS --- */}
                <section className="flex items-center gap-3 mb-4 overflow-x-auto pb-1">
                    {[
                        { id: 'All', label: `All (${counts.all})` },
                        { id: 'Approved', label: `Approved (${counts.approved})` },
                        { id: 'Pending', label: `Pending (${counts.pending})` },
                        { id: 'Rejected', label: `Rejected (${counts.rejected})` }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`min-w-fit px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-[#E3ECFD] border-[#C6D9FA] text-[#0066FF]'
                                    : 'bg-white border-[#EAEEF6] text-[#2B3E64] hover:bg-gray-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </section>

                {/* --- TABLE AREA --- */}
                <section className="bg-white border border-[#EAEEF6] rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-[#EAEEF6] bg-[#FCFDFF]">
                                    <th className="text-left px-6 py-4 text-[11px] tracking-wider font-bold text-[#889ABF] uppercase">
                                        Hospital Name
                                    </th>
                                    <th className="text-left px-4 py-4 text-[11px] tracking-wider font-bold text-[#889ABF] uppercase">
                                        City
                                    </th>
                                    <th className="text-left px-4 py-4 text-[11px] tracking-wider font-bold text-[#889ABF] uppercase">
                                        Contact Person
                                    </th>
                                    <th className="text-left px-4 py-4 text-[11px] tracking-wider font-bold text-[#889ABF] uppercase">
                                        Status
                                    </th>
                                    <th className="text-left px-4 py-4 text-[11px] tracking-wider font-bold text-[#889ABF] uppercase">
                                        Joined On
                                    </th>
                                    <th className="text-center px-4 py-4 text-[11px] tracking-wider font-bold text-[#889ABF] uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#889ABF] font-medium">
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
                                                <p className="text-sm font-semibold text-slate-700">No Hospitals Found</p>
                                                <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search query.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHospitals.map((hospital) => (
                                        <tr
                                            key={hospital.id}
                                            className="border-b border-[#F3F5FA] hover:bg-[#FAFBFF] transition-colors group"
                                        >
                                            {/* Hospital Name & Icon */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                                                        <FaHospitalSymbol size={16} />
                                                    </div>
                                                    <span className="font-semibold text-[14px] text-slate-800">{hospital.name}</span>
                                                </div>
                                            </td>

                                            {/* City */}
                                            <td className="px-4 py-4 text-sm text-[#2B3E64] font-medium">
                                                {hospital.city || 'N/A'}
                                            </td>

                                            {/* Contact Person (Mapped from admin_name) */}
                                            <td className="px-4 py-4 text-sm text-[#2B3E64] font-medium">
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
                                            <td className="px-4 py-4 text-sm text-[#2B3E64] font-medium">
                                                {formatDate(hospital.created_at)}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center hover:bg-[#0066FF] hover:text-white transition-colors" title="View Details" onClick={() => router.push('/hospitals/details')}>
                                                        {/* onClick={() => router.push(`/hospitals/details/${hospital.id}`)  */}
                                                        <FaEye size={13} />
                                                    </button>
                                                    <button className="w-8 h-8 rounded-lg bg-gray-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors" title="Edit Hospital">
                                                        <FaEdit size={13} />
                                                    </button>
                                                    <button 
                                                        onClick={() => toggleHospitalStatus(hospital)}
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${hospital.is_active ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`} 
                                                        title={hospital.is_active ? "Deactivate" : "Activate"}
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION FOOTER --- */}
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#EAEEF6]">
                        <p className="text-xs font-medium text-[#889ABF]">
                            Showing {filteredHospitals.length > 0 ? 1 : 0} to {filteredHospitals.length} of {hospitals.length} entries
                        </p>

                        <div className="flex items-center gap-1.5">
                            <button className="w-8 h-8 rounded-lg border border-[#EAEEF6] flex items-center justify-center text-slate-400 hover:bg-gray-50 hover:text-slate-600 transition-colors disabled:opacity-50">
                                <FaChevronLeft size={10} />
                            </button>

                            <button className="w-8 h-8 rounded-lg bg-[#0066FF] text-white text-xs font-semibold shadow-sm shadow-blue-200">
                                1
                            </button>

                            {/* Placeholders for future pagination pages */}
                            <button className="w-8 h-8 rounded-lg border border-[#EAEEF6] text-slate-600 text-xs font-medium hover:bg-gray-50 transition-colors hidden sm:flex items-center justify-center">
                                2
                            </button>

                            <button className="w-8 h-8 rounded-lg border border-[#EAEEF6] flex items-center justify-center text-slate-400 hover:bg-gray-50 hover:text-slate-600 transition-colors">
                                <FaChevronRight size={10} />
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </DashboardLayout>
    )
}