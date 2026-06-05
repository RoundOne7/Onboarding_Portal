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
      bg-white
      border-b
      flex
      items-center
      justify-between
      px-8
    '>

            <h2
                className='
        text-2xl
        font-bold
      '>

                Doctor Onboarding Portal

            </h2>

            <button

                onClick={logout}

                className='
        bg-black
        text-white
        px-5
        py-2
        rounded-xl
      '
            >

                Logout

            </button>

        </header>
    )
}