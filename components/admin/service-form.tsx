"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Service } from "@/lib/services"
import type { ServiceFormData, SubServiceFormData } from "@/lib/service-management"

interface ServiceFormProps {
  service?: Service
  onSave: (data: ServiceFormData) => void
  onCancel: () => void
}

export function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    id: service?.id,
    name: service?.name || "",
    icon: service?.icon || "Monitor",
    subServices:
      service?.subServices.map((sub) => ({
        id: sub.id,
        name: sub.name,
        price: sub.price,
        duration: sub.duration,
        description: sub.description,
      })) || [],
  })

  const addSubService = () => {
    setFormData((prev) => ({
      ...prev,
      subServices: [
        ...prev.subServices,
        {
          name: "",
          price: 0,
          duration: "",
          description: "",
        },
      ],
    }))
  }

  const updateSubService = (index: number, field: keyof SubServiceFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      subServices: prev.subServices.map((sub, i) => (i === index ? { ...sub, [field]: value } : sub)),
    }))
  }

  const removeSubService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subServices: prev.subServices.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">{service ? "Edit Service" : "Add New Service"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-slate-300">
                Service Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="icon" className="text-slate-300">
                Icon Name
              </Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Monitor, Download, etc."
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-slate-300">Sub-Services</Label>
              <Button type="button" onClick={addSubService} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Sub-Service
              </Button>
            </div>

            <div className="space-y-4">
              {formData.subServices.map((subService, index) => (
                <Card key={index} className="bg-slate-800 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-300">Sub-Service {index + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeSubService(index)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label className="text-xs text-slate-400">Name</Label>
                        <Input
                          value={subService.name}
                          onChange={(e) => updateSubService(index, "name", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white text-sm"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400">Price ($)</Label>
                        <Input
                          type="number"
                          value={subService.price}
                          onChange={(e) => updateSubService(index, "price", Number.parseFloat(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <Label className="text-xs text-slate-400">Duration</Label>
                      <Input
                        value={subService.duration}
                        onChange={(e) => updateSubService(index, "duration", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                        placeholder="e.g., 2-3 hours"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-400">Description</Label>
                      <Textarea
                        value={subService.description}
                        onChange={(e) => updateSubService(index, "description", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white text-sm"
                        rows={2}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Service
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
