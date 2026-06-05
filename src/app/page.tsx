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
      bg-gray-100
    '>

            <div
                className='
        bg-white
        p-10
        rounded-2xl
        w-full
        max-w-md
        shadow-lg
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
        '
                />

                <button

                    onClick={handleLogin}

                    disabled={loading}

                    className='
          w-full
          bg-black
          text-white
          p-4
          rounded-xl
          font-semibold
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