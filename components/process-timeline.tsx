"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, FileText, Settings, MapPin, Video, CreditCard, Clock, CheckCircle } from "lucide-react"

interface ProcessStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  position: { x: number; y: number }
  type: "start" | "process" | "decision" | "end"
}

const processSteps: ProcessStep[] = [
  {
    id: "start",
    title: "Start",
    description: "Begin your digital journey",
    icon: Play,
    position: { x: 0, y: 50 },
    type: "start",
  },
  {
    id: "booking",
    title: "Booking Form",
    description: "Fill out service requirements",
    icon: FileText,
    position: { x: 20, y: 50 },
    type: "process",
  },
  {
    id: "service-type",
    title: "Service Type?",
    description: "Choose delivery method",
    icon: Settings,
    position: { x: 40, y: 50 },
    type: "decision",
  },
  {
    id: "virtual",
    title: "Virtual Meeting",
    description: "Remote consultation setup",
    icon: Video,
    position: { x: 60, y: 25 },
    type: "process",
  },
  {
    id: "onsite",
    title: "Location Setup",
    description: "On-site service arrangement",
    icon: MapPin,
    position: { x: 60, y: 75 },
    type: "process",
  },
  {
    id: "payment",
    title: "Payment",
    description: "Secure payment processing",
    icon: CreditCard,
    position: { x: 80, y: 50 },
    type: "process",
  },
  {
    id: "timeline",
    title: "Timeline Generated",
    description: "Project schedule created",
    icon: Clock,
    position: { x: 100, y: 50 },
    type: "process",
  },
  {
    id: "execution",
    title: "Work Process",
    description: "Service delivery begins",
    icon: CheckCircle,
    position: { x: 120, y: 50 },
    type: "end",
  },
]

const connections = [
  { from: "start", to: "booking" },
  { from: "booking", to: "service-type" },
  { from: "service-type", to: "virtual", label: "Remote" },
  { from: "service-type", to: "onsite", label: "On-Site" },
  { from: "virtual", to: "payment" },
  { from: "onsite", to: "payment" },
  { from: "payment", to: "timeline" },
  { from: "timeline", to: "execution" },
]

export function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev + 1) % 100)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const getStepPosition = (step: ProcessStep) => {
    return {
      left: `${step.position.x}%`,
      top: `${step.position.y}%`,
    }
  }

  const getConnectionPath = (from: ProcessStep, to: ProcessStep) => {
    const fromX = from.position.x
    const fromY = from.position.y
    const toX = to.position.x
    const toY = to.position.y

    // Create a smooth curve between points
    const midX = (fromX + toX) / 2
    const controlOffset = Math.abs(toY - fromY) * 0.3

    return `M ${fromX} ${fromY} Q ${midX} ${fromY - controlOffset} ${toX} ${toY}`
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Process Flow
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Follow our streamlined workflow from initial booking to project completion
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Container */}
          <div className="relative h-96 bg-slate-900/30 rounded-2xl border border-slate-800 overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                  linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                `,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            {/* SVG for Connection Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 100">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {connections.map((connection, index) => {
                const fromStep = processSteps.find((s) => s.id === connection.from)
                const toStep = processSteps.find((s) => s.id === connection.to)

                if (!fromStep || !toStep) return null

                return (
                  <g key={`${connection.from}-${connection.to}`}>
                    {/* Base line */}
                    <path
                      d={getConnectionPath(fromStep, toStep)}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="2"
                      opacity="0.6"
                      filter="url(#glow)"
                    />

                    {/* Animated flowing line */}
                    <path
                      d={getConnectionPath(fromStep, toStep)}
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="3"
                      strokeDasharray="8 4"
                      strokeDashoffset={animationProgress * -2}
                      opacity="0.8"
                      filter="url(#glow)"
                      style={{
                        animation: `dash 3s linear infinite`,
                      }}
                    />

                    {/* Connection Label */}
                    {connection.label && (
                      <text
                        x={(fromStep.position.x + toStep.position.x) / 2}
                        y={(fromStep.position.y + toStep.position.y) / 2 - 2}
                        textAnchor="middle"
                        className="fill-blue-400 text-xs font-medium"
                      >
                        {connection.label}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Process Steps */}
            {processSteps.map((step, index) => {
              const IconComponent = step.icon
              const isActive = activeStep === step.id

              return (
                <motion.div
                  key={step.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={getStepPosition(step)}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                  whileHover={{ scale: 1.1 }}
                >
                  {/* Step Node */}
                  <div
                    className={`
                    relative w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${
                      step.type === "decision"
                        ? "rotate-45 border-yellow-500 bg-yellow-500/20"
                        : step.type === "start" || step.type === "end"
                          ? "border-green-500 bg-green-500/20"
                          : "border-blue-500 bg-blue-500/20"
                    }
                    ${isActive ? "shadow-lg shadow-blue-500/50 scale-110" : ""}
                    group-hover:shadow-lg group-hover:shadow-blue-500/50
                  `}
                  >
                    <IconComponent
                      className={`h-6 w-6 transition-colors duration-300 ${
                        step.type === "decision"
                          ? "text-yellow-400 -rotate-45"
                          : step.type === "start" || step.type === "end"
                            ? "text-green-400"
                            : "text-blue-400"
                      }`}
                    />

                    {/* Pulse animation for active step */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75" />
                    )}
                  </div>

                  {/* Step Info Tooltip */}
                  <div
                    className={`
                    absolute top-20 left-1/2 transform -translate-x-1/2 
                    bg-slate-800 border border-slate-700 rounded-lg p-3 min-w-48
                    transition-all duration-300 z-10
                    ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
                  `}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-4 h-4 bg-slate-800 border-l border-t border-slate-700 rotate-45" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-400">{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Process Steps Legend */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: "start", label: "Start/End", color: "green" },
              { type: "process", label: "Process", color: "blue" },
              { type: "decision", label: "Decision", color: "yellow" },
              { type: "flow", label: "Data Flow", color: "purple" },
            ].map((legend) => (
              <div key={legend.type} className="flex items-center space-x-2">
                <div
                  className={`
                  w-4 h-4 rounded-full border-2
                  ${
                    legend.color === "green"
                      ? "border-green-500 bg-green-500/20"
                      : legend.color === "blue"
                        ? "border-blue-500 bg-blue-500/20"
                        : legend.color === "yellow"
                          ? "border-yellow-500 bg-yellow-500/20 rotate-45"
                          : "border-purple-500 bg-purple-500/20"
                  }
                `}
                />
                <span className="text-sm text-slate-400">{legend.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -24;
          }
        }
      `}</style>
    </section>
  )
}
