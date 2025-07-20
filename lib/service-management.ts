import { services as initialServices, type Service, type SubService } from "./services"

// In-memory service storage (in production, use a database)
const managedServices: Service[] = [...initialServices]

export interface ServiceFormData {
  id?: string
  name: string
  icon: string
  subServices: SubServiceFormData[]
}

export interface SubServiceFormData {
  id?: string
  name: string
  price: number
  duration: string
  description: string
}

export const serviceManager = {
  // Get all services
  getAllServices: (): Service[] => {
    return managedServices
  },

  // Get service by ID
  getServiceById: (id: string): Service | undefined => {
    return managedServices.find((service) => service.id === id)
  },

  // Add new service
  addService: (serviceData: Omit<ServiceFormData, "id">): Service => {
    const newService: Service = {
      id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: serviceData.name,
      icon: serviceData.icon,
      subServices: serviceData.subServices.map((sub) => ({
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: sub.name,
        price: sub.price,
        duration: sub.duration,
        description: sub.description,
      })),
    }

    managedServices.push(newService)
    return newService
  },

  // Update existing service
  updateService: (id: string, serviceData: ServiceFormData): Service | null => {
    const index = managedServices.findIndex((service) => service.id === id)
    if (index === -1) return null

    const updatedService: Service = {
      id,
      name: serviceData.name,
      icon: serviceData.icon,
      subServices: serviceData.subServices.map((sub) => ({
        id: sub.id || `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: sub.name,
        price: sub.price,
        duration: sub.duration,
        description: sub.description,
      })),
    }

    managedServices[index] = updatedService
    return updatedService
  },

  // Delete service
  deleteService: (id: string): boolean => {
    const index = managedServices.findIndex((service) => service.id === id)
    if (index === -1) return false

    managedServices.splice(index, 1)
    return true
  },

  // Add sub-service to existing service
  addSubService: (serviceId: string, subServiceData: Omit<SubServiceFormData, "id">): SubService | null => {
    const service = managedServices.find((s) => s.id === serviceId)
    if (!service) return null

    const newSubService: SubService = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: subServiceData.name,
      price: subServiceData.price,
      duration: subServiceData.duration,
      description: subServiceData.description,
    }

    service.subServices.push(newSubService)
    return newSubService
  },

  // Update sub-service
  updateSubService: (
    serviceId: string,
    subServiceId: string,
    subServiceData: SubServiceFormData,
  ): SubService | null => {
    const service = managedServices.find((s) => s.id === serviceId)
    if (!service) return null

    const subIndex = service.subServices.findIndex((sub) => sub.id === subServiceId)
    if (subIndex === -1) return null

    const updatedSubService: SubService = {
      id: subServiceId,
      name: subServiceData.name,
      price: subServiceData.price,
      duration: subServiceData.duration,
      description: subServiceData.description,
    }

    service.subServices[subIndex] = updatedSubService
    return updatedSubService
  },

  // Delete sub-service
  deleteSubService: (serviceId: string, subServiceId: string): boolean => {
    const service = managedServices.find((s) => s.id === serviceId)
    if (!service) return false

    const subIndex = service.subServices.findIndex((sub) => sub.id === subServiceId)
    if (subIndex === -1) return false

    service.subServices.splice(subIndex, 1)
    return true
  },
}

// Export the managed services for use in booking system
export { managedServices }
