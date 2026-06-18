// 'use client'

// import { useState } from 'react'

// import { useRouter } from 'next/navigation'

// import { supabase } from '../../../lib/supabase'

// export default function AddHospitalPage() {

//     const router = useRouter()

//     const [name, setName] =
//         useState('')

//     const [address, setAddress] =
//         useState('')

//     const [city, setCity] =
//         useState('')

//     const [state, setState] =
//         useState('')

//     const [phone, setPhone] =
//         useState('')

//     const [email, setEmail] =
//         useState('')

//     const [loading, setLoading] =
//         useState(false)

//     async function handleAddHospital() {

//         if (
//             !name ||
//             !address ||
//             !city ||
//             !state
//         ) {

//             alert(
//                 'Please fill required fields'
//             )

//             return
//         }

//         setLoading(true)

//         const { error } =
//             await supabase

//                 .from('hospitals')

//                 .insert([
//                     {
//                         name,
//                         address,
//                         city,
//                         state,
//                         phone,
//                         email
//                     }
//                 ])

//         setLoading(false)

//         if (error) {

//             alert(error.message)

//             return
//         }

//         router.push('/hospitals')
//     }

//     return (

//         <main
//             className='
//                 min-h-screen
//                 bg-gray-100
//                 p-8
//             '
//         >

//             <div
//                 className='
//                     max-w-3xl
//                     mx-auto
//                     bg-white
//                     rounded-3xl
//                     shadow-sm
//                     border
//                     border-gray-100
//                     p-10
//                 '
//             >

//                 <div className='mb-10'>

//                     <h1
//                         className='
//                             text-4xl
//                             font-bold
//                             text-gray-900
//                         '
//                     >

//                         Add Hospital

//                     </h1>

//                     <p
//                         className='
//                             text-gray-500
//                             mt-3
//                         '
//                     >

//                         Create a new hospital
//                         or healthcare center

//                     </p>

//                 </div>

//                 <div className='space-y-6'>

//                     <div>

//                         <label
//                             className='
//                                 block
//                                 text-sm
//                                 font-semibold
//                                 text-gray-700
//                                 mb-2
//                             '
//                         >

//                             Hospital Name *

//                         </label>

//                         <input
//                             type='text'

//                             value={name}

//                             onChange={(e) =>
//                                 setName(e.target.value)
//                             }

//                             className='
//                                 w-full
//                                 border
//                                 border-gray-200
//                                 rounded-2xl
//                                 px-5
//                                 py-4
//                                 outline-none
//                                 focus:border-black
//                             '

//                             placeholder='Apollo Hospital'
//                         />

//                     </div>

//                     <div>

//                         <label
//                             className='
//                                 block
//                                 text-sm
//                                 font-semibold
//                                 text-gray-700
//                                 mb-2
//                             '
//                         >

//                             Address *

//                         </label>

//                         <textarea

//                             value={address}

//                             onChange={(e) =>
//                                 setAddress(e.target.value)
//                             }

//                             rows={4}

//                             className='
//                                 w-full
//                                 border
//                                 border-gray-200
//                                 rounded-2xl
//                                 px-5
//                                 py-4
//                                 outline-none
//                                 focus:border-black
//                             '

//                             placeholder='Hospital address'
//                         />

//                     </div>

//                     <div
//                         className='
//                             grid
//                             grid-cols-1
//                             md:grid-cols-2
//                             gap-6
//                         '
//                     >

//                         <div>

//                             <label
//                                 className='
//                                     block
//                                     text-sm
//                                     font-semibold
//                                     text-gray-700
//                                     mb-2
//                                 '
//                             >

//                                 City *

//                             </label>

//                             <input
//                                 type='text'

//                                 value={city}

//                                 onChange={(e) =>
//                                     setCity(e.target.value)
//                                 }

//                                 className='
//                                     w-full
//                                     border
//                                     border-gray-200
//                                     rounded-2xl
//                                     px-5
//                                     py-4
//                                     outline-none
//                                     focus:border-black
//                                 '

//                                 placeholder='Mumbai'
//                             />

//                         </div>

//                         <div>

