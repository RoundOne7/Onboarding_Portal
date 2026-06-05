'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { supabase } from '../../../lib/supabase'

export default function AddHospitalPage() {

    const router = useRouter()

    const [name, setName] =
        useState('')

    const [address, setAddress] =
        useState('')

    const [city, setCity] =
        useState('')

    const [state, setState] =
        useState('')

    const [phone, setPhone] =
        useState('')

    const [email, setEmail] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    async function handleAddHospital() {

        if (
            !name ||
            !address ||
            !city ||
            !state
        ) {

            alert(
                'Please fill required fields'
            )

            return
        }

        setLoading(true)

        const { error } =
            await supabase

                .from('hospitals')

                .insert([
                    {
                        name,
                        address,
                        city,
                        state,
                        phone,
                        email
                    }
                ])

        setLoading(false)

        if (error) {

            alert(error.message)

            return
        }

        router.push('/hospitals')
    }

    return (

        <main
            className='
                min-h-screen
                bg-gray-100
                p-8
            '
        >

            <div
                className='
                    max-w-3xl
                    mx-auto
                    bg-white
                    rounded-3xl
                    shadow-sm
                    border
                    border-gray-100
                    p-10
                '
            >

                <div className='mb-10'>

                    <h1
                        className='
                            text-4xl
                            font-bold
                            text-gray-900
                        '
                    >

                        Add Hospital

                    </h1>

                    <p
                        className='
                            text-gray-500
                            mt-3
                        '
                    >

                        Create a new hospital
                        or healthcare center

                    </p>

                </div>

                <div className='space-y-6'>

                    <div>

                        <label
                            className='
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            '
                        >

                            Hospital Name *

                        </label>

                        <input
                            type='text'

                            value={name}

                            onChange={(e) =>
                                setName(e.target.value)
                            }

                            className='
                                w-full
                                border
                                border-gray-200
                                rounded-2xl
                                px-5
                                py-4
                                outline-none
                                focus:border-black
                            '

                            placeholder='Apollo Hospital'
                        />

                    </div>

                    <div>

                        <label
                            className='
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            '
                        >

                            Address *

                        </label>

                        <textarea

                            value={address}

                            onChange={(e) =>
                                setAddress(e.target.value)
                            }

                            rows={4}

                            className='
                                w-full
                                border
                                border-gray-200
                                rounded-2xl
                                px-5
                                py-4
                                outline-none
                                focus:border-black
                            '

                            placeholder='Hospital address'
                        />

                    </div>

                    <div
                        className='
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-6
                        '
                    >

                        <div>

                            <label
                                className='
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                '
                            >

                                City *

                            </label>

                            <input
                                type='text'

                                value={city}

                                onChange={(e) =>
                                    setCity(e.target.value)
                                }

                                className='
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    px-5
                                    py-4
                                    outline-none
                                    focus:border-black
                                '

                                placeholder='Mumbai'
                            />

                        </div>

                        <div>

                            <label
                                className='
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                '
                            >

                                State *

                            </label>

                            <input
                                type='text'

                                value={state}

                                onChange={(e) =>
                                    setState(e.target.value)
                                }

                                className='
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    px-5
                                    py-4
                                    outline-none
                                    focus:border-black
                                '

                                placeholder='Maharashtra'
                            />

                        </div>

                    </div>

                    <div
                        className='
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-6
                        '
                    >

                        <div>

                            <label
                                className='
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                '
                            >

                                Phone

                            </label>

                            <input
                                type='text'

                                value={phone}

                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }

                                className='
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    px-5
                                    py-4
                                    outline-none
                                    focus:border-black
                                '

                                placeholder='+91 9876543210'
                            />

                        </div>

                        <div>

                            <label
                                className='
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                '
                            >

                                Email

                            </label>

                            <input
                                type='email'

                                value={email}

                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }

                                className='
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    px-5
                                    py-4
                                    outline-none
                                    focus:border-black
                                '

                                placeholder='hospital@email.com'
                            />

                        </div>

                    </div>

                    <button

                        onClick={handleAddHospital}

                        disabled={loading}

                        className='
                            w-full
                            bg-black
                            text-white
                            py-4
                            rounded-2xl
                            font-semibold
                            text-lg
                            hover:opacity-90
                            transition
                        '
                    >

                        {
                            loading

                                ? 'Creating Hospital...'

                                : 'Add Hospital'
                        }

                    </button>

                </div>

            </div>

        </main>
    )
}