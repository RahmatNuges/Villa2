import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface BookingEmailData {
  guest_name: string
  guest_email: string
  villa_name: string
  booking_reference: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  special_requests?: string
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'Email service not configured' }
    }

    const { data: emailData, error } = await resend.emails.send({
      from: 'Villa Rental <noreply@villa-rental.com>',
      to: [data.guest_email],
      subject: `Konfirmasi Booking Villa - ${data.booking_reference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Konfirmasi Booking Villa</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #D4AF37, #B8941F);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .booking-details {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #D4AF37;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              padding: 5px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
              color: #666;
            }
            .detail-value {
              color: #333;
            }
            .total-price {
              font-size: 24px;
              font-weight: bold;
              color: #D4AF37;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background: #D4AF37;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Booking Dikonfirmasi!</h1>
            <p>Terima kasih telah memilih villa kami</p>
          </div>
          
          <div class="content">
            <h2>Halo ${data.guest_name}!</h2>
            <p>Booking villa Anda telah berhasil dikonfirmasi. Berikut adalah detail booking Anda:</p>
            
            <div class="booking-details">
              <h3>Detail Booking</h3>
              <div class="detail-row">
                <span class="detail-label">Nomor Referensi:</span>
                <span class="detail-value">${data.booking_reference}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Villa:</span>
                <span class="detail-value">${data.villa_name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-in:</span>
                <span class="detail-value">${new Date(data.check_in).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-out:</span>
                <span class="detail-value">${new Date(data.check_out).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Jumlah Tamu:</span>
                <span class="detail-value">${data.guests} orang</span>
              </div>
              ${data.special_requests ? `
              <div class="detail-row">
                <span class="detail-label">Permintaan Khusus:</span>
                <span class="detail-value">${data.special_requests}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="total-price">
              Total: Rp${data.total_price.toLocaleString()}
            </div>
            
            <h3>Langkah Selanjutnya:</h3>
            <ul>
              <li>Tim kami akan menghubungi Anda dalam 24 jam untuk konfirmasi lebih lanjut</li>
              <li>Pembayaran dapat dilakukan saat check-in</li>
              <li>Jika ada pertanyaan, silakan hubungi kami melalui WhatsApp</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890'}?text=Halo! Saya telah melakukan booking villa dengan referensi ${data.booking_reference}. Mohon konfirmasi lebih lanjut." class="button">
                Hubungi via WhatsApp
              </a>
            </div>
            
            <div class="footer">
              <p><strong>Villa Rental</strong></p>
              <p>Email: info@villa-rental.com | WhatsApp: ${process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890'}</p>
              <p>Terima kasih telah mempercayai layanan kami!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }


    return { success: true, emailId: emailData?.id }
  } catch (error) {
    console.error('Unexpected error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendAdminNotificationEmail(data: BookingEmailData) {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
      console.warn('Email service not configured, skipping admin notification')
      return { success: false, error: 'Email service not configured' }
    }

    const { data: emailData, error } = await resend.emails.send({
      from: 'Villa Rental <noreply@villa-rental.com>',
      to: [process.env.ADMIN_EMAIL],
      subject: `Booking Baru - ${data.booking_reference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Baru</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #14B8A6;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 20px;
              border-radius: 0 0 10px 10px;
            }
            .booking-details {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #14B8A6;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              padding: 5px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
              color: #666;
            }
            .detail-value {
              color: #333;
            }
            .urgent {
              background: #fef3cd;
              border: 1px solid #fecaca;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔔 Booking Baru!</h1>
            <p>Ada booking baru yang perlu ditindaklanjuti</p>
          </div>
          
          <div class="content">
            <div class="urgent">
              <strong>⚠️ Tindakan Diperlukan:</strong> Booking baru memerlukan konfirmasi dan tindak lanjut.
            </div>
            
            <div class="booking-details">
              <h3>Detail Booking</h3>
              <div class="detail-row">
                <span class="detail-label">Nomor Referensi:</span>
                <span class="detail-value">${data.booking_reference}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Nama Tamu:</span>
                <span class="detail-value">${data.guest_name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${data.guest_email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Villa:</span>
                <span class="detail-value">${data.villa_name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-in:</span>
                <span class="detail-value">${new Date(data.check_in).toLocaleDateString('id-ID')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-out:</span>
                <span class="detail-value">${new Date(data.check_out).toLocaleDateString('id-ID')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Jumlah Tamu:</span>
                <span class="detail-value">${data.guests} orang</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Harga:</span>
                <span class="detail-value">Rp${data.total_price.toLocaleString()}</span>
              </div>
              ${data.special_requests ? `
              <div class="detail-row">
                <span class="detail-label">Permintaan Khusus:</span>
                <span class="detail-value">${data.special_requests}</span>
              </div>
              ` : ''}
            </div>
            
            <p><strong>Langkah yang perlu dilakukan:</strong></p>
            <ul>
              <li>Hubungi tamu untuk konfirmasi booking</li>
              <li>Verifikasi ketersediaan villa</li>
              <li>Kirim detail check-in dan informasi villa</li>
              <li>Persiapkan villa untuk kedatangan tamu</li>
            </ul>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending admin notification email:', error)
      return { success: false, error: error.message }
    }


    return { success: true, emailId: emailData?.id }
  } catch (error) {
    console.error('Unexpected error sending admin notification email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