//                             <label
//                                 className='
//                                     block
//                                     text-sm
//                                     font-semibold
//                                     text-gray-700
//                                     mb-2
//                                 '
//                             >

//                                 State *

//                             </label>

//                             <input
//                                 type='text'

//                                 value={state}

//                                 onChange={(e) =>
//                                     setState(e.target.value)
//                                 }

//                                 className='
//                                     w-full
//                                     border
//                                     border-gray-200
//                                     rounded-2xl
//                                     px-5
//                                     py-4
//                                     outline-none
//                                     focus:border-black
//                                 '

//                                 placeholder='Maharashtra'
//                             />

//                         </div>

//                     </div>

//                     <div
//                         className='
//                             grid
//                             grid-cols-1
//                             md:grid-cols-2
//                             gap-6
//                         '
//                     >

//                         <div>

//                             <label
//                                 className='
//                                     block
//                                     text-sm
//                                     font-semibold
//                                     text-gray-700
//                                     mb-2
//                                 '
//                             >

//                                 Phone

//                             </label>

//                             <input
//                                 type='text'

//                                 value={phone}

//                                 onChange={(e) =>
//                                     setPhone(e.target.value)
//                                 }

//                                 className='
//                                     w-full
//                                     border
//                                     border-gray-200
//                                     rounded-2xl
//                                     px-5
//                                     py-4
//                                     outline-none
//                                     focus:border-black
//                                 '

//                                 placeholder='+91 9876543210'
//                             />

//                         </div>

//                         <div>

//                             <label
//                                 className='
//                                     block
//                                     text-sm
//                                     font-semibold
//                                     text-gray-700
//                                     mb-2
//                                 '
//                             >

//                                 Email

//                             </label>

//                             <input
//                                 type='email'

//                                 value={email}

//                                 onChange={(e) =>
//                                     setEmail(e.target.value)
//                                 }

//                                 className='
//                                     w-full
//                                     border
//                                     border-gray-200
//                                     rounded-2xl
//                                     px-5
//                                     py-4
//                                     outline-none
//                                     focus:border-black
//                                 '

//                                 placeholder='hospital@email.com'
//                             />

//                         </div>

//                     </div>

//                     <button

//                         onClick={handleAddHospital}

//                         disabled={loading}

//                         className='
//                             w-full
//                             bg-black
//                             text-white
//                             py-4
//                             rounded-2xl
//                             font-semibold
//                             text-lg
//                             hover:opacity-90
//                             transition
//                         '
//                     >

//                         {
//                             loading

//                                 ? 'Creating Hospital...'

//                                 : 'Add Hospital'
//                         }

//                     </button>

//                 </div>

//             </div>

//         </main>
//     )
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { FiUploadCloud } from 'react-icons/fi'
import { FaQuestion } from 'react-icons/fa'

