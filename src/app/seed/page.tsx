'use client'

import { useState } from 'react'
import { auth, db } from '../../lib/firebase'
import { ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'

export default function SeedPage() {
    const [status, setStatus] = useState<string[]>([])
    const [adminEmail, setAdminEmail] = useState('admn@hospital.com')
    const [password, setPassword] = useState('Paasword')
    const [forceOverwrite, setForceOverwrite] = useState(false)
    const [loading, setLoading] = useState(false)

    const log = (msg: string) => {
        setStatus(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
    }

    const handleSeed = async () => {
        setLoading(true)
        setStatus([])
        log('Starting database seeding process...')

        try {
            // 1. Create Auth User
            log(`Attempting to register Auth user: ${adminEmail}...`)
            try {
                await createUserWithEmailAndPassword(auth, adminEmail, password)
                log(`Successfully registered Auth user: ${adminEmail}`)
            } catch (err: any) {
                if (err.code === 'auth/email-already-in-use') {
                    log(`Auth user ${adminEmail} already exists. (Note: If you are getting 'invalid-credential' on login, delete this user from the Firebase Console first, then seed again to set the password to '${password}')`)
                } else {
                    throw err
                }
            }

            // 2. Add to internal_users Realtime Database registry
            log(`Adding ${adminEmail} to Realtime Database internal_users registry...`)
            const usersRef = ref(db, 'internal_users')
            const qUser = query(usersRef, orderByChild('email'), equalTo(adminEmail))
            const snapshotUser = await get(qUser)
            
            if (!snapshotUser.exists()) {
                await push(ref(db, 'internal_users'), {
                    email: adminEmail,
                    role: 'Super Admin',
                    is_active: true,
                    created_at: new Date().toISOString()
                })
                log(`Added ${adminEmail} to internal_users.`)
            } else {
                log(`${adminEmail} already exists in internal_users registry.`)
            }

            // 3. Seed Qualifications
            log('Seeding qualifications list...')
            const qualifications = ['MBBS', 'MD', 'MS', 'DNB', 'DM', 'MCh']
            const qQual = await get(ref(db, 'qualifications'))
            if (!qQual.exists() || forceOverwrite) {
                if (forceOverwrite) {
                    await set(ref(db, 'qualifications'), null)
                }
                for (const q of qualifications) {
                    await push(ref(db, 'qualifications'), {
                        name: q,
                        created_at: new Date().toISOString()
                    })
                    log(`Seeded qualification: ${q}`)
                }
            } else {
                log('Qualifications collection already populated. Skipping...')
            }

            // 4. Seed Specializations
            log('Seeding specializations list...')
            const specializations = [
                'Veterinary',
                'Eye Specialist',
                'Brain and Nerves',
                'Diet & Nutrition',
                'Mental Wellness',
                'Cancer',
                'Women\'s Health',
                'Skin & Hair',
                'Diabetes Management',
                'Physiotherapy',
                'Heart',
                'Dental Care',
                'General Surgery',
                'Kidney Issue',
                'Digestive Issues',
                'Ear,Nose,Throat',
                'Urinary Issue',
                'General Physician',
                'Lungs and Breathing',
                'Ayurveda',
                'Bone & Joints',
                'Homeopathy',
                'Child Specialist',
                'Sexual Health'
            ]
            const qSpec = await get(ref(db, 'specializations'))
            if (!qSpec.exists() || forceOverwrite) {
                if (forceOverwrite) {
                    await set(ref(db, 'specializations'), null)
                }
                for (const s of specializations) {
                    await push(ref(db, 'specializations'), {
                        name: s,
                        created_at: new Date().toISOString()
                    })
                    log(`Seeded specialization: ${s}`)
                }
            } else {
                log('Specializations collection already populated. Skipping...')
            }

            // 5. Seed default Hospital
            log('Seeding default hospital...')
            const qHosp = await get(ref(db, 'hospitals'))
            if (!qHosp.exists() || forceOverwrite) {
                if (forceOverwrite) {
                    await set(ref(db, 'hospitals'), null)
                }
                await push(ref(db, 'hospitals'), {
                    name: 'Apollo Hospital',
                    hospital_type: 'Multi-Specialty',
                    registration_number: 'HOSP-APOLLO-999',
                    year_established: 1983,
                    number_of_beds: 500,
                    email: 'contact@apollo.com',
                    phone: '9876543210',
                    website: 'https://apollohospitals.com',
                    address: 'Bannerghatta Road',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    zip_code: '560076',
                    admin_name: 'Dr. Pratap Reddy',
                    admin_email: 'admin@apollo.com',
                    admin_phone: '9876543211',
                    is_active: true,
                    created_at: new Date().toISOString()
                })
                log('Seeded Apollo Hospital.')
            } else {
                log('Hospitals collection already populated. Skipping...')
            }

            log('✅ Seeding completed successfully! You can now log in.')

        } catch (e: any) {
            log(`❌ Error: ${e.message || e}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Database Seeding Console
                </h1>
                <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed">
                    Use this console to initialize standard auth records and database collections (specializations, qualifications, default hospital) in your new Firebase instance.
                </p>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Admin Email</label>
                        <input 
                            type="email" 
                            value={adminEmail} 
                            onChange={(e) => setAdminEmail(e.target.value)}
                            className="w-full bg-slate-700/50 border border-slate-600 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-100 outline-none focus:border-blue-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Set Password</label>
                        <input 
                            type="text" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-slate-700/50 border border-slate-600 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-100 outline-none focus:border-blue-500" 
                        />
                    </div>
                    <div className="flex items-center gap-2.5 pt-1">
                        <input 
                            type="checkbox" 
                            id="overwrite"
                            checked={forceOverwrite}
                            onChange={(e) => setForceOverwrite(e.target.checked)}
                            className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                        />
                        <label htmlFor="overwrite" className="text-xs text-slate-300 font-bold select-none cursor-pointer">
                            Force overwrite existing database collections (hospitals, specs, quals)
                        </label>
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={handleSeed}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase transition-colors shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Register & Seed Database'}
                    </button>
                    <Link 
                        href="/" 
                        className="bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center"
                    >
                        Go to Login
                    </Link>
                </div>

                <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4 h-48 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1.5 scrollbar-thin">
                    {status.length === 0 ? (
                        <span className="text-slate-500 italic">Logs will appear here once seeding starts...</span>
                    ) : (
                        status.map((item, index) => <div key={index}>{item}</div>)
                    )}
                </div>
            </div>
        </main>
    )
}
