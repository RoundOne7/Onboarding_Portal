'use client'

import {
    useEffect,
    useState,
    Suspense
} from 'react'
import { useSearchParams } from 'next/navigation'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { auth, db } from '../../../lib/firebase'
import { ref, get, update, query, orderByChild, equalTo } from 'firebase/database'

function SlotsContent() {
    const searchParams = useSearchParams()
    const doctorId = searchParams.get('id') || ''

    const [doctor, setDoctor] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (doctorId) {
            fetchDoctor()
        }
    }, [doctorId])

    async function fetchDoctor() {
        try {
            const docRef = ref(db, `doctors/${doctorId}`)
            const docSnap = await get(docRef)
            if (docSnap.exists()) {
                setDoctor({ id: docSnap.key, ...docSnap.val() })
            }
        } catch (e) {
            console.error('Failed to fetch doctor:', e)
        }
    }

    function addMinutes(time: string, mins: number) {
        const [h, m] = time.split(':').map(Number)
        const date = new Date()
        date.setHours(h)
        date.setMinutes(m + mins)
        return date.toTimeString().slice(0, 5)
    }

    async function generateSlots() {
        if (!doctorId) return
        setLoading(true)

        try {
            // Fetch schedules
            const schedRef = ref(db, 'doctor_schedules')
            const qSchedules = query(schedRef, orderByChild('doctor_id'), equalTo(doctorId))
            const snapshotSchedules = await get(qSchedules)
            
            if (!snapshotSchedules.exists()) {
                alert('No schedules found')
                setLoading(false)
                return
            }

            const schedules: any[] = []
            snapshotSchedules.forEach((child) => {
                schedules.push(child.val())
            })

            const today = new Date()
            const slots = []

            for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
                const currentDate = new Date()
                currentDate.setDate(today.getDate() + dayOffset)
                const weekday = currentDate.getDay()
                const formattedDate = currentDate.toISOString().split('T')[0]

                const schedule = schedules.find((s: any) => s.weekday === weekday)

                if (!schedule || schedule.is_off_day) {
                    continue
                }

                let currentTime = schedule.start_time.slice(0, 5)

                while (currentTime < schedule.end_time.slice(0, 5)) {
                    const nextTime = addMinutes(currentTime, schedule.slot_duration)

                    // BREAK CHECK
                    if (
                        currentTime >= schedule.break_start_time?.slice(0, 5) &&
                        currentTime < schedule.break_end_time?.slice(0, 5)
                    ) {
                        currentTime = nextTime
                        continue
                    }

                    slots.push({
                        doctor_id: doctorId,
                        slot_date: formattedDate,
                        start_time: currentTime,
                        end_time: nextTime,
                        max_booking: schedule.max_booking_per_slot,
                        booked_count: 0,
                        is_active: true,
                        created_at: new Date().toISOString()
                    })

                    currentTime = nextTime
                }
            }

            // DELETE OLD FUTURE SLOTS
            const slotsRef = ref(db, 'appointment_slots')
            const qSlots = query(slotsRef, orderByChild('doctor_id'), equalTo(doctorId))
            const snapshotSlots = await get(qSlots)
            
            const updates: any = {}
            if (snapshotSlots.exists()) {
                snapshotSlots.forEach((child) => {
                    updates[child.key] = null
                })
            }

            // Save new slots
            slots.forEach((slot) => {
                const newKey = Math.random().toString(36).substring(2, 15) + "_" + Date.now()
                updates[newKey] = slot
            })

            await update(ref(db, 'appointment_slots'), updates)

            alert(`${slots.length} slots generated`)
        } catch (err: any) {
            alert(err.message || 'An error occurred while generating slots.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-4xl mx-auto p-6'>
            <button
                onClick={() => window.history.back()}
                className='mb-6 bg-black text-white px-5 py-2 rounded-xl font-semibold cursor-pointer'
            >
                ← Back
            </button>

            <div className='bg-white rounded-3xl p-10 border shadow-sm'>
                <h1 className='text-5xl font-bold mb-3'>Generate Slots</h1>
                <p className='text-gray-500 text-lg mb-10'>{doctor?.name}</p>

                <div className='bg-gray-100 rounded-2xl p-6 mb-8'>
                    <h2 className='text-2xl font-bold mb-4'>What this does</h2>
                    <ul className='space-y-3 text-lg'>
                        <li>✔ Generates next 30 days slots</li>
                        <li>✔ Skips off days</li>
                        <li>✔ Skips break timing</li>
                        <li>✔ Uses doctor booking capacity</li>
                    </ul>
                </div>

                <button
                    onClick={generateSlots}
                    disabled={loading}
                    className='bg-black hover:bg-zinc-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg cursor-pointer transition-colors'
                >
                    {loading ? 'Generating...' : 'Generate 30 Days Slots'}
                </button>
            </div>
        </div>
    )
}

export default function SlotsPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-6 text-center">Loading slots generator...</div>}>
                <SlotsContent />
            </Suspense>
        </DashboardLayout>
    )
}
