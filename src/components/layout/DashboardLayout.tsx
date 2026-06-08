import Sidebar from './Sidebar'

import Header from './Header'

// export default function DashboardLayout({

//     children

// }: {

//     children: React.ReactNode

// }) {

//     return (

//         <div className='flex'>

//             <Sidebar />

//             <div
//                 className='
//         ml-64
//         flex-1
//         min-h-screen
//         bg-linear-to-b from-gray-600 to-white
//       '>

//                 <Header />

//                 <main className='p-8'>

//                     {children}

//                 </main>

//             </div>

//         </div>
//     )
// }

// Inside DashboardLayout.tsx (or wherever your main wrapper is)
export default function DashboardLayout({

    children

}: {

    children: React.ReactNode

}) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]"> {/* <-- CRITICAL: Change background to light gray */}
      <Sidebar />
      
      {/* The main content area that sits next to the sidebar */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-72 transition-all"> 
        
        {/* Your Top Header (Doctor's Onboarding Portal) */}
        <header className="flex justify-between items-center p-6 bg-[#f8fafc] border-b border-gray-100">
           <h1 className="text-xl font-bold text-slate-800">Doctor's Onboarding Portal</h1>
           <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">Logout</button>
        </header>

        {/* This is where DashboardPage gets rendered */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}