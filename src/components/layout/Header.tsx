'use client'

import { supabase } from '../../lib/supabase'

export default function Header() {

    async function logout() {

        await supabase.auth.signOut()

        window.location.href = '/'
    }

    return (

        <header
            className='
      h-20
      bg-linear-to-b from-gray-600/60 to-gray-500/10
      flex
      items-center
      justify-between
      px-8
    '>

            <h2
                className='
        text-3xl
        font-bold
        text-white
      '>

                Doctor's Onboarding Portal

            </h2>

            <button

                onClick={logout}

                className='
        bg-black
        text-white
        px-5
        py-2
        rounded-xl
        transition-all
        duration-200
        hover:scale-110
      '
            >

                Logout

            </button>

        </header>
    )
}