// 'use client'

// import { FiSettings } from 'react-icons/fi'
// import DashboardLayout
//     from '../../components/layout/DashboardLayout'

// export default function SettingsPage() {

//     return (

//         <DashboardLayout>

//             <main  className='w-full flex-1 px-6 pt-5 pb-6 text-[#0B1528] h-full overflow-y-auto'>

//                 {/* HEADER */}

//                 <div className='mb-8'>

//                     <div className='flex flex-row items-center gap-3'> 
//                                                                         <div className="min-w-[32px] w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xl">
//                                                                                   <FiSettings className="text-lg" />
//                                                                         </div>
//                                                                         <h1 className="text-4xl font-bold text-slate-800">Settings</h1>
//                                                                     </div>

//                     <p className="text-xs text-[#889ABF] mt-1 font-medium">
//                             Dashboard &gt; <span className="text-[#2B3E64]">Settings</span>
//                         </p>

//                 </div>

//                 {/* CONTENT */}

//                 <div
//                     className='
//                         bg-white
//                         rounded-3xl
//                         p-8
//                         border
//                         border-gray-200
//                         shadow-sm
//                     '
//                 >

//                     <h2
//                         className='
//                             text-2xl
//                             font-semibold
//                             mb-6
//                         '
//                     >

//                         General Settings

//                     </h2>

//                     <div className='space-y-6'>

//                         {/* APP NAME */}

//                         <div>

//                             <label
//                                 className='
//                                     block
//                                     text-sm
//                                     font-semibold
//                                     mb-2
//                                 '
//                             >

//                                 Portal Name

//                             </label>

//                             <input
//                                 type='text'
//                                 defaultValue='Doctor Portal'

//                                 className='
//                                     w-full
//                                     border
//                                     border-gray-200
//                                     rounded-2xl
//                                     px-5
//                                     py-4
//                                     outline-none
//                                 '
//                             />

//                         </div>

//                         {/* SUPPORT EMAIL */}

//                         <div>

//                             <label
//                                 className='
//                                     block
//                                     text-sm
//                                     font-semibold
//                                     mb-2
//                                 '
//                             >

//                                 Support Email

//                             </label>

//                             <input
//                                 type='email'
//                                 placeholder='support@example.com'

//                                 className='
//                                     w-full
//                                     border
//                                     border-gray-200
//                                     rounded-2xl
//                                     px-5
//                                     py-4
//                                     outline-none
//                                 '
//                             />

//                         </div>

//                         {/* SAVE */}

//                         <button
//                             className='
//                                 bg-black
//                                 text-white
//                                 px-6
//                                 py-4
//                                 rounded-2xl
//                                 font-semibold
//                             '
//                         >

//                             Save Settings

//                         </button>

//                     </div>

//                 </div>

//             </main>

//         </DashboardLayout>
//     )
// }

'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { 
    FiUser, FiBell, FiShield, FiSave, FiSettings, 
    FiUsers, FiActivity, FiPlus, FiClock 
} from 'react-icons/fi'

