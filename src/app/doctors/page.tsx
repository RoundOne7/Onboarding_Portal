import DashboardLayout from '../../components/layout/DashboardLayout'
import Link from 'next/link'
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaPen,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa'

export default function DoctorsPage() {
  const tabs = [
    { label: 'All', count: '1,248', active: true },
    { label: 'Approved', count: '842', active: false },
    { label: 'Pending', count: '264', active: false },
    { label: 'Rejected', count: '140', active: false },
  ]

  const doctors = [
    { name: 'Dr. Rahul Sharma', specialty: 'Cardiologist', hospital: 'City Care Hospital', status: 'Approved', joined: '12 May 2024', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Dr. Priya Mehta', specialty: 'Dermatologist', hospital: 'Sunrise Hospital', status: 'Approved', joined: '10 May 2024', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Dr. Amit Verma', specialty: 'Orthopedic Surgeon', hospital: 'HealthPlus Hospital', status: 'Pending', joined: '08 May 2024', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { name: 'Dr. Neha Kapoor', specialty: 'Pediatrician', hospital: 'Life Line Hospital', status: 'Rejected', joined: '06 May 2024', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Dr. Kunal Patel', specialty: 'Neurologist', hospital: 'Wellness Hospital', status: 'Approved', joined: '04 May 2024', image: 'https://randomuser.me/api/portraits/men/52.jpg' },
    { name: 'Dr. Simran Kaur', specialty: 'Gynecologist', hospital: 'Metro Hospital', status: 'Approved', joined: '03 May 2024', image: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { name: 'Dr. Vivek Nair', specialty: 'ENT Specialist', hospital: 'Star Care Hospital', status: 'Approved', joined: '01 May 2024', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
  ]

  const statusClass = (status: string) => {
    if (status === 'Approved') return 'bg-[#DBF1CF] text-[#335F1B]'
    if (status === 'Pending') return 'bg-[#FFFBED] text-[#E45412]'
    return 'bg-[#FFE2E2] text-[#B91C1C]'
  }

  const statusIcon = (status: string) => {
    if (status === 'Approved') return <FaCheckCircle />
    if (status === 'Pending') return <FaClock />
    return <FaTimesCircle />
  }

  return (
    <DashboardLayout>
      <main className="w-full max-w-[1180px] px-6 pt-5 pb-6 text-[#0B1528]">
        <section className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">Doctors</h1>
            <p className="text-xs text-[#889ABF] mt-2">
              Dashboard &gt; Doctors
            </p>
          </div>
        </section>

        <section className="bg-white border border-[#EAEEF6] rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#889ABF] text-sm" />
              <input
                type="text"
                placeholder="Search doctor name, speciality..."
                className="w-full h-12 bg-[#F8F9FC] border border-[#EAEEF6] rounded-xl pl-11 pr-4 text-sm outline-none placeholder:text-[#889ABF]"
              />
            </div>

            <button className="h-12 px-5 rounded-xl border border-[#EAEEF6] bg-white text-[#2B3E64] text-sm font-semibold flex items-center gap-2">
              <FaFilter className="text-xs" />
              Filters
            </button>

            <Link
              href="/doctors/add"
              className="h-12 px-5 rounded-xl bg-[#1B60E0] text-white text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <FaPlus className="text-xs" />
              Add Doctor
            </Link>
          </div>
        </section>

        <section className="flex items-center gap-4 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={`min-w-[135px] px-5 py-2.5 rounded-xl text-sm font-semibold border ${
                tab.active
                  ? 'bg-[#E3ECFD] border-[#C6D9FA] text-[#1B60E0]'
                  : 'bg-white border-[#EAEEF6] text-[#2B3E64]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </section>

        <section className="bg-white border border-[#EAEEF6] rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FC] text-[#2B3E64]">
              <tr>
                <th className="text-left px-5 py-4 font-semibold">Doctor Name</th>
                <th className="text-left px-5 py-4 font-semibold">Specialty</th>
                <th className="text-left px-5 py-4 font-semibold">Hospital</th>
                <th className="text-left px-5 py-4 font-semibold">Status</th>
                <th className="text-left px-5 py-4 font-semibold">Joined On</th>
                <th className="text-left px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.name} className="border-t border-[#EAEEF6]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-9 h-9 rounded-lg object-cover"
                      />
                      <span className="font-semibold">{doctor.name}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-[#2B3E64]">{doctor.specialty}</td>
                  <td className="px-5 py-4 text-[#2B3E64]">{doctor.hospital}</td>

                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusClass(doctor.status)}`}>
                      {statusIcon(doctor.status)}
                      {doctor.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-[#2B3E64]">{doctor.joined}</td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 text-[#1B60E0]">
                      <FaEye />
                      <FaPen />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-5 py-4 border-t border-[#EAEEF6]">
            <p className="text-xs text-[#2B3E64]">
  
            </p>

            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg border border-[#EAEEF6] text-[#2B3E64]">
                ‹
              </button>

              <button className="w-8 h-8 rounded-lg bg-[#1B60E0] text-white">
                1
              </button>

              <button className="w-8 h-8 rounded-lg border border-[#EAEEF6] text-[#2B3E64]">
                ›
              </button>
            </div>
          </div>
        </section>
      </main>
    </DashboardLayout>
  )
}