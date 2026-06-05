'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import DashboardLayout from '../../../components/layout/DashboardLayout'

import { supabase } from '../../../lib/supabase'

export default function AddDoctorPage() {

    const router = useRouter()

    const [name, setName]
        = useState('')

    const [qualificationId,
        setQualificationId]
        = useState('')

    const [qualifications,
        setQualifications]
        = useState([])

    const [experienceYears,
        setExperienceYears]
        = useState('')

    const [consultationFee,
        setConsultationFee]
        = useState('')

    const [hospitalId,
        setHospitalId]
        = useState('')

    const [specializationId,
        setSpecializationId]
        = useState('')

    const [hospitals,
        setHospitals]
        = useState([])

    const [specializations,
        setSpecializations]
        = useState([])

    const [loading, setLoading]
        = useState(false)

    useEffect(() => {

        fetchQualifications()

        fetchHospitals()

        fetchSpecializations()

    }, [])

    async function fetchHospitals() {

        const { data }
            = await supabase

                .from('hospitals')

                .select('*')

        if (data) {

            setHospitals(data)
        }
    }

    async function fetchQualifications() {

        const { data }
            = await supabase

                .from('qualifications')

                .select('*')

        if (data) {

            setQualifications(data)
        }
    }

    async function fetchSpecializations() {

        const { data }
            = await supabase

                .from('specializations')

                .select('*')

        if (data) {

            setSpecializations(data)
        }
    }

    async function handleSubmit() {

        if (
            !name ||
            !qualificationId ||
            !experienceYears ||
            !consultationFee ||
            !hospitalId ||
            !specializationId
        ) {

            alert(
                'Please fill all fields'
            )

            return
        }

        setLoading(true)

        const { error }
            = await supabase

                .from('doctors')

                .insert([
                    {
                        name: `Dr. ${name}`,

                        qualification_id:
                            qualificationId,

                        experience_years:
                            parseInt(
                                experienceYears
                            ),

                        consultation_fee:
                            parseFloat(
                                consultationFee
                            ),

                        hospital_id:
                            hospitalId,

                        specialization_id:
                            specializationId,

                        is_active: true
                    }
                ])

        setLoading(false)

        if (error) {

            alert(error.message)

            return
        }

        alert(
            'Doctor added successfully'
        )

        router.push('/doctors')
    }

    return (

        <DashboardLayout>

            <div
                className='
        max-w-3xl
        mx-auto
      '>
                <button

                    onClick={() =>
                        window.history.back()
                    }

                    className='
                mb-6
                bg-black
                text-white
                px-5
                py-2
                rounded-xl
                font-semibold
            '
                >

                    ← Back

                </button>

                <div className='mb-8'>

                    <h1
                        className='
            text-4xl
            font-bold
          '>

                        Add Doctor

                    </h1>

                    <p className='text-gray-500'>

                        Onboard a new doctor

                    </p>

                </div>

                <div
                    className='
          bg-white
          rounded-2xl
          p-8
          border
          shadow-sm
          space-y-6
        '>

                    <input
                        type='text'

                        placeholder='Doctor Name'

                        value={name}

                        onChange={(e) => {

                            const filtered =
                                e.target.value.replace(
                                    /[^a-zA-Z ]/g,
                                    ''
                                )

                            setName(filtered)
                        }}

                        className='
            w-full
            border
            p-4
            rounded-xl
        '
                    />

                    <select

                        value={qualificationId}

                        onChange={(e) =>
                            setQualificationId(
                                e.target.value
                            )
                        }

                        className='
  w-full
  border
  p-4
  rounded-xl
'
                    >

                        <option value=''>

                            Select Qualification

                        </option>

                        {
                            qualifications.map(
                                (qualification: any) => (

                                    <option
                                        key={qualification.id}
                                        value={qualification.id}
                                    >

                                        {qualification.name}

                                    </option>

                                ))
                        }

                    </select>

                    <input
                        type='number'

                        placeholder='Experience (Years)'

                        value={experienceYears}

                        max='60'

                        onChange={(e) => {

                            const value =
                                e.target.value

                            if (
                                Number(value) <= 60
                            ) {

                                setExperienceYears(value)
                            }
                        }}

                        className='
            w-full
            border
            p-4
            rounded-xl
        '
                    />

                    <input
                        type='number'

                        placeholder='Consultation Fee'

                        value={consultationFee}

                        onChange={(e) => {

                            const value =
                                e.target.value

                            if (
                                Number(value) <= 10000
                            ) {

                                setConsultationFee(value)
                            }
                        }}

                        className='
            w-full
            border
            p-4
            rounded-xl
        '
                    />

                    {/* HOSPITAL */}

                    <select

                        value={hospitalId}

                        onChange={(e) =>
                            setHospitalId(
                                e.target.value
                            )
                        }

                        className='
            w-full
            border
            p-4
            rounded-xl
          '
                    >

                        <option value=''>

                            Select Hospital

                        </option>

                        {
                            hospitals.map(
                                (hospital: any) => (

                                    <option
                                        key={hospital.id}
                                        value={hospital.id}
                                    >

                                        {hospital.name}

                                    </option>

                                ))
                        }

                    </select>

                    {/* SPECIALIZATION */}

                    <select

                        value={specializationId}

                        onChange={(e) =>
                            setSpecializationId(
                                e.target.value
                            )
                        }

                        className='
            w-full
            border
            p-4
            rounded-xl
          '
                    >

                        <option value=''>

                            Select Specialization

                        </option>

                        {
                            specializations.map(
                                (
                                    specialization: any
                                ) => (

                                    <option
                                        key={
                                            specialization.id
                                        }

                                        value={
                                            specialization.id
                                        }
                                    >

                                        {
                                            specialization.name
                                        }

                                    </option>

                                ))
                        }

                    </select>

                    <button

                        onClick={handleSubmit}

                        disabled={loading}

                        className='
            w-full
            bg-black
            text-white
            p-4
            rounded-xl
            font-semibold
          '
                    >

                        {
                            loading
                                ? 'Saving...'
                                : 'Add Doctor'
                        }

                    </button>

                </div>

            </div>

        </DashboardLayout>
    )
}