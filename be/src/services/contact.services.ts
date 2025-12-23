import databaseServices from './database.services'
import { sendEmail } from './email.services'

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

class ContactService {
  async submit(payload: ContactPayload) {
    const doc = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      subject: payload.subject || 'Liên hệ từ khách hàng',
      message: payload.message,
      status: 'new',
      created_at: new Date()
    }
    await databaseServices.contacts.insertOne(doc)

    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL
    if (notifyTo) {
      const html = `
        <h3>YORI - Thông điệp liên hệ mới</h3>
        <p><b>Tên:</b> ${this.escape(doc.name)}</p>
        <p><b>Email:</b> ${this.escape(doc.email)}</p>
        <p><b>Điện thoại:</b> ${this.escape(doc.phone)}</p>
        <p><b>Chủ đề:</b> ${this.escape(doc.subject)}</p>
        <p><b>Nội dung:</b></p>
        <div>${this.escape(doc.message).replace(/\n/g, '<br/>')}</div>
        <hr/>
        <small>Thời gian: ${doc.created_at.toLocaleString('vi-VN')}</small>
      `
      try {
        await sendEmail(notifyTo, doc.subject, html)
      } catch (e) {
        // ignore email errors, submission already saved
        console.error('Contact email failed:', e)
      }
    }

    return { message: 'Gửi liên hệ thành công' }
  }

  private escape(str: string) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
}

export default new ContactService()
