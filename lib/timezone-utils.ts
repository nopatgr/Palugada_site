// WIB (Waktu Indonesia Barat) timezone utilities
export const WIB_TIMEZONE = "Asia/Jakarta"

export const timezoneUtils = {
  // Get current date in WIB
  getCurrentDateWIB: (): Date => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: WIB_TIMEZONE }))
  },

  // Format date for WIB display
  formatDateWIB: (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("id-ID", {
      timeZone: WIB_TIMEZONE,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  },

  // Format time for WIB display
  formatTimeWIB: (time: string): string => {
    return `${time} WIB`
  },

  // Get minimum selectable date (today in WIB)
  getMinSelectableDate: (): string => {
    const today = timezoneUtils.getCurrentDateWIB()
    return today.toISOString().split("T")[0]
  },

  // Check if a date is in the past (WIB)
  isDateInPast: (date: string): boolean => {
    const today = timezoneUtils.getCurrentDateWIB()
    const selectedDate = new Date(date + "T00:00:00")
    return selectedDate < new Date(today.toISOString().split("T")[0] + "T00:00:00")
  },

  // Get working hours (9 AM - 5 PM WIB)
  getWorkingHours: (): string[] => {
    return ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]
  },
}
