export interface BookingSlot {
  date: string
  time: string
  isBooked: boolean
  bookingId?: string
}

export interface Booking {
  id: string
  services: string[]
  date: string
  time: string
  name: string
  email: string
  phone: string
  message: string
  totalPrice: number
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
}

// In-memory storage (in production, use a real database)
const bookings: Booking[] = []
let bookedSlots: BookingSlot[] = []

// Initialize some sample booked slots for demonstration
const initializeBookedSlots = () => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Add some sample booked slots
  bookedSlots = [
    {
      date: tomorrow.toISOString().split("T")[0],
      time: "10:00 AM",
      isBooked: true,
      bookingId: "sample-1",
    },
    {
      date: tomorrow.toISOString().split("T")[0],
      time: "02:00 PM",
      isBooked: true,
      bookingId: "sample-2",
    },
  ]
}

initializeBookedSlots()

export const bookingStorage = {
  // Get all bookings
  getAllBookings: (): Booking[] => {
    return bookings
  },

  // Get booking by ID
  getBookingById: (id: string): Booking | undefined => {
    return bookings.find((booking) => booking.id === id)
  },

  // Check if a slot is available
  isSlotAvailable: (date: string, time: string): boolean => {
    return !bookedSlots.some((slot) => slot.date === date && slot.time === time && slot.isBooked)
  },

  // Get booked slots for a specific date
  getBookedSlotsForDate: (date: string): string[] => {
    return bookedSlots.filter((slot) => slot.date === date && slot.isBooked).map((slot) => slot.time)
  },

  // Create a new booking
  createBooking: (bookingData: Omit<Booking, "id" | "createdAt">): Booking => {
    // Check if slot is still available
    if (!bookingStorage.isSlotAvailable(bookingData.date, bookingData.time)) {
      throw new Error("Selected time slot is no longer available")
    }

    const booking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    bookings.push(booking)

    // Mark the slot as booked
    bookedSlots.push({
      date: bookingData.date,
      time: bookingData.time,
      isBooked: true,
      bookingId: booking.id,
    })

    return booking
  },

  // Cancel a booking
  cancelBooking: (bookingId: string): boolean => {
    const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId)
    if (bookingIndex === -1) return false

    const booking = bookings[bookingIndex]
    booking.status = "cancelled"

    // Free up the slot
    const slotIndex = bookedSlots.findIndex((slot) => slot.bookingId === bookingId)
    if (slotIndex !== -1) {
      bookedSlots[slotIndex].isBooked = false
    }

    return true
  },
}
