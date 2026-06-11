'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Link from 'next/link'
import {
  FaUserMd,
  FaHospital,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    doctors: '...',
    hospitals: '...',
    locations: '...'
  })

  useEffect(() => {
    setTimeout(() => {
      setStats({
        doctors: '1,248',
        hospitals: '312',
        locations: '86'
      })
    }, 500)
  }, [])

  const hospitals = [
    { name: 'City Care Hospital', place: 'Mumbai, Maharashtra', status: 'Approved', date: '12 May 2024', icon: '🏥' },
    { name: 'Sunrise Multi Speciality', place: 'Pune, Maharashtra', status: 'Approved', date: '10 May 2024', icon: '🏨' },
    { name: 'HealthPlus Hospital', place: 'Bangalore, Karnataka', status: 'Pending', date: '08 May 2024', icon: '🏥' },
    { name: 'Life Line Hospital', place: 'Ahmedabad, Gujarat', status: 'Rejected', date: '06 May 2024', icon: '🏨' },
    { name: 'Wellness Hospital', place: 'Delhi, New Delhi', status: 'Pending', date: '05 May 2024', icon: '🏥' }
  ]

  const doctors = [
    { name: 'Dr. Rahul Sharma', role: 'Cardiologist', status: 'Approved', date: '12 May 2024', icon: '👨‍⚕️' },
    { name: 'Dr. Priya Mehta', role: 'Dermatologist', status: 'Approved', date: '10 May 2024', icon: '👩‍⚕️' },
    { name: 'Dr. Amit Verma', role: 'Orthopedic Surgeon', status: 'Pending', date: '08 May 2024', icon: '👨‍⚕️' },
    { name: 'Dr. Neha Kapoor', role: 'Pediatrician', status: 'Rejected', date: '06 May 2024', icon: '👩‍⚕️' },
    { name: 'Dr. Kunal Patel', role: 'Neurologist', status: 'Pending', date: '05 May 2024', icon: '👨‍⚕️' }
  ]

  const getStatusStyle = (status: string) => {
    if (status === 'Approved') return 'bg-green-100 text-green-700'
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'Approved') return <FaCheckCircle />
    if (status === 'Pending') return <FaClock />
    return <FaTimesCircle />
  }

  return (
    <DashboardLayout>
      <main className="w-full max-w-7xl mx-auto px-6 py-8 text-[#0B1528]">
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back, User_Name 👋</h1>
            <p className="text-[#2B3E64] mt-2">
              Here&apos;s what&apos;s happening with your platform today.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#E3ECFD] rounded-2xl px-4 py-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#E3ECFD] flex items-center justify-center font-bold">
              U
            </div>
            <div>
              <p className="font-semibold text-sm">User Name</p>
              <p className="text-xs text-[#2B3E64]">Super Admin</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white border border-[#E3ECFD] rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#C6D9FA] text-[#1B60E0] rounded-full flex items-center justify-center text-2xl">
                <FaUserMd />
              </div>
              <div>
                <p className="text-[#2B3E64] font-medium">Registered Doctors</p>
                <h2 className="text-3xl font-bold">{stats.doctors}</h2>
                <p className="text-sm text-green-600 font-medium">↑ 12.5%</p>
                <p className="text-xs text-[#2B3E64]">vs last month</p>
              </div>
            </div>
            <FaArrowRight className="text-[#2B3E64]" />
          </div>

          <div className="bg-white border border-[#E3ECFD] rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#DBF1CF] text-[#0EA76B] rounded-full flex items-center justify-center text-2xl">
                <FaHospital />
              </div>
              <div>
                <p className="text-[#2B3E64] font-medium">Connected Hospitals</p>
                <h2 className="text-3xl font-bold">{stats.hospitals}</h2>
                <p className="text-sm text-green-600 font-medium">↑ 8.3%</p>
                <p className="text-xs text-[#2B3E64]">vs last month</p>
              </div>
            </div>
            <FaArrowRight className="text-[#2B3E64]" />
          </div>

          <div className="bg-white border border-[#E3ECFD] rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl">
                <FaMapMarkerAlt />
              </div>
              <div>
                <p className="text-[#2B3E64] font-medium">Active Locations / Cities</p>
                <h2 className="text-3xl font-bold">{stats.locations}</h2>
                <p className="text-sm text-green-600 font-medium">↑ 6.7%</p>
                <p className="text-xs text-[#2B3E64]">vs last month</p>
              </div>
            </div>
            <FaArrowRight className="text-[#2B3E64]" />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E3ECFD] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E3ECFD] pb-4 mb-4">
              <h2 className="text-xl font-bold">Recent Hospitals</h2>
              <Link href="/hospitals" className="text-[#1B60E0] font-semibold">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {hospitals.map((hospital) => (
                <div key={hospital.name} className="flex items-center justify-between border-b border-[#E3ECFD] pb-3 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F1F6FE] flex items-center justify-center text-2xl">
                      {hospital.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{hospital.name}</h3>
                      <p className="text-sm text-[#2B3E64]">{hospital.place}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(hospital.status)}`}>
                      {getStatusIcon(hospital.status)} {hospital.status}
                    </span>
                    <p className="text-sm text-[#2B3E64] mt-1">{hospital.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Link href="/hospitals" className="border border-[#C6D9FA] px-8 py-3 rounded-xl text-[#1B60E0] font-semibold">
                View All Hospitals →
              </Link>
            </div>
          </div>

          <div className="bg-white border border-[#E3ECFD] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E3ECFD] pb-4 mb-4">
              <h2 className="text-xl font-bold">Recent Doctors</h2>
              <Link href="/doctors" className="text-[#1B60E0] font-semibold">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div key={doctor.name} className="flex items-center justify-between border-b border-[#E3ECFD] pb-3 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F1F6FE] flex items-center justify-center text-2xl">
                      {doctor.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{doctor.name}</h3>
                      <p className="text-sm text-[#2B3E64]">{doctor.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(doctor.status)}`}>
                      {getStatusIcon(doctor.status)} {doctor.status}
                    </span>
                    <p className="text-sm text-[#2B3E64] mt-1">{doctor.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Link href="/doctors" className="border border-[#C6D9FA] px-8 py-3 rounded-xl text-[#1B60E0] font-semibold">
                View All Doctors →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </DashboardLayout>
  )
}