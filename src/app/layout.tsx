import './globals.css'

export const metadata = {

    title: 'Doctor Onboarding Portal',

    description:
        'Hospital Management System'
}

export default function RootLayout({

    children,

}: {

    children: React.ReactNode

}) {

    return (

        <html lang='en'>

            <body>

                {children}

            </body>

        </html>
    )
}