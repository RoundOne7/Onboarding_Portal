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
    { name: 'City Care Hospital', place: 'Mumbai, Maharashtra', status: 'Approved', date: '12 May 2024', image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=120&q=80' },
    { name: 'Sunrise Multi Speciality', place: 'Pune, Maharashtra', status: 'Approved', date: '10 May 2024', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=120&q=80' },
    { name: 'HealthPlus Hospital', place: 'Bangalore, Karnataka', status: 'Pending', date: '08 May 2024', image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=120&q=80' },
    { name: 'Life Line Hospital', place: 'Ahmedabad, Gujarat', status: 'Rejected', date: '06 May 2024', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=120&q=80' },
    { name: 'Wellness Hospital', place: 'Delhi, New Delhi', status: 'Pending', date: '05 May 2024', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=120&q=80' }
  ]

  const doctors = [
    { name: 'Dr. Rahul Sharma', role: 'Cardiologist', status: 'Approved', date: '12 May 2024', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Dr. Priya Mehta', role: 'Dermatologist', status: 'Approved', date: '10 May 2024', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Dr. Amit Verma', role: 'Orthopedic Surgeon', status: 'Pending', date: '08 May 2024', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { name: 'Dr. Neha Kapoor', role: 'Pediatrician', status: 'Rejected', date: '06 May 2024', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Dr. Kunal Patel', role: 'Neurologist', status: 'Pending', date: '05 May 2024', image: 'https://randomuser.me/api/portraits/men/52.jpg' }
  ]

  const getStatusStyle = (status: string) => {
    if (status === 'Approved') return 'bg-[#DBF1CF] text-[#335F1B]'
    if (status === 'Pending') return 'bg-[#FFFBED] text-[#E45412]'
    return 'bg-[#FFE2E2] text-[#B91C1C]'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'Approved') return <FaCheckCircle />
    if (status === 'Pending') return <FaClock />
    return <FaTimesCircle />
  }

  return (
    <DashboardLayout>
      <main className="w-full flex-1 px-6 pt-5 pb-6 text-[#0B1528] h-full overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] leading-tight font-bold text-[#0B1528]">
              Welcome Back, User_Name 👋
            </h1>
            <p className="text-[#2B3E64] mt-2 text-[15px]">
              Here&apos;s what&apos;s happening with your platform today.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#EAEEF6] rounded-2xl px-4 py-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#E3ECFD] flex items-center justify-center font-bold text-[#0B1528]">
              U
            </div>
            <div>
              <p className="font-semibold text-sm text-[#0B1528]">User Name</p>
              <p className="text-xs text-[#2B3E64]">Super Admin</p>
            </div>
            <span className="text-[#2B3E64] text-xs">⌄</span>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="bg-white border border-[#EAEEF6] rounded-2xl p-5 shadow-sm flex items-center justify-between min-h-[118px]">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#C6D9FA] text-[#1B60E0] rounded-full flex items-center justify-center text-xl">
                <FaUserMd />
              </div>
              <div>
                <p className="text-[#2B3E64] text-sm font-medium">Registered Doctors</p>
                <h2 className="text-[28px] leading-none font-bold text-[#0B1528] mt-1">{stats.doctors}</h2>
                <p className="text-xs text-[#66BF36] font-semibold mt-1">↑ 12.5%</p>
                <p className="text-xs text-[#2B3E64]">vs last month</p>
              </div>
            </div>
            <FaArrowRight className="text-[#2B3E64]" />
          </div>

          <div className="bg-white border border-[#EAEEF6] rounded-2xl p-5 shadow-sm flex items-center justify-between min-h-[118px]">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#DBF1CF] text-[#0EA76B] rounded-full flex items-center justify-center text-xl">
                <FaHospital />
              </div>
              <div>
                <p className="text-[#2B3E64] text-sm font-medium">Connected Hospitals</p>
                <h2 className="text-[28px] leading-none font-bold text-[#0B1528] mt-1">{stats.hospitals}</h2>
                <p className="text-xs text-[#66BF36] font-semibold mt-1">↑ 8.3%</p>
                <p className="text-xs text-[#2B3E64]">vs last month</p>
              </div>
            </div>
            <FaArrowRight className="text-[#2B3E64]" />
          </div>

          <div className="bg-white border border-[#EAEEF6] rounded-2xl p-5 shadow-sm flex items-center justify-between min-h-[118px]">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#F1E1FF] text-[#8B22E8] rounded-full flex items-center justify-center text-xl">
                <FaMapMarkerAlt />
              </div>
              <div>
                <p className="text-[#2B3E64] text-sm font-medium">Active Locations / Cities</p>
                <h2 className="text-[28px] leading-none font-bold text-[#0B1528] mt-1">{stats.locations}</h2>
                <p className="text-xs text-[#66BF36] font-semibold mt-1">↑ 6.7%</p>
                <p className="text-xs text-[#2B3E64]">vs last month</p>
              </div>
            </div>
            <FaArrowRight className="text-[#2B3E64]" />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EAEEF6] pb-4 mb-4">
              <h2 className="text-lg font-bold text-[#0B1528]">Recent Hospitals</h2>
              <Link href="/hospitals" className="text-[#1B60E0] font-semibold text-sm">
                View All
              </Link>
            </div>

            <div>
              {hospitals.map((hospital) => (
                <div key={hospital.name} className="flex items-center justify-between border-b border-[#EAEEF6] py-3 last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={hospital.image} alt={hospital.name} className="w-12 h-12 rounded-xl object-cover bg-[#F1F6FE]" />
                    <div>
                      <h3 className="font-bold text-sm text-[#0B1528]">{hospital.name}</h3>
                      <p className="text-xs text-[#2B3E64] mt-1">{hospital.place}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(hospital.status)}`}>
                      {getStatusIcon(hospital.status)} {hospital.status}
                    </span>
                    <p className="text-xs text-[#2B3E64] mt-2">{hospital.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-5">
              <Link href="/hospitals" className="border border-[#C6D9FA] px-8 py-3 rounded-xl text-[#1B60E0] font-semibold text-sm hover:bg-[#F1F6FE]">
                View All Hospitals →
              </Link>
            </div>
          </div>

          <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EAEEF6] pb-4 mb-4">
              <h2 className="text-lg font-bold text-[#0B1528]">Recent Doctors</h2>
              <Link href="/doctors" className="text-[#1B60E0] font-semibold text-sm">
                View All
              </Link>
            </div>

            <div>
              {doctors.map((doctor) => (
                <div key={doctor.name} className="flex items-center justify-between border-b border-[#EAEEF6] py-3 last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-xl object-cover bg-[#F1F6FE]" />
                    <div>
                      <h3 className="font-bold text-sm text-[#0B1528]">{doctor.name}</h3>
                      <p className="text-xs text-[#2B3E64] mt-1">{doctor.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(doctor.status)}`}>
                      {getStatusIcon(doctor.status)} {doctor.status}
                    </span>
                    <p className="text-xs text-[#2B3E64] mt-2">{doctor.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-5">
              <Link href="/doctors" className="border border-[#C6D9FA] px-8 py-3 rounded-xl text-[#1B60E0] font-semibold text-sm hover:bg-[#F1F6FE]">
                View All Doctors →
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-14 flex items-center justify-between border-t border-[#EAEEF6] pt-4 text-xs text-[#2B3E64]">
          <p>© 2026 QuickCheck. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-[#1B60E0]">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#1B60E0]">Terms of Service</Link>
          </div>
        </footer>
      </main>
    </DashboardLayout>
  )
}