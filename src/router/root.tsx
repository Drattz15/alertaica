import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import TourComponent from "@/lib/tour-steps"
import { useAuth } from "@/providers/AuthProvider"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import "mapbox-gl/dist/mapbox-gl.css"

export default function RootLayout() {
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!session) {
      navigate("/login", { viewTransition: true })
    }
  }, [session])

  if (!session) return null

  return (
    <div className="app-container bg-gray-900 min-h-screen flex flex-col">
      {/* Navbar (Header) */}
      <div className="sticky top-0 z-50 profile-dropdown">
        <Navbar />
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 w-full p-4 pb-20">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
      <TourComponent />
    </div>
  )
}
