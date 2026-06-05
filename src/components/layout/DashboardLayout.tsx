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
        bg-gray-100
      '>

                <Header />

                <main className='p-8'>

                    {children}

                </main>

            </div>

        </div>
    )
}