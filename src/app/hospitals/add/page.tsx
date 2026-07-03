'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db, storage, ref as dbRef, push, get, query as dbQuery, orderByChild, equalTo } from '../../../lib/firebase'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { FiUploadCloud } from 'react-icons/fi'
import { FaQuestion } from 'react-icons/fa'

export default function AddHospitalPage() {
    const router = useRouter()

    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

    // Form States
    const [name, setName] = useState('')
    const [hospitalType, setHospitalType] = useState('')
    const [registrationNumber, setRegistrationNumber] = useState('')
    const [yearOfEstablishment, setYearOfEstablishment] = useState('')
    const [numberOfBeds, setNumberOfBeds] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [website, setWebsite] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [adminName, setAdminName] = useState('')
    const [adminEmail, setAdminEmail] = useState('')
    const [adminPhone, setAdminPhone] = useState('')

    const [registrationCert, setRegistrationCert] = useState<File | null>(null)
    const [complianceDoc, setComplianceDoc] = useState<File | null>(null)

    const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

    // Load draft from localStorage on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('hospital_onboarding_draft')
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft)
                if (confirm('A draft of your onboarding form was found. Do you want to resume?')) {
                    setName(draft.name || '')
                    setHospitalType(draft.hospitalType || '')
                    setRegistrationNumber(draft.registrationNumber || '')
                    setYearOfEstablishment(draft.yearOfEstablishment || '')
                    setNumberOfBeds(draft.numberOfBeds || '')
                    setEmail(draft.email || '')
                    setPhone(draft.phone || '')
                    setWebsite(draft.website || '')
                    setAddress(draft.address || '')
                    setCity(draft.city || '')
                    setState(draft.state || '')
                    setZipCode(draft.zipCode || '')
                    setAdminName(draft.adminName || '')
                    setAdminEmail(draft.adminEmail || '')
                    setAdminPhone(draft.adminPhone || '')
                    setCurrentStep(draft.currentStep || 1)
                } else {
                    localStorage.removeItem('hospital_onboarding_draft')
                }
            } catch (e) {
                console.error('Failed to parse draft:', e)
            }
        }
    }, [])

    // Autosave draft on step change
    const saveDraft = (step: number) => {
        const draft = {
            name, hospitalType, registrationNumber, yearOfEstablishment, numberOfBeds,
            email, phone, website, address, city, state, zipCode,
            adminName, adminEmail, adminPhone, currentStep: step
        }
        localStorage.setItem('hospital_onboarding_draft', JSON.stringify(draft))
    }

    const checkDuplicateRegistration = async (regNum: string) => {
        try {
            const hospRef = dbRef(db, 'hospitals')
            const q = dbQuery(hospRef, orderByChild('registration_number'), equalTo(regNum))
            const snapshot = await get(q)
            return snapshot.exists()
        } catch (e) {
            console.error('Duplicate check failed:', e)
            return false
        }
    }

    const handleNextStep = async () => {
        if (currentStep === 1) {
            if (!name || !hospitalType || !registrationNumber) {
                alert('Please fill the required Basic Information fields (*)')
                return
            }

            if (name.length < 3) {
                alert('Hospital name must be at least 3 letters')
                return
            }

            setLoading(true)
            const isDuplicate = await checkDuplicateRegistration(registrationNumber)
            setLoading(false)
            if (isDuplicate) {
                alert('This registration number is already registered in the system.')
                return
            }
        }

        if (currentStep === 2) {
            if (!email || !phone) {
                alert('Please fill the required Contact fields (*)')
                return
            }

            if (!isValidEmail(email)) {
                alert('Please enter a valid official email address')
                return
            }

            if (phone.length !== 10) {
                alert('Phone number must be exactly 10 digits')
                return
            }

            if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
                alert('Website must start with http:// or https://')
                return
            }
        }

        if (currentStep === 3) {
            if (!address || !city || !state || !zipCode) {
                alert('Please fill the required Address fields (*)')
                return
            }

            if (zipCode.length !== 6) {
                alert('Pin code must be exactly 6 digits')
                return
            }
        }

        if (currentStep === 5) {
            if (!adminName || !adminEmail) {
                alert('Please fill the required Admin fields (*)')
                return
            }

            if (!isValidEmail(adminEmail)) {
                alert('Please enter a valid admin email address')
                return
            }

            if (adminPhone && adminPhone.length !== 10) {
                alert('Admin phone number must be exactly 10 digits')
                return
            }
        }

        const nextStep = currentStep + 1
        setCurrentStep(nextStep)
        saveDraft(nextStep)
    }

    const handlePrevStep = () => {
        if (currentStep > 1) {
            const prevStep = currentStep - 1
            setCurrentStep(prevStep)
            saveDraft(prevStep)
        } else {
            router.push('/hospitals')
        }
    }

    const uploadFile = (file: File, folder: string, onProgress: (pct: number) => void) => {
        return new Promise<string>((resolve, reject) => {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const sRef = storageRef(storage, `hospital-docs/${folder}/${fileName}`)
            
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
            let regCertPath = ''
            let compDocPath = ''

            const uploadPromises = []

            if (registrationCert) {
                uploadPromises.push(
                    uploadFile(registrationCert, 'registration', (pct) => {
                        setUploadProgress(prev => ({ ...prev, [registrationCert.name]: pct }))
                    }).then(path => { regCertPath = path })
                )
            }
            if (complianceDoc) {
                uploadPromises.push(
                    uploadFile(complianceDoc, 'compliance', (pct) => {
                        setUploadProgress(prev => ({ ...prev, [complianceDoc.name]: pct }))
                    }).then(path => { compDocPath = path })
                )
            }

            if (uploadPromises.length > 0) {
                await Promise.all(uploadPromises)
            }

            const newHospRef = dbRef(db, 'hospitals')
            const addedRef = await push(newHospRef, {
                name,
                hospital_type: hospitalType,
                registration_number: registrationNumber,
                year_established: parseInt(yearOfEstablishment || '0') || null,
                number_of_beds: parseInt(numberOfBeds || '0') || null,
                email,
                phone,
                website,
                address,
                city,
                state,
                zip_code: zipCode,
                admin_name: adminName,
                admin_email: adminEmail,
                admin_phone: adminPhone,
                is_active: false,
                created_at: new Date().toISOString(),
                registration_cert_url: regCertPath,
                compliance_doc_url: compDocPath
            })

            // Log upload & create action in audit_logs
            const userEmail = auth.currentUser?.email || 'System'
            await push(dbRef(db, 'audit_logs'), {
                user_email: userEmail,
                action: `Onboarded Hospital: ${name} (Reg: ${registrationNumber})`,
                affected_table: 'hospitals',
                affected_id: addedRef.key,
                ip_address: 'Client Connection',
                user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
                created_at: new Date().toISOString()
            })

            // Clear draft
            localStorage.removeItem('hospital_onboarding_draft')

            alert('Hospital completely added successfully!')
            router.push('/hospitals')
        } catch (err: any) {
            alert(err.message || 'An error occurred during submission.')
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { id: 1, label: 'Basic Information' },
        { id: 2, label: 'Contact Details' },
        { id: 3, label: 'Address Information' },
        { id: 4, label: 'Documents' },
        { id: 5, label: 'Admin Details' },
        { id: 6, label: 'Review & Submit' }
    ]

    const renderFormContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Hospital Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter hospital name"
                                value={name}
                                maxLength={60}
                                onChange={(e) => {
                                    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                                    setName(filtered)
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Hospital Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={hospitalType}
                                onChange={(e) => setHospitalType(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white hover:scale-102"
                            >
                                <option value="">Select type</option>
                                <option value="General">General Hospital</option>
                                <option value="Specialty">Specialty Clinic</option>
                                <option value="Multi-Specialty">Multi-Specialty</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Registration Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter registration number"
                                value={registrationNumber}
                                maxLength={20}
                                onChange={(e) => {
                                    const formatted = e.target.value
                                        .toUpperCase()
                                        .replace(/[^A-Z0-9/-]/g, '')
                                    setRegistrationNumber(formatted)
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Year of Establishment
                            </label>
                            <select
                                value={yearOfEstablishment}
                                onChange={(e) => setYearOfEstablishment(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white hover:scale-102"
                            >
                                <option value="">Select year</option>
                                {Array.from(
                                    { length: new Date().getFullYear() - 1949 },
                                    (_, i) => new Date().getFullYear() - i
                                ).map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Number of Beds
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Enter number of beds"
                                value={numberOfBeds}
                                maxLength={5}
                                onChange={(e) => {
                                    const onlyNumbers = e.target.value.replace(/\D/g, '')
                                    setNumberOfBeds(onlyNumbers)
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:scale-102"
                            />
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Official Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="contact@hospital.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value.replace(/\s/g, ''))
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <div className="flex items-center justify-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium text-slate-600">
                                    +91
                                </div>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    placeholder="9876543210"
                                    value={phone}
                                    onChange={(e) => {
                                        const onlyDigits = e.target.value.replace(/\D/g, '')
                                        setPhone(onlyDigits)
                                    }}
                                    className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                placeholder="https://www.hospitalwebsite.com"
                                value={website}
                                onChange={(e) => {
                                    setWebsite(e.target.value.replace(/\s/g, ''))
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                            />
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Street Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Full hospital address"
                                rows={3}
                                value={address}
                                maxLength={150}
                                onChange={(e) => {
                                    const filtered = e.target.value.replace(/[^a-zA-Z0-9\s,./#-]/g, '')
                                    setAddress(filtered)
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Mumbai"
                                value={city}
                                maxLength={40}
                                onChange={(e) => {
                                    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                                    setCity(filtered)
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                State <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Maharashtra"
                                value={state}
                                maxLength={40}
                                onChange={(e) => {
                                    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                                    setState(filtered)
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Zip / Pin Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                placeholder="400001"
                                value={zipCode}
                                onChange={(e) => {
                                    const onlyNumbers = e.target.value.replace(/\D/g, '')
                                    setZipCode(onlyNumbers)
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                            />
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="md:col-span-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                            <FiUploadCloud size={32} className={`${registrationCert ? 'text-green-500' : 'text-blue-500'} mb-3 transition-colors`} />
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                                {registrationCert ? 'Registration Certificate Selected' : 'Upload Hospital Registration Certificate'}
                            </p>

                            {registrationCert ? (
                                <p className="text-xs text-green-600 mb-4 font-medium">{registrationCert.name}</p>
                            ) : (
                                <p className="text-xs text-gray-500 mb-4">PDF, JPG or PNG (Max 5MB)</p>
                            )}

                            <label className="bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 cursor-pointer transition-colors">
                                {registrationCert ? 'Change File' : 'Select File'}
                                <input
                                    type="file"
                                    accept=".pdf, .jpg, .jpeg, .png"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setRegistrationCert(e.target.files[0])
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        <div className="md:col-span-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                            <FiUploadCloud size={32} className={`${complianceDoc ? 'text-green-500' : 'text-blue-500'} mb-3 transition-colors`} />
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                                {complianceDoc ? 'Compliance Document Selected' : 'Upload Compliance/License Documents'}
                            </p>

                            {complianceDoc ? (
                                <p className="text-xs text-green-600 mb-4 font-medium">{complianceDoc.name}</p>
                            ) : (
                                <p className="text-xs text-gray-500 mb-4">PDF, JPG or PNG (Max 5MB)</p>
                            )}

                            <label className="bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 cursor-pointer transition-colors">
                                {complianceDoc ? 'Change File' : 'Select File'}
                                <input
                                    type="file"
                                    accept=".pdf, .jpg, .jpeg, .png"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setComplianceDoc(e.target.files[0])
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Admin Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter admin full name"
                                value={adminName}
                                maxLength={60}
                                onChange={(e) => {
                                    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                                    setAdminName(filtered)
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Admin Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="admin@hospital.com"
                                value={adminEmail}
                                onChange={(e) => {
                                    setAdminEmail(e.target.value.replace(/\s/g, ''))
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Admin Phone Number
                            </label>
                            <div className="flex gap-2">
                                <div className="flex items-center justify-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium text-slate-600">
                                    +91
                                </div>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    placeholder="9876543210"
                                    value={adminPhone}
                                    onChange={(e) => {
                                        const onlyDigits = e.target.value.replace(/\D/g, '')
                                        setAdminPhone(onlyDigits)
                                    }}
                                    className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 6:
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
                                : 'Please ensure all information is correct before submitting the hospital profile to the database.'}
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
                                H
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                    Quick<span className="text-blue-600">Check</span>
                                </h1>
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
                            <h1 className="text-2xl font-bold text-slate-800 mb-2">Add Hospital</h1>
                            <div className="text-xs text-gray-500 flex gap-2 font-medium">
                                <span>Dashboard</span>
                                <span>›</span>
                                <span>Hospitals</span>
                                <span>›</span>
                                <span className="text-gray-400">Add Hospital</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full min-h-[400px]">
                            <h2 className="text-lg font-bold text-slate-800 mb-6">
                                {steps[currentStep - 1].label}
                            </h2>

                            {renderFormContent()}
                        </div>

                        <div className="flex justify-between items-center mt-8 w-full">
                            <button
                                onClick={handlePrevStep}
                                className="px-6 py-2.5 border border-gray-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
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