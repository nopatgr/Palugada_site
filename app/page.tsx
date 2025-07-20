"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Monitor,
  Download,
  Headphones,
  FileText,
  GraduationCap,
  Globe,
  Zap,
  Shield,
  Users,
  Star,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { MultiServiceSelector } from "@/components/multi-service-selector";
import { useToast } from "@/components/ui/toast";
import { bookingStorage } from "@/lib/booking-storage";
import { emailService } from "@/lib/email-service";
import { timezoneUtils } from "@/lib/timezone-utils";
import { serviceManager } from "@/lib/service-management";
import type { Service } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { ProcessTimeline } from "@/components/process-timeline";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<
    Array<{
      serviceId: string;
      subServiceId: string;
      name: string;
      price: number;
    }>
  >([]);
  const [bookingData, setBookingData] = useState({
    services: [] as string[],
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    totalPrice: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const router = useRouter();

  // Add state for click counter
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Add click handler for logo
  const handleLogoClick = () => {
    setLogoClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 5) {
        router.push("/admin?access_key=dp2024admin");
        return 0;
      }
      return newCount;
    });

    // Reset counter after 3 seconds
    setTimeout(() => setLogoClickCount(0), 3000);
  };

  useEffect(() => {
    setAvailableServices(serviceManager.getAllServices());
  }, []);

  const { addToast } = useToast();

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validate slot availability
      if (!bookingStorage.isSlotAvailable(bookingData.date, bookingData.time)) {
        addToast({
          type: "error",
          title: "Slot Unavailable",
          description:
            "The selected time slot is no longer available. Please choose another time.",
        });
        setIsSubmitting(false);
        return;
      }

      // Create booking
      const booking = bookingStorage.createBooking({
        services: selectedServices.map((s) => s.subServiceId),
        date: bookingData.date,
        time: bookingData.time,
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        message: bookingData.message,
        totalPrice: selectedServices.reduce((sum, s) => sum + s.price, 0),
        status: "confirmed",
      });

      // Send confirmation email
      const emailSent = await emailService.sendBookingConfirmation({
        booking: {
          id: booking.id,
          services: booking.services,
          date: booking.date,
          time: booking.time,
          name: booking.name,
          email: booking.email,
          totalPrice: booking.totalPrice,
        },
        serviceNames: selectedServices.map((s) => s.name),
      });

      if (!emailSent) {
        addToast({
          type: "warning",
          title: "Booking Confirmed",
          description:
            "Your booking is confirmed, but we couldn't send the confirmation email. We'll contact you directly.",
        });
      } else {
        addToast({
          type: "success",
          title: "Booking Confirmed!",
          description:
            "Your booking has been confirmed and a confirmation email has been sent.",
        });
      }

      setIsBooked(true);
    } catch (error) {
      addToast({
        type: "error",
        title: "Booking Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while processing your booking.",
      });
    }

    setIsSubmitting(false);
  };

  const resetBooking = () => {
    setIsBookingOpen(false);
    setBookingStep(1);
    setIsBooked(false);
    setSelectedServices([]);
    setBookingData({
      services: [],
      date: "",
      time: "",
      name: "",
      email: "",
      phone: "",
      message: "",
      totalPrice: 0,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span
                  className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer select-none"
                  onClick={handleLogoClick}
                >
                  DigitalPro
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#services"
                  className="hover:text-blue-400 transition-colors"
                >
                  Services
                </a>
                <a
                  href="#about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About
                </a>
                <a
                  href="#testimonials"
                  className="hover:text-blue-400 transition-colors"
                >
                  Testimonials
                </a>
                <a
                  href="#contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 scale-[1.2] translate-x-[0%] translate-y-[42%]"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/blackhole.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                Palugada Solution Service
              </span>
              <br />
              <span className="text-slate-300 text-3xl sm:text-4xl lg:text-3xl">
                for Your Everyday Needs
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto"
          >
            From system installations to professional writing services, we
            deliver reliable, expert solutions that save you time and ensure
            quality results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Service Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 bg-transparent"
            >
              View Services
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative z-10 text-center mb-16 text-white px-4 py-8"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Our Services
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to meet your personal and
              professional needs
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Monitor,
                title: "OS Reinstallation",
                description:
                  "Professional Windows and Linux system installation and configuration",
              },
              {
                icon: Download,
                title: "Software Installation",
                description:
                  "Office 365, antivirus, PDF tools, and essential software setup",
              },
              {
                icon: Headphones,
                title: "Technical Support",
                description:
                  "Remote and on-site technical assistance for all your IT needs",
              },
              {
                icon: FileText,
                title: "CV/Resume Creation",
                description:
                  "Professional resume writing that gets you noticed by employers",
              },
              {
                icon: GraduationCap,
                title: "Academic Writing",
                description:
                  "Expert thesis and proposal writing services for students",
              },
              {
                icon: Globe,
                title: "Portfolio Websites",
                description:
                  "Custom portfolio website development to showcase your work",
              },
            ].map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300 group hover:transform hover:scale-105">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <service.icon className="h-12 w-12 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-100 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                DigitalPro
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              We combine expertise, reliability, and personalized service to
              deliver exceptional results
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Quick turnaround times without compromising on quality",
              },
              {
                icon: Shield,
                title: "Trusted & Secure",
                description: "Your data and privacy are our top priorities",
              },
              {
                icon: Users,
                title: "Expert Team",
                description:
                  "Certified professionals with years of industry experience",
              },
            ].map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-400 text-lg">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <ProcessTimeline />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              What Our{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Clients Say
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Don't just take our word for it - hear from satisfied customers
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Manager",
                content:
                  "DigitalPro saved me hours of frustration with their quick OS reinstallation. Professional and efficient!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Graduate Student",
                content:
                  "Their thesis writing service was exceptional. They understood my requirements perfectly and delivered on time.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Freelance Designer",
                content:
                  "The portfolio website they created for me is stunning and has helped me land several new clients.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-slate-900/50 border-slate-800 h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <Image
                        src={`/placeholder.svg?height=40&width=40`}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-slate-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who trust DigitalPro for
              their digital needs. Let's discuss how we can help you today.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Service Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-slate-950 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Palugada Solution Service
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Your trusted partner for professional digital solutions. We
                deliver quality, reliability, and expertise in every project.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Linkedin className="h-6 w-6 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Instagram className="h-6 w-6 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Services
              </h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    OS Installation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Software Setup
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Tech Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    CV Writing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Academic Writing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Web Development
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Contact Info
              </h3>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <a
                    href="mailto:service@palugada.biz.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    service@palugada.biz.id
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <a
                    href="https://wa.me/6285777101676?text=Halo%20saya%20tertarik%20dengan%20layanan%20Anda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    +6285777101676
                  </a>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Bekasi, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} DigitalPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {isBooked ? "Booking Confirmed!" : "Book Your Service"}
            </DialogTitle>
            <button
              onClick={resetBooking}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </DialogHeader>

          {!isBooked ? (
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        bookingStep >= step
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${
                          bookingStep > step
                            ? "bg-gradient-to-r from-blue-600 to-purple-600"
                            : "bg-slate-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Service Selection */}
              {bookingStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Select Your Services
                  </h3>
                  <MultiServiceSelector
                    availableServices={availableServices}
                    selectedServices={selectedServices}
                    onSelectionChange={setSelectedServices}
                  />
                  <Button
                    onClick={() => setBookingStep(2)}
                    disabled={selectedServices.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Date & Time Selection */}
              {bookingStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Choose Date & Time (WIB)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-slate-300">
                        <Calendar className="inline h-4 w-4 mr-2" />
                        Select Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingData.date}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            date: e.target.value,
                          })
                        }
                        min={timezoneUtils.getMinSelectableDate()}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-slate-300">
                        <Clock className="inline h-4 w-4 mr-2" />
                        Select Time (WIB)
                      </Label>
                      <Select
                        value={bookingData.time}
                        onValueChange={(value) =>
                          setBookingData({ ...bookingData, time: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Choose time" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {timezoneUtils.getWorkingHours().map((time) => {
                            const isBooked =
                              bookingData.date &&
                              bookingStorage
                                .getBookedSlotsForDate(bookingData.date)
                                .includes(time);
                            return (
                              <SelectItem
                                key={time}
                                value={time}
                                disabled={isBooked}
                                className={`text-white hover:bg-slate-700 ${
                                  isBooked
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                {time} {isBooked ? "(Booked)" : ""}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setBookingStep(1)}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setBookingStep(3)}
                      disabled={!bookingData.date || !bookingData.time}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact Information */}
              {bookingStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Your Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-slate-300">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={bookingData.name}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            name: e.target.value,
                          })
                        }
                        className="bg-slate-800 border-slate-700 text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-300">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            email: e.target.value,
                          })
                        }
                        className="bg-slate-800 border-slate-700 text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-slate-300">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={bookingData.phone}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          phone: e.target.value,
                        })
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-slate-300">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      value={bookingData.message}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          message: e.target.value,
                        })
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="Any specific requirements or questions..."
                      rows={3}
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Booking Summary</h4>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div>
                        <span className="text-slate-400">Services:</span>
                        <div className="ml-4 mt-1">
                          {selectedServices.map((service, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{service.name}</span>
                              <span>${service.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p>
                        <span className="text-slate-400">Date:</span>{" "}
                        {timezoneUtils.formatDateWIB(bookingData.date)}
                      </p>
                      <p>
                        <span className="text-slate-400">Time:</span>{" "}
                        {timezoneUtils.formatTimeWIB(bookingData.time)}
                      </p>
                      <div className="border-t border-slate-700 pt-2 mt-2">
                        <div className="flex justify-between font-semibold text-blue-400">
                          <span>Total Price:</span>
                          <span>
                            $
                            {selectedServices.reduce(
                              (sum, s) => sum + s.price,
                              0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setBookingStep(2)}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={
                        !bookingData.name ||
                        !bookingData.email ||
                        !bookingData.phone ||
                        isSubmitting
                      }
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSubmitting ? "Booking..." : "Confirm Booking"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">
                Booking Confirmed!
              </h3>
              <div className="bg-slate-800 p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Booking Details</h4>
                <div className="space-y-2 text-left">
                  <p>
                    <span className="text-slate-400">Service:</span>{" "}
                    {selectedServices.map((s) => s.name).join(", ")}
                  </p>
                  <p>
                    <span className="text-slate-400">Date:</span>{" "}
                    {timezoneUtils.formatDateWIB(bookingData.date)}
                  </p>
                  <p>
                    <span className="text-slate-400">Time:</span>{" "}
                    {timezoneUtils.formatTimeWIB(bookingData.time)}
                  </p>
                  <p>
                    <span className="text-slate-400">Contact:</span>{" "}
                    {bookingData.email}
                  </p>
                </div>
              </div>
              <p className="text-slate-400 mb-6">
                We've sent a confirmation email to {bookingData.email}. Our team
                will contact you within 24 hours to confirm the details.
              </p>
              <Button
                onClick={resetBooking}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Close
              </Button>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
