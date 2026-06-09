'use client'

import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

import DashboardLayout
    from '../../components/layout/DashboardLayout'

import { supabase }
    from '../../lib/supabase'

export default function HospitalsPage() {

    const [hospitals, setHospitals] =
        useState<any[]>([])

    const [loading, setLoading] =
        useState(true)

    const [search, setSearch] =
        useState('')

    useEffect(() => {

        fetchHospitals()

    }, [])

    async function fetchHospitals() {

        setLoading(true)

        const { data, error } =
            await supabase

                .from('hospitals')

                .select('*')

                .order(
                    'created_at',
                    {
                        ascending: false
                    }
                )

        if (!error && data) {

            setHospitals(data as any[])
        }

        setLoading(false)
    }

    async function toggleHospitalStatus(
        hospital: any
    ) {

        await supabase

            .from('hospitals')

            .update({
                is_active:
                    !hospital.is_active
            })

            .eq('id', hospital.id)

        fetchHospitals()
    }

    const filteredHospitals =
        useMemo(() => {

            return hospitals.filter(
                (hospital) =>

                    hospital.name
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )

                    ||

                    hospital.city
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            )

        }, [hospitals, search])

    return (

        <DashboardLayout>

            <main
                className='
                    p-8
                    bg-gray-100
                    min-h-screen
                '
            >

                {/* HEADER */}

                <div
                    className='
                        flex
                        items-center
                        justify-between
                        mb-8
                    '
                >

                    <div>

                        <h1
                            className='
                                text-4xl
                                font-bold
                                text-gray-900
                            '
                        >

                            Hospitals

                        </h1>

                        <p
                            className='
                                text-gray-500
                                mt-2
                            '
                        >

                            Manage hospitals and
                            healthcare centers

                        </p>

                    </div>

                    <Link href='/hospitals/add'>

                        <button
                            className='
                                bg-black
                                text-white
                                px-5
                                py-3
                                rounded-2xl
                                font-semibold
                                hover:opacity-90
                                transition
                            '
                        >

                            Add Hospital

                        </button>

                    </Link>

                </div>

                {/* SEARCH */}

                <div className='mb-8'>

                    <input
                        type='text'
                        placeholder='Search hospitals...'

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        className='
                            w-full
                            bg-white
                            border
                            border-gray-200
                            rounded-2xl
                            px-5
                            py-4
                            outline-none
                        '
                    />

                </div>

                {/* LOADING */}

                {
                    loading && (

                        <div
                            className='
                                bg-white
                                rounded-3xl
                                p-12
                                text-center
                            '
                        >

                            Loading hospitals...

                        </div>
                    )
                }

                {/* EMPTY */}

                {
                    !loading &&
                    filteredHospitals.length === 0 && (

                        <div
                            className='
                                bg-white
                                rounded-3xl
                                border
                                border-gray-200
                                p-12
                                text-center
                                shadow-sm
                            '
                        >

                            <h2
                                className='
                                    text-2xl
                                    font-semibold
                                    text-gray-900
                                '
                            >

                                No Hospitals Found

                            </h2>

                            <p
                                className='
                                    text-gray-500
                                    mt-4
                                '
                            >

                                Add hospitals to start
                                managing healthcare centers.

                            </p>

                        </div>
                    )
                }

                {/* LIST */}

                <div
                    className='
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        xl:grid-cols-3
                        gap-6
                    '
                >

                    {
                        filteredHospitals.map(
                            (hospital) => (

                                <div

                                    key={hospital.id}

                                    className='
                                        bg-white
                                        rounded-3xl
                                        p-6
                                        shadow-sm
                                        border
                                        border-gray-100
                                    '
                                >

                                    <div
                                        className='
                                            flex
                                            items-start
                                            justify-between
                                        '
                                    >

                                        <div>

                                            <h2
                                                className='
                                                    text-2xl
                                                    font-bold
                                                    text-gray-900
                                                '
                                            >

                                                {
                                                    hospital.name
                                                }

                                            </h2>

                                            <p
                                                className='
                                                    text-gray-500
                                                    mt-2
                                                '
                                            >

                                                {
                                                    hospital.city
                                                },{' '}
                                                {
                                                    hospital.state
                                                }

                                            </p>

                                        </div>

                                        <div
                                            className={`
                                                px-3
                                                py-1
                                                rounded-full
                                                text-sm
                                                font-semibold

                                                ${hospital.is_active

                                                    ? 'bg-green-100 text-green-700'

                                                    : 'bg-red-100 text-red-700'
                                                }
                                            `}
                                        >

                                            {
                                                hospital.is_active

                                                    ? 'Active'

                                                    : 'Inactive'
                                            }

                                        </div>

                                    </div>

                                    <div className='mt-6'>

                                        <p className='text-gray-700'>

                                            {
                                                hospital.address
                                            }

                                        </p>

                                        <p className='text-gray-500 mt-4'>

                                            {
                                                hospital.phone ||
                                                'No phone added'
                                            }

                                        </p>

                                        <p className='text-gray-500 mt-1'>

                                            {
                                                hospital.email ||
                                                'No email added'
                                            }

                                        </p>

                                    </div>

                                    <div
                                        className='
                                            mt-8
                                            flex
                                            gap-3
                                        '
                                    >

                                        <button
                                            className='
                                                flex-1
                                                bg-gray-100
                                                py-3
                                                rounded-2xl
                                                font-semibold
                                            '
                                        >

                                            Edit

                                        </button>

                                        <button

                                            onClick={() =>
                                                toggleHospitalStatus(
                                                    hospital
                                                )
                                            }

                                            className={`
                                                flex-1
                                                py-3
                                                rounded-2xl
                                                font-semibold

                                                ${hospital.is_active

                                                    ? 'bg-red-100 text-red-700'

                                                    : 'bg-green-100 text-green-700'
                                                }
                                            `}
                                        >

                                            {
                                                hospital.is_active

                                                    ? 'Deactivate'

                                                    : 'Activate'
                                            }

                                        </button>

                                    </div>

                                </div>
                            )
                        )
                    }

                </div>

            </main>

        </DashboardLayout>
    )
}