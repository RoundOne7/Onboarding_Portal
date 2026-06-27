'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { FiMail, FiPhone, FiMessageCircle, FiSend, FiCheckCircle, FiHeadphones } from 'react-icons/fi'

export default function SupportPage() {
    const [formData, setFormData] = useState({ subject: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        // Simulate an API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSubmitted(true)
            setFormData({ subject: '', message: '' })
            
            // Reset success message after 3 seconds
            setTimeout(() => setIsSubmitted(false), 3000)
        }, 1500)
    }

    return (
        <DashboardLayout>
            <main className="w-full flex-1 px-6 pt-5 pb-6 text-[#0B1528] h-full overflow-y-auto bg-[#f8fafc]">
                {/* --- HEADER --- */}
                <section className="flex items-start justify-between mb-8">
                    <div>
                        <div className='flex flex-row items-center gap-3'> 
                                                                            <div className="min-w-[32px] w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xl">
                                                                                      <FiHeadphones className="text-lg" />
                                                                            </div>
                                                                            <h1 className="text-4xl font-bold text-slate-800">Contact Support</h1>
                                                                        </div>
                        <p className="text-xs text-[#889ABF] mt-1 font-medium">
                            Dashboard &gt; <span className="text-[#2B3E64]">Contact Support</span>
                        </p>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* --- LEFT COLUMN: CONTACT FORM --- */}
                    <section className="lg:col-span-2 bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-2">Send us a message</h2>
                        <p className="text-sm text-[#889ABF] mb-6">
                            Experiencing an issue with the portal? Fill out the form below and our technical team will get back to you within 24-48 hours.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Issue Subject <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white"
                                >
                                    <option value="">Select a topic...</option>
                                    <option value="login">Login / Authentication Issue</option>
                                    <option value="hospital_onboarding">Hospital Onboarding Error</option>
                                    <option value="doctor_onboarding">Doctor Profile Update</option>
                                    <option value="bug_report">Report a System Bug</option>
                                    <option value="other">Other Inquiry</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Detailed Description <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    required
                                    rows={6}
                                    placeholder="Please describe the issue in detail. Include any error messages you received."
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-none"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-between">
                                {isSubmitted ? (
                                    <div className="flex items-center gap-2 text-green-600 font-medium text-sm animate-in fade-in">
                                        <FiCheckCircle size={18} />
                                        Message sent successfully!
                                    </div>
                                ) : (
                                    <div></div> // Empty div to push button to the right
                                )}
                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="h-12 px-8 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(0,102,255,0.39)] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            <FiSend size={16} />
                                            Submit Ticket
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* --- RIGHT COLUMN: QUICK CONTACTS & FAQ --- */}
                    <div className="flex flex-col gap-6">
                        
                        {/* Direct Contact Cards */}
                        <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
                            <h2 className="text-base font-bold text-slate-800 mb-5">Other ways to connect</h2>
                            
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                                        <FiMail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Email Support</p>
                                        <p className="text-xs text-[#889ABF]">support@quickcheck.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <FiPhone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Call Us (Toll-Free)</p>
                                        <p className="text-xs text-[#889ABF]">1800-123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <FiMessageCircle size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Live Chat</p>
                                        <p className="text-xs text-[#889ABF]">Available 9 AM - 6 PM</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Mini FAQ */}
                        <section className="bg-gradient-to-br from-slate-800 to-[#0B1528] rounded-2xl p-6 shadow-sm text-white">
                            <h2 className="text-base font-bold mb-4">Quick Help</h2>
                            <ul className="flex flex-col gap-3 text-sm text-slate-300">
                                <li className="pb-3 border-b border-slate-700/50">
                                    <strong className="block text-white mb-1">How long does approval take?</strong>
                                    Hospital approvals typically take 24-48 business hours after document verification.
                                </li>
                                <li>
                                    <strong className="block text-white mb-1">File upload limits?</strong>
                                    Certificates and licenses must be under 5MB in PDF, JPG, or PNG format.
                                </li>
                            </ul>
                        </section>
                    </div>

                </div>
            </main>
        </DashboardLayout>
    )
}