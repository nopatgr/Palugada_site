"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Users,
  Calendar,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAdmin } from "@/contexts/admin-context"
import { useToast } from "@/components/ui/toast"
import { serviceManager, type ServiceFormData } from "@/lib/service-management"
import { bookingStorage } from "@/lib/booking-storage"
import { ServiceForm } from "@/components/admin/service-form"
import type { Service } from "@/lib/services"

export default function AdminDashboard() {
  const [services, setServices] = useState<Service[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | undefined>()
  const [expandedServices, setExpandedServices] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"services" | "bookings">("services")

  const { user, logout, isAuthenticated, isLoading } = useAdmin()
  const { addToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin?access_key=dp2024admin")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = () => {
    setServices(serviceManager.getAllServices())
    setBookings(bookingStorage.getAllBookings())
  }

  const handleSaveService = (data: ServiceFormData) => {
    try {
      if (editingService) {
        serviceManager.updateService(editingService.id, data)
        addToast({
          type: "success",
          title: "Service Updated",
          description: "Service has been updated successfully.",
        })
      } else {
        serviceManager.addService(data)
        addToast({
          type: "success",
          title: "Service Added",
          description: "New service has been added successfully.",
        })
      }

      loadData()
      setShowServiceForm(false)
      setEditingService(undefined)
    } catch (error) {
      addToast({
        type: "error",
        title: "Error",
        description: "Failed to save service. Please try again.",
      })
    }
  }

  const handleDeleteService = (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      serviceManager.deleteService(serviceId)
      addToast({
        type: "success",
        title: "Service Deleted",
        description: "Service has been deleted successfully.",
      })
      loadData()
    }
  }

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const handleLogout = () => {
    logout()
    addToast({
      type: "success",
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-400">Welcome back, {user?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Services</p>
                  <p className="text-2xl font-bold text-white">{services.length}</p>
                </div>
                <Settings className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-white">{bookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    ${bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">{bookings.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setActiveTab("services")}
            variant={activeTab === "services" ? "default" : "outline"}
            className={
              activeTab === "services"
                ? "bg-gradient-to-r from-blue-600 to-purple-600"
                : "border-slate-600 text-slate-300 hover:bg-slate-800"
            }
          >
            <Settings className="h-4 w-4 mr-2" />
            Services
          </Button>
          <Button
            onClick={() => setActiveTab("bookings")}
            variant={activeTab === "bookings" ? "default" : "outline"}
            className={
              activeTab === "bookings"
                ? "bg-gradient-to-r from-blue-600 to-purple-600"
                : "border-slate-600 text-slate-300 hover:bg-slate-800"
            }
          >
            <Calendar className="h-4 w-4 mr-2" />
            Bookings
          </Button>
        </div>

        {/* Services Tab */}
        {activeTab === "services" && (
          <div>
            {showServiceForm ? (
              <ServiceForm
                service={editingService}
                onSave={handleSaveService}
                onCancel={() => {
                  setShowServiceForm(false)
                  setEditingService(undefined)
                }}
              />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Service Management</h2>
                  <Button
                    onClick={() => setShowServiceForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                <div className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="bg-slate-900 border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => toggleServiceExpansion(service.id)}
                            className="flex items-center space-x-3 text-left"
                          >
                            {expandedServices.includes(service.id) ? (
                              <ChevronDown className="h-5 w-5 text-blue-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-blue-400" />
                            )}
                            <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                          </button>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => {
                                setEditingService(service)
                                setShowServiceForm(true)
                              }}
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteService(service.id)}
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {expandedServices.includes(service.id) && (
                          <div className="pl-8 space-y-3">
                            <p className="text-slate-400 text-sm mb-3">{service.subServices.length} sub-services</p>
                            {service.subServices.map((subService) => (
                              <div key={subService.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-white">{subService.name}</h4>
                                    <p className="text-sm text-slate-400 mt-1">{subService.description}</p>
                                    <p className="text-xs text-slate-500 mt-1">Duration: {subService.duration}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-blue-400">${subService.price}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Recent Bookings</h2>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <Card className="bg-slate-900 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">No bookings yet</p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id} className="bg-slate-900 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="font-semibold text-white">{booking.name}</h3>
                          <p className="text-slate-400">{booking.email}</p>
                          <p className="text-sm text-slate-500">{booking.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-300">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </p>
                          <p className="font-semibold text-blue-400">${booking.totalPrice}</p>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs ${
                              booking.status === "confirmed"
                                ? "bg-green-900 text-green-300"
                                : "bg-yellow-900 text-yellow-300"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      {booking.message && (
                        <div className="mt-4 p-3 bg-slate-800 rounded">
                          <p className="text-sm text-slate-300">{booking.message}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
