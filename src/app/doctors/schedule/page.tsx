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

const weekdays = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 }
]

function ScheduleContent() {
    const searchParams = useSearchParams()
    const doctorId = searchParams.get('id') || ''

    const [doctorName, setDoctorName] = useState('')
    const [loading, setLoading] = useState(false)
    const [globalBreakStart, setGlobalBreakStart] = useState('14:00')
    const [globalBreakEnd, setGlobalBreakEnd] = useState('16:00')
    const [schedules, setSchedules] = useState<any[]>([])

    useEffect(() => {
        if (doctorId) {
            fetchDoctor()
            loadDoctorSchedules()
        }
    }, [doctorId])

    async function fetchDoctor() {
        try {
            const docRef = ref(db, `doctors/${doctorId}`)
            const docSnap = await get(docRef)
            if (docSnap.exists()) {
                setDoctorName(docSnap.val().name)
            }
        } catch (e) {
            console.error('Failed to fetch doctor:', e)
        }
    }

    async function loadDoctorSchedules() {
        try {
            const schedRef = ref(db, 'doctor_schedules')
            const q = query(schedRef, orderByChild('doctor_id'), equalTo(doctorId))
            const snapshot = await get(q)
            if (snapshot.exists()) {
                const list: any[] = []
                snapshot.forEach((child) => {
                    list.push(child.val())
                })
                const merged = weekdays.map((day) => {
                    const found = list.find((item: any) => item.weekday === day.value)
                    return found ? { label: day.label, ...found } : {
                        weekday: day.value,
                        label: day.label,
                        start_time: '10:00',
                        end_time: '17:00',
                        break_start_time: '14:00',
                        break_end_time: '16:00',
                        slot_duration: 30,
                        max_booking_per_slot: 2,
                        is_off_day: false
                    }
                })
                setSchedules(merged)
            } else {
                initializeSchedules()
            }
        } catch (e) {
            console.error('Failed to load doctor schedules:', e)
            initializeSchedules()
        }
    }

    function initializeSchedules() {
        const initial = weekdays.map((day) => ({
            weekday: day.value,
            label: day.label,
            start_time: '10:00',
            end_time: '17:00',
            break_start_time: '14:00',
            break_end_time: '16:00',
            slot_duration: 30,
            max_booking_per_slot: 2,
            is_off_day: false
        }))
        setSchedules(initial)
    }

    function updateSchedule(
        weekday: number,
        field: string,
        value: any
    ) {
        setSchedules((prev) =>
            prev.map((schedule) =>
                schedule.weekday === weekday
                    ? {
                        ...schedule,
                        [field]: value
                    }
                    : schedule
            )
        )
    }

    function applyGlobalBreak(
        start: string,
        end: string
    ) {
        setGlobalBreakStart(start)
        setGlobalBreakEnd(end)
        setSchedules((prev) =>
            prev.map((schedule) => ({
                ...schedule,
                break_start_time: start,
                break_end_time: end
            }))
        )
    }

    async function saveSchedules() {
        if (!doctorId) return
        setLoading(true)
        try {
            const schedRef = ref(db, 'doctor_schedules')
            const q = query(schedRef, orderByChild('doctor_id'), equalTo(doctorId))
            const snapshot = await get(q)
            
            const updates: any = {}
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    updates[child.key] = null
                })
            }

            schedules.forEach((schedule) => {
                const newKey = Math.random().toString(36).substring(2, 15) + "_" + Date.now()
                updates[newKey] = {
                    doctor_id: doctorId,
                    weekday: schedule.weekday,
                    start_time: schedule.start_time,
                    end_time: schedule.end_time,
                    break_start_time: schedule.break_start_time,
                    break_end_time: schedule.break_end_time,
                    slot_duration: Number(schedule.slot_duration),
                    max_booking_per_slot: Number(schedule.max_booking_per_slot),
                    is_off_day: schedule.is_off_day,
                    created_at: new Date().toISOString()
                }
            })

            await update(ref(db, 'doctor_schedules'), updates)
            alert('Schedule saved successfully')
        } catch (err: any) {
            alert(err.message || 'Failed to save schedules.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-6xl mx-auto p-6'>
            {/* BACK BUTTON */}
            <button
                onClick={() => window.history.back()}
                className='mb-6 bg-black text-white px-5 py-2 rounded-xl font-semibold cursor-pointer'
            >
                ← Back
            </button>

            {/* PAGE HEADER */}
            <div className='flex items-start justify-between gap-10 mb-10'>
                <div>
                    <h1 className='text-5xl font-bold mb-2'>Configure Schedule</h1>
                    <p className='text-gray-500 text-lg'>{doctorName}</p>
                </div>

                {/* GLOBAL BREAK */}
                <div className='bg-white border rounded-2xl p-5 flex gap-5 shadow-sm'>
                    <div>
                        <label className='block mb-2 font-medium'>Global Break Start</label>
                        <input
                            type='time'
                            value={globalBreakStart}
                            onChange={(e) => applyGlobalBreak(e.target.value, globalBreakEnd)}
                            className='border p-3 rounded-xl'
                        />
                    </div>
                    <div>
                        <label className='block mb-2 font-medium'>Global Break End</label>
                        <input
                            type='time'
                            value={globalBreakEnd}
                            onChange={(e) => applyGlobalBreak(globalBreakStart, e.target.value)}
                            className='border p-3 rounded-xl'
                        />
                    </div>
                </div>
            </div>

            {/* SCHEDULE LIST */}
            <div className='space-y-6'>
                {schedules.map((schedule) => (
                    <div key={schedule.weekday} className='bg-white rounded-3xl border p-8 shadow-sm'>
                        {/* HEADER */}
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-3xl font-bold'>{schedule.label}</h2>
                            <label className='flex items-center gap-3 text-lg cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={schedule.is_off_day || false}
                                    onChange={(e) => updateSchedule(schedule.weekday, 'is_off_day', e.target.checked)}
                                />
                                Off Day
                            </label>
                        </div>

                        {!schedule.is_off_day && (
                            <div className='grid grid-cols-1 md:grid-cols-6 gap-5'>
                                {/* START */}
                                <div>
                                    <label className='font-medium'>Start Time</label>
                                    <input
                                        type='time'
                                        value={schedule.start_time || '10:00'}
                                        onChange={(e) => updateSchedule(schedule.weekday, 'start_time', e.target.value)}
                                        className='mt-2 w-full border p-3 rounded-xl'
                                    />
                                </div>

                                {/* END */}
                                <div>
                                    <label className='font-medium'>End Time</label>
                                    <input
                                        type='time'
                                        value={schedule.end_time || '17:00'}
                                        onChange={(e) => updateSchedule(schedule.weekday, 'end_time', e.target.value)}
                                        className='mt-2 w-full border p-3 rounded-xl'
                                    />
                                </div>

                                {/* BREAK START */}
                                <div>
                                    <label className='font-medium'>Break Start</label>
                                    <input
                                        type='time'
                                        value={schedule.break_start_time || '14:00'}
                                        onChange={(e) => updateSchedule(schedule.weekday, 'break_start_time', e.target.value)}
                                        className='mt-2 w-full border p-3 rounded-xl'
                                    />
                                </div>

                                {/* BREAK END */}
                                <div>
                                    <label className='font-medium'>Break End</label>
                                    <input
                                        type='time'
                                        value={schedule.break_end_time || '16:00'}
                                        onChange={(e) => updateSchedule(schedule.weekday, 'break_end_time', e.target.value)}
                                        className='mt-2 w-full border p-3 rounded-xl'
                                    />
                                </div>

                                {/* SLOT */}
                                <div>
                                    <label className='font-medium'>Slot Duration</label>
                                    <select
                                        value={schedule.slot_duration || 30}
                                        onChange={(e) => updateSchedule(schedule.weekday, 'slot_duration', e.target.value)}
                                        className='mt-2 w-full border p-3 rounded-xl bg-white'
                                    >
                                        <option value='10'>10 mins</option>
                                        <option value='15'>15 mins</option>
                                        <option value='20'>20 mins</option>
                                        <option value='30'>30 mins</option>
                                    </select>
                                </div>

                                {/* CAPACITY */}
                                <div>
                                    <label className='font-medium'>Max Booking</label>
                                    <input
                                        type='number'
                                        value={schedule.max_booking_per_slot || 2}
                                        onChange={(e) => updateSchedule(schedule.weekday, 'max_booking_per_slot', e.target.value)}
                                        className='mt-2 w-full border p-3 rounded-xl'
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* SAVE */}
            <button
                onClick={saveSchedules}
                disabled={loading}
                className='mt-10 bg-black hover:bg-zinc-800 text-white px-10 py-4 rounded-2xl font-semibold text-lg cursor-pointer transition-colors'
            >
                {loading ? 'Saving...' : 'Save Schedule'}
            </button>
        </div>
    )
}

export default function SchedulePage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-6 text-center">Loading schedule configuration...</div>}>
                <ScheduleContent />
            </Suspense>
        </DashboardLayout>
    )
}
