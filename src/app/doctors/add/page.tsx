'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db, storage, ref as dbRef, push, get, query as dbQuery, orderByChild, equalTo } from '../../../lib/firebase'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { FiUploadCloud } from 'react-icons/fi'
import { FaQuestion } from 'react-icons/fa'

export default function AddDoctorPage() {
    const router = useRouter()

    // --- 1. UI Step State ---
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

    // --- 2. Form States: Step 1 (Personal Information) ---
    const [fullName, setFullName] = useState('')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    // --- 3. Form States: Step 2 & 3 (Professional & Hospital) ---
    const [qualificationId, setQualificationId] = useState('')
    const [experienceYears, setExperienceYears] = useState('')
    const [consultationFee, setConsultationFee] = useState('')
    const [hospitalId, setHospitalId] = useState('')
    const [specializationId, setSpecializationId] = useState('')

    // --- 4. Form States: Step 4 (Documents) ---
    const [medicalLicense, setMedicalLicense] = useState<File | null>(null)
    const [idProof, setIdProof] = useState<File | null>(null)

    // --- Dropdown Data ---
    const [qualifications, setQualifications] = useState<any[]>([])
    const [hospitals, setHospitals] = useState<any[]>([])
    const [specializations, setSpecializations] = useState<any[]>([])

    // --- FETCHING LOGIC ---
    useEffect(() => {
        fetchQualifications()
        fetchHospitals()
        fetchSpecializations()
    }, [])

    async function fetchHospitals() {
        try {
            const snaps = await get(dbRef(db, 'hospitals'))
            const list: any[] = []
            if (snaps.exists()) {
                snaps.forEach((child) => {
                    list.push({ id: child.key, ...child.val() })
                })
            }
            setHospitals(list)
        } catch (e) {
            console.error('Fetch hospitals dropdown failed:', e)
        }
    }

    async function fetchQualifications() {
        try {
            const snaps = await get(dbRef(db, 'qualifications'))
            const list: any[] = []
            if (snaps.exists()) {
                snaps.forEach((child) => {
                    list.push({ id: child.key, ...child.val() })
                })
            }
            setQualifications(list)
        } catch (e) {
            console.error('Fetch qualifications dropdown failed:', e)
        }
    }

    async function fetchSpecializations() {
        try {
            const snaps = await get(dbRef(db, 'specializations'))
            const list: any[] = []
            if (snaps.exists()) {
                snaps.forEach((child) => {
                    list.push({ id: child.key, ...child.val() })
                })
            }
            setSpecializations(list)
        } catch (e) {
            console.error('Fetch specializations dropdown failed:', e)
        }
    }

    // --- NAVIGATION LOGIC ---
    const handleNextStep = () => {
        if (currentStep === 1 && (!fullName || !dob || !gender || !email || !phone)) {
            alert('Please fill all required Personal Information fields (*)')
            return
        }

        if (currentStep === 2 && (!qualificationId || !specializationId || !experienceYears)) {
            alert('Please fill all required Professional Details fields (*)')
            return
        }

        if (currentStep === 3 && (!hospitalId || !consultationFee)) {
            alert('Please fill all required Hospital & Availability fields (*)')
            return
        }
        
        setCurrentStep((prev) => prev + 1)
    }

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        } else {
            router.push('/doctors')
        }
    }

    const uploadFile = (file: File, folder: string, onProgress: (pct: number) => void) => {
        return new Promise<string>((resolve, reject) => {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const sRef = storageRef(storage, `doctor-docs/${folder}/${fileName}`)
            
            const uploadTask = uploadBytesResumable(sRef, file)
            
            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    onProgress(progress)
                }, 
                (error) => {
                    reject(error)
                }, 
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                        resolve(downloadURL)
                    } catch (err) {
                        reject(err)
                    }
                }
            )
        })
    }

    async function handleFinalSubmit() {
        setLoading(true)
        setUploadProgress({})

        try {
            let licensePath = ''
            let proofPath = ''

            const uploadPromises = []

            if (medicalLicense) {
                uploadPromises.push(
                    uploadFile(medicalLicense, 'licenses', (pct) => {
                        setUploadProgress(prev => ({ ...prev, [medicalLicense.name]: pct }))
                    }).then(path => { licensePath = path })
                )
            }
            if (idProof) {
                uploadPromises.push(
                    uploadFile(idProof, 'proofs', (pct) => {
                        setUploadProgress(prev => ({ ...prev, [idProof.name]: pct }))
                    }).then(path => { proofPath = path })
                )
            }

            if (uploadPromises.length > 0) {
                await Promise.all(uploadPromises)
            }

            // Find selected names to store denormalized values
            const selectedQual = qualifications.find(q => q.id === qualificationId)
            const selectedSpec = specializations.find(s => s.id === specializationId)
            const selectedHosp = hospitals.find(h => h.id === hospitalId)

            const newDocRef = dbRef(db, 'doctors')
            const addedRef = await push(newDocRef, {
                name: `Dr. ${fullName}`,
                email,
                phone,
                dob,
                gender,
                qualification_id: qualificationId,
                qualification_name: selectedQual?.name || '',
                experience_years: parseInt(experienceYears || '0'),
                consultation_fee: parseFloat(consultationFee || '0'),
                hospital_id: hospitalId,
                hospital_name: selectedHosp?.name || '',
                hospital_location: selectedHosp ? `${selectedHosp.city || ''}, ${selectedHosp.state || ''}` : '',
                specialization_id: specializationId,
                specialization_name: selectedSpec?.name || '',
                is_active: false,
                created_at: new Date().toISOString(),
                medical_license_url: licensePath,
                id_proof_url: proofPath
            })

            // Log activity to audit logs
            const userEmail = auth.currentUser?.email || 'System'
            await push(dbRef(db, 'audit_logs'), {
                user_email: userEmail,
                action: `Registered Doctor: Dr. ${fullName}`,
                affected_table: 'doctors',
                affected_id: addedRef.key,
                ip_address: 'Client Connection',
                user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
                created_at: new Date().toISOString()
            })

            alert('Doctor completely added successfully!')
            router.push('/doctors')
        } catch (err: any) {
            alert(err.message || 'An error occurred during submission.')
        } finally {
            setLoading(false)
        }
    }

    // --- UI DATA ---
    const steps = [
        { id: 1, label: 'Personal Information' },
        { id: 2, label: 'Professional Details' },
        { id: 3, label: 'Hospital & Availability' },
        { id: 4, label: 'Documents' },
        { id: 5, label: 'Review & Submit' }
    ]

    // --- DYNAMIC FORM RENDERING ---
    const renderFormContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type='text' 
                                placeholder='Enter full name' 
                                value={fullName} 
                                onChange={(e) => {
                                    const filtered = e.target.value.replace(/[^a-zA-Z \-'.]/g, '')
                                    setFullName(filtered)
                                }} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-[1.02]" 
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type='date' 
                                value={dob} 
                                onChange={(e) => setDob(e.target.value)} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:scale-[1.02]" 
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-semibold text-slate-700 mb-3">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-8">
                                {['Male', 'Female', 'Other', 'Prefer not to say'].map((g) => (
                                    <label key={g} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value={g} 
                                            checked={gender === g} 
                                            onChange={(e) => setGender(e.target.value)} 
                                            className="w-4 h-4 text-[#0066FF] border-gray-300 focus:ring-[#0066FF] cursor-pointer" 
                                        />
                                        {g}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type='email' 
                                placeholder='Enter email' 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-[1.02]" 
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <div className="flex items-center justify-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 shrink-0">
                                    <span className="mr-1">🇮🇳</span> +91
                                </div>
                                <input 
                                    type='tel' 
                                    inputMode="numeric" 
                                    pattern="[0-9]*" 
                                    maxLength={10}
                                    placeholder='Enter phone number' 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                                    className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-[1.02]" 
                                />
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Qualification <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={qualificationId} 
                                onChange={(e) => setQualificationId(e.target.value)} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 bg-white hover:scale-[1.02]"
                            >
                                <option value=''>Select qualification</option>
                                {qualifications.map((q) => (
                                    <option key={q.id} value={q.id}>{q.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Specialization <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={specializationId} 
                                onChange={(e) => setSpecializationId(e.target.value)} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 bg-white hover:scale-[1.02]"
                            >
                                <option value=''>Select specialization</option>
                                {specializations.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Years of Experience <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type='text' 
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={2}
                                placeholder='e.g. 8' 
                                value={experienceYears} 
                                onChange={(e) => setExperienceYears(e.target.value.replace(/\D/g, ''))} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-[1.02]" 
                            />
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Assigned Hospital <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={hospitalId} 
                                onChange={(e) => setHospitalId(e.target.value)} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 bg-white hover:scale-[1.02]"
                            >
                                <option value=''>Select hospital</option>
                                {hospitals.map((h) => (
                                    <option key={h.id} value={h.id}>{h.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Consultation Fee (INR) <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type='text' 
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={5}
                                placeholder='e.g. 500' 
                                value={consultationFee} 
                                onChange={(e) => setConsultationFee(e.target.value.replace(/\D/g, ''))} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-[1.02]" 
                            />
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="md:col-span-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                            <FiUploadCloud size={32} className={`${medicalLicense ? 'text-green-500' : 'text-blue-500'} mb-3 transition-colors`} />
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                                {medicalLicense ? 'Medical License Selected' : 'Upload Medical Registration Certificate / License'}
                            </p>
                            {medicalLicense ? (
                                <p className="text-xs text-green-600 mb-4 font-medium">{medicalLicense.name}</p>
                            ) : (
                                <p className="text-xs text-gray-500 mb-4">PDF, JPG or PNG (Max 5MB)</p>
                            )}
                            <label className="bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 cursor-pointer transition-colors">
                                {medicalLicense ? 'Change File' : 'Select File'}
                                <input 
                                    type="file" 
                                    accept=".pdf, .jpg, .jpeg, .png" 
                                    className="hidden" 
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) setMedicalLicense(e.target.files[0])
                                    }} 
                                />
                            </label>
                        </div>

                        <div className="md:col-span-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                            <FiUploadCloud size={32} className={`${idProof ? 'text-green-500' : 'text-blue-500'} mb-3 transition-colors`} />
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                                {idProof ? 'ID Proof Selected' : 'Upload Government ID Proof (Aadhaar / Passport)'}
                            </p>
                            {idProof ? (
                                <p className="text-xs text-green-600 mb-4 font-medium">{idProof.name}</p>
                            ) : (
                                <p className="text-xs text-gray-500 mb-4">PDF, JPG or PNG (Max 5MB)</p>
                            )}
                            <label className="bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 cursor-pointer transition-colors">
                                {idProof ? 'Change File' : 'Select File'}
                                <input 
                                    type="file" 
                                    accept=".pdf, .jpg, .jpeg, .png" 
                                    className="hidden" 
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) setIdProof(e.target.files[0])
                                    }} 
                                />
                            </label>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="flex flex-col items-center justify-center py-10 w-full animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                            <FiUploadCloud size={32} className={loading ? "animate-bounce" : ""} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            {loading ? 'Submitting Profile...' : 'Ready to Submit'}
                        </h3>
                        <p className="text-slate-500 text-sm text-center max-w-sm mb-6">
                            {loading 
                                ? 'Uploading documents and saving details. Please do not close this window.' 
                                : 'Please ensure all information is correct before submitting the doctor registry profile to the database.'}
                        </p>

                        {loading && Object.keys(uploadProgress).length > 0 && (
                            <div className="w-full max-w-md bg-slate-50 border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Document Upload Progress</h4>
                                <div className="space-y-4">
                                    {Object.entries(uploadProgress).map(([fileName, pct]) => (
                                        <div key={fileName} className="text-left">
                                            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                                                <span className="truncate max-w-[280px]">{fileName}</span>
                                                <span className="text-blue-600">{pct}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out" 
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <DashboardLayout>
            <main className="w-full flex-1 px-8 pt-6 pb-8 text-[#0B1528] h-full overflow-y-auto">
                <div className="flex h-full min-h-[80vh] bg-gray-50/30 w-full mx-auto">
                    <div className="w-64 py-8 pr-8 hidden md:block shrink-0">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg text-white font-bold">
                                D
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 leading-tight">Quick<span className="text-blue-600">Check</span></h1>
                                <p className="text-xs text-slate-600 font-semibold">Onboarding Portal</p>
                            </div>
                        </div>

                        <div className="relative">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-start mb-8 relative">
                                    {index !== steps.length - 1 && (
                                        <div className={`absolute top-8 left-[15px] w-[2px] h-12 transition-colors duration-300 ${currentStep > step.id ? 'bg-[#0066FF]' : 'bg-gray-100'}`}></div>
                                    )}
                                    
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 shrink-0 transition-all duration-300 ${
                                        currentStep === step.id ? 'bg-[#0066FF] text-white shadow-md shadow-blue-200 ring-4 ring-blue-50' : 
                                        currentStep > step.id ? 'bg-[#0066FF] text-white' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        {currentStep > step.id ? '✓' : step.id}
                                    </div>
                                    
                                    <div className={`ml-4 mt-1.5 text-sm font-medium transition-colors duration-300 ${
                                        currentStep === step.id ? 'text-[#0066FF] font-bold' : 
                                        currentStep > step.id ? 'text-slate-800' : 'text-gray-400'
                                    }`}>
                                        {step.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 py-8 pl-4 md:pl-8 border-l border-gray-100 w-full overflow-hidden">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-800 mb-2">Add Doctor</h1>
                            <div className="text-xs text-gray-500 flex gap-2 font-medium">
                                <span>Dashboard</span>
                                <span>›</span>
                                <span>Doctors</span>
                                <span>›</span>
                                <span className="text-gray-400">Add Doctor</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full min-h-[400px]">
                            <h2 className="text-lg font-bold text-slate-800 mb-6">{steps[currentStep - 1].label}</h2>
                            {renderFormContent()}
                        </div>

                        <div className="flex justify-between items-center mt-8 w-full">
                            <button 
                                onClick={handlePrevStep}
                                className="px-6 py-2.5 border border-gray-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                {currentStep === 1 ? 'Cancel' : '← Back'}
                            </button>
                            
                            {currentStep === steps.length ? (
                                <button 
                                    onClick={handleFinalSubmit}
                                    disabled={loading}
                                    className="px-8 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-green-500/30 flex items-center gap-2 disabled:opacity-70 cursor-pointer"
                                >
                                    {loading ? 'Submitting...' : 'Submit Profile'}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleNextStep}
                                    className="px-8 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-blue-500/30 flex items-center gap-2 cursor-pointer"
                                >
                                    Next <span>→</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    )
}