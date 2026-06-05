'use client'

import {
    useEffect,
    useState,
    use
} from 'react'

import DashboardLayout from '../../../../components/layout/DashboardLayout'

import { supabase } from '../../../../lib/supabase'

export default function SlotGeneratorPage({

    params

}: any) {

    const resolvedParams = use(params)

    const doctorId = resolvedParams.id

    const [doctor,
        setDoctor]
        = useState<any>(null)

    const [loading,
        setLoading]
        = useState(false)

    useEffect(() => {

        fetchDoctor()

    }, [])

    async function fetchDoctor() {

        const { data }
            = await supabase

                .from('doctors')

                .select('*')

                .eq('id', doctorId)

                .single()

        if (data) {

            setDoctor(data)
        }
    }

    function addMinutes(

        time: string,

        mins: number

    ) {

        const [h, m]
            = time.split(':').map(Number)

        const date = new Date()

        date.setHours(h)
        date.setMinutes(m + mins)

        return date
            .toTimeString()
            .slice(0, 5)
    }

    async function generateSlots() {

        setLoading(true)

        const { data: schedules }
            = await supabase

                .from('doctor_schedules')

                .select('*')

                .eq('doctor_id', doctorId)

        if (!schedules) {

            alert(
                'No schedules found'
            )

            setLoading(false)

            return
        }

        const today = new Date()

        const slots = []

        for (

            let dayOffset = 0;

            dayOffset < 30;

            dayOffset++

        ) {

            const currentDate =
                new Date()

            currentDate.setDate(
                today.getDate() + dayOffset
            )

            const weekday =
                currentDate.getDay()

            const formattedDate =
                currentDate
                    .toISOString()
                    .split('T')[0]

            const schedule =
                schedules.find(
                    (s: any) =>

                        s.weekday === weekday
                )

            if (
                !schedule ||
                schedule.is_off_day
            ) {

                continue
            }

            let currentTime =
                schedule.start_time.slice(0, 5)

            while (

                currentTime <
                schedule.end_time.slice(0, 5)

            ) {

                const nextTime =
                    addMinutes(

                        currentTime,

                        schedule.slot_duration
                    )

                // BREAK CHECK

                if (

                    currentTime >=
                    schedule.break_start_time?.slice(0, 5)

                    &&

                    currentTime <
                    schedule.break_end_time?.slice(0, 5)

                ) {

                    currentTime = nextTime

                    continue
                }

                slots.push({

                    doctor_id: doctorId,

                    slot_date:
                        formattedDate,

                    start_time:
                        currentTime,

                    end_time:
                        nextTime,

                    max_booking:
                        schedule.max_booking_per_slot,

                    booked_count: 0,

                    is_active: true
                })

                currentTime = nextTime
            }
        }

        // DELETE OLD FUTURE SLOTS

        await supabase

            .from('appointment_slots')

            .delete()

            .eq('doctor_id', doctorId)

        const { error }
            = await supabase

                .from('appointment_slots')

                .insert(slots)

        setLoading(false)

        if (error) {

            alert(error.message)

            return
        }

        alert(
            `${slots.length} slots generated`
        )
    }

    return (

        <DashboardLayout>

            <div
                className='
                max-w-4xl
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

                <div
                    className='
                    bg-white
                    rounded-3xl
                    p-10
                    border
                    shadow-sm
                '>

                    <h1
                        className='
                        text-5xl
                        font-bold
                        mb-3
                    '>

                        Generate Slots

                    </h1>

                    <p
                        className='
                        text-gray-500
                        text-lg
                        mb-10
                    '>

                        {
                            doctor?.name
                        }

                    </p>

                    <div
                        className='
                        bg-gray-100
                        rounded-2xl
                        p-6
                        mb-8
                    '>

                        <h2
                            className='
                            text-2xl
                            font-bold
                            mb-4
                        '>

                            What this does

                        </h2>

                        <ul
                            className='
                            space-y-3
                            text-lg
                        '>

                            <li>
                                ✔ Generates next 30 days slots
                            </li>

                            <li>
                                ✔ Skips off days
                            </li>

                            <li>
                                ✔ Skips break timing
                            </li>

                            <li>
                                ✔ Uses doctor booking capacity
                            </li>

                        </ul>

                    </div>

                    <button

                        onClick={generateSlots}

                        disabled={loading}

                        className='
                        bg-black
                        text-white
                        px-8
                        py-4
                        rounded-2xl
                        font-semibold
                        text-lg
                    '
                    >

                        {
                            loading

                                ? 'Generating...'

                                : 'Generate 30 Days Slots'
                        }

                    </button>

                </div>

            </div>

        </DashboardLayout>
    )
}