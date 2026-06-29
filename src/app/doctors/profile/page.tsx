import DashboardLayout from '../../../components/layout/DashboardLayout'
import Link from 'next/link'
import {
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaStar,
} from 'react-icons/fa'

export default function DoctorProfilePage() {
  return (
    <DashboardLayout>
      <main className="w-full flex-1 px-6 pt-5 pb-6 text-[#0B1528] h-full overflow-y-auto">
        <section className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">Doctor Profile</h1>
            <p className="text-xs text-[#889ABF] mt-2">
              Dashboard &gt; Doctors &gt; Dr. Rahul Sharma
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
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80"
                alt="Dr. Rahul Sharma"
                className="w-36 h-32 rounded-2xl object-cover"
              />

              <div>
                <h2 className="text-xl font-bold">Dr. Rahul Sharma</h2>
                <p className="text-sm text-[#2B3E64] mt-1">Cardiologist</p>
                <p className="text-sm text-[#2B3E64] mt-2 mb-4">
                  City Care Hospital, Mumbai
                </p>

                <p className="flex items-center gap-2 text-sm text-[#2B3E64] mb-2">
                  <FaPhone className="text-[#1B60E0]" />
                  +91 98765 43210
                </p>

                <p className="flex items-center gap-2 text-sm text-[#2B3E64]">
                  <FaEnvelope className="text-[#1B60E0]" />
                  rahul.sharma@citycare.com
                </p>
              </div>
            </div>

            <div className="w-72 space-y-5 text-sm">
              <InfoRow label="Joined On" value="12 May 2024" />
              <InfoRow label="Approved On" value="14 May 2024" />
              <InfoRow label="Approved By" value="admin" />
            </div>
          </div>
        </section>

        <section className="bg-white border border-[#EAEEF6] rounded-2xl mb-4 overflow-hidden">
          <div className="grid grid-cols-5 w-full">
            {[
              'Overview',
              'Documents',
              'Availability',
              'Consultation Fees',
              'Activity Log'
            ].map((tab, index) => (
              <button
                key={tab}
                className={`py-4 text-sm font-semibold text-center whitespace-nowrap ${
                  index === 0
                    ? 'text-[#1B60E0] border-b-2 border-[#1B60E0]'
                    : 'text-[#2B3E64] hover:text-[#1B60E0]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold mb-5">General Information</h2>

            <div className="space-y-4">
              <InfoBlock label="Full Name" value="Dr. Rahul Sharma" />
              <InfoBlock label="Date of Birth" value="15 Aug 1985" />
              <InfoBlock label="Gender" value="Male" />
              <InfoBlock label="Languages" value="English, Hindi, Marathi" />
              <InfoBlock label="Experience" value="10 Years" />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold mb-5">Professional Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <InfoBlock label="Qualification" value="MBBS, MD (Cardiology)" />
              <InfoBlock label="Specialization" value="Cardiologist" />
              <InfoBlock label="Registration Number" value="MMC/2010/0345" />
              <InfoBlock label="Experience" value="10 Years" />

              <div className="md:col-span-2">
                <p className="text-xs text-[#889ABF] font-semibold mb-2">
                  About
                </p>
                <p className="text-sm font-semibold text-[#0B1528] leading-relaxed">
                  Expert in Interventional Cardiology and Heart Failure Management.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAEEF6] rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold mb-5">Statistics</h2>

            <div className="space-y-5">
              <StatRow label="Total Appointments" value="1,256" />
              <StatRow label="Patients Treated" value="982" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#2B3E64]">Avg. Rating</span>
                <span className="font-bold flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  4.8
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex justify-end gap-4 mt-6">
          <Link
            href="/doctors"
            className="px-6 py-3 rounded-xl border border-[#C6D9FA] text-[#1B60E0] font-semibold text-sm"
          >
            Edit Doctor
          </Link>

          <button className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm">
            Deactivate Doctor
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
      <span className="font-bold text-[#0B1528]">{value}</span>
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

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#2B3E64]">{label}</span>
      <span className="font-bold text-[#0B1528]">{value}</span>
    </div>
  )
}