import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  FaPhone,
  FaEnvelope,
  FaCheckCircle
} from 'react-icons/fa'

export default function DoctorProfilePage() {
  return (
    <DashboardLayout>
      <main className="w-full max-w-[1180px] px-6 pt-5 pb-6 text-[#0B1528]">
        {/* Header */}
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

        {/* Doctor Profile Card */}
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
              <InfoRow label="Approved By" value="User_Name" />
            </div>
          </div>
        </section>

        {/* Tabs */}
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
      </main>
    </DashboardLayout>
  )
}

function InfoRow({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex justify-between border-b border-[#EAEEF6] pb-3">
      <span className="text-[#889ABF]">{label}</span>
      <span className="font-bold text-[#0B1528]">{value}</span>
    </div>
  )
}