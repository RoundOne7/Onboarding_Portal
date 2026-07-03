'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { auth, db, ref, onValue, push } from '../../lib/firebase'
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
        const ticketsRef = ref(db, 'tickets')
        const unsubscribe = onValue(ticketsRef, (snapshot) => {
            const list: any[] = []
            snapshot.forEach((child) => {
                list.push({ id: child.key, ...child.val() })
            })
            list.reverse()
            setTickets(list)
        }, (err) => {
            console.error('Failed to subscribe to tickets:', err)
        })

        return () => unsubscribe()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const user = auth.currentUser
            if (!user) {
                alert('No active session found.')
                return
            }

            await push(ref(db, 'tickets'), {
                subject,
                ticket_type: ticketType,
                priority,
                message,
                status: 'Open',
                user_email: user.email || 'unknown@user.com',
                created_at: new Date().toISOString()
            })

            setIsSubmitted(true)
            setSubject('')
            setTicketType('General')
            setPriority('Medium')
            setMessage('')

            setTimeout(() => setIsSubmitted(false), 3000)
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
                                        Priority Level <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        required
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 bg-white cursor-pointer"
                                    >
                                        <option value="Low">Low (Non-critical)</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical (System Down)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                    Describe the issue <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    required
                                    rows={6}
                                    placeholder="Explain the issue in detail here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-[#889ABF] font-semibold flex items-center gap-1.5">
                                    <FiAlertCircle className="text-amber-500" />
                                    All fields marked with (*) are required.
                                </span>
                                
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase flex items-center gap-2 shadow-md shadow-blue-500/15 transition-all hover:scale-[1.01] cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            <FiSend />
                                            Submit Ticket
                                        </>
                                    )}
                                </button>
                            </div>

                            {isSubmitted && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#DBF1CF] border border-[#C2E7B0] text-[#335F1B] px-4 py-3.5 rounded-xl flex items-center gap-3 text-sm font-bold mt-2"
                                >
                                    <FiCheckCircle size={18} />
                                    Support ticket submitted successfully! Reference logged.
                                </motion.div>
                            )}
                        </form>
                    </motion.section>

                    {/* --- RIGHT COLUMN: HELPLINES & HISTORY --- */}
                    <div className="flex flex-col gap-6">
                        
                        {/* Direct Helplines */}
                        <motion.section 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium"
                        >
                            <h3 className="font-bold text-slate-800 text-base mb-4">Direct Helplines</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                        <FiMail size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                                        <p className="text-xs font-bold text-slate-700 mt-0.5">support@quickcheck.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                        <FiPhone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Toll-Free Number</p>
                                        <p className="text-xs font-bold text-slate-700 mt-0.5">1800-456-9999</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                                        <FiMessageCircle size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Chat</p>
                                        <p className="text-xs font-bold text-slate-700 mt-0.5">Available Mon-Fri, 9am - 6pm</p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Recent Support Tickets */}
                        <motion.section 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-premium flex-1 flex flex-col"
                        >
                            <h3 className="font-bold text-slate-800 text-base mb-4">Support History</h3>
                            {tickets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 flex-1">
                                    <p className="text-xs text-slate-400 font-semibold text-center">No support tickets created yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                    {tickets.map((ticket) => (
                                        <div key={ticket.id} className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-700 line-clamp-1">{ticket.subject}</h4>
                                            <p className="text-[10px] text-slate-400 font-semibold mt-1">Logged on: {new Date(ticket.created_at).toLocaleDateString('en-GB')}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.section>

                    </div>

                </div>
            </main>
        </DashboardLayout>
    )
}