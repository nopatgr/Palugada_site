import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast"
import { AdminProvider } from "@/contexts/admin-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Palugada Solution Service",
  description:
    "Professional digital solutions for your everyday needs. OS installation, software setup, technical support, CV writing, academic writing, and web development.",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#030014] overflow-y-scroll overflow-x-hidden`}>
        <ToastProvider>
          <AdminProvider>{children}</AdminProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
