// CODE ONLY ACCESS THE EXISTING USER AND DON'T TAKE LOGIN OF NEW USERS.
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '../lib/supabase'

export default function LoginPage() {

    const router = useRouter()

    const [email, setEmail] =
        useState('')

    const [password, setPassword] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    async function handleLogin() {

        setLoading(true)

        const { data, error } =
            await supabase.auth.signInWithPassword({

                email,
                password
            })

        if (error) {

            alert(error.message)

            setLoading(false)

            return
        }

        const userEmail =
            data.user.email

        const { data: internalUser }
            = await supabase

                .from('internal_users')

                .select('*')

                .eq('email', userEmail)

                .eq('is_active', true)

                .single()

        if (!internalUser) {

            alert(
                'No portal access'
            )

            await supabase.auth.signOut()

            setLoading(false)

            return
        }

        router.push('/dashboard')
    }

    return (

        <main
            className='
      min-h-screen
      flex
      items-center
      justify-center
      bg-linear-to-br from-gray-600 via-gray-400 to-gray-600
    '>

            <div
                className='
        bg-gray-200/80
        p-10
        rounded-2xl
        w-full
        max-w-md
        shadow-gray-100
        shadow-3xl
        hover:shadow-gray-300
        hover:shadow-4xl
        hover:scale-110
        hover:bg-gray-200/90
        transition
        duration-300
      '>

                <h1
                    className='
          text-3xl
          font-bold
          mb-8
          text-center
        '>

                    Doctor Portal Login

                </h1>

                <input
                    type='email'
                    placeholder='Email'

                    value={email}

                    onChange={(e) =>
                        setEmail(e.target.value)
                    }

                    className='
          w-full
          border
          p-4
          rounded-xl
          mb-4
          hover:scale-105
          transition
          duration-200
        '
                />

                <input
                    type='password'
                    placeholder='Password'

                    value={password}

                    onChange={(e) =>
                        setPassword(e.target.value)
                    }

                    className='
          w-full
          border
          p-4
          rounded-xl
          mb-6
          hover:scale-105
          transition
          duration-200
        '
                />

                <button

                    onClick={handleLogin}

                    disabled={loading}

                    className='
          w-full
          bg-gray-800/90
          text-white
          p-4
          rounded-xl
          font-semibold
          hover:scale-115
          transition
          duration-300
        '
                >

                    {
                        loading
                            ? 'Logging in...'
                            : 'Login'
                    }

                </button>

            </div>

        </main>
    )
}