export default function SettingsPage() {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('General')
    const [isSaving, setIsSaving] = useState(false)

    // Form States
    const [alerts, setAlerts] = useState({
        newHospital: true,
        newDoctor: true,
        documentExpiry: false,
        weeklyDigest: true,
    })
    
    const [security, setSecurity] = useState({
        twoFactor: false,
        sessionTimeout: '30',
    })

    // Dummy Data for Team Management
    const teamMembers = [
        { id: 1, name: 'System Administrator', email: 'admin@quickcheck.com', role: 'Super Admin', status: 'Active' },
        { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@quickcheck.com', role: 'Data Verifier', status: 'Active' },
        { id: 3, name: 'Dr. Arun Patel', email: 'arun.p@quickcheck.com', role: 'Medical Reviewer', status: 'Pending' },
    ]

    // Dummy Data for Audit Logs
    const auditLogs = [
        { id: 1, action: 'Approved Hospital: City Care', user: 'Sarah Jenkins', time: '10:45 AM, Today', ip: '192.168.1.45' },
        { id: 2, action: 'Updated Security Settings', user: 'System Administrator', time: '09:12 AM, Today', ip: '10.0.0.12' },
        { id: 3, action: 'Rejected Doctor: Profile Incomplete', user: 'Sarah Jenkins', time: '04:30 PM, Yesterday', ip: '192.168.1.45' },
        { id: 4, action: 'Invited new user: Arun Patel', user: 'System Administrator', time: '11:00 AM, Yesterday', ip: '10.0.0.12' },
    ]

    // --- HANDLERS ---
    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            alert("Settings saved successfully!")
        }, 1000)
    }

    // --- HELPER COMPONENTS ---
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
            <main className="w-full flex-1 px-6 pt-5 pb-6 text-[#0B1528] h-full overflow-y-auto bg-[#f8fafc]">
                
                {/* --- HEADER --- */}
                <section className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="min-w-[32px] w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xl shadow-sm">
                            <FiSettings className="text-[22px]" />
                        </div>
                        <div>
                            <h1 className="text-[22px] font-bold text-slate-800">Control Center</h1>
                            <p className="text-xs text-[#889ABF] mt-1 font-medium">
                                Dashboard &gt; <span className="text-[#2B3E64]">Settings</span>
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-10 px-6 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(0,102,255,0.39)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <FiSave size={16} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </section>

                {/* --- TAB NAVIGATION --- */}
                <section className="flex items-center gap-3 mb-6 overflow-x-auto pb-1 border-b border-[#EAEEF6]">
                    {['General', 'Security & Alerts', 'Team Management', 'Audit Logs'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                                activeTab === tab
                                    ? 'border-[#0066FF] text-[#0066FF]'
                                    : 'border-transparent text-[#889ABF] hover:text-slate-700 hover:border-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </section>

                {/* --- TAB CONTENT AREAS --- */}
                <div className="max-w-6xl">
                    
                    {/* 1. GENERAL TAB (Profile) */}
                    {activeTab === 'General' && (
                        <div className="animate-in fade-in duration-300">
                            <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm mb-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-[#EAEEF6] pb-4">
                                    <FiUser className="text-[#0066FF]" size={20} />
                                    <h2 className="text-lg font-bold text-slate-800">My Profile</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input type='text' defaultValue='System Administrator' className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                        <input type='email' defaultValue='admin@quickcheck.com' className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                                        <input type='text' disabled defaultValue='Super Admin' className="w-full border border-gray-100 px-4 py-3 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* 2. SECURITY & ALERTS TAB */}
                    {activeTab === 'Security & Alerts' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
                            {/* Security Settings */}
                            <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm h-fit">
                                <div className="flex items-center gap-2 mb-6 border-b border-[#EAEEF6] pb-4">
                                    <FiShield className="text-[#0066FF]" size={20} />
                                    <h2 className="text-lg font-bold text-slate-800">Access Security</h2>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="pr-4">
                                            <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication (2FA)</p>
                                            <p className="text-xs text-[#889ABF] mt-1">Require an extra security code when logging in.</p>
                                        </div>
                                        <Toggle checked={security.twoFactor} onChange={() => setSecurity({...security, twoFactor: !security.twoFactor})} />
                                    </div>

                                    <hr className="border-[#EAEEF6]" />

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Session Timeout</label>
                                        <p className="text-xs text-[#889ABF] mb-3">Automatically log out after inactivity.</p>
                                        <select 
                                            value={security.sessionTimeout}
                                            onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                                            className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white"
                                        >
                                            <option value="15">15 Minutes</option>
                                            <option value="30">30 Minutes</option>
                                            <option value="60">1 Hour</option>
                                            <option value="never">Never</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Notifications */}
                            <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm h-fit">
                                <div className="flex items-center gap-2 mb-6 border-b border-[#EAEEF6] pb-4">
                                    <FiBell className="text-[#0066FF]" size={20} />
                                    <h2 className="text-lg font-bold text-slate-800">Email Notifications</h2>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="pr-4">
                                            <p className="text-sm font-semibold text-slate-800">New Hospital Applications</p>
                                            <p className="text-[11px] text-[#889ABF] mt-1">Get notified when a hospital submits documents.</p>
                                        </div>
                                        <Toggle checked={alerts.newHospital} onChange={() => setAlerts({...alerts, newHospital: !alerts.newHospital})} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="pr-4">
                                            <p className="text-sm font-semibold text-slate-800">New Doctor Registrations</p>
                                            <p className="text-[11px] text-[#889ABF] mt-1">Alerts for new doctor profile creations.</p>
                                        </div>
                                        <Toggle checked={alerts.newDoctor} onChange={() => setAlerts({...alerts, newDoctor: !alerts.newDoctor})} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="pr-4">
                                            <p className="text-sm font-semibold text-slate-800">Document Expiry Alerts</p>
                                            <p className="text-[11px] text-[#889ABF] mt-1">Weekly warnings for expiring medical licenses.</p>
                                        </div>
                                        <Toggle checked={alerts.documentExpiry} onChange={() => setAlerts({...alerts, documentExpiry: !alerts.documentExpiry})} />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* 3. TEAM MANAGEMENT TAB */}
                    {activeTab === 'Team Management' && (
                        <div className="animate-in fade-in duration-300">
                            <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6 border-b border-[#EAEEF6] pb-4">
                                    <div className="flex items-center gap-2">
                                        <FiUsers className="text-[#0066FF]" size={20} />
                                        <h2 className="text-lg font-bold text-slate-800">Staff Members</h2>
                                    </div>
                                    <button className="h-9 px-4 rounded-lg bg-blue-50 text-[#0066FF] text-xs font-bold flex items-center gap-2 hover:bg-blue-100 transition-colors">
                                        <FiPlus size={14} /> Invite Member
                                    </button>
                                </div>

                                <div className="overflow-x-auto w-full">
                                    <table className="w-full whitespace-nowrap">
                                        <thead>
                                            <tr className="border-b border-[#EAEEF6] bg-[#FCFDFF]">
                                                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#889ABF] uppercase tracking-wider">User</th>
                                                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#889ABF] uppercase tracking-wider">Role</th>
                                                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#889ABF] uppercase tracking-wider">Status</th>
                                                <th className="text-right px-4 py-3 text-[11px] font-bold text-[#889ABF] uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teamMembers.map((member) => (
                                                <tr key={member.id} className="border-b border-gray-50 last:border-0 hover:bg-[#FAFBFF]">
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-800">{member.name}</span>
                                                            <span className="text-xs text-slate-500">{member.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-medium text-slate-600">{member.role}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {member.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right text-sm">
                                                        <button className="text-blue-600 hover:underline font-medium">Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* 4. AUDIT LOGS TAB */}
                    {activeTab === 'Audit Logs' && (
                        <div className="animate-in fade-in duration-300">
                            <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6 border-b border-[#EAEEF6] pb-4">
                                    <div className="flex items-center gap-2">
                                        <FiActivity className="text-[#0066FF]" size={20} />
                                        <h2 className="text-lg font-bold text-slate-800">System Activity Log</h2>
                                    </div>
                                    <button className="h-9 px-4 rounded-lg border border-gray-200 text-slate-600 text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                                        Export Log (CSV)
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {auditLogs.map((log) => (
                                        <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-gray-400 mt-0.5">
                                                    <FiClock size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        Performed by <span className="font-medium text-slate-700">{log.user}</span> • IP: {log.ip}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-xs font-medium text-[#889ABF] whitespace-nowrap">
                                                {log.time}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                </div>
            </main>
        </DashboardLayout>
    )
}