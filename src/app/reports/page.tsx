'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { FaArrowUp, FaArrowDown,FaQuestion } from 'react-icons/fa'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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
        fetchAnalytics()
    }, [])

    async function fetchAnalytics() {
        setLoading(true)

        // Fetch all appointments (You can add date filters here later!)
        const { data: appointments, error } = await supabase
            .from('appointments')
            .select('*')
            .order('created_at', { ascending: true })

        if (!error && appointments) {
            // 1. Calculate KPIs
            let completed = 0, pending = 0, cancelled = 0, noShow = 0;
            
            appointments.forEach(app => {
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
            
            appointments.forEach(app => {
                // Extract just the "DD MMM" part of the date (e.g., "12 May")
                const dateObj = new Date(app.created_at || app.appointment_date)
                const dateKey = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                
                dateGroups[dateKey] = (dateGroups[dateKey] || 0) + 1
            })

            // Convert grouped object to array for Recharts
            const formattedChartData = Object.keys(dateGroups).map(date => ({
                date,
                appointments: dateGroups[date]
            }))

            setChartData(formattedChartData)
        }
        
        setLoading(false)
    }

    // Helper to calculate percentages safely
    const getPercent = (value: number) => {
        if (kpis.total === 0) return '0.0%'
        return ((value / kpis.total) * 100).toFixed(1) + '%'
    }

    return (
        <DashboardLayout>
            <main className="w-full flex-1 px-6 pt-5 pb-6 text-[#0B1528] h-full overflow-y-auto bg-[#f8fafc]">
                
                {/* --- HEADER --- */}
                <section className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
                    <div>
                        <div className='flex flex-row items-center gap-3'> 
                            <div className="min-w-[32px] w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xl">
                                      <FaQuestion className="text-lg" />
                            </div>
                            <h1 className="text-[22px] font-bold text-slate-800">Reports</h1>
                        </div>
                       
                        <p className="text-xs text-[#889ABF] mt-1 font-medium">
                            Dashboard &gt; <span className="text-[#2B3E64]">Reports</span>
                        </p>
                    </div>
                    
                    {/* Top Controls */}
                    <div className="flex items-center gap-3 text-sm">
                        <select className="px-4 py-2 bg-white border border-[#EAEEF6] rounded-lg text-slate-600 font-medium outline-none focus:border-blue-500 shadow-sm cursor-pointer">
                            <option>Appointment Report</option>
                            <option>Onboarding Report</option>
                        </select>
                        <select className="px-4 py-2 bg-white border border-[#EAEEF6] rounded-lg text-slate-600 font-medium outline-none focus:border-blue-500 shadow-sm cursor-pointer">
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>Year to Date</option>
                        </select>
                        <button className="px-4 py-2 bg-white border border-[#EAEEF6] rounded-lg text-slate-600 font-medium hover:bg-gray-50 shadow-sm transition-colors">
                            Export
                        </button>
                    </div>
                </section>

                {/* --- KPI CARDS --- */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Appointments */}
                    <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <h3 className="text-sm font-semibold text-[#889ABF] mb-4">Total Appointments</h3>
                        <div>
                            <div className="text-3xl font-bold text-slate-800 mb-2">{loading ? '-' : kpis.total.toLocaleString()}</div>
                            <div className="flex items-center text-xs font-semibold text-green-600">
                                <FaArrowUp className="mr-1" /> 15.3% <span className="text-slate-400 ml-1 font-medium">vs last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <h3 className="text-sm font-semibold text-[#889ABF] mb-4">Completed</h3>
                        <div>
                            <div className="text-3xl font-bold text-slate-800 mb-2">{loading ? '-' : kpis.completed.toLocaleString()}</div>
                            <div className="flex items-center text-xs font-semibold text-green-600">
                                <FaArrowUp className="mr-1" /> 13.8%
                            </div>
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <h3 className="text-sm font-semibold text-[#889ABF] mb-4">Pending</h3>
                        <div>
                            <div className="text-3xl font-bold text-slate-800 mb-2">{loading ? '-' : kpis.pending.toLocaleString()}</div>
                            <div className="flex items-center text-xs font-semibold text-red-500">
                                <FaArrowDown className="mr-1" /> 2.2%
                            </div>
                        </div>
                    </div>

                    {/* Cancelled */}
                    <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <h3 className="text-sm font-semibold text-[#889ABF] mb-4">Cancelled</h3>
                        <div>
                            <div className="text-3xl font-bold text-slate-800 mb-2">{loading ? '-' : kpis.cancelled.toLocaleString()}</div>
                            <div className="flex items-center text-xs font-semibold text-red-500">
                                <FaArrowDown className="mr-1" /> 2.6%
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- BOTTOM SECTION (CHART & STATUS) --- */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    
                    {/* CHART AREA (Takes up 2 columns) */}
                    <div className="lg:col-span-2 bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col">
                        <h3 className="text-base font-bold text-slate-800 mb-6">Appointments Overview</h3>
                        
                        <div className="flex-1 w-full relative">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-medium">
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
                                            tick={{ fontSize: 11, fill: '#889ABF' }} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 11, fill: '#889ABF' }} 
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                            labelStyle={{ fontWeight: 'bold', color: '#2B3E64', marginBottom: '4px' }}
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
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-medium">
                                    No appointment data available.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* STATUS BREAKDOWN (Takes up 1 column) */}
                    <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm flex flex-col">
                        <h3 className="text-base font-bold text-slate-800 mb-8">By Status</h3>
                        
                        <div className="flex-1 flex flex-col gap-6">
                            {/* Completed Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-4 border-blue-500 bg-white"></div>
                                    <span className="text-sm font-semibold text-slate-700">Completed</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-800">{kpis.completed.toLocaleString()}</span>
                                    <span className="text-xs font-medium text-[#889ABF] w-12 text-right">({getPercent(kpis.completed)})</span>
                                </div>
                            </div>

                            {/* Pending Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-4 border-purple-400 bg-white"></div>
                                    <span className="text-sm font-semibold text-slate-700">Pending</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-800">{kpis.pending.toLocaleString()}</span>
                                    <span className="text-xs font-medium text-[#889ABF] w-12 text-right">({getPercent(kpis.pending)})</span>
                                </div>
                            </div>

                            {/* Cancelled Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-4 border-orange-400 bg-white"></div>
                                    <span className="text-sm font-semibold text-slate-700">Cancelled</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-800">{kpis.cancelled.toLocaleString()}</span>
                                    <span className="text-xs font-medium text-[#889ABF] w-12 text-right">({getPercent(kpis.cancelled)})</span>
                                </div>
                            </div>

                            {/* No Show Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-4 border-emerald-600 bg-white"></div>
                                    <span className="text-sm font-semibold text-slate-700">No Show</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-800">{kpis.noShow.toLocaleString()}</span>
                                    <span className="text-xs font-medium text-[#889ABF] w-12 text-right">({getPercent(kpis.noShow)})</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Bottom Row */}
                        <div className="mt-auto pt-6 border-t border-[#EAEEF6] flex items-center justify-between">
                            <span className="text-sm font-semibold text-[#889ABF]">Total</span>
                            <span className="text-lg font-bold text-slate-800">{kpis.total.toLocaleString()}</span>
                        </div>
                    </div>

                </section>

            </main>
        </DashboardLayout>
    )
}