import DashboardLayout from '../../components/layout/DashboardLayout'
import Link from 'next/link'
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa'

export default function DoctorsPage() {
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
          {[
            'All (1248)',
            'Approved (842)',
            'Pending (264)',
            'Rejected (140)'
          ].map((tab, index) => (
            <button
              key={tab}
              className={`min-w-[135px] px-5 py-2.5 rounded-xl text-sm font-semibold border ${
                index === 0
                  ? 'bg-[#E3ECFD] border-[#C6D9FA] text-[#1B60E0]'
                  : 'bg-white border-[#EAEEF6] text-[#2B3E64]'
              }`}
            >
              {tab}
            </button>
          ))}
        </section>
      </main>
    </DashboardLayout>
  )
}