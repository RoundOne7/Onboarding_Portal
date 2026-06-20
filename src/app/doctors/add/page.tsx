// 'use client'

// import { useEffect, useState } from 'react'

// import { useRouter } from 'next/navigation'

// import DashboardLayout from '../../../components/layout/DashboardLayout'

// import { supabase } from '../../../lib/supabase'

// export default function AddDoctorPage() {

//     const router = useRouter()

//     const [name, setName]
//         = useState('')

//     const [qualificationId,
//         setQualificationId]
//         = useState('')

//     const [qualifications,
//         setQualifications]
//         = useState<any[]>([])

//     const [experienceYears,
//         setExperienceYears]
//         = useState('')

//     const [consultationFee,
//         setConsultationFee]
//         = useState('')

//     const [hospitalId,
//         setHospitalId]
//         = useState('')

//     const [specializationId,
//         setSpecializationId]
//         = useState('')

//     const [hospitals,
//         setHospitals]
//         = useState<any[]>([])

//     const [specializations,
//         setSpecializations]
//         = useState<any[]>([])

//     const [loading, setLoading]
//         = useState(false)

//     useEffect(() => {

//         fetchQualifications()

//         fetchHospitals()

//         fetchSpecializations()

//     }, [])

//     async function fetchHospitals() {

//         const { data }
//             = await supabase

//                 .from('hospitals')

//                 .select('*')

//         if (data) {

//             setHospitals(data as any[])
//         }
//     }

//     async function fetchQualifications() {

//         const { data }
//             = await supabase

//                 .from('qualifications')

//                 .select('*')

//         if (data) {

//             setQualifications(data as any[])
//         }
//     }

//     async function fetchSpecializations() {

//         const { data }
//             = await supabase

//                 .from('specializations')

//                 .select('*')

//         if (data) {

//             setSpecializations(data as any[])
//         }
//     }

//     async function handleSubmit() {

//         if (
//             !name ||
//             !qualificationId ||
//             !experienceYears ||
//             !consultationFee ||
//             !hospitalId ||
//             !specializationId
//         ) {

//             alert(
//                 'Please fill all fields'
//             )

//             return
//         }

//         setLoading(true)

//         const { error }
//             = await supabase

//                 .from('doctors')

//                 .insert([
//                     {
//                         name: `Dr. ${name}`,

//                         qualification_id:
//                             qualificationId,

//                         experience_years:
//                             parseInt(
//                                 experienceYears
//                             ),

//                         consultation_fee:
//                             parseFloat(
//                                 consultationFee
//                             ),

//                         hospital_id:
//                             hospitalId,

//                         specialization_id:
//                             specializationId,

//                         is_active: true
//                     }
//                 ])

//         setLoading(false)

//         if (error) {

//             alert(error.message)

//             return
//         }

//         alert(
//             'Doctor added successfully'
//         )

//         router.push('/doctors')
//     }

//     return (

//         <DashboardLayout>

//             <div
//                 className='
//         max-w-3xl
//         mx-auto
//       '>
//                 <button

//                     onClick={() =>
//                         window.history.back()
//                     }

//                     className='
//                 mb-6
//                 bg-black
//                 text-white
//                 px-5
//                 py-2
//                 rounded-xl
//                 font-semibold
//             '
//                 >

//                     ← Back

//                 </button>

//                 <div className='mb-8'>

//                     <h1
//                         className='
//             text-4xl
//             font-bold
//           '>

//                         Add Doctor

//                     </h1>

//                     <p className='text-gray-500'>

//                         Onboard a new doctor

//                     </p>

//                 </div>

//                 <div
//                     className='
//           bg-white
//           rounded-2xl
//           p-8
//           border
//           shadow-sm
//           space-y-6
//         '>

//                     <input
//                         type='text'

//                         placeholder='Doctor Name'

//                         value={name}

//                         onChange={(e) => {

//                             const filtered =
//                                 e.target.value.replace(
//                                     /[^a-zA-Z ]/g,
//                                     ''
//                                 )

//                             setName(filtered)
//                         }}

//                         className='
//             w-full
//             border
//             p-4
//             rounded-xl
//         '
//                     />

//                     <select

//                         value={qualificationId}

