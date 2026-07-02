'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { FiMail, FiPhone, FiMessageCircle, FiSend, FiCheckCircle, FiHeadphones, FiAlertCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function SupportPage() {
    const [subject, setSubject] = useState('')
    const [ticketType, setTicketType] = useState('General')
    const [priority, setPriority] = useState('Medium')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [tickets, setTickets] = useState<any[]>([])

    useEffect(() => {
        fetchTickets()

        const channel = supabase
            .channel('support-tickets-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tickets' },
                () => {
                    fetchTickets()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    async function fetchTickets() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setTickets(data)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                alert('No active session found.')
                return
            }

            const { error } = await supabase.from('tickets').insert([{
                subject,
                ticket_type: ticketType,
                priority,
                message,
                status: 'Open',
                user_email: user.email || 'unknown@user.com'
            }])

            if (error) throw error

            setIsSubmitted(true)
            setSubject('')
            setTicketType('General')
            setPriority('Medium')
            setMessage('')

            setTimeout(() => setIsSubmitted(false), 3000)
            fetchTickets()
        } catch (err: any) {
            alert(err.message || 'An error occurred while submitting your ticket.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getPriorityColor = (prio: string) => {
        if (prio === 'Critical') return 'bg-red-100 text-red-700 border border-red-200'
        if (prio === 'High') return 'bg-orange-100 text-orange-700 border border-orange-200'
        if (prio === 'Medium') return 'bg-blue-100 text-blue-700 border border-blue-200'
        return 'bg-slate-100 text-slate-700 border border-slate-200'
    }

    const getStatusColor = (status: string) => {
        if (status === 'Resolved') return 'bg-green-100 text-green-700 border border-green-200'
        if (status === 'Closed') return 'bg-slate-100 text-slate-600 border border-slate-200'
        return 'bg-amber-100 text-amber-700 border border-amber-200'
    }

    return (
        <DashboardLayout>
            <main className="w-full flex-1 px-8 pt-6 pb-8 text-[#0B1528] h-full overflow-y-auto bg-[#f5f7fb]">
                
                {/* --- HEADER --- */}
                <motion.section 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start justify-between mb-8"
                >
                    <div>
                        <div className="flex flex-row items-center gap-3"> 
                            <div className="min-w-[36px] w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/10">
                                <FiHeadphones className="text-base" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Contact Support</h1>
                        </div>
                        <p className="text-xs text-[#889ABF] mt-2 font-bold">
                            Dashboard &gt; <span className="text-[#2B3E64]">Contact Support</span>
                        </p>
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* --- LEFT COLUMN: CONTACT FORM --- */}
                    <motion.section 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium"
                    >
                        <h2 className="text-lg font-bold text-slate-800 mb-2">Send us a message</h2>
                        <p className="text-sm text-[#889ABF] mb-6 font-semibold">
                            Experiencing an issue with the portal? Fill out the form below and our technical team will get back to you within 24-48 hours.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                    Ticket Subject <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="Brief summary of the issue..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                        Ticket Type <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        required
                                        value={ticketType}
                                        onChange={(e) => setTicketType(e.target.value)}
                                        className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 bg-white cursor-pointer"
                                    >
                                        <option value="Bug">Bug Report</option>
                                        <option value="Technical Issue">Technical Issue</option>
                                        <option value="Authentication">Authentication / Login</option>
                                        <option value="Hospital">Hospital Module</option>
                                        <option value="Doctor">Doctor Registry</option>
                                        <option value="General">General Inquiry</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                        Priority <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        required
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 bg-white cursor-pointer"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                    Detailed Description <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    required
                                    rows={5}
                                    placeholder="Please describe the issue in detail. Include steps to reproduce if applicable."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-none font-semibold text-slate-800"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-between">
                                {isSubmitted ? (
                                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm animate-in fade-in">
                                        <FiCheckCircle size={18} />
                                        Ticket raised successfully!
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                                
                                <motion.button 
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/10 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isSubmitting ? 'Submitting...' : (
                                        <>
                                            <FiSend size={16} />
                                            Submit Ticket
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>

                        {/* SUBMITTED TICKETS LIST */}
                        <div className="mt-12">
                            <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Your Support Tickets</h3>
                            {tickets.length === 0 ? (
                                <p className="text-xs text-slate-400 font-semibold py-4">You have not submitted any tickets yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {tickets.map((t) => (
                                        <div key={t.id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <h4 className="font-bold text-sm text-slate-800">{t.subject}</h4>
                                                <div className="flex gap-2">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getPriorityColor(t.priority)}`}>
                                                        {t.priority}
                                                    </span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(t.status)}`}>
                                                        {t.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium line-clamp-2">{t.message}</p>
                                            <span className="text-[10px] text-slate-400 font-semibold mt-2 block">
                                                Type: {t.ticket_type} • Raised on: {new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.section>

                    {/* --- RIGHT COLUMN: QUICK CONTACTS & FAQ --- */}
                    <div className="flex flex-col gap-6">
                        
                        {/* Direct Contact Cards */}
                        <motion.section 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium"
                        >
                            <h2 className="text-base font-bold text-slate-800 mb-5">Other ways to connect</h2>
                            
                            <div className="flex flex-col gap-4">
                                <motion.div 
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0 group-hover:bg-[#0066FF] group-hover:text-white transition-colors shadow-sm">
                                        <FiMail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Email Support</p>
                                        <p className="text-xs text-[#889ABF] font-semibold mt-0.5">support@quickcheck.com</p>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm">
                                        <FiPhone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Call Us (Toll-Free)</p>
                                        <p className="text-xs text-[#889ABF] font-semibold mt-0.5">1800-123-4567</p>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                                        <FiMessageCircle size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Live Chat</p>
                                        <p className="text-xs text-[#889ABF] font-semibold mt-0.5">Available 9 AM - 6 PM</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* Mini FAQ */}
                        <motion.section 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-slate-800 to-[#0B1528] rounded-2xl p-6 shadow-premium text-white"
                        >
                            <h2 className="text-base font-bold mb-4">Quick Help</h2>
                            <ul className="flex flex-col gap-4 text-sm text-slate-300">
                                <li className="pb-3 border-b border-slate-700/50">
                                    <strong className="block text-white mb-1.5 font-bold">How long does approval take?</strong>
                                    Hospital approvals typically take 24-48 business hours after document verification.
                                </li>
                                <li>
                                    <strong className="block text-white mb-1.5 font-bold">File upload limits?</strong>
                                    Certificates and licenses must be under 5MB in PDF, JPG, or PNG format.
                                </li>
                            </ul>
                        </motion.section>
                    </div>

                </div>
            </main>
        </DashboardLayout>
    )
}