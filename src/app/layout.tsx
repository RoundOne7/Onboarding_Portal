import './globals.css'
import AuthGuard from '../components/auth/AuthGuard'

export const metadata = {
  title: 'Doctor Onboarding Portal',
  description: 'Hospital Management System'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  )
}