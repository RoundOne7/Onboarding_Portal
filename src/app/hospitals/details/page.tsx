import DashboardLayout from '../../../components/layout/DashboardLayout'
import Link from 'next/link'
import {
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaStar,
  FaUserMd,
  FaCalendarCheck,
  FaHospital,
} from 'react-icons/fa'

export default function HospitalDetailsPage() {
  return (
    <DashboardLayout>
      <main className="w-full max-w-[1180px] px-6 pt-5 pb-6 text-[#0B1528]">
        <section className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">Hospital Details</h1>
            <p className="text-xs text-[#889ABF] mt-2">
              Dashboard &gt; Hospitals &gt; City Care Hospital
            </p>
          </div>

          <span className="inline-flex items-center gap-2 bg-[#DBF1CF] text-[#335F1B] px-4 py-2 rounded-full text-xs font-bold">
            <FaCheckCircle />
            Approved
          </span>
        </section>

        <section className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex justify-between gap-6">
            <div className="flex gap-5">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=500&q=80"
                alt="City Care Hospital"
                className="w-36 h-32 rounded-2xl object-cover"
              />

              <div>
                <h2 className="text-xl font-bold">City Care Hospital</h2>
                <p className="text-sm text-[#2B3E64] mt-1 mb-4">
                  Mumbai, Maharashtra
                </p>

                <p className="flex items-center gap-2 text-sm text-[#2B3E64] mb-2">
                  <FaPhone className="text-[#1B60E0]" />
                  +91 98765 43210
                </p>

                <p className="flex items-center gap-2 text-sm text-[#2B3E64]">
                  <FaEnvelope className="text-[#1B60E0]" />
                  info@citycarehospital.com
                </p>
              </div>
            </div>

            <div className="w-72 space-y-5 text-sm">
              <InfoRow label="Joined On" value="12 May 2024" />
              <InfoRow label="Approved On" value="14 May 2024" />
              <InfoRow label="Approved By" value="User_Name" />
            </div>
          </div>
        </section>

        <section className="bg-white border border-[#EAEEF6] rounded-2xl px-6 mb-4">
          <div className="flex gap-8">
            {['Overview', 'Documents', 'Admins', 'Doctors (56)', 'Departments', 'Activity Log'].map(
              (tab, index) => (
                <button
                  key={tab}
                  className={`py-4 text-sm font-semibold ${
                    index === 0
                      ? 'text-[#1B60E0] border-b-2 border-[#1B60E0]'
                      : 'text-[#2B3E64]'
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Hospital Information</h2>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <InfoBlock label="Hospital Name" value="City Care Hospital" />
              <InfoBlock label="Contact Person" value="Ravi Sharma" />
              <InfoBlock label="Registration Number" value="CCH/2024/1256" />
              <InfoBlock label="Email" value="info@citycarehospital.com" />
              <InfoBlock label="Hospital Type" value="Multi-Speciality" />
              <InfoBlock label="Phone" value="+91 98765 43210" />

              <div>
                <p className="text-xs text-[#889ABF] font-semibold mb-2">Address</p>
                <p className="text-sm font-semibold">
                  123, MG Road, Andheri East, Mumbai, Maharashtra - 400069
                </p>
              </div>

              <InfoBlock label="Website" value="www.citycarehospital.com" />
            </div>
          </div>

          <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Statistics</h2>

            <div className="space-y-5">
              <StatRow icon={<FaUserMd />} label="Total Doctors" value="56" />
              <StatRow icon={<FaCalendarCheck />} label="Total Appointments" value="8,432" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2B3E64]">Avg. Rating</span>
                <span className="font-bold flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  4.6
                </span>
              </div>

              <StatRow icon={<FaHospital />} label="Departments" value="12" />
            </div>
          </div>
        </section>

        <section className="flex justify-end gap-4 mt-6">
          <Link
            href="/hospitals"
            className="px-6 py-3 rounded-xl border border-[#C6D9FA] text-[#1B60E0] font-semibold text-sm"
          >
            Edit Hospital
          </Link>

          <button className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm">
            Deactivate Hospital
          </button>
        </section>
      </main>
    </DashboardLayout>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[#EAEEF6] pb-3">
      <span className="text-[#889ABF]">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#889ABF] font-semibold mb-2">{label}</p>
      <p className="text-sm font-semibold text-[#0B1528]">{value}</p>
    </div>
  )
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#2B3E64] flex items-center gap-2">
        <span className="text-[#1B60E0]">{icon}</span>
        {label}
      </span>
      <span className="font-bold">{value}</span>
    </div>
  )
}