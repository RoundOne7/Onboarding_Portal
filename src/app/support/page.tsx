'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function SupportPage() {
    return (
        <DashboardLayout>
            <main className="w-full flex-1 px-6 pt-5 pb-6 text-[#0B1528] h-full overflow-y-auto">
                <section className="flex items-start justify-between mb-5">
                    <div>
                        <h1 className="text-2xl font-bold">Contact Support</h1>
                        <p className="text-xs text-[#889ABF] mt-2">
                            Dashboard &gt; Contact Support
                        </p>
                    </div>
                </section>
            </main>
        </DashboardLayout>

    )
}
