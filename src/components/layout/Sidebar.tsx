'use client'

import Link from 'next/link'

export default function Sidebar() {

    return (

        <aside
            className='
      w-64
      h-screen
      bg-linear-to-b from-gray-600 to-white
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
        flex        
        items-center
        justify-center
        font-serif
      '>
                HMS Portal
            </h1>

            <nav
                className='
        flex
        flex-col
        gap-4
      '>
            
                <Link href='/dashboard'
                className='
                flex
                items-center
                justify-center
                gap-3
                h-14
                rounded-2xl
              hover:bg-linear-to-r from-white/5 via-gray-700/90 to-white/5
                hover:scale-110
                transition-all
              bg-white/1
                border
              border-white/10
                backdrop-blur-xl
                shadow-xl
                '>
                    Dashboard
                </Link>

                <Link href='/doctors'
                className='
                flex
                items-center
                justify-center
                gap-3
                h-14
                rounded-2xl
              hover:bg-linear-to-r from-white/5 via-gray-700/90 to-white/5
                hover:scale-110
                transition-all
              bg-white/1
                border
              border-white/10
                backdrop-blur-xl
                shadow-xl'>
                    Doctors
                </Link>

                <Link href='/hospitals'
                className='
                flex
                items-center
                justify-center
                gap-3
                h-14
                rounded-2xl
              hover:bg-linear-to-r from-white/5 via-gray-700/90 to-white/5
                hover:scale-110
                transition-all
              bg-white/1
                border
              border-white/10
                backdrop-blur-xl
                shadow-xl'>
                    Hospitals
                </Link>

                <Link href='/settings'
                className='
                flex
                items-center
                justify-center
                gap-3
                h-14
                rounded-2xl
                transition-all
              hover:bg-linear-to-r from-white/5 via-gray-700/90 to-white/5
                hover:scale-110
              bg-white/1
                border
              border-white/10
                backdrop-blur-xl
                shadow-xl'>
                    Settings
                </Link>
                

            </nav>

        </aside>
    )
}