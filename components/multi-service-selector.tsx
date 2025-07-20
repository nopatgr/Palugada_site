"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Check } from "lucide-react"
import type { Service, SubService } from "@/lib/services"
import { Card, CardContent } from "@/components/ui/card"

interface SelectedService {
  serviceId: string
  subServiceId: string
  name: string
  price: number
}

interface MultiServiceSelectorProps {
  availableServices: Service[]
  selectedServices: SelectedService[]
  onSelectionChange: (services: SelectedService[]) => void
}

export function MultiServiceSelector({
  availableServices,
  selectedServices,
  onSelectionChange,
}: MultiServiceSelectorProps) {
  const [expandedServices, setExpandedServices] = useState<string[]>([])

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const isSubServiceSelected = (serviceId: string, subServiceId: string) => {
    return selectedServices.some(
      (selected) => selected.serviceId === serviceId && selected.subServiceId === subServiceId,
    )
  }

  const toggleSubService = (service: Service, subService: SubService) => {
    const isSelected = isSubServiceSelected(service.id, subService.id)

    if (isSelected) {
      // Remove the service
      onSelectionChange(
        selectedServices.filter(
          (selected) => !(selected.serviceId === service.id && selected.subServiceId === subService.id),
        ),
      )
    } else {
      // Add the service
      const newService: SelectedService = {
        serviceId: service.id,
        subServiceId: subService.id,
        name: `${service.name} - ${subService.name}`,
        price: subService.price,
      }
      onSelectionChange([...selectedServices, newService])
    }
  }

  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {availableServices.map((service) => (
          <Card key={service.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <button
                onClick={() => toggleServiceExpansion(service.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400">
                    {expandedServices.includes(service.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                  <h3 className="font-semibold text-white">{service.name}</h3>
                </div>
                <div className="text-sm text-slate-400">{service.subServices.length} options</div>
              </button>

              {expandedServices.includes(service.id) && (
                <div className="mt-4 space-y-2 pl-8">
                  {service.subServices.map((subService) => (
                    <div
                      key={subService.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSubServiceSelected(service.id, subService.id)
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                      onClick={() => toggleSubService(service, subService)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSubServiceSelected(service.id, subService.id)
                                ? "border-blue-500 bg-blue-500"
                                : "border-slate-500"
                            }`}
                          >
                            {isSubServiceSelected(service.id, subService.id) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{subService.name}</h4>
                            <p className="text-sm text-slate-400">{subService.description}</p>
                            <p className="text-xs text-slate-500">Duration: {subService.duration}</p>
                          </div>
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

      {selectedServices.length > 0 && (
        <Card className="bg-slate-900 border-blue-500/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3">Selected Services</h3>
            <div className="space-y-2 mb-4">
              {selectedServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{service.name}</span>
                  <span className="text-blue-400">${service.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-700 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">Total Price:</span>
                <span className="font-bold text-xl text-blue-400">${totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
