import Sidebar from './Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-0 lg:ml-72 transition-all">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}