import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import Footer from './Footer'
import { useAuth } from '../../context/AuthContext'

export default function Layout({ children, rightPanel, fullWidth = false }) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <div className="flex pt-14">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className={`
          flex-1 min-h-screen pb-20 lg:pb-8
          ${fullWidth ? '' : 'lg:ml-60'}
        `}>
          <div className={`
            mx-auto px-4 py-6
            ${fullWidth ? 'max-w-7xl' : rightPanel ? 'max-w-7xl' : 'max-w-2xl'}
          `}>
            {rightPanel ? (
              <div className="flex gap-6 items-start">
                <div className="flex-1 min-w-0">{children}</div>
                <div className="hidden xl:block w-72 flex-shrink-0">{rightPanel}</div>
              </div>
            ) : children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  )
}