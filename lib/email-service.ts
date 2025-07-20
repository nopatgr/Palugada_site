interface EmailData {
  to: string
  subject: string
  html: string
}

interface BookingEmailData {
  booking: {
    id: string
    services: string[]
    date: string
    time: string
    name: string
    email: string
    totalPrice: number
  }
  serviceNames: string[]
}

export const emailService = {
  // Send booking confirmation email with retry logic
  sendBookingConfirmation: async (data: BookingEmailData, retries = 3): Promise<boolean> => {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmation - DigitalPro</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .service-item { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
            .total { font-weight: bold; font-size: 18px; color: #3b82f6; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DigitalPro</h1>
              <h2>Booking Confirmation</h2>
            </div>
            <div class="content">
              <p>Dear ${data.booking.name},</p>
              <p>Thank you for booking our services! Your booking has been confirmed.</p>
              
              <div class="booking-details">
                <h3>Booking Details</h3>
                <p><strong>Booking ID:</strong> ${data.booking.id}</p>
                <p><strong>Date:</strong> ${new Date(data.booking.date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "Asia/Jakarta",
                })}</p>
                <p><strong>Time:</strong> ${data.booking.time} WIB</p>
                
                <h4>Selected Services:</h4>
                ${data.serviceNames.map((service) => `<div class="service-item">${service}</div>`).join("")}
                
                <p class="total">Total Price: $${data.booking.totalPrice}</p>
              </div>
              
              <p>Our team will contact you within 24 hours to confirm the details and provide any additional information needed.</p>
              
              <p>If you have any questions or need to make changes to your booking, please contact us at:</p>
              <ul>
                <li>Email: info@digitalpro.com</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
              
              <div class="footer">
                <p>Thank you for choosing DigitalPro!</p>
                <p>&copy; ${new Date().getFullYear()} DigitalPro. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const emailData: EmailData = {
      to: data.booking.email,
      subject: `Booking Confirmation - ${data.booking.id}`,
      html: emailHtml,
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Simulate email sending (in production, use Resend or Nodemailer)
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
              resolve(true)
            } else {
              reject(new Error("Email sending failed"))
            }
          }, 1000)
        })

        console.log(`Email sent successfully to ${emailData.to} on attempt ${attempt}`)
        return true
      } catch (error) {
        console.error(`Email sending attempt ${attempt} failed:`, error)

        if (attempt === retries) {
          console.error(`Failed to send email after ${retries} attempts`)
          return false
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    return false
  },
}
