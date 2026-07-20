'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { auth, db } from '../../lib/firebase'
import { ref, onValue } from 'firebase/database'
import { FaArrowUp, FaArrowDown, FaQuestion } from 'react-icons/fa'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'

export default function ReportsPage() {
    const [loading, setLoading] = useState(true)
    
    // Analytics State
    const [kpis, setKpis] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
        noShow: 0
    })
    
    // Chart Data State
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        setLoading(true)
        const apptsRef = ref(db, 'appointments')
        const unsubscribe = onValue(apptsRef, (snapshot) => {
            const appointments: any[] = []
            snapshot.forEach((child) => {
                appointments.push({ id: child.key, ...child.val() })
            })
            
            // 1. Calculate KPIs
            let completed = 0, pending = 0, cancelled = 0, noShow = 0;
            
            appointments.forEach((app: any) => {
                const status = app.status?.toLowerCase() || ''
                if (status === 'completed') completed++
                else if (status === 'pending') pending++
                else if (status === 'cancelled') cancelled++
                else if (status === 'no show' || status === 'no_show') noShow++
            })

            setKpis({
                total: appointments.length,
                completed,
                pending,
                cancelled,
                noShow
            })

            // 2. Process Data for the Chart (Group by Date)
            const dateGroups: Record<string, number> = {}
            
            appointments.forEach((app: any) => {
                const dateObj = new Date(app.created_at || app.appointment_date)
                const dateKey = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                
                dateGroups[dateKey] = (dateGroups[dateKey] || 0) + 1
            })

            const formattedChartData = Object.keys(dateGroups).map(date => ({
                date,
                appointments: dateGroups[date]
            }))

            setChartData(formattedChartData)
            setLoading(false)
        }, (err) => {
            console.error('Failed to subscribe to appointments:', err)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const getPercent = (value: number) => {
        if (kpis.total === 0) return '0.0%'
        return ((value / kpis.total) * 100).toFixed(1) + '%'
    }

    return (
        <DashboardLayout>
            <main className="w-full flex-1 px-8 pt-6 pb-8 text-[#0B1528] h-full overflow-y-auto bg-[#f5f7fb]">
                
                {/* --- HEADER --- */}
                <motion.section 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4"
                >
                    <div>
                        <div className="flex flex-row items-center gap-3"> 
                            <div className="min-w-[36px] w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/10">
                                <FaQuestion className="text-base" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Reports</h1>
                        </div>
                       
                        <p className="text-xs text-[#889ABF] mt-2 font-bold">
                            Dashboard &gt; <span className="text-[#2B3E64]">Reports</span>
                        </p>
                    </div>
                    
                    {/* Top Controls */}
                    <div className="flex items-center gap-3 text-sm font-semibold">
                        <select className="px-4 py-2 bg-white border border-[#EAEEF6] rounded-xl text-slate-600 outline-none focus:border-blue-500 shadow-sm cursor-pointer">
                            <option>Appointment Report</option>
                            <option>Onboarding Report</option>
                        </select>
                        <select className="px-4 py-2 bg-white border border-[#EAEEF6] rounded-xl text-slate-600 outline-none focus:border-blue-500 shadow-sm cursor-pointer">
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>Year to Date</option>
                        </select>
                        <button className="px-4 py-2 bg-white border border-[#EAEEF6] rounded-xl text-[#2B3E64] hover:bg-slate-50 shadow-sm transition-colors cursor-pointer">
                            Export
                        </button>
                    </div>
                </motion.section>

                {/* --- KPI CARDS --- */}
                <motion.section 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.08
                            }
                        }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {/* Total Appointments */}
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                        }}
                        whileHover={{ y: -4, boxShadow: "var(--shadow-premium-hover)" }}
                        className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium flex flex-col justify-between cursor-pointer transition-all duration-300"
                    >
                        <h3 className="text-xs font-bold text-[#889ABF] uppercase tracking-wider mb-4">Total Appointments</h3>
                        <div>
                            <div className="text-3xl font-extrabold text-slate-800 mb-2">{loading ? '-' : kpis.total.toLocaleString()}</div>
                            <div className="flex items-center text-xs font-bold text-green-600">
                                <FaArrowUp className="mr-1" /> 15.3% <span className="text-slate-400 ml-1.5 font-semibold">vs last month</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Completed */}
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                        }}
                        whileHover={{ y: -4, boxShadow: "var(--shadow-premium-hover)" }}
                        className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium flex flex-col justify-between cursor-pointer transition-all duration-300"
                    >
                        <h3 className="text-xs font-bold text-[#889ABF] uppercase tracking-wider mb-4">Completed</h3>
                        <div>
                            <div className="text-3xl font-extrabold text-slate-800 mb-2">{loading ? '-' : kpis.completed.toLocaleString()}</div>
                            <div className="flex items-center text-xs font-bold text-green-600">
                                <FaArrowUp className="mr-1" /> 13.8% <span className="text-slate-400 ml-1.5 font-semibold">completed</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Pending */}
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                        }}
                        whileHover={{ y: -4, boxShadow: "var(--shadow-premium-hover)" }}
                        className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium flex flex-col justify-between cursor-pointer transition-all duration-300"
                    >
                        <h3 className="text-xs font-bold text-[#889ABF] uppercase tracking-wider mb-4">Pending</h3>
                        <div>
                            <div className="text-3xl font-extrabold text-slate-800 mb-2">{loading ? '-' : kpis.pending.toLocaleString()}</div>
                            <div className="flex items-center text-xs font-bold text-amber-500">
                                <FaArrowDown className="mr-1" /> 2.2% <span className="text-slate-400 ml-1.5 font-semibold">in queue</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cancelled */}
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                        }}
                        whileHover={{ y: -4, boxShadow: "var(--shadow-premium-hover)" }}
                        className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium flex flex-col justify-between cursor-pointer transition-all duration-300"
                    >
                        <h3 className="text-xs font-bold text-[#889ABF] uppercase tracking-wider mb-4">Cancelled</h3>
                        <div>
                            <div className="text-3xl font-extrabold text-slate-800 mb-2">{loading ? '-' : kpis.cancelled.toLocaleString()}</div>
                            <div className="flex items-center text-xs font-bold text-red-500">
                                <FaArrowDown className="mr-1" /> 2.6% <span className="text-slate-400 ml-1.5 font-semibold">cancelled</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* --- BOTTOM SECTION (CHART & STATUS) --- */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    
                    {/* CHART AREA */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium min-h-[400px] flex flex-col"
                    >
                        <h3 className="text-base font-bold text-slate-800 mb-6">Appointments Overview</h3>
                        
                        <div className="flex-1 w-full relative">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-semibold">
                                    Loading chart data...
                                </div>
                            ) : chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEEF6" />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 11, fill: '#889ABF', fontWeight: 'bold' }} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 11, fill: '#889ABF', fontWeight: 'bold' }} 
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-premium-hover)' }}
                                            labelStyle={{ fontWeight: 'extrabold', color: '#0B1528', marginBottom: '4px' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="appointments" 
                                            stroke="#0066FF" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorAppts)" 
                                            activeDot={{ r: 6, fill: '#0066FF', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-semibold">
                                    No appointment data available.
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* STATUS BREAKDOWN */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium flex flex-col"
                    >
                        <h3 className="text-base font-bold text-slate-800 mb-8">By Status</h3>
                        
                        <div className="flex-1 flex flex-col gap-6">
                            {/* Completed Row */}
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-4 border-blue-500 bg-white group-hover:scale-110 transition-transform"></div>
                                    <span className="text-sm font-bold text-slate-700">Completed</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-extrabold text-slate-800">{kpis.completed.toLocaleString()}</span>
                                    <span className="text-xs font-bold text-[#889ABF] w-12 text-right">({getPercent(kpis.completed)})</span>
                                </div>
                            </div>

                            {/* Pending Row */}
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-4 border-purple-400 bg-white group-hover:scale-110 transition-transform"></div>
                                    <span className="text-sm font-bold text-slate-700">Pending</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-extrabold text-slate-800">{kpis.pending.toLocaleString()}</span>
                                    <span className="text-xs font-bold text-[#889ABF] w-12 text-right">({getPercent(kpis.pending)})</span>
                                </div>
                            </div>

                            {/* Cancelled Row */}
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-4 border-orange-400 bg-white group-hover:scale-110 transition-transform"></div>
                                    <span className="text-sm font-bold text-slate-700">Cancelled</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-extrabold text-slate-800">{kpis.cancelled.toLocaleString()}</span>
                                    <span className="text-xs font-bold text-[#889ABF] w-12 text-right">({getPercent(kpis.cancelled)})</span>
                                </div>
                            </div>

                            {/* No Show Row */}
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-4 border-emerald-600 bg-white group-hover:scale-110 transition-transform"></div>
                                    <span className="text-sm font-bold text-slate-700">No Show</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-extrabold text-slate-800">{kpis.noShow.toLocaleString()}</span>
                                    <span className="text-xs font-bold text-[#889ABF] w-12 text-right">({getPercent(kpis.noShow)})</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Bottom Row */}
                        <div className="mt-auto pt-6 border-t border-[#EAEEF6] flex items-center justify-between">
                            <span className="text-sm font-bold text-[#889ABF]">Total</span>
                            <span className="text-lg font-extrabold text-slate-800">{kpis.total.toLocaleString()}</span>
                        </div>
                    </motion.div>

                </section>

            </main>
        </DashboardLayout>
    )
}
