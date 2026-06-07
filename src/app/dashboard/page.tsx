import DashboardLayout from '../../components/layout/DashboardLayout'
import FeatureCard from '../../components/FeatureCard'
import { FaHospital } from 'react-icons/fa'
import { FaGear, FaKitMedical } from 'react-icons/fa6'
import Link from 'next/dist/client/link'

export default function DashboardPage() {

    return (

        <DashboardLayout>

            <div className='
             bg-linear-to-b from-white/0.5 to-white/3
            '>

                <h1
                    className='
                        text-4xl
                        font-bold
                        mb-4
                        text-white
                    '>

                    Dashboard

                </h1>

                <p className='text-white text-lg'>

                    Welcome to the
                    Doctor Onboarding Portal

                </p>

                <div
                        className="
                          relative z-10
                          grid
                          grid-cols-1
                          md:grid-cols-2
                          xl:grid-cols-3
                          gap-12
                          p-6
                        "
                      >
                        <Link href='/doctors'>
                            <FeatureCard
                          title="Add New Doctor"
                          description="Add and onboard new doctors to the system."
                          icon={<FaKitMedical />}
                        />
                        </Link>
                        
                        <Link href='/hospitals'>
                            <FeatureCard
                          title="Hospital Management"
                          description="Manage hospital information and doctor assignments."
                          icon={<FaHospital />}
                        />
                        </Link>
                        
                        <Link href='/settings'>
                            <FeatureCard 
                          title="System Setup"
                          description="Configure and customize the onboarding system to meet your organization's needs."
                          icon={<FaGear />}
                        />
                        </Link>
                        
                
                      </div>

            </div>

        </DashboardLayout>
    )
}