'use client'

import {
    useEffect,
    useState
} from 'react'

import Link from 'next/link'

import DashboardLayout from '../../components/layout/DashboardLayout'

import { supabase } from '../../lib/supabase'

export default function DoctorsPage() {

    const [doctors,
        setDoctors]
        = useState([])

    const [search,
        setSearch]
        = useState('')

    useEffect(() => {

        fetchDoctors()

    }, [])

    async function fetchDoctors() {

        const { data, error }
            = await supabase

                .from('doctors')

                .select(`
                    *,
                    hospitals(name),
                    specializations(name)
                `)

                .order(
                    'created_at',
                    { ascending: false }
                )

        if (!error && data) {

            setDoctors(data)
        }
    }

    async function toggleDoctorStatus(

        doctorId: string,

        currentStatus: boolean

    ) {

        const { error }
            = await supabase

                .from('doctors')

                .update({

                    is_active: !currentStatus

                })

                .eq('id', doctorId)

        if (error) {

            alert(error.message)

            return
        }

        fetchDoctors()
    }

    const filteredDoctors =
        doctors.filter((doctor: any) =>

            doctor.name
                ?.toLowerCase()

                .includes(
                    search.toLowerCase()
                )
        )

    return (

        <DashboardLayout>

            <div
                className='
                flex
                items-center
                justify-between
                mb-8
            '>

                <div>

                    <h1
                        className='
                        text-5xl
                        font-bold
                        mb-2
                    '>

                        Doctors

                    </h1>

                    <p
                        className='
                        text-gray-500
                        text-lg
                    '>

                        Manage onboarded doctors

                    </p>

                </div>

                <Link
                    href='/doctors/add'

                    className='
                    bg-black
                    text-white
                    px-6
                    py-4
                    rounded-2xl
                    font-semibold
                    text-lg
                '
                >

                    + Add Doctor

                </Link>

            </div>

            {/* SEARCH */}

            <input
                type='text'

                placeholder='Search doctor'

                value={search}

                onChange={(e) =>
                    setSearch(e.target.value)
                }

                className='
                w-full
                bg-white
                border
                p-4
                rounded-2xl
                mb-8
                text-lg
            '
            />

            {/* DOCTOR GRID */}

            <div
                className='
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
            '>

                {
                    filteredDoctors.map(
                        (doctor: any) => (

                            <div

                                key={doctor.id}

                                className='
                                bg-white
                                rounded-3xl
                                p-7
                                shadow-sm
                                border
                            '
                            >

                                {/* HEADER */}

                                <div
                                    className='
                                    flex
                                    items-center
                                    justify-between
                                    mb-5
                                '>

                                    <h2
                                        className='
                                        text-2xl
                                        font-bold
                                    '>

                                        {doctor.name}

                                    </h2>

                                    <span
                                        className={`

                                            px-4
                                            py-2
                                            rounded-full
                                            text-sm
                                            font-semibold

                                            ${doctor.is_active

                                                ? 'bg-green-100 text-green-700'

                                                : 'bg-red-100 text-red-700'
                                            }
                                        `}
                                    >

                                        {
                                            doctor.is_active

                                                ? 'ACTIVE'

                                                : 'INACTIVE'
                                        }

                                    </span>

                                </div>

                                {/* DETAILS */}

                                <div
                                    className='
                                    space-y-3
                                    text-lg
                                '>

                                    <p>

                                        <strong>
                                            Specialization:
                                        </strong>

                                        {' '}

                                        {
                                            doctor.specializations
                                                ?.name
                                        }

                                    </p>

                                    <p>

                                        <strong>
                                            Hospital:
                                        </strong>

                                        {' '}

                                        {
                                            doctor.hospitals
                                                ?.name
                                        }

                                    </p>

                                    <p>

                                        <strong>
                                            Experience:
                                        </strong>

                                        {' '}

                                        {
                                            doctor.experience_years
                                        }

                                        {' '}years

                                    </p>

                                    <p>

                                        <strong>
                                            Fee:
                                        </strong>

                                        {' '}

                                        ₹
                                        {
                                            doctor.consultation_fee
                                        }

                                    </p>

                                </div>

                                {/* ACTIONS */}

                                <div
                                    className='
                                    mt-6
                                    space-y-3
                                '>

                                    <Link
                                        href={`/doctors/${doctor.id}/schedule`}

                                        className='
                                        block
                                        w-full
                                        text-center
                                        bg-black
                                        text-white
                                        px-4
                                        py-3
                                        rounded-2xl
                                        font-semibold
                                    '
                                    >

                                        Configure Schedule

                                    </Link>

                                    <Link
                                        href={`/doctors/${doctor.id}/slots`}

                                        className='
                                            block
                                            w-full
                                            text-center
                                            bg-blue-500
                                            text-white
                                            px-4
                                            py-3
                                            rounded-2xl
                                            font-semibold
                                        '
                                    >

                                        Generate Slots

                                    </Link>

                                    <button

                                        onClick={() =>

                                            toggleDoctorStatus(

                                                doctor.id,

                                                doctor.is_active
                                            )
                                        }

                                        className={`

                                            w-full
                                            px-4
                                            py-3
                                            rounded-2xl
                                            font-semibold

                                            ${doctor.is_active

                                                ? 'bg-red-500 text-white'

                                                : 'bg-green-500 text-white'
                                            }
                                        `}
                                    >

                                        {
                                            doctor.is_active

                                                ? 'Deactivate Doctor'

                                                : 'Activate Doctor'
                                        }

                                    </button>

                                </div>

                            </div>

                        ))
                }

            </div>

        </DashboardLayout>
    )
}