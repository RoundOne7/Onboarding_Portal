'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { 
    FiUser, FiBell, FiShield, FiSave, FiSettings, 
    FiUsers, FiActivity, FiPlus, FiClock, FiPower 
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('General')
    const [isSaving, setIsSaving] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>({ name: 'System User', email: 'admin@quickcheck.com', role: 'Super Admin' })

    // Database state mappings
    const [brandingSettings, setBrandingSettings] = useState<any>({ organization_name: 'QuickCheck', support_email: 'support@quickcheck.com' })
    const [regionalSettings, setRegionalSettings] = useState<any>({ timezone: 'Asia/Kolkata', language: 'en' })
    const [securitySettings, setSecuritySettings] = useState<any>({ session_timeout_minutes: 30, two_factor_auth: false })
    
    const [alerts, setAlerts] = useState({
        newHospital: true,
        newDoctor: true,
        documentExpiry: false,
    })

    const [teamMembers, setTeamMembers] = useState<any[]>([])
    const [auditLogs, setAuditLogs] = useState<any[]>([])
    const [searchLog, setSearchLog] = useState('')

    useEffect(() => {
        loadSettingsData()

        const usersChannel = supabase.channel('settings-users')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'internal_users' }, () => fetchTeamMembers())
            .subscribe()

        const auditsChannel = supabase.channel('settings-audits')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, () => fetchAuditLogs())
            .subscribe()

        return () => {
            supabase.removeChannel(usersChannel)
            supabase.removeChannel(auditsChannel)
        }
    }, [])

    async function loadSettingsData() {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setCurrentUser({
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Administrator',
                email: user.email || '',
                role: 'Super Admin'
            })
        }

        fetchSettings()
        fetchTeamMembers()
        fetchAuditLogs()
    }

    async function fetchSettings() {
        const { data } = await supabase.from('settings').select('*')
        if (data) {
            data.forEach((s: any) => {
                if (s.key === 'branding') setBrandingSettings(s.value)
                if (s.key === 'regional') setRegionalSettings(s.value)
                if (s.key === 'security') setSecuritySettings(s.value)
            })
        }
    }

    async function fetchTeamMembers() {
        const { data, error } = await supabase
            .from('internal_users')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setTeamMembers(data)
        }
    }

    async function fetchAuditLogs() {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setAuditLogs(data)
        }
    }

    const handleSaveSettings = async () => {
        setIsSaving(true)
        try {
            const { error } = await supabase.from('settings').upsert([
                { key: 'branding', value: brandingSettings },
                { key: 'regional', value: regionalSettings },
                { key: 'security', value: securitySettings }
            ])
            if (error) throw error

            // Log save activity
            await supabase.from('audit_logs').insert([{
                user_email: currentUser.email,
                action: 'Updated system security and branding settings configurations',
                ip_address: 'Client Connection'
            }])

            alert('Settings saved successfully!')
        } catch (e: any) {
            alert(e.message || 'Failed to save settings.')
        } finally {
            setIsSaving(false)
        }
    }

    const inviteMember = async () => {
        const email = prompt('Enter email address of the team member to invite:')
        if (!email) return
        const role = prompt('Enter role (Super Admin, Verifier, Operator, Support):', 'Verifier')
        if (!role) return

        const { error } = await supabase
            .from('internal_users')
            .insert([{ email, role, is_active: true }])

        if (error) {
            alert(error.message)
        } else {
            alert('Team member added successfully!')
            fetchTeamMembers()
        }
    }

    const toggleMemberStatus = async (member: any) => {
        const { error } = await supabase
            .from('internal_users')
            .update({ is_active: !member.is_active })
            .eq('id', member.id)

        if (error) {
            alert(error.message)
        } else {
            fetchTeamMembers()
        }
    }

    const filteredAuditLogs = auditLogs.filter(log => 
        log.action?.toLowerCase().includes(searchLog.toLowerCase()) ||
        log.user_email?.toLowerCase().includes(searchLog.toLowerCase())
    )

    const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
        <button 
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#0066FF]' : 'bg-gray-200'}`}
        >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    )

    return (
        <DashboardLayout>
            <main className="w-full flex-1 px-8 pt-6 pb-8 text-[#0B1528] h-full overflow-y-auto bg-[#f5f7fb]">
                
                {/* --- HEADER --- */}
                <section className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="min-w-[36px] w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/10">
                            <FiSettings className="text-[22px]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Control Center</h1>
                            <p className="text-xs text-[#889ABF] mt-2 font-bold">
                                Dashboard &gt; <span className="text-[#2B3E64]">Settings</span>
                            </p>
                        </div>
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FiSave size={16} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                </section>

                {/* --- TAB NAVIGATION --- */}
                <section className="flex items-center gap-3 mb-6 overflow-x-auto pb-1 border-b border-[#EAEEF6]">
                    {['General', 'Security & Alerts', 'Team Management', 'Audit Logs'].map((tab) => {
                        const active = activeTab === tab
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-4 py-3.5 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                                    active ? 'text-[#0066FF]' : 'text-[#889ABF] hover:text-slate-700'
                                }`}
                            >
                                <span className="relative z-10">{tab}</span>
                                {active && (
                                    <motion.div
                                        layoutId="activeSettingsTabBorder"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]"
                                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                    />
                                )}
                            </button>
                        )
                    })}
                </section>

                {/* --- TAB CONTENT AREAS --- */}
                <div className="max-w-6xl">
                    <AnimatePresence mode="wait">
                        {/* 1. GENERAL TAB (Profile & Branding) */}
                        {activeTab === 'General' && (
                            <motion.div
                                key="General"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-6"
                            >
                                <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-6 border-b border-[#EAEEF6] pb-4">
                                        <FiUser className="text-[#0066FF]" size={20} />
                                        <h2 className="text-lg font-bold text-slate-800">My Profile</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Full Name</label>
                                            <input type='text' readOnly value={currentUser.name} className="w-full border border-slate-100 px-4 py-3 rounded-xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed font-semibold" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Email Address</label>
                                            <input type='email' readOnly value={currentUser.email} className="w-full border border-slate-100 px-4 py-3 rounded-xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed font-semibold" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Role</label>
                                            <input type='text' disabled defaultValue='Super Admin' className="w-full border border-slate-100 px-4 py-3 rounded-xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed font-semibold" />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-6 border-b border-[#EAEEF6] pb-4">
                                        <FiSettings className="text-[#0066FF]" size={20} />
                                        <h2 className="text-lg font-bold text-slate-800">Portal Branding</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Organization Name</label>
                                            <input 
                                                type='text' 
                                                value={brandingSettings.organization_name || ''} 
                                                onChange={(e) => setBrandingSettings({ ...brandingSettings, organization_name: e.target.value })}
                                                className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Support Email Address</label>
                                            <input 
                                                type='email' 
                                                value={brandingSettings.support_email || ''} 
                                                onChange={(e) => setBrandingSettings({ ...brandingSettings, support_email: e.target.value })}
                                                className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800" 
                                            />
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {/* 2. SECURITY & ALERTS TAB */}
                        {activeTab === 'Security & Alerts' && (
                            <motion.div
                                key="Security"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                            >
                                <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm h-fit">
                                    <div className="flex items-center gap-2 mb-6 border-b border-[#EAEEF6] pb-4">
                                        <FiShield className="text-[#0066FF]" size={20} />
                                        <h2 className="text-lg font-bold text-slate-800">Access Security</h2>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <div className="pr-4">
                                                <p className="text-sm font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
                                                <p className="text-xs text-[#889ABF] mt-1 font-semibold">Require an extra security code when logging in.</p>
                                            </div>
                                            <Toggle checked={securitySettings.two_factor_auth || false} onChange={() => setSecuritySettings({...securitySettings, two_factor_auth: !securitySettings.two_factor_auth})} />
                                        </div>

                                        <hr className="border-[#EAEEF6]" />

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Session Timeout</label>
                                            <p className="text-xs text-[#889ABF] mb-3 font-semibold">Automatically log out after inactivity.</p>
                                            <select 
                                                value={securitySettings.session_timeout_minutes || 30}
                                                onChange={(e) => setSecuritySettings({...securitySettings, session_timeout_minutes: parseInt(e.target.value)})}
                                                className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 bg-white"
                                            >
                                                <option value="15">15 Minutes</option>
                                                <option value="30">30 Minutes</option>
                                                <option value="60">1 Hour</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm h-fit">
                                    <div className="flex items-center gap-2 mb-6 border-b border-[#EAEEF6] pb-4">
                                        <FiBell className="text-[#0066FF]" size={20} />
                                        <h2 className="text-lg font-bold text-slate-800">Email Alerts</h2>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <div className="pr-4">
                                                <p className="text-sm font-bold text-slate-800">New Hospital Applications</p>
                                                <p className="text-[11px] text-[#889ABF] mt-1 font-semibold">Get notified when a hospital submits documents.</p>
                                            </div>
                                            <Toggle checked={alerts.newHospital} onChange={() => setAlerts({...alerts, newHospital: !alerts.newHospital})} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="pr-4">
                                                <p className="text-sm font-bold text-slate-800">New Doctor Registrations</p>
                                                <p className="text-[11px] text-[#889ABF] mt-1 font-semibold">Alerts for new doctor profile creations.</p>
                                            </div>
                                            <Toggle checked={alerts.newDoctor} onChange={() => setAlerts({...alerts, newDoctor: !alerts.newDoctor})} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="pr-4">
                                                <p className="text-sm font-bold text-slate-800">Document Expiry Alerts</p>
                                                <p className="text-[11px] text-[#889ABF] mt-1 font-semibold">Weekly warnings for expiring medical licenses.</p>
                                            </div>
                                            <Toggle checked={alerts.documentExpiry} onChange={() => setAlerts({...alerts, documentExpiry: !alerts.documentExpiry})} />
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {/* 3. TEAM MANAGEMENT TAB */}
                        {activeTab === 'Team Management' && (
                            <motion.div
                                key="Team"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                            >
                                <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6 border-b border-[#EAEEF6] pb-4">
                                        <div className="flex items-center gap-2">
                                            <FiUsers className="text-[#0066FF]" size={20} />
                                            <h2 className="text-lg font-bold text-slate-800">Staff Members</h2>
                                        </div>
                                        <button 
                                            onClick={inviteMember}
                                            className="h-9 px-4 rounded-lg bg-blue-50 text-[#0066FF] text-xs font-bold flex items-center gap-2 hover:bg-blue-100 transition-all cursor-pointer"
                                        >
                                            <FiPlus size={14} /> Invite Member
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto w-full">
                                        <table className="w-full text-sm whitespace-nowrap">
                                            <thead className="bg-[#FCFDFF] border-b border-[#EAEEF6] text-[#889ABF]">
                                                <tr>
                                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider">User</th>
                                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider">Role</th>
                                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider">Status</th>
                                                    <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {teamMembers.map((member) => (
                                                    <tr key={member.id} className="border-b border-gray-50 last:border-0 hover:bg-[#FAFBFF] transition-colors">
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-slate-800">{member.email.split('@')[0]}</span>
                                                                <span className="text-xs text-slate-500 font-semibold mt-0.5">{member.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm font-bold text-slate-600">{member.role}</td>
                                                        <td className="px-4 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${member.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                {member.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-right text-sm">
                                                            <button 
                                                                onClick={() => toggleMemberStatus(member)}
                                                                className={`font-bold hover:underline cursor-pointer ${member.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                                                            >
                                                                {member.is_active ? 'Deactivate' : 'Activate'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {/* 4. AUDIT LOGS TAB */}
                        {activeTab === 'Audit Logs' && (
                            <motion.div
                                key="Audit"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                            >
                                <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6 border-b border-[#EAEEF6] pb-4 gap-4 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <FiActivity className="text-[#0066FF]" size={20} />
                                            <h2 className="text-lg font-bold text-slate-800">System Activity Log</h2>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="text" 
                                                placeholder="Search log..." 
                                                value={searchLog}
                                                onChange={(e) => setSearchLog(e.target.value)}
                                                className="border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                                        {filteredAuditLogs.length === 0 ? (
                                            <p className="text-xs text-slate-400 font-semibold py-4 text-center">No matching activities found.</p>
                                        ) : (
                                            filteredAuditLogs.map((log) => (
                                                <motion.div 
                                                    key={log.id} 
                                                    whileHover={{ x: 4 }}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-gray-50/50 hover:bg-gray-50 transition-all gap-3"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200/80 flex items-center justify-center shrink-0 text-gray-400 mt-0.5 shadow-sm">
                                                            <FiClock size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">{log.action}</p>
                                                            <p className="text-xs text-slate-500 mt-0.5 font-semibold">
                                                                Performed by <span className="font-bold text-slate-700">{log.user_email}</span> • IP: {log.ip_address || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs font-bold text-[#889ABF] whitespace-nowrap">
                                                        {new Date(log.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </DashboardLayout>
    )
}