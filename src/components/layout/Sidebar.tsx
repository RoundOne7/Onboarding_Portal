'use client'

import Link from 'next/link'

export default function Sidebar() {

    return (

        <aside
            className='
      w-64
      h-screen
      bg-black
      text-white
      p-6
      fixed
      left-0
      top-0
    '>

            <h1
                className='
        text-2xl
        font-bold
        mb-10
      '>

                HMS Portal

            </h1>

            <nav
                className='
        flex
        flex-col
        gap-4
      '>

                <Link href='/dashboard'>
                    Dashboard
                </Link>

                <Link href='/doctors'>
                    Doctors
                </Link>

                <Link href='/hospitals'>
                    Hospitals
                </Link>

                <Link href='/settings'>
                    Settings
                </Link>

            </nav>

        </aside>
    )
}