//                         onChange={(e) =>
//                             setQualificationId(
//                                 e.target.value
//                             )
//                         }

//                         className='
//   w-full
//   border
//   p-4
//   rounded-xl
// '
//                     >

//                         <option value=''>

//                             Select Qualification

//                         </option>

//                         {
//                             qualifications.map(
//                                 (qualification: any) => (

//                                     <option
//                                         key={qualification.id}
//                                         value={qualification.id}
//                                     >

//                                         {qualification.name}

//                                     </option>

//                                 ))
//                         }

//                     </select>

//                     <input
//                         type='number'

//                         placeholder='Experience (Years)'

//                         value={experienceYears}

//                         max='60'

//                         onChange={(e) => {

//                             const value =
//                                 e.target.value

//                             if (
//                                 Number(value) <= 60
//                             ) {

//                                 setExperienceYears(value)
//                             }
//                         }}

//                         className='
//             w-full
//             border
//             p-4
//             rounded-xl
//         '
//                     />

//                     <input
//                         type='number'

//                         placeholder='Consultation Fee'

//                         value={consultationFee}

//                         onChange={(e) => {

//                             const value =
//                                 e.target.value

//                             if (
//                                 Number(value) <= 10000
//                             ) {

//                                 setConsultationFee(value)
//                             }
//                         }}

//                         className='
//             w-full
//             border
//             p-4
//             rounded-xl
//         '
//                     />

//                     {/* HOSPITAL */}

//                     <select

//                         value={hospitalId}

//                         onChange={(e) =>
//                             setHospitalId(
//                                 e.target.value
//                             )
//                         }

//                         className='
//             w-full
//             border
//             p-4
//             rounded-xl
//           '
//                     >

//                         <option value=''>

//                             Select Hospital

//                         </option>

//                         {
//                             hospitals.map(
//                                 (hospital: any) => (

//                                     <option
//                                         key={hospital.id}
//                                         value={hospital.id}
//                                     >

//                                         {hospital.name}

//                                     </option>

//                                 ))
//                         }

//                     </select>

//                     {/* SPECIALIZATION */}

//                     <select

//                         value={specializationId}

//                         onChange={(e) =>
//                             setSpecializationId(
//                                 e.target.value
//                             )
//                         }

//                         className='
//             w-full
//             border
//             p-4
//             rounded-xl
//           '
//                     >

//                         <option value=''>

//                             Select Specialization

//                         </option>

//                         {
//                             specializations.map(
//                                 (
//                                     specialization: any
//                                 ) => (

//                                     <option
//                                         key={
//                                             specialization.id
//                                         }

//                                         value={
//                                             specialization.id
//                                         }
//                                     >

//                                         {
//                                             specialization.name
//                                         }

//                                     </option>

//                                 ))
//                         }

//                     </select>

//                     <button

//                         onClick={handleSubmit}

//                         disabled={loading}

//                         className='
//             w-full
//             bg-black
//             text-white
//             p-4
//             rounded-xl
//             font-semibold
//           '
//                     >

//                         {
//                             loading
//                                 ? 'Saving...'
//                                 : 'Add Doctor'
//                         }

//                     </button>

//                 </div>

//             </div>

//         </DashboardLayout>
//     )
// }

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { supabase } from '../../../lib/supabase'
import { FiUploadCloud } from 'react-icons/fi'
import { FaQuestion } from 'react-icons/fa'

