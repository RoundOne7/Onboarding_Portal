import DashboardLayout from '../../components/layout/DashboardLayout'
import Link from 'next/link'
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'

export default function DoctorsPage() {
  const doctors = [
    {
      name: 'Dr. Priya Sharma',
      speciality: 'Cardiologist',
      hospital: 'City Care Hospital',
      status: 'Approved',
      date: '12 May 2024',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Dr. Ananya Reddy',
      speciality: 'Dermatologist',
      hospital: 'Sunrise Hospital',
      status: 'Approved',
      date: '10 May 2024',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Dr. Amit Verma',
      speciality: 'Pediatrician',
      hospital: 'HealthPlus Hospital',
      status: 'Pending',
      date: '08 May 2024',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Dr. Rahul Sharma',
      speciality: 'Neurologist',
      hospital: 'Life Line Hospital',
      status: 'Rejected',
      date: '06 May 2024',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=200&q=80',
    },
  ]

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
              className="h-12 px-5 rounded-xl bg-[#1B60E0] text-white text-sm font-semibold flex items-center gap-2"
            >
              <FaPlus className="text-xs" />
              Add Doctor
            </Link>
          </div>
        </section>

        <section className="flex items-center gap-4 mb-4">
          {['All (1248)', 'Approved (842)', 'Pending (264)', 'Rejected (140)'].map(
            (tab, index) => (
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
            )
          )}
        </section>

        <section className="bg-white border border-[#EAEEF6] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EAEEF6] bg-[#FCFDFF]">
                <th className="text-left px-6 py-4 text-xs font-bold text-[#889ABF] uppercase">
                  Doctor Name
                </th>
                <th className="text-left px-4 py-4 text-xs font-bold text-[#889ABF] uppercase">
                  Specialty
                </th>
                <th className="text-left px-4 py-4 text-xs font-bold text-[#889ABF] uppercase">
                  Hospital
                </th>
                <th className="text-left px-4 py-4 text-xs font-bold text-[#889ABF] uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-4 text-xs font-bold text-[#889ABF] uppercase">
                  Joined On
                </th>
                <th className="text-center px-4 py-4 text-xs font-bold text-[#889ABF] uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {doctors.map((doctor) => (
                <tr
                  key={doctor.name}
                  className="border-b border-[#F3F5FA] hover:bg-[#FAFBFF]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-[#E3ECFD]"
                      />
                      <span className="font-medium">{doctor.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-[#2B3E64]">
                    {doctor.speciality}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#2B3E64]">
                    {doctor.hospital}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        doctor.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : doctor.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-[#2B3E64]">
                    {doctor.date}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-[#1B60E0]">
                        <FaEye />
                      </button>
                      <button className="text-[#1B60E0]">
                        <FaEdit />
                      </button>
                      <button className="text-red-500">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-sm text-[#889ABF]">
              Showing 1 to 4 of 1,248 entries
            </p>

            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-lg border border-[#EAEEF6] flex items-center justify-center">
                <FaChevronLeft size={10} />
              </button>

              <button className="w-9 h-9 rounded-lg bg-[#1B60E0] text-white text-sm font-semibold">
                1
              </button>

              <button className="w-9 h-9 rounded-lg border border-[#EAEEF6] text-sm">
                2
              </button>

              <button className="w-9 h-9 rounded-lg border border-[#EAEEF6] text-sm">
                3
              </button>

              <button className="w-9 h-9 rounded-lg border border-[#EAEEF6] flex items-center justify-center">
                <FaChevronRight size={10} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </DashboardLayout>
  )
}