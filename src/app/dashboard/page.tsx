'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Link from 'next/link'
import { FaSearch, FaBell, FaUserMd, FaHospital, FaCalendarCheck, FaCheckCircle, FaClock } from 'react-icons/fa'
import { FaKitMedical } from 'react-icons/fa6'

export default function DashboardPage() {
  // --- STATE FOR DYNAMIC DATA ---
  const [stats, setStats] = useState({
    doctors: '...',
    hospitals: '...',
    slots: '...'
  });

  // --- FETCH DATA ON MOUNT ---
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        
        setTimeout(() => {
          setStats({
            doctors: '42',      
            hospitals: '8',     
            slots: '156'        
          });
        }, 800);

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        setStats({ doctors: 'Error', hospitals: 'Error', slots: 'Error' });
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <DashboardLayout>
      <div className='w-full max-w-7xl mx-auto p-6 md:p-8 text-slate-800'>
        
        {/* HEADER SECTION */}
        <header className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4'>
          <div>
            <h1 className='text-3xl font-bold flex items-center gap-2'>
              Welcome back, Admin <span className="text-2xl">👋</span>
            </h1>
            <p className='text-gray-500 mt-1'>Monitor doctor registrations, hospital onboarding status, and platform activity in real time.</p>
          </div>

          <div className='flex items-center gap-4'>
            <div className='relative shadow-xl rounded-3xl'>
              <FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
              <input 
                type="text" 
                placeholder="Search system..." 
                className='pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c3f53c] w-64'
              />
            </div>
            <button className='w-11 h-11 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-xl relative'>
              <FaBell className='text-gray-600' />
              <span className='absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full'></span>
            </button>
            <div className='w-11 h-11 bg-blue-100 rounded-full border-2 border-white shadow-xl overflow-hidden'>
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`} alt="Profile" />
            </div>
          </div>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>

          <div className='lg:col-span-8 flex flex-col gap-8'>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
              
              {/* Metric 1: Doctors */}
              <div className='bg-white p-5 rounded-3xl border border-gray-100 shadow-xl'>
                <div className='flex items-center gap-4 mb-3'>
                  <div className='p-3 bg-blue-50 text-blue-600 rounded-2xl'>
                    <FaUserMd className='text-xl' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 font-medium'>Registered Doctors</p>
                    <h3 className='text-xl font-bold'>{stats.doctors} Profiles</h3>
                  </div>
                </div>
                <div className='flex justify-between text-xs text-gray-400 font-medium border-t pt-3'>
                  <Link href="/doctors" className="text-blue-500 hover:underline">View Directory →</Link>
                </div>
              </div>

              {/* Metric 2: Hospitals */}
              <div className='bg-white p-5 rounded-3xl border border-gray-100 shadow-xl'>
                <div className='flex items-center gap-4 mb-3'>
                  <div className='p-3 bg-purple-50 text-purple-600 rounded-2xl'>
                    <FaHospital className='text-xl' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 font-medium'>Connected Hospitals</p>
                    <h3 className='text-xl font-bold'>{stats.hospitals} Facilities</h3>
                  </div>
                </div>
                <div className='flex justify-between text-xs text-gray-400 font-medium border-t pt-3'>
                  <Link href="/hospitals" className="text-purple-500 hover:underline">Manage Registry →</Link>
                </div>
              </div>

              {/* Metric 3: Appointments/Slots */}
              <div className='bg-white p-5 rounded-3xl border border-gray-100 shadow-xl'>
                <div className='flex items-center gap-4 mb-3'>
                  <div className='p-3 bg-green-50 text-green-600 rounded-2xl'>
                    <FaCalendarCheck className='text-xl' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 font-medium'>Active Slots</p>
                    <h3 className='text-xl font-bold'>{stats.slots} Available</h3>
                  </div>
                </div>
                <div className='flex justify-between text-xs text-gray-400 font-medium border-t pt-3'>
                   <span className="text-gray-500">System Capacity</span>
                </div>
              </div>
            </div>

            {/* Middle Row: Pipeline Analytics */}
            <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-xl h-80 flex flex-col'>
               <div className='flex justify-between items-center mb-6'>
                 <h2 className='text-lg font-bold'>Onboarding Activity</h2>
                 <select className='bg-gray-50 border-none text-sm font-medium rounded-full px-4 py-1.5 outline-none'>
                   <option>Weekly</option>
                   <option>Monthly</option>
                 </select>
               </div>
               <div className='flex-1 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center bg-gray-50/50'>
                  <p className='text-gray-400 font-medium'>[ Recharts Bar Chart Goes Here ]</p>
               </div>
            </div>

            {/* Bottom Row: Recent Doctor Profiles */}
            <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-xl'>
               <div className='flex justify-between items-center mb-6'>
                 <h2 className='text-lg font-bold'>Recently Added Profiles</h2>
                 <Link href="/doctors" className='text-sm font-medium bg-gray-100 text-slate-900 px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors'>View Directory</Link>
               </div>
               
               {/* They will be changed to display actual doctor profiles */}
               <div className='space-y-4'>
                 {/* Profile Item 1 */}
                 <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl'>
                   <div className='flex items-center gap-4'>
                     <div className='w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold'>SW</div>
                     <div>
                       <h4 className='font-bold text-gray-800'>Dr. Sarah Webb</h4>
                       <p className='text-xs text-gray-500'>Cardiology • City General Hospital</p>
                     </div>
                   </div>
                   <div>
                     <Link href="/doctors/1/schedule" className='text-sm font-medium text-blue-600 hover:underline'>View Schedule</Link>
                   </div>
                 </div>

                 {/* Profile Item 2 */}
                 <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl'>
                   <div className='flex items-center gap-4'>
                     <div className='w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold'>MJ</div>
                     <div>
                       <h4 className='font-bold text-gray-800'>Dr. Marcus Johnson</h4>
                       <p className='text-xs text-gray-500'>Neurology • Westside Clinic</p>
                     </div>
                   </div>
                   <div>
                     <Link href="/doctors/2/schedule" className='text-sm font-medium text-blue-600 hover:underline'>View Schedule</Link>
                   </div>
                 </div>

               </div>
            </div>

          </div>

          <div className='lg:col-span-4 flex flex-col gap-8'>
            
            <div className='bg-cyan-900/99 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden'>
               <div className='relative z-10'>
                 <div className='bg-white/10 w-max p-2 rounded-xl mb-4'>
                   <FaUserMd className='text-2xl text-[#5ff67b]' />
                 </div>
                 <h2 className='text-2xl font-bold mb-2'>Add New Doctor</h2>
                 <p className='text-white text-sm mb-6 leading-relaxed'>
                   Initiate a new onboarding pipeline and assign initial hospital parameters.
                 </p>
                 <Link href="/doctors/add" className='inline-block bg-[#5ff67b] text-slate-900 font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform'>
                   Start Onboarding
                 </Link>
               </div>
               <div className='absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl'></div>
               <div className='absolute -bottom-8 -right-4 w-24 h-24 bg-[#5ff67b]/20 rounded-full blur-xl'></div>
            </div>

            <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-xl '>
              <h2 className='text-lg font-bold mb-4'>Quick Actions</h2>
              <div className='space-y-3'>
                 <Link href="/hospitals/add" className='flex items-center gap-3 p-3 border border-gray-100 bg-cyan-900/99  rounded-2xl hover:scale-105 transition-transform'>
                    <div className='w-10 h-10 text-[#5ff67b] bg-white/10 rounded-xl flex items-center justify-center'>
                      <FaHospital />
                    </div>
                    <div>
                      <h4 className='font-bold text-sm text-white'>Register Hospital</h4>
                      <p className='text-[10px] text-white'>Add a new facility</p>
                    </div>
                 </Link>
                 <Link href="/settings" className='flex items-center gap-3 p-3 border border-gray-100 bg-cyan-900/99  rounded-2xl hover:scale-105 transition-transform'>
                    <div className='w-10 h-10 text-[#5ff67b] bg-white/10 rounded-xl flex items-center justify-center'>
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h4 className='font-bold text-sm text-white'>Global Settings</h4>
                      <p className='text-[10px] text-white'>Configure platform</p>
                    </div>
                 </Link>
              </div>
            </div>

            {/* Urgent Tasks */}
            <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex-1'>
               <div className='flex justify-between items-center mb-6'>
                 <h2 className='text-lg font-bold'>Urgent Actions</h2>
                 <button className='w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center'>+</button>
               </div>
               
               <div className='space-y-3'>
                 <div className='flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center'>
                        <FaClock />
                      </div>
                      <div>
                        <h4 className='font-bold text-sm text-gray-800'>Review Schedule</h4>
                        <p className='text-[10px] text-gray-400'>Dr. Allen • Missing Slots</p>
                      </div>
                    </div>
                    <span className='bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md'>Urgent</span>
                 </div>
               </div>
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}