export default function AddDoctorPage() {
    const router = useRouter()

    // --- 1. UI Step State ---
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // --- 2. Form States: Step 1 (Personal Information) ---
    const [fullName, setFullName] = useState('')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null)

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
        const { data } = await supabase.from('hospitals').select('*')
        if (data) setHospitals(data as any[])
    }

    async function fetchQualifications() {
        const { data } = await supabase.from('qualifications').select('*')
        if (data) setQualifications(data as any[])
    }

    async function fetchSpecializations() {
        const { data } = await supabase.from('specializations').select('*')
        if (data) setSpecializations(data as any[])
    }

    // --- NAVIGATION LOGIC ---
    const handleNextStep = () => {
        // Validation for Step 1
        if (currentStep === 1 && (!fullName || !dob || !gender || !email || !phone)) {
            alert('Please fill all required Personal Information fields (*)')
            return
        }

        // Validation for Step 2
        if (currentStep === 2 && (!qualificationId || !specializationId || !experienceYears)) {
            alert('Please fill all required Professional Details fields (*)')
            return
        }

        // Validation for Step 3
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
            router.push('/doctors') // Go back to dashboard if on step 1
        }
    }

    // --- FINAL SUBMISSION LOGIC ---
    async function handleFinalSubmit() {
        setLoading(true)

        // Ensure we format the doctor's name properly before inserting
        const { error } = await supabase.from('doctors').insert([{
            name: `Dr. ${fullName}`,
            qualification_id: qualificationId,
            experience_years: parseInt(experienceYears || '0'),
            consultation_fee: parseFloat(consultationFee || '0'),
            hospital_id: hospitalId,
            specialization_id: specializationId,
            is_active: true
            // Note: You will need to add email, phone, gender, and dob columns to your doctors table!
        }])

        setLoading(false)

        if (error) {
            alert(error.message)
            return
        }

        alert('Doctor completely added successfully!')
        router.push('/doctors')
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
                        {/* Full Name */}
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type='text' 
                                placeholder='Enter full name' 
                                value={fullName} 
                                onChange={(e) => {
                                    const filtered = e.target.value.replace(/[^a-zA-Z ]/g, '')
                                    setFullName(filtered)
                                }} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-[1.02]" 
                            />
                        </div>

                        {/* Date of Birth */}
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

                        {/* Gender */}
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-semibold text-slate-700 mb-3">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-8">
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="Male" 
                                        checked={gender === 'Male'} 
                                        onChange={(e) => setGender(e.target.value)} 
                                        className="w-4 h-4 text-[#0066FF] border-gray-300 focus:ring-[#0066FF] cursor-pointer" 
                                    />
                                    Male
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="Female" 
                                        checked={gender === 'Female'} 
                                        onChange={(e) => setGender(e.target.value)} 
                                        className="w-4 h-4 text-[#0066FF] border-gray-300 focus:ring-[#0066FF] cursor-pointer" 
                                    />
                                    Female
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="Other" 
                                        checked={gender === 'Other'} 
                                        onChange={(e) => setGender(e.target.value)} 
                                        className="w-4 h-4 text-[#0066FF] border-gray-300 focus:ring-[#0066FF] cursor-pointer" 
                                    />
                                    Other
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="Prefer not to say" 
                                        checked={gender === 'Prefer not to say'} 
                                        onChange={(e) => setGender(e.target.value)} 
                                        className="w-4 h-4 text-[#0066FF] border-gray-300 focus:ring-[#0066FF] cursor-pointer" 
                                    />
                                    Prefer not to say
                                </label>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type='email' 
                                placeholder='Enter email' 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-[1.02]" 
                            />
                        </div>

                        {/* Phone Number */}
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
                                    onChange={(e) => {
                                        const onlyDigits = e.target.value.replace(/\D/g, '')
                                        setPhone(onlyDigits)
                                    }} 
                                    className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-[1.02]" 
                                />
                            </div>
                        </div>

                        {/* Profile Photo */}
                        <div className="md:col-span-2 mt-2">
                            <label className="block text-[13px] font-semibold text-slate-700 mb-3">Profile Photo</label>
                            <div className="flex flex-col items-start gap-2">
                                <label className="flex items-center gap-2 border border-blue-100 bg-white text-blue-600 px-6 py-2.5 rounded-xl font-medium text-sm shadow-sm hover:bg-blue-50 cursor-pointer transition-colors">
                                    <FiUploadCloud size={18} />
                                    {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                                    <input 
                                        type="file" 
                                        accept=".jpg, .jpeg, .png" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setProfilePhoto(e.target.files[0])
                                            }
                                        }} 
                                    />
                                </label>
                                {profilePhoto ? (
                                    <p className="text-[11px] text-green-600 mt-1 font-medium ml-1">{profilePhoto.name}</p>
                                ) : (
                                    <p className="text-[11px] text-gray-400 mt-1 font-medium ml-1">JPG, PNG (Max. 2MB)</p>
                                )}
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Qualification */}
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Qualification <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={qualificationId} 
                                onChange={(e) => setQualificationId(e.target.value)} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white hover:scale-[1.02]"
                            >
                                <option value=''>Select Qualification</option>
                                {qualifications.map((q: any) => (
                                    <option key={q.id} value={q.id}>{q.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Specialization */}
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Specialization <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={specializationId} 
                                onChange={(e) => setSpecializationId(e.target.value)} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white hover:scale-[1.02]"
                            >
                                <option value=''>Select Specialization</option>
                                {specializations.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Experience (Years) <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type='text' 
                                inputMode="numeric" 
                                pattern="[0-9]*" 
                                maxLength={2}
                                placeholder='e.g. 5' 
                                value={experienceYears} 
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if (Number(value) <= 60) {
                                        setExperienceYears(value)
                                    }
                                }} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-[1.02]" 
                            />
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Hospital */}
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Primary Hospital Assignment <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={hospitalId} 
                                onChange={(e) => setHospitalId(e.target.value)} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white hover:scale-[1.02]"
                            >
                                <option value=''>Select Hospital</option>
                                {hospitals.map((h: any) => (
                                    <option key={h.id} value={h.id}>{h.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Consultation Fee */}
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                Consultation Fee (₹) <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type='text' 
                                inputMode="numeric" 
                                pattern="[0-9]*"
                                placeholder='e.g. 500' 
                                value={consultationFee} 
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if (Number(value) <= 10000) {
                                        setConsultationFee(value)
                                    }
                                }} 
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-[1.02]" 
                            />
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Medical License */}
                        <div className="md:col-span-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                            <FiUploadCloud size={32} className={`${medicalLicense ? 'text-green-500' : 'text-blue-500'} mb-3 transition-colors`} />
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                                {medicalLicense ? 'Medical License Selected' : 'Upload Medical License / Registration'}
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
                                        if (e.target.files && e.target.files[0]) {
                                            setMedicalLicense(e.target.files[0])
                                        }
                                    }} 
                                />
                            </label>
                        </div>

                        {/* ID Proof */}
                        <div className="md:col-span-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                            <FiUploadCloud size={32} className={`${idProof ? 'text-green-500' : 'text-blue-500'} mb-3 transition-colors`} />
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                                {idProof ? 'Identity Proof Selected' : 'Upload Government ID Proof'}
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
                                        if (e.target.files && e.target.files[0]) {
                                            setIdProof(e.target.files[0])
                                        }
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
                            <FiUploadCloud size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Submit</h3>
                        <p className="text-slate-500 text-sm text-center max-w-sm mb-6">Please ensure all information is correct before submitting the doctor's profile to the database.</p>
                    </div>
                )
            default:
                return (
                    <div className="py-12 flex items-center justify-center w-full animate-in fade-in duration-300">
                        <p className="text-slate-400 font-medium">Fields for {steps[currentStep - 1].label} will go here.</p>
                    </div>
                )
        }
    }

    return (
            <div className="flex h-full min-h-[80vh] bg-gray-50/30 w-[90%] mx-auto">
                
                {/* ========================================== */}
                {/* LEFT SIDEBAR: Visual Stepper               */}
                {/* ========================================== */}
                <div className="w-64 py-8 pr-8 hidden md:block shrink-0">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg">
                            <FaQuestion className='text-blue-900'/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">Quick<span className="text-teal-400">Check</span></h1>
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

                {/* ========================================== */}
                {/* RIGHT SIDE: Main Form Area                 */}
                {/* ========================================== */}
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

                    {/* Bottom Action Buttons */}
                    <div className="flex justify-between items-center mt-8 w-full">
                        <button 
                            onClick={handlePrevStep}
                            className="px-6 py-2.5 border border-gray-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                        >
                            {currentStep === 1 ? 'Cancel' : '← Back'}
                        </button>
                        
                        {currentStep === steps.length ? (
                            <button 
                                onClick={handleFinalSubmit}
                                disabled={loading}
                                className="px-8 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-green-500/30 flex items-center gap-2 disabled:opacity-70"
                            >
                                {loading ? 'Submitting...' : 'Submit Profile'}
                            </button>
                        ) : (
                            <button 
                                onClick={handleNextStep}
                                className="px-8 py-2.5 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-blue-500/30 flex items-center gap-2"
                            >
                                Next <span>→</span>
                            </button>
                        )}
                    </div>

                </div>
            </div>
    )
}