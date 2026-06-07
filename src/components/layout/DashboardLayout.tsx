import Sidebar from './Sidebar'

import Header from './Header'

export default function DashboardLayout({

    children

}: {

    children: React.ReactNode

}) {

    return (

        <div className='flex'>

            <Sidebar />

            <div
                className='
        ml-64
        flex-1
        min-h-screen
        bg-linear-to-b from-gray-600 to-white
      '>

                <Header />

                <main className='p-8'>

                    {children}

                </main>

            </div>

        </div>
    )
}