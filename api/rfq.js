import { Resend } from 'resend'
import { validateRfqForm } from '../src/lib/rfq.js'

function buildEmailText(formData) {
  return [
    'New Qantara RFQ submission',
    '',
    `Name: ${formData.name}`,
    `Company: ${formData.company}`,
    `Email: ${formData.email}`,
    `Phone: ${formData.phone || 'Not provided'}`,
    `Country: ${formData.country}`,
    `Part Number: ${formData.partNumber}`,
    `Manufacturer / OEM: ${formData.manufacturer || 'Not provided'}`,
    `Quantity: ${formData.quantity}`,
    `Required Delivery Location: ${formData.deliveryLocation}`,
    `Urgency: ${formData.urgency}`,
    `Upload / Spec Reference: ${formData.upload || 'Not provided'}`,
    '',
    'Additional Notes:',
    formData.notes || 'Not provided',
  ].join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const from = process.env.RFQ_FROM_EMAIL
  const to = process.env.RFQ_TO_EMAIL

  if (!resendApiKey || !from || !to) {
    return res.status(500).json({
      error: 'Server email configuration is incomplete. Set RESEND_API_KEY, RFQ_FROM_EMAIL, and RFQ_TO_EMAIL.',
    })
  }

  let payload = req.body

  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload.' })
    }
  }

  const { errors, formData } = validateRfqForm(payload)

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Please correct the highlighted fields.', fieldErrors: errors })
  }

  const resend = new Resend(resendApiKey)

  try {
    await resend.emails.send({
      from,
      to: [to],
      subject: `New RFQ from ${formData.company} (${formData.partNumber})`,
      text: buildEmailText(formData),
      replyTo: formData.email,
    })

    return res.status(200).json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email delivery failed.'
    return res.status(500).json({ error: message })
  }
}
