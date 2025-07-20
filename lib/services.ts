export interface SubService {
  id: string
  name: string
  price: number
  duration: string
  description: string
}

export interface Service {
  id: string
  name: string
  icon: string
  subServices: SubService[]
}

export const services: Service[] = [
  {
    id: "os-install",
    name: "OS Reinstallation",
    icon: "Monitor",
    subServices: [
      {
        id: "windows-install",
        name: "Windows Installation",
        price: 99,
        duration: "2-3 hours",
        description: "Complete Windows OS installation with drivers",
      },
      {
        id: "linux-install",
        name: "Linux Installation",
        price: 89,
        duration: "2-3 hours",
        description: "Ubuntu, Debian, or other Linux distributions",
      },
      {
        id: "dual-boot",
        name: "Dual Boot Setup",
        price: 149,
        duration: "3-4 hours",
        description: "Windows + Linux dual boot configuration",
      },
    ],
  },
  {
    id: "software-install",
    name: "Software Installation",
    icon: "Download",
    subServices: [
      {
        id: "office-suite",
        name: "Office Suite (Office 365/LibreOffice)",
        price: 59,
        duration: "1 hour",
        description: "Complete office suite installation and setup",
      },
      {
        id: "antivirus",
        name: "Antivirus & Security",
        price: 49,
        duration: "30 minutes",
        description: "Antivirus installation and system security setup",
      },
      {
        id: "creative-software",
        name: "Creative Software",
        price: 79,
        duration: "1-2 hours",
        description: "Adobe Creative Suite, GIMP, or other creative tools",
      },
      {
        id: "development-tools",
        name: "Development Environment",
        price: 89,
        duration: "1-2 hours",
        description: "IDE, compilers, and development tools setup",
      },
    ],
  },
  {
    id: "tech-support",
    name: "Technical Support",
    icon: "Headphones",
    subServices: [
      {
        id: "remote-support",
        name: "Remote Technical Support",
        price: 79,
        duration: "1 hour",
        description: "Remote troubleshooting and problem solving",
      },
      {
        id: "onsite-support",
        name: "On-site Technical Support",
        price: 149,
        duration: "2 hours",
        description: "In-person technical assistance at your location",
      },
      {
        id: "data-recovery",
        name: "Data Recovery",
        price: 199,
        duration: "2-4 hours",
        description: "Recover lost or corrupted files and data",
      },
    ],
  },
  {
    id: "cv-writing",
    name: "CV/Resume Creation",
    icon: "FileText",
    subServices: [
      {
        id: "basic-cv",
        name: "Basic CV/Resume",
        price: 149,
        duration: "3-5 days",
        description: "Professional CV with standard formatting",
      },
      {
        id: "premium-cv",
        name: "Premium CV/Resume",
        price: 249,
        duration: "3-5 days",
        description: "Advanced CV with custom design and ATS optimization",
      },
      {
        id: "cover-letter",
        name: "Cover Letter",
        price: 99,
        duration: "2-3 days",
        description: "Personalized cover letter for job applications",
      },
    ],
  },
  {
    id: "academic-writing",
    name: "Academic Writing",
    icon: "GraduationCap",
    subServices: [
      {
        id: "thesis-writing",
        name: "Thesis Writing",
        price: 499,
        duration: "2-4 weeks",
        description: "Complete thesis writing and research assistance",
      },
      {
        id: "proposal-writing",
        name: "Research Proposal",
        price: 299,
        duration: "1-2 weeks",
        description: "Academic research proposal development",
      },
      {
        id: "essay-writing",
        name: "Essay Writing",
        price: 199,
        duration: "3-7 days",
        description: "Academic essays and research papers",
      },
    ],
  },
  {
    id: "web-development",
    name: "Web Development",
    icon: "Globe",
    subServices: [
      {
        id: "portfolio-website",
        name: "Portfolio Website",
        price: 499,
        duration: "1-2 weeks",
        description: "Custom portfolio website with responsive design",
      },
      {
        id: "business-website",
        name: "Business Website",
        price: 799,
        duration: "2-3 weeks",
        description: "Professional business website with CMS",
      },
      {
        id: "ecommerce-website",
        name: "E-commerce Website",
        price: 1299,
        duration: "3-4 weeks",
        description: "Full e-commerce solution with payment integration",
      },
    ],
  },
]
