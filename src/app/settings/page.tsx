'use client'

import DashboardLayout
    from '../../components/layout/DashboardLayout'

export default function SettingsPage() {

    return (

        <DashboardLayout>

            <main
                className='
                    p-8
                    bg-gray-100
                    min-h-screen
                '
            >

                {/* HEADER */}

                <div className='mb-8'>

                    <h1
                        className='
                            text-4xl
                            font-bold
                            text-gray-900
                        '
                    >

                        Settings

                    </h1>

                    <p
                        className='
                            text-gray-500
                            mt-2
                        '
                    >

                        Configure portal settings
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