export default function AddHospitalPage() {
    const router = useRouter()

    // 1. UI Step State 
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // 2. Form States: Step 1 (Basic Info)
    const [name, setName] = useState('')
    const [hospitalType, setHospitalType] = useState('')
    const [registrationNumber, setRegistrationNumber] = useState('')
    const [yearOfEstablishment, setYearOfEstablishment] = useState('')
    const [numberOfBeds, setNumberOfBeds] = useState('')

    // 3. Form States: Step 2 (Contact Details)
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [website, setWebsite] = useState('')

    // 4. Form States: Step 3 (Address Information)
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')

    // 5. Form States: Step 5 (Admin Details)
    const [adminName, setAdminName] = useState('')
    const [adminEmail, setAdminEmail] = useState('')
    const [adminPhone, setAdminPhone] = useState('')

    // --- NAVIGATION LOGIC ---
    
    // Move to the next screen (Client-side only)
    const handleNextStep = () => {
        // Basic validation for Step 1
        if (currentStep === 1 && (!name || !hospitalType || !registrationNumber)) {
            alert('Please fill the required Basic Information fields (*)')
            return
        }
        
        // Basic validation for Step 2
        if (currentStep === 2 && (!email || !phone)) {
            alert('Please fill the required Contact fields (*)')
            return
        }

        // Basic validation for Step 3
        if (currentStep === 3 && (!address || !city || !state || !zipCode)) {
            alert('Please fill the required Address fields (*)')
            return
        }

        // Basic validation for Step 5
        if (currentStep === 5 && (!adminName || !adminEmail)) {
            alert('Please fill the required Admin fields (*)')
            return
        }

        setCurrentStep((prev) => prev + 1)
    }

    // Move to the previous screen
    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        } else {
            router.push('/hospitals') // Go back to dashboard if on step 1
        }
    }

    // 4. Form States: Step 4 (Documents)
        const [registrationCert, setRegistrationCert] = useState<File | null>(null)
        const [complianceDoc, setComplianceDoc] = useState<File | null>(null)
        
    // --- FINAL SUBMISSION LOGIC ---
    
    // This only fires on the very last step!
    async function handleFinalSubmit() {
        setLoading(true)

        // Note: You will need to add columns for website, zip_code, admin_name, 
        // admin_email, and admin_phone to your Supabase hospitals table!
        const { error } = await supabase.from('hospitals').insert([{
            name,
            hospital_type: hospitalType,
            registration_number: registrationNumber,
            year_established: yearOfEstablishment,
            number_of_beds: numberOfBeds,
            email,
            phone,
            website,
            address,
            city,
            state,
            zip_code: zipCode,
            admin_name: adminName,
            admin_email: adminEmail,
            admin_phone: adminPhone
        }])

        setLoading(false)

        if (error) {
            alert(error.message)
            return
        }

        alert('Hospital completely added successfully!')
        router.push('/hospitals')
    }

    // --- UI DATA ---
    const steps = [
        { id: 1, label: 'Basic Information' },
        { id: 2, label: 'Contact Details' },
        { id: 3, label: 'Address Information' },
        { id: 4, label: 'Documents' },
        { id: 5, label: 'Admin Details' },
        { id: 6, label: 'Review & Submit' }
    ]

    // --- DYNAMIC FORM RENDERING ---
    const renderFormContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Hospital Name <span className="text-red-500">*</span></label>
                            <input type='text' placeholder='Enter hospital name' value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Hospital Type <span className="text-red-500">*</span></label>
                            <select value={hospitalType} onChange={(e) => setHospitalType(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white hover:scale-102">
                                <option value=''>Select type</option>
                                <option value='General'>General Hospital</option>
                                <option value='Specialty'>Specialty Clinic</option>
                                <option value='Multi-Specialty'>Multi-Specialty</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Registration Number <span className="text-red-500">*</span></label>
                            <input type='text' placeholder='Enter registration number' value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Year of Establishment</label>
                            <select value={yearOfEstablishment} onChange={(e) => setYearOfEstablishment(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 bg-white hover:scale-102">
                                <option value=''>Select year</option>
                                {Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Beds</label>
                            <input 
                                type="text" 
                                inputMode="numeric" 
                                pattern="[0-9]*"
                                placeholder="Enter number of beds" 
                                value={numberOfBeds}
                                onChange={(e) => {
                                // Only allow digits to be typed
                                const onlyNumbers = e.target.value.replace(/\D/g, '')
                                setNumberOfBeds(onlyNumbers)
                                }}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:scale-102" 
                            />
                        </div>
                        <div className="md:col-span-2 mt-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Hospital Logo</label>
                            <button className="flex items-center gap-2 border border-blue-100 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors hover:scale-102"><FiUploadCloud size={18} />Upload Logo</button>
                            <p className="text-[11px] text-gray-400 mt-2 font-medium">JPG, PNG or SVG (Max. 2MB)</p>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Official Email <span className="text-red-500">*</span></label>
                            <input type='email' placeholder='hospital@email.com' value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 ">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                            {/* Optional: Static Country Code Box */}
                               <div className="flex items-center justify-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium text-slate-600">
                                    +91
                                </div>
                                <input 
                                    type='tel' 
                                    maxLength={10}
                                    placeholder='9876543210' 
                                    value={phone} 
                                    onChange={(e) => {
                                    // This regex replaces anything that is NOT a digit (\D) with an empty string
                                    const onlyDigits = e.target.value.replace(/\D/g, '')
                                    setPhone(onlyDigits)
                                    }} 
                                    className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102" 
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                            <input type='url' placeholder='https://www.hospitalwebsite.com' value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102" />
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Street Address <span className="text-red-500">*</span></label>
                            <textarea placeholder='Full hospital address' rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">City <span className="text-red-500">*</span></label>
                            <input type='text' placeholder='Mumbai' value={city} onChange={(e) => setCity(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">State <span className="text-red-500">*</span></label>
                            <input type='text' placeholder='Maharashtra' value={state} onChange={(e) => setState(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Zip / Pin Code <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                inputMode="numeric" 
                                pattern="[0-9]*" 
                                maxLength={6}
                                placeholder='400001' 
                                value={zipCode} 
                                onChange={(e) => {
                                // Strip out any non-digit characters
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
            
            {/* --- Registration Certificate Upload --- */}
            <div className="md:col-span-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                <FiUploadCloud size={32} className={`${registrationCert ? 'text-green-500' : 'text-blue-500'} mb-3 transition-colors`} />
                <p className="text-sm font-semibold text-slate-700 mb-1">
                    {registrationCert ? 'Registration Certificate Selected' : 'Upload Hospital Registration Certificate'}
                </p>
                
                {/* Show filename if uploaded, otherwise show requirements */}
                {registrationCert ? (
                    <p className="text-xs text-green-600 mb-4 font-medium">{registrationCert.name}</p>
                ) : (
                    <p className="text-xs text-gray-500 mb-4">PDF, JPG or PNG (Max 5MB)</p>
                )}

                {/* The Hidden Input Trick */}
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

            {/* --- Compliance Documents Upload --- */}
            <div className="md:col-span-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                <FiUploadCloud size={32} className={`${complianceDoc ? 'text-green-500' : 'text-blue-500'} mb-3 transition-colors`} />
                <p className="text-sm font-semibold text-slate-700 mb-1">
                    {complianceDoc ? 'Compliance Document Selected' : 'Upload Compliance/License Documents'}
                </p>
                
                {/* Show filename if uploaded, otherwise show requirements */}
                {complianceDoc ? (
                    <p className="text-xs text-green-600 mb-4 font-medium">{complianceDoc.name}</p>
                ) : (
                    <p className="text-xs text-gray-500 mb-4">PDF, JPG or PNG (Max 5MB)</p>
                )}

                {/* The Hidden Input Trick */}
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
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Admin Name <span className="text-red-500">*</span></label>
                            <input type='text' placeholder='John Doe' value={adminName} onChange={(e) => setAdminName(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Email <span className="text-red-500">*</span></label>
                            <input type='email' placeholder='admin@hospital.com' value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 hover:scale-102" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Admin Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                            {/* Optional: Static Country Code Box */}
                               <div className="flex items-center justify-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium text-slate-600">
                                    +91
                                </div>
                                <input 
                                    type='tel' 
                                    maxLength={10}
                                    placeholder='9876543210' 
                                    value={phone} 
                                    onChange={(e) => {
                                    // This regex replaces anything that is NOT a digit (\D) with an empty string
                                    const onlyDigits = e.target.value.replace(/\D/g, '')
                                    setPhone(onlyDigits)
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
                            <FiUploadCloud size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Submit</h3>
                        <p className="text-slate-500 text-sm text-center max-w-sm mb-6">Please ensure all information is correct before submitting the hospital profile to the database.</p>
                    </div>
                )
            default:
                return null
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
                                    {/* Show checkmark if step is completed */}
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
                        <h2 className="text-lg font-bold text-slate-800 mb-6">{steps[currentStep - 1].label}</h2>
                        
                        {/* Dynamically render the form content based on current step */}
                        {renderFormContent()}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex justify-between items-center mt-8 w-full">
                        <button 
                            onClick={handlePrevStep}
                            className="px-6 py-2.5 border border-gray-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
                        >
                            {currentStep === 1 ? 'Cancel' : '← Back'}
                        </button>
                        
                        {/* If it's the last step, show Submit. Otherwise, show Next */}
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