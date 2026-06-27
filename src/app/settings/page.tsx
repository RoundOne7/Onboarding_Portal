'use client'

import { FiSettings } from 'react-icons/fi'
import DashboardLayout
    from '../../components/layout/DashboardLayout'

export default function SettingsPage() {

    return (

        <DashboardLayout>

            <main className='w-full flex-1 px-6 pt-5 pb-6 text-[#0B1528] h-full overflow-y-auto'>

                {/* HEADER */}

                <div className='mb-8'>

                    <div className='flex flex-row items-center gap-3'> 
                                                                        <div className="min-w-[32px] w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xl">
                                                                                  <FiSettings className="text-lg" />
                                                                        </div>
                                                                        <h1 className="text-4xl font-bold text-slate-800">Settings</h1>
                                                                    </div>

                    <p className="text-xs text-[#889ABF] mt-1 font-medium">
                            Dashboard &gt; <span className="text-[#2B3E64]">Settings</span>
                        </p>

                </div>

                {/* CONTENT */}

                <div
                    className='
                        bg-white
                        rounded-3xl
                        p-8
                        border
                        border-gray-200
                        shadow-sm
                    '
                >

                    <h2
                        className='
                            text-2xl
                            font-semibold
                            mb-6
                        '
                    >

                        General Settings

                    </h2>

                    <div className='space-y-6'>

                        {/* APP NAME */}

                        <div>

                            <label
                                className='
                                    block
                                    text-sm
                                    font-semibold
                                    mb-2
                                '
                            >

                                Portal Name

                            </label>

                            <input
                                type='text'
                                defaultValue='Doctor Portal'

                                className='
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    px-5
                                    py-4
                                    outline-none
                                '
                            />

                        </div>

                        {/* SUPPORT EMAIL */}

                        <div>

                            <label
                                className='
                                    block
                                    text-sm
                                    font-semibold
                                    mb-2
                                '
                            >

                                Support Email

                            </label>

                            <input
                                type='email'
                                placeholder='support@example.com'

                                className='
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    px-5
                                    py-4
                                    outline-none
                                '
                            />

                        </div>

                        {/* SAVE */}

                        <button
                            className='
                                bg-black
                                text-white
                                px-6
                                py-4
                                rounded-2xl
                                font-semibold
                            '
                        >

                            Save Settings

                        </button>

                    </div>

                </div>

            </main>

        </DashboardLayout>
    )
}