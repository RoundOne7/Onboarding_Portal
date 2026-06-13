import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  FaPhone,
  FaEnvelope,
  FaCheckCircle
} from 'react-icons/fa'

export default function HospitalDetailsPage() {
  return (
    <DashboardLayout>
      <main className="w-full px-6 pt-5 pb-6 text-[#0B1528]">

        {/* Header */}
        <section className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1528]">
              Hospital Details
            </h1>

            <p className="text-sm text-[#889ABF] mt-2">
              Dashboard &gt; Hospitals &gt; City Care Hospital
            </p>
          </div>

          <span className="inline-flex items-center gap-2 bg-[#DBF1CF] text-[#335F1B] px-4 py-2 rounded-full text-sm font-semibold">
            <FaCheckCircle />
            Approved
          </span>
        </section>

        {/* Hospital Profile Card */}
        <section className="bg-white border border-[#EAEEF6] rounded-3xl p-8 shadow-sm min-h-[280px]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 h-full">

            {/* Left Side */}
            <div className="flex gap-6 items-center">

              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80"
                alt="Hospital"
                className="w-44 h-40 rounded-2xl object-cover"
              />

              <div className="flex flex-col justify-center">

                <h2 className="text-3xl font-bold text-[#0B1528]">
                  City Care Hospital
                </h2>

                <p className="text-[#2B3E64] mt-2 mb-5">
                  Mumbai, Maharashtra
                </p>

                <p className="flex items-center gap-3 text-[#2B3E64] mb-3">
                  <FaPhone className="text-[#1B60E0]" />
                  +91 98765 43210
                </p>

                <p className="flex items-center gap-3 text-[#2B3E64]">
                  <FaEnvelope className="text-[#1B60E0]" />
                  info@citycarehospital.com
                </p>

              </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-80 space-y-6">

              <InfoRow
                label="Joined On"
                value="12 May 2024"
              />

              <InfoRow
                label="Approved On"
                value="14 May 2024"
              />

              <InfoRow
                label="Approved By"
                value="User_Name"
              />

            </div>

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
      <span className="text-[#889ABF]">
        {label}
      </span>

      <span className="font-semibold text-[#0B1528]">
        {value}
      </span>
    </div>
  )
}